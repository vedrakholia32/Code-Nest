"use client";
import { ProjectFile } from "@/types";
import { Settings } from "lucide-react";
import FontSizeControl from "./FontSizeControl";

interface EditorToolbarProps {
  activeFile: ProjectFile | null;
  onRunFile: (file: ProjectFile) => void;
  isRunning: boolean;
  files: ProjectFile[];
  projectName: string;
}

export default function EditorToolbar({
  activeFile,
  onRunFile,
  isRunning,
  files,
  projectName
}: EditorToolbarProps) {
  return (
    <div className="h-12 bg-[#262637] border-b border-[#313244] flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Settings className="w-4 h-4" />
          <span>Project: {projectName}</span>
        </div>
        <FontSizeControl />
      </div>

      <div className="flex items-center gap-2">
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
              {isRunning ? 'Running...' : `Run ${activeFile.name}`}
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
