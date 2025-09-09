"use client";
import { ProjectFile } from "@/types";
import { X, Circle } from "lucide-react";

interface EditorTabsProps {
  openTabs: ProjectFile[];
  activeTab: string | null;
  onTabSelect: (fileId: string) => void;
  onTabClose: (fileId: string) => void;
}

export default function EditorTabs({
  openTabs,
  activeTab,
  onTabSelect,
  onTabClose
}: EditorTabsProps) {
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const iconMap: Record<string, string> = {
      js: "🟨",
      ts: "🔷", 
      py: "🐍",
      java: "☕",
      cpp: "⚡",
      c: "⚡",
      cs: "🔵",
      go: "🐹",
      rs: "🦀",
      php: "🐘",
      rb: "💎",
      swift: "🦉"
    };
    return iconMap[extension || ''] || "📄";
  };

  if (openTabs.length === 0) {
    return (
      <div className="h-10 bg-[#1e1e2e] border-b border-[#313244] flex items-center justify-center">
        <span className="text-sm text-gray-500">No files open</span>
      </div>
    );
  }

  return (
    <div className="h-10 bg-[#1e1e2e] border-b border-[#313244] flex items-center overflow-x-auto">
      {openTabs.map((file) => (
        <div
          key={file._id}
          className={`flex items-center gap-2 px-3 py-2 border-r border-[#313244] cursor-pointer group min-w-0 ${
            activeTab === file._id
              ? 'bg-[#262637] text-[#e6edf3]'
              : 'hover:bg-[#2a2a3a] text-gray-400 hover:text-[#e6edf3]'
          }`}
          onClick={() => onTabSelect(file._id)}
        >
          <span className="text-xs">{getFileIcon(file.name)}</span>
          <span className="text-sm truncate max-w-[120px]">{file.name}</span>
          {file.isEntry && (
            <Circle className="w-2 h-2 fill-green-400 text-green-400 flex-shrink-0" />
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTabClose(file._id);
            }}
            className="opacity-0 group-hover:opacity-100 hover:bg-[#3a3a4a] rounded p-0.5 flex-shrink-0 ml-1"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
