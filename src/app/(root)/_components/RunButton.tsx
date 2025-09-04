"use client";

import { getExecutionResult, useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { motion } from "framer-motion";
import { Loader2, Play } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import useMounted from "@/hooks/useMounted";

function RunButton() {
  const mounted = useMounted();
  const { user } = useUser();
  const { runCode, language, isRunning } = useCodeEditorStore();
  const saveExecution = useMutation(api.codeExecutions.saveExecution);

  const handleRun = async () => {
    await runCode();
    const result = getExecutionResult();

    if (user && result) {
      await saveExecution({
        language,
        code: result.code,
        output: result.output || undefined,
        error: result.error || undefined,
      });
    }
  };

  if (!mounted) {
    return (
      <button
        disabled
        className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#1e1e2e] text-[#b3b3b3] rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Play className="w-4 h-4" />
        <span className="text-sm font-medium">Run</span>
      </button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={isRunning}
      onClick={handleRun}
      className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#15803d] text-white rounded-md hover:bg-[#166534] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isRunning ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Play className="w-4 h-4" />
      )}
      <span className="text-sm font-medium">
        {isRunning ? "Running..." : "Run"}
      </span>
    </motion.button>
  );
}
export default RunButton;