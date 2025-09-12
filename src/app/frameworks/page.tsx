"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Code, 
  FolderOpen,
  Clock,
  Play,
  Square,
  Eye,
  Trash2,
  Settings,
  ExternalLink
} from "lucide-react";
import { FRAMEWORK_CONFIG } from "@/app/(root)/_constants/frameworks";
import { FrameworkProject, FrameworkProjectManager } from "@/services/FrameworkProjectManager";
import CreateFrameworkProject from "@/app/(root)/_components/CreateFrameworkProject";
import FrameworkProjectDashboard from "@/app/(root)/_components/FrameworkProjectDashboard";

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | 'frontend' | 'backend' | 'fullstack' | 'running' | 'ready';

const projectManager = new FrameworkProjectManager();

export default function FrameworkProjectsPage() {
  const [projects, setProjects] = useState<FrameworkProject[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedProject, setSelectedProject] = useState<FrameworkProject | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from your backend
      const frameworks = Object.values(FRAMEWORK_CONFIG);
      const mockProjects: FrameworkProject[] = [
        {
          id: 'project-1',
          name: 'My React App',
          framework: frameworks.find((f: any) => f.id === 'react')!,
          template: { 
            id: 'react-default',
            name: 'default', 
            framework: 'react',
            description: 'Default React template',
            files: [] 
          },
          path: '/projects/project-1',
          status: 'ready',
          createdAt: new Date('2024-01-15'),
          lastModified: new Date('2024-01-20'),
          processes: []
        },
        {
          id: 'project-2',
          name: 'Express API',
          framework: frameworks.find((f: any) => f.id === 'express')!,
          template: { 
            id: 'express-default',
            name: 'default', 
            framework: 'express',
            description: 'Default Express template',
            files: [] 
          },
          path: '/projects/project-2',
          status: 'running',
          createdAt: new Date('2024-01-10'),
          lastModified: new Date('2024-01-22'),
          processes: [
            {
              id: 'proc-1',
              type: 'dev',
              status: 'running',
              startTime: new Date(),
              url: 'http://localhost:3000',
              logs: []
            }
          ]
        },
        {
          id: 'project-3',
          name: 'Next.js Blog',
          framework: frameworks.find((f: any) => f.id === 'nextjs')!,
          template: { 
            id: 'nextjs-default',
            name: 'default', 
            framework: 'nextjs',
            description: 'Default Next.js template',
            files: [] 
          },
          path: '/projects/project-3',
          status: 'building',
          createdAt: new Date('2024-01-18'),
          lastModified: new Date('2024-01-23'),
          processes: []
        }
      ];
      setProjects(mockProjects);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and search projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.framework.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'frontend' && project.framework.category === 'frontend') ||
      (filter === 'backend' && project.framework.category === 'backend') ||
      (filter === 'fullstack' && project.framework.category === 'fullstack') ||
      (filter === 'running' && project.status === 'running') ||
      (filter === 'ready' && project.status === 'ready');

    return matchesSearch && matchesFilter;
  });

  // Handle project actions
  const handleProjectAction = async (project: FrameworkProject, action: string, data?: any) => {
    try {
      switch (action) {
        case 'start-dev':
          await projectManager.startDevServer(project.id);
          break;
        case 'stop-dev':
          await projectManager.stopProcess(project.id, data);
          break;
        case 'build':
          await projectManager.buildProject(project.id);
          break;
        case 'preview':
          await projectManager.startPreviewServer(project.id);
          break;
        case 'stop-process':
          await projectManager.stopProcess(project.id, data);
          break;
        case 'delete':
          if (confirm('Are you sure you want to delete this project?')) {
            await projectManager.deleteProject(project.id);
            setProjects(prev => prev.filter(p => p.id !== project.id));
            if (selectedProject?.id === project.id) {
              setSelectedProject(null);
            }
          }
          break;
        case 'run-script':
          // Mock script execution
          console.log(`Running script: ${data}`);
          break;
        case 'clear-logs':
          // Clear logs logic
          break;
      }
      
      // Reload projects to get updated status
      await loadProjects();
    } catch (error) {
      console.error('Project action failed:', error);
    }
  };

  const handleCreateProject = async (projectId: string) => {
    try {
      // Reload projects to include the new one
      await loadProjects();
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Failed to handle project creation:', error);
    }
  };

  if (selectedProject) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          {/* Back Button */}
          <button
            onClick={() => setSelectedProject(null)}
            className="mb-6 flex items-center gap-2 text-secondary hover:text-primary transition-colors"
          >
            ← Back to Projects
          </button>

          <FrameworkProjectDashboard
            project={selectedProject}
            onAction={(action, data) => handleProjectAction(selectedProject, action, data)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-weight-bold text-primary mb-2">Framework Projects</h1>
            <p className="text-secondary">
              Create and manage your framework-based projects with live preview and deployment.
            </p>
          </div>

          <button
            onClick={() => setShowCreateDialog(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:border-purple-500 text-primary"
            />
          </div>

          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
            className="px-3 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:border-purple-500 text-primary"
          >
            <option value="all">All Projects</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="fullstack">Full-stack</option>
            <option value="running">Running</option>
            <option value="ready">Ready</option>
          </select>

          {/* View Mode */}
          <div className="flex items-center gap-1 bg-surface border border-border rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-secondary hover:text-primary'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-secondary hover:text-primary'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Projects Grid/List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-surface rounded-lg border border-border p-6 animate-pulse">
                <div className="w-full h-32 bg-surface-hover rounded-lg mb-4"></div>
                <div className="h-4 bg-surface-hover rounded mb-2"></div>
                <div className="h-3 bg-surface-hover rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <Code className="w-16 h-16 text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-weight-semibold text-primary mb-2">No Projects Found</h3>
            <p className="text-secondary mb-6">
              {projects.length === 0 
                ? "Create your first framework project to get started."
                : "No projects match your current filters."
              }
            </p>
            {projects.length === 0 && (
              <button
                onClick={() => setShowCreateDialog(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Create Your First Project
              </button>
            )}
          </div>
        ) : (
          <AnimatePresence>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onSelect={() => setSelectedProject(project)}
                    onAction={(action, data) => handleProjectAction(project, action, data)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProjects.map((project) => (
                  <ProjectListItem
                    key={project.id}
                    project={project}
                    onSelect={() => setSelectedProject(project)}
                    onAction={(action, data) => handleProjectAction(project, action, data)}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Create Project Dialog */}
      <AnimatePresence>
        {showCreateDialog && (
          <CreateFrameworkProject
            onClose={() => setShowCreateDialog(false)}
            onProjectCreated={handleCreateProject}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Project Card Component
function ProjectCard({ 
  project, 
  onSelect, 
  onAction 
}: { 
  project: FrameworkProject; 
  onSelect: () => void;
  onAction: (action: string, data?: any) => void;
}) {
  const isRunning = project.processes.some(p => p.status === 'running');
  const devServer = project.processes.find(p => p.type === 'dev' && p.status === 'running');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-surface rounded-lg border border-border overflow-hidden hover:border-purple-500 transition-all duration-200 group"
    >
      {/* Project Preview */}
      <div className="h-32 bg-gradient-to-br from-purple-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Code className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-weight-medium">{project.framework.name}</span>
        </div>
        
        {isRunning && (
          <div className="absolute top-4 right-4">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>

      {/* Project Info */}
      <div className="p-4">
        <h3 className="font-weight-semibold text-primary mb-1">{project.name}</h3>
        <p className="text-sm text-secondary mb-3">
          {project.framework.category} • Updated {project.lastModified.toLocaleDateString()}
        </p>

        {/* Status */}
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-2 h-2 rounded-full ${
            project.status === 'running' ? 'bg-green-500' :
            project.status === 'ready' ? 'bg-blue-500' :
            project.status === 'building' ? 'bg-yellow-500' :
            project.status === 'error' ? 'bg-red-500' :
            'bg-gray-500'
          }`}></div>
          <span className="text-xs text-secondary capitalize">{project.status}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onSelect}
            className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
          >
            Open
          </button>
          
          {devServer ? (
            <a
              href={devServer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-green-500 hover:text-green-600 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <button
              onClick={() => onAction('start-dev')}
              className="p-2 text-blue-500 hover:text-blue-600 transition-colors"
            >
              <Play className="w-4 h-4" />
            </button>
          )}
          
          <button
            onClick={() => onAction('delete')}
            className="p-2 text-red-500 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Project List Item Component
function ProjectListItem({ 
  project, 
  onSelect, 
  onAction 
}: { 
  project: FrameworkProject; 
  onSelect: () => void;
  onAction: (action: string, data?: any) => void;
}) {
  const isRunning = project.processes.some(p => p.status === 'running');
  const devServer = project.processes.find(p => p.type === 'dev' && p.status === 'running');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-surface rounded-lg border border-border p-4 hover:border-purple-500 transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <Code className="w-6 h-6 text-white" />
          </div>
          
          <div>
            <h3 className="font-weight-semibold text-primary">{project.name}</h3>
            <div className="flex items-center gap-2 text-sm text-secondary">
              <span>{project.framework.name}</span>
              <span>•</span>
              <span>{project.framework.category}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${
                  project.status === 'running' ? 'bg-green-500' :
                  project.status === 'ready' ? 'bg-blue-500' :
                  project.status === 'building' ? 'bg-yellow-500' :
                  project.status === 'error' ? 'bg-red-500' :
                  'bg-gray-500'
                }`}></div>
                <span className="capitalize">{project.status}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSelect}
            className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
          >
            Open
          </button>
          
          {devServer ? (
            <a
              href={devServer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-green-500 hover:text-green-600 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <button
              onClick={() => onAction('start-dev')}
              className="p-2 text-blue-500 hover:text-blue-600 transition-colors"
            >
              <Play className="w-4 h-4" />
            </button>
          )}
          
          <button
            onClick={() => onAction('delete')}
            className="p-2 text-red-500 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
