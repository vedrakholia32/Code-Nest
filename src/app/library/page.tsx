"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Code,
  Grid,
  Layers,
  Search,
  Tag,
  X,
  Clock,
  User,
  Globe,
  Eye,
  Sparkles,
  Lock,
} from "lucide-react";
import NavigationHeader from "@/comonents/NavigationHeader";
import Image from "next/image";
import { LANGUAGE_CONFIG } from "../(root)/_constants";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

function LibraryPageContent() {
  const { user } = useUser();
  const userData = useQuery(api.users.getUser, { userId: user?.id ?? "" });
  const projects = useQuery(api.projects.getPublicProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");

  const isPro = userData?.isPro ?? false;

  // loading state
  if (projects === undefined) {
    return (
      <div className="min-h-screen">
        <NavigationHeader />
        <LibraryPageSkeleton />
      </div>
    );
  }

  const languages = [...new Set(projects.map((p) => p.language))];
  const popularLanguages = languages.slice(0, 8);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description &&
        project.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesLanguage =
      !selectedLanguage || project.language === selectedLanguage;

    return matchesSearch && matchesLanguage;
  });

  // Redirect non-pro users with upgrade message
  if (!isPro) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        <NavigationHeader />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="mb-8">
            {/* <Lock className="h-16 w-16 text-purple-500 mx-auto mb-4" /> */}
            <h1 className="text-4xl md:text-5xl font-bold text-[#b3b3b3] group-hover:text-[#e0e0e0] transition-colors duration-300 mb-6">
              Project Showcase
            </h1>
            <p className="text-lg text-gray-400 mb-8">
              Access to multi-file projects and the Project Showcase is
              available exclusively for Pro users.
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-xl text-white mb-8">
            <Sparkles className="h-8 w-8 mx-auto mb-3" />
            <h2 className="text-xl font-semibold mb-2">Upgrade to Pro</h2>
            <p className="mb-4">
              Unlock multi-file projects, private repositories, and advanced
              collaboration features.
            </p>
            <button className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Upgrade Now
            </button>
          </div>

          <div className="text-center">
            <p className="text-gray-500 mb-4">Looking for code snippets?</p>
            <Link
              href="/snippets"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Visit Code Gallery
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <NavigationHeader />

      <div className="relative max-w-7xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <BookOpen className="w-8 h-8 text-[#7c3aed]" />
              <h1 className="text-4xl md:text-5xl font-bold text-[#b3b3b3] group-hover:text-[#e0e0e0] transition-colors duration-300">
                Project Showcase
              </h1>
            </div>
            <p className="text-xl text-gray-300 mb-8">
              Discover and explore amazing projects created by the community
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Code className="w-4 h-4" />
                <span>{projects.length} Public Projects</span>
              </div>
              <div className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                <span>{languages.length} Languages</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <div className="bg-[#1a1a2e] rounded-2xl p-8 border border-[#16213e]">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects, languages, or creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-[#0a0a0f] border border-[#232340] rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/50 focus:border-[#7c3aed]/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Language Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setSelectedLanguage(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !selectedLanguage
                    ? "bg-[#7c3aed] text-white"
                    : "bg-[#232340] text-gray-300 hover:bg-[#2a2a40] hover:text-white"
                }`}
              >
                All Languages
              </button>
              {popularLanguages.map((language) => {
                const config = LANGUAGE_CONFIG[language];
                return (
                  <button
                    key={language}
                    onClick={() => setSelectedLanguage(language)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      selectedLanguage === language
                        ? "bg-[#7c3aed] text-white"
                        : "bg-[#232340] text-gray-300 hover:bg-[#2a2a40] hover:text-white"
                    }`}
                  >
                    {config && (
                      <Image
                        src={config.logoPath}
                        alt={language}
                        width={16}
                        height={16}
                        className="rounded"
                      />
                    )}
                    {config?.label || language}
                  </button>
                );
              })}
            </div>

            {/* View Toggle */}
            <div className="flex items-center justify-between">
              <div className="text-gray-300">
                <span className="font-medium">{filteredProjects.length}</span>{" "}
                projects found
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setView("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    view === "grid"
                      ? "bg-[#7c3aed] text-white"
                      : "text-gray-400 hover:text-white hover:bg-[#2a2a40]"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    view === "list"
                      ? "bg-[#7c3aed] text-white"
                      : "text-gray-400 hover:text-white hover:bg-[#2a2a40]"
                  }`}
                >
                  <Layers className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Projects Grid/List */}
        <AnimatePresence mode="wait">
          {filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <Code className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                No projects found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={
                view === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {filteredProjects.map((project) => (
                <ProjectCard key={project._id} project={project} view={view} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  view,
}: {
  project: {
    _id: string;
    _creationTime: number;
    name: string;
    description?: string;
    language: string;
    createdAt: number;
    userName: string;
    isPublic: boolean;
    userId: string;
    updatedAt: number;
  };
  view: "grid" | "list";
}) {
  const config = LANGUAGE_CONFIG[project.language];

  if (view === "list") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.01 }}
        className="bg-[#1a1a2e] rounded-xl p-6 border border-[#16213e] hover:border-[#7c3aed]/30 transition-all duration-300"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              {config && (
                <Image
                  src={config.logoPath}
                  alt={project.language}
                  width={24}
                  height={24}
                  className="rounded"
                />
              )}
              <h3 className="text-lg font-semibold text-white">
                {project.name}
              </h3>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Globe className="w-3 h-3" />
                <span>Public</span>
              </div>
            </div>
            {project.description && (
              <p className="text-gray-300 mb-3 line-clamp-2">
                {project.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{project.userName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>
                  {new Date(project._creationTime).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <Link
            href={`/library/${project._id}`}
            className="px-4 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            <span>View</span>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="bg-[#1a1a2e] rounded-xl p-6 border border-[#16213e] hover:border-[#7c3aed]/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          {config && (
            <Image
              src={config.logoPath}
              alt={project.language}
              width={20}
              height={20}
              className="rounded"
            />
          )}
          <span className="text-sm text-gray-400 font-medium">
            {config?.label || project.language}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-green-400">
          <Globe className="w-3 h-3" />
          <span>Public</span>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white mb-3 line-clamp-1">
        {project.name}
      </h3>

      {project.description && (
        <p className="text-gray-300 text-sm mb-4 line-clamp-3">
          {project.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">
          <div className="flex items-center gap-1 mb-1">
            <User className="w-3 h-3" />
            <span className="line-clamp-1">{project.userName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{new Date(project._creationTime).toLocaleDateString()}</span>
          </div>
        </div>
        <Link
          href={`/library/${project._id}`}
          className="px-3 py-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm rounded-lg transition-colors flex items-center gap-2"
        >
          <Eye className="w-3 h-3" />
          <span>View</span>
        </Link>
      </div>
    </motion.div>
  );
}

function LibraryPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse">
          {/* Hero Skeleton */}
          <div className="text-center mb-16">
            <div className="h-12 bg-gray-800 rounded-lg w-64 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-800 rounded-lg w-96 mx-auto mb-8"></div>
            <div className="flex justify-center gap-4">
              <div className="h-4 bg-gray-800 rounded w-24"></div>
              <div className="h-4 bg-gray-800 rounded w-24"></div>
            </div>
          </div>

          {/* Search Skeleton */}
          <div className="bg-[#1a1a2e] rounded-2xl p-8 border border-[#16213e] mb-12">
            <div className="h-12 bg-gray-800 rounded-xl mb-6"></div>
            <div className="flex gap-2 mb-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-800 rounded-lg w-20"></div>
              ))}
            </div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-800 rounded w-32"></div>
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-gray-800 rounded-lg"></div>
                <div className="h-8 w-8 bg-gray-800 rounded-lg"></div>
              </div>
            </div>
          </div>

          {/* Projects Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="bg-[#1a1a2e] rounded-xl p-6 border border-[#16213e]"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="h-4 bg-gray-800 rounded w-20"></div>
                  <div className="h-4 bg-gray-800 rounded w-16"></div>
                </div>
                <div className="h-6 bg-gray-800 rounded mb-3"></div>
                <div className="h-16 bg-gray-800 rounded mb-4"></div>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="h-3 bg-gray-800 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-800 rounded w-20"></div>
                  </div>
                  <div className="h-8 bg-gray-800 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LibraryPage() {
  return <LibraryPageContent />;
}
