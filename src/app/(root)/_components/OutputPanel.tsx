"use client";

import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { AlertTriangle, CheckCircle, Clock, Copy, Terminal } from "lucide-react";
import { useState } from "react";
import RunningCodeSkeleton from "./RunningCodeSkeleton";

function OutputPanel() {
  const { output, error, isRunning } = useCodeEditorStore();
  const [isCopied, setIsCopied] = useState(false);
  const hasContent = error || output;

  const handleCopy = async () => {
    if (!hasContent) return;
    await navigator.clipboard.writeText(error || output);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative h-[calc(100vh-80px)] min-h-[600px] bg-[#181825] p-6 shadow-[inset-8px_0_20px_rgba(255,255,255,0.15)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#232334]">
        <Terminal className="w-5 h-5 text-blue-400" />
        </div>
        <span className="text-base font-semibold text-[#b3b3b3]">Output</span>
      </div>
      {hasContent && (
        <button
        onClick={handleCopy}
        className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#1e1e2e] text-[#b3b3b3] rounded-md hover:bg-[#2a2a3a] transition-colors"
        >
        {isCopied ? (
          <CheckCircle className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">{isCopied ? "Copied" : "Copy"}</span>
        </button>
      )}
      </div>

      {/* Output or Placeholder */}
      <div className="relative min-h-[400px] bg-[#232334] rounded-xl">
      {isRunning ? (
        <RunningCodeSkeleton />
      ) : hasContent ? (
        <pre className="w-full text-sm text-gray-200 whitespace-pre-wrap break-words p-4">
        {error ? (
          <span className="text-red-400">{error}</span>
        ) : (
          output
        )}
        </pre>
      ) : (
        <div className="flex items-center justify-center w-full h-full py-16">
        <Terminal className="w-10 h-10 text-gray-600 mb-4" />
        <span className="text-lg text-gray-500">Run your code to see the output here</span>
        </div>
      )}
      </div>
    </div>
  );
}

export default OutputPanel;