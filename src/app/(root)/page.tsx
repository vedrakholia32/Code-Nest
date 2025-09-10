"use client";

import { useState } from "react";
import EditorPanel from "./_components/EditorPanel";
import Header from "./_components/Header";
import OutputPanel from "./_components/OutputPanel";
import ResizablePanel from "./_components/ResizablePanel";
import CollapsibleProjectManager from "./_components/CollapsibleProjectManager";
import MultiFileEditor from "./_components/MultiFileEditor";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Id } from "../../../convex/_generated/dataModel";
import LandingPage from "../_components/LandingPage";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Home() {
  // All hooks must be called at the top level, before any early returns
  const { user, isLoaded } = useUser();
  const userData = useQuery(api.users.getUser, { userId: user?.id ?? "" });
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [activeMode, setActiveMode] = useState<"single" | "project">("single");
  const [projectOutput, setProjectOutput] = useState("");
  const [projectError, setProjectError] = useState<string | null>(null);

  const isPro = userData?.isPro ?? false;

  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page if user is not authenticated
  if (!user) {
    return <LandingPage />;
  }

  const handleProjectRunResult = (output: string, error?: string) => {
    setProjectOutput(output);
    setProjectError(error || null);
  };

  return (
    <div className="min-h-screen">
      <Header isPro={isPro} showLanguageSelector={activeMode === "single"} />

      {/* Mode Toggle */}
      <div className="bg-[#1e1e2e] border-b border-[#313244] px-4 py-2">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveMode("single")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeMode === "single"
                ? "bg-[#7c3aed] text-white"
                : "text-gray-400 hover:text-white hover:bg-[#2a2a3a]"
            }`}
          >
            Snippet
          </button>
          <button
            onClick={() => {
              if (isPro) {
                setActiveMode("project");
              }
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${
              activeMode === "project"
                ? "bg-[#7c3aed] text-white"
                : isPro 
                  ? "text-gray-400 hover:text-white hover:bg-[#2a2a3a]" 
                  : "text-gray-600 cursor-not-allowed"
            }`}
            disabled={!isPro}
            title={!isPro ? "Upgrade to Pro to access multi-file projects" : ""}
          >
            Project
            {!isPro && (
              <span className="absolute -top-1 -right-1 text-xs bg-[#eabc60] text-black px-1 py-0.5 rounded font-bold">
                PRO
              </span>
            )}
          </button>
          {!isPro && (
            <Link
              href="/pricing"
              className="ml-2 px-3 py-1.5 bg-[#eabc60] hover:bg-[#d4a74a] text-black rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              Upgrade to Pro
            </Link>
          )}
        </div>
      </div>

      <div className="h-[calc(100vh-120px)] w-full">
        {activeMode === "single" ? (
          <ResizablePanel
            leftPanel={<EditorPanel />}
            rightPanel={<OutputPanel />}
            initialRatio={0.8}
            minLeftWidth={45}
            minRightWidth={20}
          />
        ) : (
          <div className="flex h-full">
            <CollapsibleProjectManager
              onProjectSelect={setSelectedProjectId}
              selectedProjectId={selectedProjectId}
            />
            {selectedProjectId ? (
              <ResizablePanel
                leftPanel={
                  <MultiFileEditor
                    projectId={selectedProjectId as Id<"projects">}
                    onRunResult={handleProjectRunResult}
                  />
                }
                rightPanel={
                  <OutputPanel
                    output={projectOutput}
                    error={projectError}
                    isProjectMode={true}
                  />
                }
                initialRatio={0.75}
                minLeftWidth={50}
                minRightWidth={25}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-[#0a0a0f] text-gray-500">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">
                    No project selected
                  </h3>
                  <p>Select or create a project to start coding</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
