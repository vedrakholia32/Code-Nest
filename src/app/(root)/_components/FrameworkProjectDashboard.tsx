"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Square, 
  Hammer, 
  Eye, 
  Terminal, 
  Package, 
  Settings, 
  Trash2,
  ExternalLink,
  Clock,
  AlertCircle,
  CheckCircle,
  Loader2,
  FolderOpen,
  Code,
  Zap
} from "lucide-react";
import { FrameworkProject, ProcessInfo, LogEntry, ProjectStatus } from "@/services/FrameworkProjectManager";
import LivePreview from "./LivePreview";
import FrameworkFileEditor from "./FrameworkFileEditor";

interface FrameworkProjectDashboardProps {
  project: FrameworkProject;
  onAction: (action: string, data?: any) => Promise<void>;
  className?: string;
}

const STATUS_COLORS: Record<ProjectStatus, string> = {
  created: "text-blue-500",
  installing: "text-yellow-500",
  ready: "text-green-500",
  building: "text-orange-500",
  running: "text-purple-500",
  error: "text-red-500"
};

const STATUS_ICONS: Record<ProjectStatus, any> = {
  created: FolderOpen,
  installing: Package,
  ready: CheckCircle,
  building: Hammer,
  running: Play,
  error: AlertCircle
};

export default function FrameworkProjectDashboard({ 
  project, 
  onAction, 
  className = "" 
}: FrameworkProjectDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'files' | 'preview' | 'logs' | 'settings'>('overview');
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Get running processes
  const runningProcesses = project.processes.filter(p => p.status === 'running');
  const devServer = runningProcesses.find(p => p.type === 'dev');
  const previewServer = runningProcesses.find(p => p.type === 'preview');

  // Handle actions with loading state
  const handleAction = async (action: string, data?: any) => {
    setIsActionLoading(action);
    try {
      await onAction(action, data);
    } finally {
      setIsActionLoading(null);
    }
  };

  // Get status icon and color
  const StatusIcon = STATUS_ICONS[project.status];
  const statusColor = STATUS_COLORS[project.status];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Code },
    { id: 'files', label: 'Files', icon: FolderOpen },
    { id: 'preview', label: 'Preview', icon: Eye, disabled: !devServer && !previewServer },
    { id: 'logs', label: 'Logs', icon: Terminal },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className={`bg-surface rounded-lg border border-border overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <Code className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-weight-bold text-primary">{project.name}</h2>
              <div className="flex items-center gap-2 text-sm">
                <StatusIcon className={`w-4 h-4 ${statusColor}`} />
                <span className={statusColor}>{project.status}</span>
                <span className="text-secondary">•</span>
                <span className="text-secondary">{project.framework.name}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Actions */}
            <button
              onClick={() => handleAction('start-dev')}
              disabled={!!devServer || isActionLoading === 'start-dev'}
              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {isActionLoading === 'start-dev' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {devServer ? 'Running' : 'Start Dev'}
            </button>

            <button
              onClick={() => handleAction('build')}
              disabled={isActionLoading === 'build'}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {isActionLoading === 'build' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Hammer className="w-4 h-4" />
              )}
              Build
            </button>

            <button
              onClick={() => handleAction('delete')}
              disabled={!!isActionLoading}
              className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Running Processes */}
        {runningProcesses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {runningProcesses.map((process) => (
              <div key={process.id} className="bg-surface-hover rounded-lg p-3 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-weight-medium text-primary capitalize">{process.type} Server</span>
                  </div>
                  <button
                    onClick={() => handleAction('stop-process', process.id)}
                    disabled={isActionLoading === `stop-${process.id}`}
                    className="p-1 text-red-500 hover:text-red-600 transition-colors"
                  >
                    <Square className="w-3 h-3" />
                  </button>
                </div>
                
                {process.url && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-secondary">URL:</span>
                    <a
                      href={process.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-500 hover:text-purple-600 flex items-center gap-1"
                    >
                      {process.url}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-xs text-secondary mt-1">
                  <Clock className="w-3 h-3" />
                  <span>Started {process.startTime.toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && setActiveTab(tab.id as any)}
                disabled={tab.disabled}
                className={`px-4 py-3 border-b-2 transition-colors flex items-center gap-2 ${
                  isActive
                    ? 'border-purple-500 text-purple-600'
                    : tab.disabled
                    ? 'border-transparent text-gray-400 cursor-not-allowed'
                    : 'border-transparent text-secondary hover:text-primary'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Project Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-weight-semibold text-primary">Project Details</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-secondary">Framework:</span>
                      <span className="text-primary font-weight-medium">{project.framework.name}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-secondary">Language:</span>
                      <span className="text-primary">{project.framework.language}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-secondary">Category:</span>
                      <span className="text-primary">{project.framework.category}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-secondary">Created:</span>
                      <span className="text-primary">{project.createdAt.toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-secondary">Last Modified:</span>
                      <span className="text-primary">{project.lastModified.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-weight-semibold text-primary">Available Scripts</h3>
                  
                  <div className="space-y-2">
                    {Object.entries(project.framework.scripts).map(([name, command]) => (
                      <div key={name} className="flex items-center justify-between p-3 bg-surface-hover rounded-lg border border-border">
                        <div>
                          <span className="font-weight-medium text-primary">{name}</span>
                          <p className="text-xs text-secondary">{command}</p>
                        </div>
                        <button
                          onClick={() => handleAction('run-script', name)}
                          disabled={!!isActionLoading}
                          className="p-2 text-purple-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950 rounded transition-colors"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dependencies */}
              <div>
                <h3 className="text-lg font-weight-semibold text-primary mb-4">Dependencies</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-weight-medium text-primary mb-3">Production</h4>
                    <div className="space-y-1">
                      {project.framework.dependencies.map((dep) => (
                        <div key={dep} className="text-sm text-secondary">{dep}</div>
                      ))}
                    </div>
                  </div>
                  
                  {project.framework.devDependencies && (
                    <div>
                      <h4 className="font-weight-medium text-primary mb-3">Development</h4>
                      <div className="space-y-1">
                        {project.framework.devDependencies.map((dep) => (
                          <div key={dep} className="text-sm text-secondary">{dep}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'files' && (
            <motion.div
              key="files"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-[600px]"
            >
              <FrameworkFileEditor
                project={project}
                onSave={async (files) => {
                  console.log('Saving files:', files);
                  // In a real app, this would save to the backend
                }}
                className="h-full"
              />
            </motion.div>
          )}

          {activeTab === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-[600px]"
            >
              <LivePreview
                url={devServer?.url || previewServer?.url || ''}
                isLoading={isActionLoading === 'start-dev'}
                className="h-full"
              />
            </motion.div>
          )}

          {activeTab === 'logs' && (
            <motion.div
              key="logs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-weight-semibold text-primary">Project Logs</h3>
                <button
                  onClick={() => handleAction('clear-logs')}
                  className="px-3 py-1 text-sm text-secondary hover:text-primary transition-colors"
                >
                  Clear Logs
                </button>
              </div>

              <div className="bg-black rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm">
                {logs.length === 0 ? (
                  <div className="text-gray-400 text-center py-8">
                    No logs yet. Start a process to see logs here.
                  </div>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className={`mb-1 ${
                      log.level === 'error' ? 'text-red-400' :
                      log.level === 'warn' ? 'text-yellow-400' :
                      log.level === 'info' ? 'text-green-400' :
                      'text-gray-300'
                    }`}>
                      <span className="text-gray-500">
                        [{log.timestamp.toLocaleTimeString()}]
                      </span>
                      <span className="text-blue-400 ml-2">[{log.source}]</span>
                      <span className="ml-2">{log.message}</span>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-weight-semibold text-primary">Project Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-weight-medium text-primary mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={project.name}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:border-purple-500 text-primary"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-weight-medium text-primary mb-2">
                    Framework
                  </label>
                  <input
                    type="text"
                    value={project.framework.name}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:border-purple-500 text-primary"
                    readOnly
                  />
                </div>

                <div className="pt-4 border-t border-border">
                  <h4 className="font-weight-medium text-primary mb-3">Danger Zone</h4>
                  
                  <button
                    onClick={() => handleAction('delete')}
                    disabled={!!isActionLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Delete Project
                  </button>
                  
                  <p className="text-xs text-secondary mt-2">
                    This action cannot be undone. This will permanently delete the project and all its data.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
