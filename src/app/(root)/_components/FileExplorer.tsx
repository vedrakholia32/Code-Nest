"use client";
import { useState } from "react";
import { ProjectFile, FileTreeItem } from "@/types";
import Image from "next/image";
import { LANGUAGE_CONFIG } from "../_constants";
import { 
  FileIcon, 
  FolderIcon, 
  FolderOpenIcon, 
  PlusIcon, 
  MoreVertical,
  Play,
  Copy,
  Trash2,
  Edit
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface FileExplorerProps {
  files: ProjectFile[];
  activeFileId: string | null;
  projectId: Id<"projects">;
  onFileSelect: (fileId: string) => void;
  onRunFile: (file: ProjectFile) => void;
  isRunning: boolean;
}

export default function FileExplorer({
  files,
  activeFileId,
  projectId,
  onFileSelect,
  onRunFile,
  isRunning
}: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["root"]));
  const [showNewFileInput, setShowNewFileInput] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState("");

  const createFile = useMutation(api.files.createFile);
  const deleteFile = useMutation(api.files.deleteFile);
  const duplicateFile = useMutation(api.files.duplicateFile);
  const setEntryFile = useMutation(api.files.setEntryFile);

  const buildFileTree = (files: ProjectFile[]): FileTreeItem[] => {
    const tree: FileTreeItem[] = [];
    const pathMap = new Map<string, FileTreeItem>();

    files.forEach(file => {
      const pathParts = file.path.split('/');
      let currentPath = '';

      pathParts.forEach((part, index) => {
        const parentPath = currentPath;
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        
        if (!pathMap.has(currentPath)) {
          const item: FileTreeItem = {
            id: index === pathParts.length - 1 ? file._id : currentPath,
            name: part,
            type: index === pathParts.length - 1 ? 'file' : 'folder',
            children: index === pathParts.length - 1 ? undefined : [],
            path: currentPath,
            fileId: index === pathParts.length - 1 ? file._id : undefined
          };

          pathMap.set(currentPath, item);

          if (parentPath) {
            const parent = pathMap.get(parentPath);
            parent?.children?.push(item);
          } else {
            tree.push(item);
          }
        }
      });
    });

    return tree;
  };

  const handleCreateFile = async (folderPath: string = "") => {
    if (!newFileName.trim()) return;

    const fullPath = folderPath ? `${folderPath}/${newFileName}` : newFileName;
    const extension = newFileName.split('.').pop() || 'js';
    const language = getLanguageFromExtension(extension);

    try {
      await createFile({
        projectId,
        name: newFileName,
        content: getDefaultContent(language),
        language,
        path: fullPath,
        isEntry: files.length === 0
      });
      setNewFileName("");
      setShowNewFileInput(null);
    } catch (error) {
      console.error("Error creating file:", error);
    }
  };

  const handleDeleteFile = async (fileId: Id<"files">) => {
    try {
      await deleteFile({ fileId });
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const handleDuplicateFile = async (fileId: Id<"files">) => {
    try {
      await duplicateFile({ fileId });
    } catch (error) {
      console.error("Error duplicating file:", error);
    }
  };

  const handleSetEntryFile = async (fileId: Id<"files">) => {
    try {
      await setEntryFile({ projectId, fileId });
    } catch (error) {
      console.error("Error setting entry file:", error);
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    // Map file extensions to language keys in LANGUAGE_CONFIG
    const extensionToLanguage: Record<string, string> = {
      js: "javascript",
      ts: "typescript", 
      py: "python",
      java: "java",
      cpp: "cpp",
      cc: "cpp",
      c: "cpp",
      cs: "csharp",
      go: "go",
      rs: "rust",
      rb: "ruby",
      swift: "swift"
    };

    const language = extensionToLanguage[extension || ''];
    return language ? LANGUAGE_CONFIG[language].logoPath : "/logo.png";
  };

  const renderTreeItem = (item: FileTreeItem, depth = 0) => {
    const isExpanded = expandedFolders.has(item.path);
    const isActive = activeFileId === item.id;
    const file = files.find(f => f._id === item.fileId);
    const isEntry = file?.isEntry;

    return (
      <div key={item.path}>
        <div
          className={`flex items-center justify-between group px-2 py-1 cursor-pointer hover:bg-[#2a2a3a] rounded-md transition-colors ${
            isActive ? 'bg-[#7c3aed]/20 text-[#7c3aed]' : 'text-[#e6edf3]'
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          <div 
            className="flex items-center gap-2 flex-1"
            onClick={() => {
              if (item.type === 'folder') {
                const newExpanded = new Set(expandedFolders);
                if (isExpanded) {
                  newExpanded.delete(item.path);
                } else {
                  newExpanded.add(item.path);
                }
                setExpandedFolders(newExpanded);
              } else {
                onFileSelect(item.id);
              }
            }}
          >
            {item.type === 'folder' ? (
              isExpanded ? (
                <FolderOpenIcon className="w-4 h-4" />
              ) : (
                <FolderIcon className="w-4 h-4" />
              )
            ) : (
              <Image
                src={getFileIcon(item.name)}
                alt="File icon"
                width={16}
                height={16}
                className="rounded"
              />
            )}
            <span className="text-sm flex items-center gap-1">
              {item.name}
              {isEntry && <Play className="w-3 h-3 text-green-400" />}
            </span>
          </div>

          {item.type === 'file' && file && (
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRunFile(file);
                }}
                disabled={isRunning}
                className={`p-1 hover:bg-[#3a3a4a] rounded transition-colors ${
                  isRunning ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                title="Run this file"
              >
                {isRunning ? (
                  <div className="w-3 h-3 border border-green-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Play className="w-3 h-3 text-green-400" />
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSetEntryFile(file._id);
                }}
                className="p-1 hover:bg-[#3a3a4a] rounded"
                title="Set as main file"
              >
                <Edit className="w-3 h-3 text-blue-400" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFile(file._id);
                }}
                className="p-1 hover:bg-[#3a3a4a] rounded"
                title="Delete file"
              >
                <Trash2 className="w-3 h-3 text-red-400" />
              </button>
            </div>
          )}
        </div>

        {item.type === 'folder' && (
          <>
            {isExpanded && showNewFileInput === item.path && (
              <div className="ml-6 p-2">
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateFile(item.path);
                    } else if (e.key === 'Escape') {
                      setShowNewFileInput(null);
                      setNewFileName("");
                    }
                  }}
                  placeholder="filename.ext"
                  className="w-full px-2 py-1 text-sm bg-[#262637] border border-[#414155] rounded text-white"
                  autoFocus
                />
              </div>
            )}
            {isExpanded && item.children && (
              <div>
                {item.children.map(child => renderTreeItem(child, depth + 1))}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const fileTree = buildFileTree(files);

  return (
    <div className="w-full bg-[#1e1e2e] h-full overflow-y-auto">
      <div className="p-4 border-b border-[#313244]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[#e6edf3]">Explorer</h3>
          <button
            onClick={() => {
              setShowNewFileInput("root");
              setNewFileName("");
            }}
            className="p-1 hover:bg-[#2a2a3a] rounded text-[#e6edf3] hover:text-white"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="p-2">
        {showNewFileInput === "root" && (
          <div className="p-2 mb-2">
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateFile("");
                } else if (e.key === 'Escape') {
                  setShowNewFileInput(null);
                  setNewFileName("");
                }
              }}
              placeholder="filename.ext"
              className="w-full px-2 py-1 text-sm bg-[#262637] border border-[#414155] rounded text-white"
              autoFocus
            />
          </div>
        )}
        {fileTree.map(item => renderTreeItem(item))}
      </div>
    </div>
  );
}

// Helper functions
function getLanguageFromExtension(extension: string): string {
  const languageMap: Record<string, string> = {
    js: "javascript",
    ts: "typescript",
    py: "python",
    java: "java",
    cpp: "cpp",
    c: "c",
    cs: "csharp",
    go: "go",
    rs: "rust",
    php: "php",
    rb: "ruby",
    swift: "swift"
  };
  return languageMap[extension] || "javascript";
}

function getDefaultContent(language: string): string {
  const defaultCodes: Record<string, string> = {
    javascript: `console.log("Hello, World!");`,
    typescript: `console.log("Hello, World!");`,
    python: `print("Hello, World!")`,
  };
  return defaultCodes[language] || `// Hello, World!`;
}
