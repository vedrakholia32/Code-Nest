"use client";

import EditorPanel from "./_components/EditorPanel";
import Header from "./_components/Header";
import OutputPanel from "./_components/OutputPanel";
import ResizablePanel from "./_components/ResizablePanel";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { user } = useUser();
  const userData = useQuery(api.users.getUser, { userId: user?.id ?? "" });
  const isPro = userData?.isPro ?? false;

  return (
    <div className="min-h-screen">
      <Header isPro={isPro} />
      <div className="h-[calc(100vh-80px)] w-full">
        <ResizablePanel
          leftPanel={<EditorPanel />}
          rightPanel={<OutputPanel />}
          initialRatio={0.75}
          minLeftWidth={45}
          minRightWidth={25}
        />
      </div>
    </div>
  );
}
