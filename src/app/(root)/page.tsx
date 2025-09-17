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
import FlowingBackground from "../_components/FlowingBackground";
import { FolderOpen } from "lucide-react";

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
      <div className="min-h-screen bg-gray-950 relative overflow-hidden">
        <FlowingBackground variant="minimal" />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading...</p>
          </div>
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
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      <FlowingBackground variant="secondary" />
      
      <div className="relative z-10">
        <Header 
          isPro={isPro} 
          showLanguageSelector={activeMode === "single"} 
          activeMode={activeMode}
          onModeChange={setActiveMode}
        />

        <div className="h-[calc(100vh-80px)] w-full">
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
                <div className="flex-1 flex items-center justify-center bg-white/5 backdrop-blur-sm border border-white/10 text-gray-300 m-2 rounded-xl">
                  <div className="text-center">
                    <FolderOpen className="w-16 h-16 mx-auto mb-4 text-purple-400/60" />
                    <h3 className="text-xl font-semibold mb-2 text-white">
                      No project selected
                    </h3>
                    <p className="text-gray-400">Select or create a project to start coding</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
