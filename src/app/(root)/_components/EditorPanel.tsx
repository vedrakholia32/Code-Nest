"use client";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useEffect, useState } from "react";
import { defineMonacoThemes, LANGUAGE_CONFIG } from "../_constants";
import { Editor } from "@monaco-editor/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { RotateCcwIcon, ShareIcon, TypeIcon, X } from "lucide-react";
import { SignedIn, useClerk, useUser } from "@clerk/nextjs";
import { EditorPanelSkeleton } from "./EditorPanelSkeleton";
import useMounted from "@/hooks/useMounted";
import ShareSnippetDialog from "./ShareSnippetDialog";
import RunButton from "./RunButton";
import CollaborationButton from "./CollaborationButton";
import CollaborationPanel from "./CollaborationPanel";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import dynamic from "next/dynamic";

// Dynamically import CollaborativeEditor to prevent SSR issues
const CollaborativeEditor = dynamic(
  () => import("./CollaborativeEditor"),
  { 
    ssr: false,
    loading: () => <EditorPanelSkeleton />
  }
);

function EditorPanel() {
  const clerk = useClerk();
  const { user } = useUser();
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [collaborationRoomId, setCollaborationRoomId] = useState<string | null>(null);
  const [isInCollaboration, setIsInCollaboration] = useState(false);
  const { language, theme, fontSize, editor, setFontSize, setEditor } =
    useCodeEditorStore();

  const mounted = useMounted();
  const leaveRoom = useMutation(api.collaboration.leaveRoom);

  // Function to get personalized default code
  const getPersonalizedCode = (language: string, userName?: string) => {
    const firstName = userName ? userName.split(' ')[0] : null;
    const greeting = firstName ? `Hello, ${firstName}!` : "Hello, World!";
    
    const baseCode = LANGUAGE_CONFIG[language].defaultCode;
    
    // Replace "Hello, World!" with personalized greeting
    return baseCode.replace("Hello, World!", greeting);
  };

  useEffect(() => {
    const savedCode = localStorage.getItem(`editor-code-${language}`);
    const codeVersion = localStorage.getItem(`editor-code-version-${language}`);
    const currentVersion = "v4.0"; // Updated version for personalized examples
    
    // Use new default code if no saved code or version mismatch
    const userName = user?.fullName || user?.firstName || undefined;
    const defaultCode = getPersonalizedCode(language, userName);
    const newCode = (savedCode && codeVersion === currentVersion) 
      ? savedCode 
      : defaultCode;
      
    if (editor) {
      editor.setValue(newCode);
      // Update version when using default code
      if (!savedCode || codeVersion !== currentVersion) {
        localStorage.setItem(`editor-code-version-${language}`, currentVersion);
      }
    }
  }, [language, editor, user]);

  useEffect(() => {
    const { loadSavedState } = useCodeEditorStore.getState();
    loadSavedState();
  }, []);

  const handleRefresh = () => {
    const userName = user?.fullName || user?.firstName || undefined;
    const defaultCode = getPersonalizedCode(language, userName);
    if (editor) editor.setValue(defaultCode);
    localStorage.removeItem(`editor-code-${language}`);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      localStorage.setItem(`editor-code-${language}`, value);
      localStorage.setItem(`editor-code-version-${language}`, "v4.0");
    }
  };

  const handleFontSizeChange = (newSize: number) => {
    const size = Math.min(Math.max(newSize, 12), 24);
    setFontSize(size);
    localStorage.setItem("editor-font-size", size.toString());
  };

  // Collaboration handlers
  const handleCollaborationStart = (roomId: string) => {
    setCollaborationRoomId(roomId);
    setIsInCollaboration(true);
  };

  const handleLeaveCollaboration = async () => {
    if (collaborationRoomId) {
      try {
        await leaveRoom({ roomId: collaborationRoomId });
      } catch (error) {
        console.error('Failed to leave room:', error);
      }
    }
    setCollaborationRoomId(null);
    setIsInCollaboration(false);
  };

  if (!mounted) return null;

  return (
    <div className="relative h-[calc(100vh-80px)] min-h-[600px] flex flex-col">
      <div className="flex-1 flex flex-row gap-2 m-2">
        {/* Main Editor Panel */}
        <div className="flex-1 flex flex-col justify-stretch bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl relative">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-3 hover:cursor-pointer">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:cursor-pointer hover:bg-white/10 transition-colors">
                <Image
                  src={"/" + language + ".png"}
                  alt="Logo"
                  width={24}
                  height={24}
                  className="hover:cursor-pointer"
                />
              </div>
              <div className="hover:cursor-pointer">
                <h2 className="text-sm font-semibold text-gray-300">
                  {isInCollaboration ? "Collaborative Editor" : "Code Editor"}
                </h2>
                {isInCollaboration && (
                  <p className="text-xs text-blue-400">Room: {collaborationRoomId}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Font Size Controls - only show in regular mode */}
              {!isInCollaboration && (
                <div className="flex items-center gap-1.5 w-[120px] px-3 py-1.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-md hover:border-white/20 transition-colors group">
                  <TypeIcon className="w-4.2 h-4.2 text-gray-300 opacity-70 group-hover:opacity-100 transition-opacity" />
                  <div className="h-4 w-px bg-white/20 mx-1" />
                  <button
                    className="w-8 py-0.5 rounded-md hover:bg-white/10 text-sm font-medium text-gray-300 transition-colors hover:cursor-pointer"
                    onClick={() => handleFontSizeChange(Math.max(12, fontSize - 1))}
                    aria-label="Decrease font size"
                  >
                    −
                  </button>
                  <span className="text-sm font-medium text-gray-300 w-8 text-center select-none">
                    {fontSize}
                  </span>
                  <button
                    className="w-8 py-0.5 rounded-md hover:bg-white/10 text-sm font-medium text-gray-300 transition-colors hover:cursor-pointer"
                    onClick={() => handleFontSizeChange(Math.min(24, fontSize + 1))}
                    aria-label="Increase font size"
                  >
                    +
                  </button>
                </div>
              )}
              
              {/* Reset Button - only show in regular mode */}
              {!isInCollaboration && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRefresh}
                  className="w-[120px] px-3 py-1.5 bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 rounded-md transition-colors inline-flex items-center justify-center hover:cursor-pointer"
                  aria-label="Reset to default code"
                >
                  <RotateCcwIcon className="w-4 h-4 text-gray-300 mr-2" />
                  <span className="text-sm font-medium text-gray-300">Reset</span>
                </motion.button>
              )}
              
              {/* Share Button - only show in regular mode */}
              {!isInCollaboration && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsShareDialogOpen(true)}
                  className="w-[120px] px-3 py-1.5 bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 rounded-md transition-colors inline-flex items-center justify-center hover:cursor-pointer"
                >
                  <ShareIcon className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium text-gray-300">Share</span>
                </motion.button>
              )}

              {/* Collaboration Button */}
              {!isInCollaboration && (
                <SignedIn>
                  <CollaborationButton
                    onCollaborationStart={handleCollaborationStart}
                    className="w-[120px]"
                  />
                </SignedIn>
              )}

              {/* Leave Collaboration Button */}
              {isInCollaboration && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLeaveCollaboration}
                  className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 text-red-400 rounded-md transition-colors inline-flex items-center justify-center hover:cursor-pointer"
                >
                  <X className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Leave</span>
                </motion.button>
              )}

              {/* Run Button */}
              <SignedIn>
                <RunButton />
              </SignedIn>
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1 relative group overflow-hidden">
            {clerk.loaded && (
              <>
                {isInCollaboration && collaborationRoomId ? (
                  <CollaborativeEditor
                    roomId={collaborationRoomId}
                    language={language}
                    theme={theme}
                    fontSize={fontSize}
                  />
                ) : (
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
              </>
            )}

            {!clerk.loaded && <EditorPanelSkeleton />}
          </div>
        </div>

        {/* Collaboration Panel - show when in collaboration */}
        {isInCollaboration && collaborationRoomId && (
          <div className="w-80 flex-shrink-0">
            <CollaborationPanel
              roomId={collaborationRoomId}
              onLeaveRoom={handleLeaveCollaboration}
            />
          </div>
        )}
      </div>

      {/* Share Dialog */}
      {isShareDialogOpen && (
        <ShareSnippetDialog onClose={() => setIsShareDialogOpen(false)} />
      )}
    </div>
  );
}
export default EditorPanel;
