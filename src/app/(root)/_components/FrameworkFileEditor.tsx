"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FolderOpen,
  File,
  Plus,
  Save,
  Search,
  Settings,
  Download,
  Upload,
  X,
  ChevronRight,
  ChevronDown,
  FileText,
  Folder,
  Code,
  Image,
  FileCode
} from "lucide-react";
import { FrameworkProject } from "@/services/FrameworkProjectManager";
import { TemplateFile, FileType } from "@/types/framework";

interface FrameworkFileEditorProps {
  project: FrameworkProject;
  onSave: (files: EditorFile[]) => Promise<void>;
  className?: string;
}

interface EditorFile extends TemplateFile {
  id: string;
  isModified?: boolean;
  isOpen?: boolean;
}

interface FileTreeNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileTreeNode[];
  file?: EditorFile;
  isExpanded?: boolean;
}

const FILE_TYPE_ICONS: Record<FileType, any> = {
  component: Code,
  page: FileText,
  config: Settings,
  style: Image,
  test: FileCode,
  asset: Image,
  api: Code,
  middleware: Code,
  utils: FileCode,
  types: FileText
};

const FILE_EXTENSIONS: Record<string, FileType> = {
  'tsx': 'component',
  'jsx': 'component',
  'ts': 'types',
  'js': 'component',
  'css': 'style',
  'scss': 'style',
  'json': 'config',
  'md': 'asset',
  'html': 'page'
};

