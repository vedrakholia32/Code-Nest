"use client";

import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { CheckCircle, Copy, Terminal } from "lucide-react";
import { useState } from "react";
import RunningCodeSkeleton from "./RunningCodeSkeleton";

interface OutputPanelProps {
  output?: string;
  error?: string | null;
  isProjectMode?: boolean;
}

function OutputPanel({ 
  output: propOutput, 
  error: propError, 
  isProjectMode = false 
}: OutputPanelProps) {
  const { output: storeOutput, error: storeError, isRunning } = useCodeEditorStore();
  const [isCopied, setIsCopied] = useState(false);
  
  // Use props if in project mode, otherwise use store
  const output = isProjectMode ? propOutput || "" : storeOutput;
  const error = isProjectMode ? propError : storeError;
  const hasContent = error || output;

  const handleCopy = async () => {
    if (!hasContent) return;
    await navigator.clipboard.writeText(error || output);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative h-[calc(100vh-80px)] min-h-[600px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-2xl m-2 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
        <Terminal className="w-5 h-5 text-blue-400" />
        </div>
        <span className="text-base font-semibold text-gray-300">Output</span>
      </div>
      {hasContent && (
        <button
        onClick={handleCopy}
        className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 backdrop-blur-sm border border-white/10 text-gray-300 rounded-md hover:bg-white/10 transition-colors"
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
      <div className="relative min-h-[400px] bg-black/5 backdrop-blur-sm border border-white/5 rounded-xl">
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
        <div className="flex flex-col items-center justify-center w-full h-full py-16">
        <Terminal className="w-10 h-10 text-gray-500 mb-4" />
        <span className="text-lg text-gray-400">Run your code to see the output here</span>
        </div>
      )}
      </div>
    </div>
  );
}

export default OutputPanel;