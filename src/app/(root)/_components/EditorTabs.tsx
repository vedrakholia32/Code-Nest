"use client";
import { ProjectFile } from "@/types";
import { X, Circle } from "lucide-react";
import Image from "next/image";

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
        js: "/javascript.png",
        jsx: "/javascript.png", 
        ts: "/typescript.png",
        tsx: "/typescript.png",
        py: "/python.png",
        java: "/java.png",
        cpp: "/cpp.png",
        cxx: "/cpp.png",
        cc: "/cpp.png",
        c: "/cpp.png",
        cs: "/csharp.png",
        go: "/go.png",
        rs: "/rust.png",
        rb: "/ruby.png",
        swift: "/swift.png",
        sh: "/bash.png"
    };
    const iconSrc = iconMap[extension || ''] || "/logo.png";
    return (
        <Image
            src={iconSrc}
            alt={extension ? `${extension} file` : "file"}
            width={16}
            height={16}
            className="w-4 h-4 inline-block align-middle"
        />
    );
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
