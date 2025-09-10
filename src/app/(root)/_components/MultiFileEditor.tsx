"use client";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { ProjectFile, ExecuteCodeResponse } from "@/types";
import FileExplorer from "./FileExplorer";
import EditorTabs from "./EditorTabs";
import EditorToolbar from "./EditorToolbar";
import ResizablePanel from "./ResizablePanel";
import { Editor } from "@monaco-editor/react";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useUser } from "@clerk/nextjs";

interface MultiFileEditorProps {
  projectId: Id<"projects">;
  onRunResult?: (output: string, error?: string) => void;
}

export default function MultiFileEditor({
  projectId,
  onRunResult,
}: MultiFileEditorProps) {
  const { user } = useUser();
  const files = useQuery(api.files.getProjectFiles, { projectId });
  const project = useQuery(api.projects.getProject, { projectId });
  const updateFileContent = useMutation(api.files.updateFileContent);
  const saveExecution = useMutation(api.codeExecutions.saveExecution);

  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const [fileContents, setFileContents] = useState<Record<string, string>>({});
  const [isRunning, setIsRunning] = useState(false);

  const { theme, fontSize } = useCodeEditorStore();

  // Initialize with entry file or first file
  useEffect(() => {
    if (files && files.length > 0 && !activeFileId) {
      const entryFile = files.find((f) => f.isEntry) || files[0];
      if (entryFile) {
        setActiveFileId(entryFile._id);
        setOpenTabs([entryFile._id]);
        setFileContents((prev) => ({
          ...prev,
          [entryFile._id]: entryFile.content,
        }));
      }
    }
  }, [files, activeFileId]);

  // Initialize file contents when files load
  useEffect(() => {
    if (files) {
      setFileContents((prevContents) => {
        const newContents: Record<string, string> = { ...prevContents };
        let hasChanges = false;
        
        files.forEach((file) => {
          if (!newContents[file._id]) {
            newContents[file._id] = file.content;
            hasChanges = true;
          }
        });
        
        return hasChanges ? newContents : prevContents;
      });
    }
  }, [files]);

  const handleFileSelect = (fileId: string) => {
    if (!openTabs.includes(fileId)) {
      setOpenTabs((prev) => [...prev, fileId]);
    }
    setActiveFileId(fileId);
  };

  const handleTabClose = (fileId: string) => {
    const newTabs = openTabs.filter((id) => id !== fileId);
    setOpenTabs(newTabs);

    if (activeFileId === fileId && newTabs.length > 0) {
      setActiveFileId(newTabs[newTabs.length - 1]);
    } else if (newTabs.length === 0) {
      setActiveFileId(null);
    }
  };

  const handleContentChange = (fileId: string, content: string) => {
    setFileContents((prev) => ({
      ...prev,
      [fileId]: content,
    }));

    // Debounced save to database
    const timeoutId = setTimeout(() => {
      updateFileContent({ fileId: fileId as Id<"files">, content });
    }, 1000);

    return () => clearTimeout(timeoutId);
  };

  const handleRunFile = async (file: ProjectFile) => {
    setIsRunning(true);
    const currentContent = fileContents[file._id] || file.content;

    try {
      // Save current content before running
      await updateFileContent({
        fileId: file._id as Id<"files">,
        content: currentContent,
      });

      const response = await fetch("/api/execute-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: file.language,
          code: currentContent,
        }),
      });

      const data: ExecuteCodeResponse = await response.json();

      if (data.run) {
        const output = data.run.output || "";
        const error = data.run.stderr || "";
        onRunResult?.(output, error);

        // Save execution to database
        if (user) {
          await saveExecution({
            language: file.language,
            code: currentContent,
            output: output || undefined,
            error: error || undefined,
            projectId: projectId,
            fileName: file.name,
            executionType: "multi-file",
          });
        }
      } else if (data.compile) {
        const compileError = data.compile.output || "Compilation failed";
        onRunResult?.("", compileError);

        // Save compilation error to database
        if (user) {
          await saveExecution({
            language: file.language,
            code: currentContent,
            output: undefined,
            error: compileError,
            projectId: projectId,
            fileName: file.name,
            executionType: "multi-file",
          });
        }
      }
    } catch (error) {
      console.error("Error running file:", error);
      const errorMessage = "Failed to execute code. Please try again.";
      onRunResult?.("", errorMessage);

      // Save execution error to database
      if (user) {
        await saveExecution({
          language: file.language,
          code: currentContent,
          output: undefined,
          error: errorMessage,
          projectId: projectId,
          fileName: file.name,
          executionType: "multi-file",
        });
      }
    } finally {
      setIsRunning(false);
    }
  };

  if (!files) {
    return (
      <div className="flex h-full items-center justify-center bg-[#1e1e2e]">
        <div className="text-gray-400">Loading project...</div>
      </div>
    );
  }

  const activeFile = files.find((f) => f._id === activeFileId);
  const openTabFiles = openTabs
    .map((id) => files.find((f) => f._id === id))
    .filter(Boolean) as ProjectFile[];

  return (
    <ResizablePanel
      leftPanel={
        <FileExplorer
          files={files}
          activeFileId={activeFileId}
          projectId={projectId}
          onFileSelect={handleFileSelect}
        />
      }
      rightPanel={
        <div className="flex flex-col h-full">
          <EditorTabs
            openTabs={openTabFiles}
            activeTab={activeFileId}
            onTabSelect={setActiveFileId}
            onTabClose={handleTabClose}
          />

          <EditorToolbar
            activeFile={activeFile || null}
            onRunFile={handleRunFile}
            isRunning={isRunning}
            projectName={project?.name || "Untitled Project"}
            projectId={projectId}
            isPublic={project?.isPublic}
          />

          {activeFile ? (
            <div className="flex-1">
              <Editor
                height="100%"
                language={activeFile.language}
                theme={theme}
                value={fileContents[activeFile._id] || activeFile.content}
                onChange={(value) =>
                  handleContentChange(activeFile._id, value || "")
                }
                options={{
                  fontSize,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  insertSpaces: true,
                  wordWrap: "on",
                  lineNumbers: "on",
                  renderWhitespace: "selection",
                  bracketPairColorization: { enabled: true },
                }}
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-[#0a0a0f] text-gray-500">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">No file selected</h3>
                <p>Select a file from the explorer to start editing</p>
              </div>
            </div>
          )}
        </div>
      }
      initialRatio={0.3}
      minLeftWidth={10}
      minRightWidth={70}
    />
  );
}
