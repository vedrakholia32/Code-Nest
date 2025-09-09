"use client";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Plus, Globe, Lock, Calendar, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { LANGUAGE_CONFIG } from "../_constants";

interface ProjectManagerProps {
  onProjectSelect: (projectId: string) => void;
  selectedProjectId: string | null;
}

export default function ProjectManager({ onProjectSelect, selectedProjectId }: ProjectManagerProps) {
  const { user } = useUser();
  const projects = useQuery(api.projects.getUserProjects, 
    user?.id ? { userId: user.id } : "skip"
  );
  const createProject = useMutation(api.projects.createProject);
  const deleteProject = useMutation(api.projects.deleteProject);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    language: "javascript",
    isPublic: false
  });

  const getLanguageLogo = (language: string) => {
    return LANGUAGE_CONFIG[language]?.logoPath || "/logo.png";
  };

  const languages = [
    { value: "javascript", label: "JavaScript", logoPath: "/javascript.png" },
    { value: "typescript", label: "TypeScript", logoPath: "/typescript.png" },
    { value: "python", label: "Python", logoPath: "/python.png" },
    { value: "java", label: "Java", logoPath: "/java.png" },
    { value: "cpp", label: "C++", logoPath: "/cpp.png" },
    { value: "csharp", label: "C#", logoPath: "/csharp.png" },
    { value: "go", label: "Go", logoPath: "/go.png" },
    { value: "rust", label: "Rust", logoPath: "/rust.png" },
    { value: "ruby", label: "Ruby", logoPath: "/ruby.png" },
  ];

  const handleCreateProject = async () => {
    if (!user || !newProject.name.trim()) return;

    try {
      const projectId = await createProject({
        name: newProject.name,
        description: newProject.description || undefined,
        userId: user.id,
        userName: user.fullName || user.emailAddresses[0]?.emailAddress || "Anonymous",
        language: newProject.language,
        isPublic: newProject.isPublic
      });
      
      onProjectSelect(projectId);
      setShowCreateForm(false);
      setNewProject({
        name: "",
        description: "",
        language: "javascript",
        isPublic: false
      });
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    try {
      await deleteProject({ projectId: projectId as Id<"projects"> });
      if (selectedProjectId === projectId) {
        onProjectSelect("");
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  if (!projects) {
    return (
      <div className="w-16 bg-[#1e1e2e] border-r border-[#313244] h-full">
        <div className="p-2">
          <div className="animate-pulse space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 bg-[#262637] rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-[#1e1e2e] border-r border-[#313244] h-full overflow-y-auto transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-80'
    }`}>
      {/* Header with collapse button */}
      <div className="p-2 border-b border-[#313244] flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="text-sm font-semibold text-[#e6edf3]">Projects</h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-[#2a2a3a] rounded transition-colors ml-auto"
          title={isCollapsed ? "Expand Projects" : "Collapse Projects"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </div>

      {/* Expanded View */}
      {!isCollapsed && (
        <div className="p-4">
          {/* Create Project Button */}
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full p-3 mb-4 bg-[#7c3aed] hover:bg-[#6d28d9] rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">New Project</span>
          </button>

          {/* Create Form */}
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#262637] p-4 rounded-lg border border-[#414155] mb-4"
            >
              <h3 className="text-sm font-semibold text-[#e6edf3] mb-3">Create New Project</h3>
              
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Project name"
                  value={newProject.name}
                  onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#1e1e2e] border border-[#414155] rounded text-white text-sm"
                />
                
                <select
                  value={newProject.language}
                  onChange={(e) => setNewProject(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#1e1e2e] border border-[#414155] rounded text-white text-sm"
                >
                  {languages.map(lang => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                  ))}
                </select>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateProject}
                    disabled={!newProject.name.trim()}
                    className="flex-1 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-white text-sm font-medium"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 py-2 bg-[#414155] hover:bg-[#4a4a5a] rounded text-white text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Projects List */}
          <div className="space-y-2">
            {projects.map(project => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 bg-[#262637] rounded-lg border transition-all cursor-pointer group ${
                  selectedProjectId === project._id
                    ? 'border-[#7c3aed]/50 bg-[#7c3aed]/10'
                    : 'border-[#414155] hover:border-[#515165]'
                }`}
                onClick={() => onProjectSelect(project._id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Image
                      src={getLanguageLogo(project.language)}
                      alt={`${project.language} logo`}
                      width={16}
                      height={16}
                      className="rounded"
                    />
                    <span className="font-medium text-[#e6edf3] text-sm truncate">
                      {project.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {project.isPublic ? (
                      <Globe className="w-3 h-3 text-green-400" />
                    ) : (
                      <Lock className="w-3 h-3 text-gray-400" />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(project._id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
                    >
                      <Trash2 className="w-3 h-3 text-red-400" />
                    </button>
                  </div>
                </div>
                
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(project._creationTime).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Collapsed View */}
      {isCollapsed && (
        <div className="p-2 space-y-2">
          {/* Add Project Button */}
          <button
            onClick={() => setIsCollapsed(false)}
            className="w-full p-2 bg-[#7c3aed] hover:bg-[#6d28d9] rounded transition-colors"
            title="Create New Project"
          >
            <Plus className="w-4 h-4 text-white mx-auto" />
          </button>
          
          {/* Project Icons */}
          {projects.slice(0, 8).map(project => (
            <button
              key={project._id}
              onClick={() => onProjectSelect(project._id)}
              className={`w-full p-2 rounded hover:bg-[#2a2a3a] transition-colors group relative ${
                selectedProjectId === project._id ? 'bg-[#7c3aed]/20' : ''
              }`}
              title={project.name}
            >
              <Image
                src={getLanguageLogo(project.language)}
                alt={`${project.language} logo`}
                width={20}
                height={20}
                className="rounded mx-auto"
              />
              {selectedProjectId === project._id && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-[#7c3aed] rounded-r"></div>
              )}
            </button>
          ))}
          
          {projects.length > 8 && (
            <div className="text-xs text-gray-500 text-center py-1">
              +{projects.length - 8}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
