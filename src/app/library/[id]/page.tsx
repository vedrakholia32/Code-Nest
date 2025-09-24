"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { notFound } from "next/navigation";
import NavigationHeader from "@/comonents/NavigationHeader";
import { useState, use } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  Code, 
  Copy, 
  Eye, 
  FileText, 
  Globe, 
  Lock,
  Share2, 
  Sparkles,
  User 
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { LANGUAGE_CONFIG } from "../../(root)/_constants";
import Editor from "@monaco-editor/react";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useUser } from "@clerk/nextjs";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function PublicProjectPage({ params }: Props) {
  const { user } = useUser();
  const userData = useQuery(api.users.getUser, { userId: user?.id ?? "" });
  const { theme, fontSize } = useCodeEditorStore();
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { id } = use(params);

  const isPro = userData?.isPro ?? false;

  const project = useQuery(api.projects.getProject, {
    projectId: id as Id<"projects">,
  });
  
  const files = useQuery(
    api.files.getProjectFiles,
    project?._id ? { projectId: project._id } : "skip"
  );

  if (project === undefined || files === undefined) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        <NavigationHeader />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading project...</p>
          </div>
        </div>
      </div>
    );
  }

  if (project === null || !project.isPublic) {
    notFound();
  }

  // Redirect non-pro users with upgrade message
  if (!isPro) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        <NavigationHeader />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="mb-8">
            <Lock className="h-16 w-16 text-purple-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-purple-600 bg-clip-text text-transparent mb-4">
              Project Access Restricted
            </h1>
            <p className="text-lg text-gray-400 mb-8">
              This multi-file project is only available to Pro users. Upgrade to access advanced project features.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-xl text-white mb-8">
            <Sparkles className="h-8 w-8 mx-auto mb-3" />
            <h2 className="text-xl font-semibold mb-2">Upgrade to Pro</h2>
            <p className="mb-4">Unlock multi-file projects, private repositories, and advanced collaboration features.</p>
            <button className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Upgrade Now
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/library"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Project Showcase
            </Link>
            <Link 
              href="/snippets"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Visit Code Gallery
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const activeFile = activeFileId && files ? files.find(f => f._id === activeFileId) : files?.[0];
  const config = LANGUAGE_CONFIG[project.language];

  const handleCopyProject = async () => {
    if (!files) return;
    
    const projectData = {
      name: project.name,
      description: project.description,
      language: project.language,
      files: files.map(file => ({
        name: file.name,
        content: file.content,
        language: file.language,
        path: file.path
      }))
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(projectData, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy project:", error);
    }
  };

  const handleShareProject = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.name,
          text: project.description || `Check out this ${project.language} project`,
          url: typeof window !== 'undefined' ? window.location.href : '',
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback: copy URL to clipboard
      if (typeof window !== 'undefined') {
        await navigator.clipboard.writeText(window.location.href);
        alert("Project URL copied to clipboard!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <NavigationHeader />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/library"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Project Showcase
          </Link>

          <div className="bg-[#1a1a2e] rounded-2xl p-8 border border-[#16213e]">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  {config && (
                    <Image
                      src={config.logoPath}
                      alt={project.language}
                      width={32}
                      height={32}
                      className="rounded"
                    />
                  )}
                  <div>
                    <h1 className="text-3xl font-bold text-white">
                      {project.name}
                    </h1>
                    <div className="flex items-center gap-4 text-gray-400 mt-2">
                      <div className="flex items-center gap-1">
                        <Globe className="w-4 h-4 text-green-400" />
                        <span>Public Project</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Code className="w-4 h-4" />
                        <span>{config?.label || project.language}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        <span>{files?.length || 0} files</span>
                      </div>
                    </div>
                  </div>
                </div>

                {project.description && (
                  <p className="text-gray-300 text-lg mb-6">
                    {project.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Created by {project.userName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(project._creationTime).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleShareProject}
                  className="px-4 py-2 bg-[#232340] hover:bg-[#2a2a40] text-gray-300 hover:text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button
                  onClick={handleCopyProject}
                  className="px-4 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? "Copied!" : "Copy Project"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* File Explorer and Editor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-4 gap-6"
        >
          {/* File Explorer */}
          <div className="lg:col-span-1">
            <div className="bg-[#1a1a2e] rounded-xl border border-[#16213e] p-4">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Project Files
              </h3>
              <div className="space-y-2">
                {files?.map((file) => (
                  <button
                    key={file._id}
                    onClick={() => setActiveFileId(file._id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeFileId === file._id || (!activeFileId && files[0]._id === file._id)
                        ? "bg-[#7c3aed]/20 text-[#7c3aed] border border-[#7c3aed]/30"
                        : "text-gray-300 hover:bg-[#232340] hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {LANGUAGE_CONFIG[file.language] && (
                        <Image
                          src={LANGUAGE_CONFIG[file.language].logoPath}
                          alt={file.language}
                          width={16}
                          height={16}
                          className="rounded"
                        />
                      )}
                      <span className="text-sm font-medium truncate">
                        {file.name}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {file.path}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="lg:col-span-3">
            <div className="bg-[#1a1a2e] rounded-xl border border-[#16213e] overflow-hidden">
              {activeFile ? (
                <div>
                  <div className="bg-[#16213e] px-4 py-3 border-b border-[#232340] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {LANGUAGE_CONFIG[activeFile.language] && (
                        <Image
                          src={LANGUAGE_CONFIG[activeFile.language].logoPath}
                          alt={activeFile.language}
                          width={20}
                          height={20}
                          className="rounded"
                        />
                      )}
                      <span className="text-white font-medium">
                        {activeFile.name}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {activeFile.language}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Eye className="w-4 h-4" />
                      <span>Read-only</span>
                    </div>
                  </div>
                  <div className="h-[600px]">
                    <Editor
                      height="100%"
                      language={activeFile.language}
                      theme={theme}
                      value={activeFile.content}
                      options={{
                        fontSize,
                        readOnly: true,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 2,
                        wordWrap: "on",
                        lineNumbers: "on",
                        renderWhitespace: "selection",
                        contextmenu: false,
                        selectOnLineNumbers: false,
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="h-[600px] flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Select a file to view its contents</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
