"use client";
import { ProjectFile } from "@/types";
import { Settings, Edit2, Check, X, ExternalLink } from "lucide-react";
import FontSizeControl from "./FontSizeControl";
import ThemeSelector from "./ThemeSelector";
import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import Link from "next/link";

interface EditorToolbarProps {
  activeFile: ProjectFile | null;
  onRunFile: (file: ProjectFile) => void;
  isRunning: boolean;
  files: ProjectFile[];
  projectName: string;
  projectId: Id<"projects">;
  isPublic?: boolean;
}

export default function EditorToolbar({
  activeFile,
  onRunFile,
  isRunning,
  projectName,
  projectId,
  isPublic
}: Omit<EditorToolbarProps, 'files'>) {
  const [isEditingProjectName, setIsEditingProjectName] = useState(false);
  const [newProjectName, setNewProjectName] = useState(projectName);
  const updateProject = useMutation(api.projects.updateProject);

  // Update local state when projectName prop changes
  useEffect(() => {
    setNewProjectName(projectName);
  }, [projectName]);

  const handleProjectNameSave = async () => {
    if (newProjectName.trim() && newProjectName !== projectName) {
      try {
        await updateProject({
          projectId,
          name: newProjectName.trim(),
        });
      } catch (error) {
        console.error("Failed to update project name:", error);
        setNewProjectName(projectName); // Reset on error
      }
    }
    setIsEditingProjectName(false);
  };

  const handleProjectNameCancel = () => {
    setNewProjectName(projectName);
    setIsEditingProjectName(false);
  };

  return (
    <div className="h-12 bg-[#262637] border-b border-[#313244] flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">Project:</span>
          {isEditingProjectName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="px-2 py-1 bg-[#1e1e2e] border border-[#414155] rounded text-white text-sm min-w-[120px]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleProjectNameSave();
                  if (e.key === 'Escape') handleProjectNameCancel();
                }}
                autoFocus
              />
              <button
                onClick={handleProjectNameSave}
                className="p-1 hover:bg-[#2a2a3a] rounded transition-colors"
                title="Save"
              >
                <Check className="w-3 h-3 text-green-400" />
              </button>
              <button
                onClick={handleProjectNameCancel}
                className="p-1 hover:bg-[#2a2a3a] rounded transition-colors"
                title="Cancel"
              >
                <X className="w-3 h-3 text-red-400" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 group">
              <span className="text-[#e6edf3] font-medium">{projectName}</span>
              <button
                onClick={() => setIsEditingProjectName(true)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#2a2a3a] rounded transition-all"
                title="Rename project"
              >
                <Edit2 className="w-3 h-3 text-gray-400" />
              </button>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3 px-2 py-1 bg-[#1e1e2e] rounded border border-[#313244]">
          <div className="h-3 w-px bg-[#313244]" />
          <FontSizeControl />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isPublic && (
          <Link
            href={`/library/${projectId}`}
            className="px-3 py-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-md transition-colors flex items-center gap-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="text-sm font-medium">View in Showcase</span>
          </Link>
        )}
        {activeFile && (
          <button
            onClick={() => onRunFile(activeFile)}
            disabled={isRunning}
            className={`px-3 py-1.5 bg-[#15803d] text-white rounded-md hover:bg-[#166534] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 ${
              isRunning ? '' : 'hover:cursor-pointer'
            }`}
          >
            {isRunning ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
            <span className="text-sm font-medium">
              {isRunning ? 'Running...' : `Run`}
            </span>
          </button>
        )}
        {!activeFile && (
          <span className="text-sm text-gray-400">
            Select a file to run
          </span>
        )}
      </div>
    </div>
  );
}