export default function FrameworkFileEditor({ project, onSave, className = "" }: FrameworkFileEditorProps) {
  const [files, setFiles] = useState<EditorFile[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [fileTree, setFileTree] = useState<FileTreeNode[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const editorRef = useRef<any>(null);

  // Initialize files from project template
  useEffect(() => {
    const initialFiles: EditorFile[] = project.template.files.map((file, index) => ({
      ...file,
      id: `file_${index}`,
      isModified: false,
      isOpen: false
    }));

    // Add some default files if template is empty
    if (initialFiles.length === 0) {
      const defaultFiles = generateDefaultFiles(project.framework.id);
      initialFiles.push(...defaultFiles);
    }

    setFiles(initialFiles);
    generateFileTree(initialFiles);
  }, [project]);

  // Generate default files based on framework
  const generateDefaultFiles = (frameworkId: string): EditorFile[] => {
    const defaultFiles: EditorFile[] = [];

    switch (frameworkId) {
      case 'react':
        defaultFiles.push(
          {
            id: 'app_tsx',
            path: 'src/App.tsx',
            content: `import React from 'react';\nimport './App.css';\n\nfunction App() {\n  return (\n    <div className="App">\n      <h1>Welcome to ${project.name}</h1>\n    </div>\n  );\n}\n\nexport default App;`,
            type: 'component',
            language: 'typescript'
          },
          {
            id: 'index_tsx',
            path: 'src/index.tsx',
            content: `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\n\nconst root = ReactDOM.createRoot(\n  document.getElementById('root') as HTMLElement\n);\nroot.render(<App />);`,
            type: 'component',
            language: 'typescript'
          }
        );
        break;
      case 'nextjs':
        defaultFiles.push(
          {
            id: 'page_tsx',
            path: 'app/page.tsx',
            content: `export default function Home() {\n  return (\n    <main>\n      <h1>Welcome to ${project.name}</h1>\n    </main>\n  );\n}`,
            type: 'page',
            language: 'typescript'
          },
          {
            id: 'layout_tsx',
            path: 'app/layout.tsx',
            content: `export default function RootLayout({\n  children,\n}: {\n  children: React.ReactNode;\n}) {\n  return (\n    <html lang="en">\n      <body>{children}</body>\n    </html>\n  );\n}`,
            type: 'page',
            language: 'typescript'
          }
        );
        break;
      case 'express':
        defaultFiles.push(
          {
            id: 'index_js',
            path: 'src/index.js',
            content: `const express = require('express');\nconst app = express();\nconst port = process.env.PORT || 3000;\n\napp.get('/', (req, res) => {\n  res.json({ message: 'Welcome to ${project.name}' });\n});\n\napp.listen(port, () => {\n  console.log(\`Server running on port \${port}\`);\n});`,
            type: 'api',
            language: 'javascript'
          }
        );
        break;
    }

    return defaultFiles;
  };

  // Generate file tree structure
  const generateFileTree = (fileList: EditorFile[]) => {
    const tree: FileTreeNode[] = [];
    const folders = new Map<string, FileTreeNode>();

    fileList.forEach(file => {
      const pathParts = file.path.split('/');
      let currentLevel = tree;
      let currentPath = '';

      for (let i = 0; i < pathParts.length; i++) {
        const part = pathParts[i];
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        const isFile = i === pathParts.length - 1;

        if (isFile) {
          currentLevel.push({
            name: part,
            path: currentPath,
            type: 'file',
            file
          });
        } else {
          let folder = currentLevel.find(item => item.name === part && item.type === 'folder');
          
          if (!folder) {
            folder = {
              name: part,
              path: currentPath,
              type: 'folder',
              children: [],
              isExpanded: true
            };
            currentLevel.push(folder);
          }
          
          currentLevel = folder.children!;
        }
      }
    });

    setFileTree(tree);
  };

  // Open file in editor
  const openFile = (file: EditorFile) => {
    setActiveFile(file.id);
    
    if (!openTabs.includes(file.id)) {
      setOpenTabs(prev => [...prev, file.id]);
    }

    setFiles(prev => prev.map(f => 
      f.id === file.id ? { ...f, isOpen: true } : f
    ));
  };

  // Close tab
  const closeTab = (fileId: string) => {
    setOpenTabs(prev => prev.filter(id => id !== fileId));
    
    if (activeFile === fileId) {
      const remainingTabs = openTabs.filter(id => id !== fileId);
      setActiveFile(remainingTabs.length > 0 ? remainingTabs[remainingTabs.length - 1] : null);
    }

    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, isOpen: false } : f
    ));
  };

  // Update file content
  const updateFileContent = (fileId: string, content: string) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId 
        ? { ...f, content, isModified: f.content !== content }
        : f
    ));
  };

  // Save all files
  const saveFiles = async () => {
    const modifiedFiles = files.filter(f => f.isModified);
    if (modifiedFiles.length > 0) {
      await onSave(files);
      setFiles(prev => prev.map(f => ({ ...f, isModified: false })));
    }
  };

  // Get file icon
  const getFileIcon = (file: EditorFile) => {
    const Icon = FILE_TYPE_ICONS[file.type] || FileText;
    return Icon;
  };

  // Filter files based on search
  const filteredTree = fileTree.filter(node => 
    searchQuery === '' || 
    node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (node.children?.some(child => 
      child.name.toLowerCase().includes(searchQuery.toLowerCase())
    ))
  );

  const activeFileData = files.find(f => f.id === activeFile);

  return (
    <div className={`flex h-full bg-background border border-border rounded-lg overflow-hidden ${className}`}>
      {/* File Explorer */}
      <div className="w-80 border-r border-border bg-surface">
        {/* Explorer Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-weight-semibold text-primary">Files</h3>
            <div className="flex items-center gap-2">
              <button className="p-1 text-secondary hover:text-primary transition-colors">
                <Plus className="w-4 h-4" />
              </button>
              <button className="p-1 text-secondary hover:text-primary transition-colors">
                <FolderOpen className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded text-sm focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* File Tree */}
        <div className="p-2 overflow-y-auto h-full">
          <FileTreeView 
            nodes={filteredTree} 
            onFileSelect={openFile}
            level={0}
          />
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Tabs */}
        {openTabs.length > 0 && (
          <div className="flex items-center bg-surface border-b border-border overflow-x-auto">
            {openTabs.map(tabId => {
              const file = files.find(f => f.id === tabId);
              if (!file) return null;

              const Icon = getFileIcon(file);
              
              return (
                <div
                  key={tabId}
                  className={`flex items-center gap-2 px-3 py-2 border-r border-border cursor-pointer transition-colors ${
                    activeFile === tabId 
                      ? 'bg-background text-primary' 
                      : 'text-secondary hover:text-primary hover:bg-surface-hover'
                  }`}
                  onClick={() => setActiveFile(tabId)}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm whitespace-nowrap">
                    {file.path.split('/').pop()}
                  </span>
                  {file.isModified && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(tabId);
                    }}
                    className="ml-1 p-1 text-secondary hover:text-primary transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Editor */}
        <div className="flex-1 relative">
          {activeFileData ? (
            <div className="h-full">
              {/* Editor Header */}
              <div className="flex items-center justify-between p-3 border-b border-border bg-surface">
                <div className="flex items-center gap-2">
                  {(() => {
                    const Icon = getFileIcon(activeFileData);
                    return <Icon className="w-4 h-4 text-secondary" />;
                  })()}
                  <span className="text-sm font-weight-medium text-primary">
                    {activeFileData.path}
                  </span>
                  {activeFileData.isModified && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                
                <button
                  onClick={saveFiles}
                  disabled={!files.some(f => f.isModified)}
                  className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Save
                </button>
              </div>

              {/* Code Editor */}
              <div className="h-full p-4 bg-background">
                <textarea
                  value={activeFileData.content}
                  onChange={(e) => updateFileContent(activeFileData.id, e.target.value)}
                  className="w-full h-full bg-transparent border-none resize-none focus:outline-none text-primary font-mono text-sm"
                  placeholder="Start typing..."
                />
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-secondary">
              <div className="text-center">
                <Code className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Select a file to start editing</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// File Tree View Component
function FileTreeView({ 
  nodes, 
  onFileSelect, 
  level = 0 
}: { 
  nodes: FileTreeNode[]; 
  onFileSelect: (file: EditorFile) => void;
  level: number;
}) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleExpanded = (path: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  return (
    <div>
      {nodes.map(node => (
        <div key={node.path}>
          <div
            className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-surface-hover transition-colors`}
            style={{ paddingLeft: `${level * 12 + 8}px` }}
            onClick={() => {
              if (node.type === 'folder') {
                toggleExpanded(node.path);
              } else if (node.file) {
                onFileSelect(node.file);
              }
            }}
          >
            {node.type === 'folder' ? (
              <>
                {expandedNodes.has(node.path) ? (
                  <ChevronDown className="w-4 h-4 text-secondary" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-secondary" />
                )}
                <Folder className="w-4 h-4 text-blue-500" />
              </>
            ) : (
              <>
                <div className="w-4" />
                {node.file && (() => {
                  const Icon = FILE_TYPE_ICONS[node.file.type] || FileText;
                  return <Icon className="w-4 h-4 text-secondary" />;
                })()}
              </>
            )}
            
            <span className="text-sm text-primary flex-1 truncate">
              {node.name}
            </span>
            
            {node.file?.isModified && (
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </div>

          {node.type === 'folder' && node.children && expandedNodes.has(node.path) && (
            <FileTreeView 
              nodes={node.children} 
              onFileSelect={onFileSelect}
              level={level + 1}
            />
          )}
        </div>
      ))}
    </div>
  );
}
