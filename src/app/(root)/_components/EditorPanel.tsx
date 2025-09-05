"use client";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useEffect, useState } from "react";
import { defineMonacoThemes, LANGUAGE_CONFIG } from "../_constants";
import { Editor } from "@monaco-editor/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { RotateCcwIcon, ShareIcon, TypeIcon } from "lucide-react";
import { SignedIn, useClerk } from "@clerk/nextjs";
import { EditorPanelSkeleton } from "./EditorPanelSkeleton";
import useMounted from "@/hooks/useMounted";
import ShareSnippetDialog from "./ShareSnippetDialog";
import RunButton from "./RunButton";

function EditorPanel() {
  const clerk = useClerk();
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const { language, theme, fontSize, editor, setFontSize, setEditor } =
    useCodeEditorStore();

  const mounted = useMounted();

  useEffect(() => {
    const savedCode = localStorage.getItem(`editor-code-${language}`);
    const newCode = savedCode || LANGUAGE_CONFIG[language].defaultCode;
    if (editor) editor.setValue(newCode);
  }, [language, editor]);

  useEffect(() => {
    const { loadSavedState } = useCodeEditorStore.getState();
    loadSavedState();
  }, []);

  const handleRefresh = () => {
    const defaultCode = LANGUAGE_CONFIG[language].defaultCode;
    if (editor) editor.setValue(defaultCode);
    localStorage.removeItem(`editor-code-${language}`);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value) localStorage.setItem(`editor-code-${language}`, value);
  };

  const handleFontSizeChange = (newSize: number) => {
    const size = Math.min(Math.max(newSize, 12), 24);
    setFontSize(size);
    localStorage.setItem("editor-font-size", size.toString());
  };

  if (!mounted) return null;

  return (
    <div className="relative h-[calc(100vh-80px)] min-h-[600px] flex flex-col">
      <div className="flex-1 flex flex-col justify-stretch bg-[#181825] backdrop-blur rounded-none shadow-[8px_0_20px_rgba(0,0,0,0.5)] relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#232334]">
          <div className="flex items-center gap-3 hover:cursor-pointer">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#232334] hover:cursor-pointer hover:bg-[#2a2a3a] transition-colors">
              <Image
                src={"/" + language + ".png"}
                alt="Logo"
                width={24}
                height={24}
                className="hover:cursor-pointer"
              />
            </div>
            <div className="hover:cursor-pointer">
              <h2 className="text-sm font-semibold text-[#b3b3b3]">
                Code Editor
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Font Size Controls */}
            <div className="flex items-center gap-1.5 w-[120px] px-3 py-1.5 bg-[#1e1e2e] rounded-md border border-[#232334] hover:border-[#343444] transition-colors group">
              <TypeIcon className="w-4.2 h-4.2 text-[#d6d6d6] opacity-70 group-hover:opacity-100 transition-opacity" />
              <div className="h-4 w-px bg-[#232334] mx-1" />
              <button
                className="w-8 py-0.5 rounded-md hover:bg-[#2a2a3a] text-sm font-medium text-[#b3b3b3] transition-colors hover:cursor-pointer"
                onClick={() => handleFontSizeChange(Math.max(12, fontSize - 1))}
                aria-label="Decrease font size"
              >
                −
              </button>
              <span className="text-sm font-medium text-[#b3b3b3] w-8 text-center select-none">
                {fontSize}
              </span>
              <button
                className="w-8 py-0.5 rounded-md hover:bg-[#2a2a3a] text-sm font-medium text-[#b3b3b3] transition-colors hover:cursor-pointer"
                onClick={() => handleFontSizeChange(Math.min(24, fontSize + 1))}
                aria-label="Increase font size"
              >
                +
              </button>
            </div>
            {/* Reset Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRefresh}
              className="w-[120px] px-3 py-1.5 bg-[#1e1e2e] hover:bg-[#2a2a3a] rounded-md transition-colors inline-flex items-center justify-center hover:cursor-pointer"
              aria-label="Reset to default code"
            >
              <RotateCcwIcon className="w-4 h-4 text-[#b3b3b3] mr-2" />
              <span className="text-sm font-medium text-[#b3b3b3]">Reset</span>
            </motion.button>
            {/* Share Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsShareDialogOpen(true)}
              className="w-[120px] px-3 py-1.5 bg-[#1e1e2e] hover:bg-[#2a2a3a] rounded-md transition-colors inline-flex items-center justify-center hover:cursor-pointer"
            >
              <ShareIcon className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium text-[#b3b3b3]">Share</span>
            </motion.button>
            <SignedIn>
              <RunButton />
            </SignedIn>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 relative group overflow-hidden">
          {clerk.loaded && (
            <Editor
              height="100%"
              language={LANGUAGE_CONFIG[language].monacoLanguage}
              onChange={handleEditorChange}
              theme={theme}
              beforeMount={defineMonacoThemes}
              onMount={(editor) => setEditor(editor)}
              options={{
                minimap: { enabled: false },
                fontSize,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
                renderWhitespace: "selection",
                fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
                fontLigatures: true,
                cursorBlinking: "smooth",
                smoothScrolling: true,
                contextmenu: true,
                renderLineHighlight: "all",
                lineHeight: 1.6,
                letterSpacing: 0.5,
                roundedSelection: true,
                scrollbar: {
                  verticalScrollbarSize: 8,
                  horizontalScrollbarSize: 8,
                },
              }}
            />
          )}

          {!clerk.loaded && <EditorPanelSkeleton />}
        </div>
      </div>
      {isShareDialogOpen && (
        <ShareSnippetDialog onClose={() => setIsShareDialogOpen(false)} />
      )}
    </div>
  );
}
export default EditorPanel;
