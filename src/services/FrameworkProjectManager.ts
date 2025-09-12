import { FrameworkConfig, ProjectTemplate } from "@/types/framework";
import { FrameworkTemplateGenerator } from "./FrameworkTemplateGenerator";
import { createDependencyManager, BaseDependencyManager, InstallResult } from "./DependencyManager";
import { createFrameworkExecutor, BaseFrameworkExecutor, BuildResult, DevServerResult, PreviewResult } from "./FrameworkExecutor";

export interface FrameworkProject {
  id: string;
  name: string;
  framework: FrameworkConfig;
  template: ProjectTemplate;
  path: string;
  createdAt: Date;
  lastModified: Date;
  status: ProjectStatus;
  processes: ProcessInfo[];
}

export interface ProcessInfo {
  id: string;
  type: 'dev' | 'build' | 'preview';
  status: 'running' | 'stopped' | 'error';
  port?: number;
  url?: string;
  startTime: Date;
  logs: LogEntry[];
}

export interface LogEntry {
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  source: string;
}

export type ProjectStatus = 'created' | 'installing' | 'ready' | 'building' | 'running' | 'error';

export class FrameworkProjectManager {
  private projects: Map<string, FrameworkProject> = new Map();
  private dependencyManagers: Map<string, BaseDependencyManager> = new Map();
  private executors: Map<string, BaseFrameworkExecutor> = new Map();

  /**
   * Create a new framework project
   */
  async createProject(
    name: string,
    framework: FrameworkConfig,
    options: CreateProjectOptions = {}
  ): Promise<FrameworkProject> {
    const projectId = `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const projectPath = `/projects/${projectId}`;

    // Generate project template
    const template = FrameworkTemplateGenerator.generateProject(
      framework.id,
      name,
      options.customOptions
    );

    if (!template) {
      throw new Error(`Failed to generate template for framework: ${framework.id}`);
    }

    // Create project structure
    const project: FrameworkProject = {
      id: projectId,
      name,
      framework,
      template,
      path: projectPath,
      createdAt: new Date(),
      lastModified: new Date(),
      status: 'created',
      processes: []
    };

    // Initialize dependency manager
    const packageManagerType = this.getPackageManagerForFramework(framework);
    const dependencyManager = createDependencyManager(packageManagerType, projectPath);
    this.dependencyManagers.set(projectId, dependencyManager);

    // Initialize executor
    const executor = createFrameworkExecutor(framework, projectPath, dependencyManager);
    this.executors.set(projectId, executor);

    // Store project
    this.projects.set(projectId, project);

    // Install dependencies if requested
    if (options.installDependencies !== false) {
      await this.installDependencies(projectId);
    }

    this.addLog(projectId, 'info', `Project ${name} created successfully`, 'system');
    
    return project;
  }

  /**
   * Install project dependencies
   */
  async installDependencies(projectId: string): Promise<InstallResult> {
    const project = this.getProject(projectId);
    const dependencyManager = this.dependencyManagers.get(projectId);

    if (!project || !dependencyManager) {
      throw new Error('Project or dependency manager not found');
    }

    this.updateProjectStatus(projectId, 'installing');
    this.addLog(projectId, 'info', 'Installing dependencies...', 'npm');

    try {
      // Install main dependencies
      const mainDeps = project.framework.dependencies;
      let result: InstallResult;

      if (mainDeps.length > 0) {
        result = await dependencyManager.install(mainDeps, { save: true });
        
        if (!result.success) {
          throw new Error(`Failed to install dependencies: ${result.error}`);
        }
        
        this.addLog(projectId, 'info', `Installed dependencies: ${mainDeps.join(', ')}`, 'npm');
      }

      // Install dev dependencies
      const devDeps = project.framework.devDependencies || [];
      if (devDeps.length > 0) {
        result = await dependencyManager.install(devDeps, { isDev: true, save: true });
        
        if (!result.success) {
          this.addLog(projectId, 'warn', `Failed to install dev dependencies: ${result.error}`, 'npm');
        } else {
          this.addLog(projectId, 'info', `Installed dev dependencies: ${devDeps.join(', ')}`, 'npm');
        }
      }

      this.updateProjectStatus(projectId, 'ready');
      this.addLog(projectId, 'info', 'Dependencies installed successfully', 'npm');

      return result!;
    } catch (error) {
      this.updateProjectStatus(projectId, 'error');
      this.addLog(projectId, 'error', `Dependency installation failed: ${error}`, 'npm');
      throw error;
    }
  }

  /**
   * Start development server
   */
  async startDevServer(
    projectId: string,
    options: DevServerOptions = {}
  ): Promise<DevServerResult> {
    const project = this.getProject(projectId);
    const executor = this.executors.get(projectId);

    if (!project || !executor) {
      throw new Error('Project or executor not found');
    }

    this.addLog(projectId, 'info', 'Starting development server...', 'dev');

    try {
      const result = await executor.dev({
        port: options.port,
        host: options.host,
        open: options.open,
        env: options.env
      });

      if (result.success && result.processId) {
        // Add process info
        const processInfo: ProcessInfo = {
          id: result.processId,
          type: 'dev',
          status: 'running',
          port: result.port,
          url: result.serverUrl,
          startTime: new Date(),
          logs: []
        };

        project.processes.push(processInfo);
        this.updateProjectStatus(projectId, 'running');
        this.addLog(projectId, 'info', `Development server started on ${result.serverUrl}`, 'dev');
      } else {
        this.addLog(projectId, 'error', `Failed to start dev server: ${result.error}`, 'dev');
      }

      return result;
    } catch (error) {
      this.addLog(projectId, 'error', `Dev server error: ${error}`, 'dev');
      throw error;
    }
  }

  /**
   * Build project
   */
  async buildProject(
    projectId: string,
    options: BuildProjectOptions = {}
  ): Promise<BuildResult> {
    const project = this.getProject(projectId);
    const executor = this.executors.get(projectId);

    if (!project || !executor) {
      throw new Error('Project or executor not found');
    }

    this.updateProjectStatus(projectId, 'building');
    this.addLog(projectId, 'info', 'Building project...', 'build');

    try {
      const result = await executor.build({
        installDeps: options.installDeps,
        env: options.env,
        outputDir: options.outputDir,
        minify: options.minify,
        sourcemap: options.sourcemap
      });

      if (result.success) {
        this.updateProjectStatus(projectId, 'ready');
        this.addLog(projectId, 'info', `Build completed in ${result.duration}ms`, 'build');
        
        if (result.assets) {
          const totalSize = result.assets.reduce((sum, asset) => sum + asset.size, 0);
          this.addLog(projectId, 'info', `Generated ${result.assets.length} assets (${this.formatSize(totalSize)})`, 'build');
        }
      } else {
        this.updateProjectStatus(projectId, 'error');
        this.addLog(projectId, 'error', `Build failed: ${result.error}`, 'build');
      }

      return result;
    } catch (error) {
      this.updateProjectStatus(projectId, 'error');
      this.addLog(projectId, 'error', `Build error: ${error}`, 'build');
      throw error;
    }
  }

  /**
   * Start preview server
   */
  async startPreviewServer(
    projectId: string,
    options: PreviewServerOptions = {}
  ): Promise<PreviewResult> {
    const project = this.getProject(projectId);
    const executor = this.executors.get(projectId);

    if (!project || !executor) {
      throw new Error('Project or executor not found');
    }

    this.addLog(projectId, 'info', 'Starting preview server...', 'preview');

    try {
      const result = await executor.preview({
        port: options.port,
        host: options.host,
        build: options.build
      });

      if (result.success && result.processId) {
        const processInfo: ProcessInfo = {
          id: result.processId,
          type: 'preview',
          status: 'running',
          port: result.port,
          url: result.previewUrl,
          startTime: new Date(),
          logs: []
        };

        project.processes.push(processInfo);
        this.addLog(projectId, 'info', `Preview server started on ${result.previewUrl}`, 'preview');
      } else {
        this.addLog(projectId, 'error', `Failed to start preview server: ${result.error}`, 'preview');
      }

      return result;
    } catch (error) {
      this.addLog(projectId, 'error', `Preview server error: ${error}`, 'preview');
      throw error;
    }
  }

  /**
   * Stop a running process
   */
  async stopProcess(projectId: string, processId: string): Promise<boolean> {
    const project = this.getProject(projectId);
    const executor = this.executors.get(projectId);

    if (!project || !executor) {
      return false;
    }

    try {
      const success = await executor.stop(processId);
      
      if (success) {
        // Update process status
        const process = project.processes.find(p => p.id === processId);
        if (process) {
          process.status = 'stopped';
        }

        // Update project status if no running processes
        const hasRunningProcesses = project.processes.some(p => p.status === 'running');
        if (!hasRunningProcesses) {
          this.updateProjectStatus(projectId, 'ready');
        }

        this.addLog(projectId, 'info', `Process ${processId} stopped`, 'system');
      }

      return success;
    } catch (error) {
      this.addLog(projectId, 'error', `Failed to stop process ${processId}: ${error}`, 'system');
      return false;
    }
  }

  /**
   * Get project by ID
   */
  getProject(projectId: string): FrameworkProject {
    const project = this.projects.get(projectId);
    if (!project) {
      throw new Error(`Project ${projectId} not found`);
    }
    return project;
  }

  /**
   * Get all projects
   */
  getAllProjects(): FrameworkProject[] {
    return Array.from(this.projects.values());
  }

  /**
   * Delete project
   */
  async deleteProject(projectId: string): Promise<boolean> {
    const project = this.projects.get(projectId);
    if (!project) {
      return false;
    }

    try {
      // Stop all running processes
      for (const process of project.processes) {
        if (process.status === 'running') {
          await this.stopProcess(projectId, process.id);
        }
      }

      // Clean up managers
      this.dependencyManagers.delete(projectId);
      this.executors.delete(projectId);
      
      // Remove project
      this.projects.delete(projectId);

      return true;
    } catch (error) {
      console.error(`Error deleting project ${projectId}:`, error);
      return false;
    }
  }

  /**
   * Get project logs
   */
  getProjectLogs(projectId: string, limit?: number): LogEntry[] {
    const project = this.getProject(projectId);
    const allLogs: LogEntry[] = [];

    // Collect logs from all processes
    project.processes.forEach(process => {
      allLogs.push(...process.logs);
    });

    // Sort by timestamp (newest first)
    allLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return limit ? allLogs.slice(0, limit) : allLogs;
  }

  // Private helper methods
  private updateProjectStatus(projectId: string, status: ProjectStatus): void {
    const project = this.projects.get(projectId);
    if (project) {
      project.status = status;
      project.lastModified = new Date();
    }
  }

  private addLog(
    projectId: string, 
    level: LogEntry['level'], 
    message: string, 
    source: string
  ): void {
    const project = this.projects.get(projectId);
    if (!project) return;

    const logEntry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      source
    };

    // Add to the most recent process or create a system log
    const lastProcess = project.processes[project.processes.length - 1];
    if (lastProcess && lastProcess.status === 'running') {
      lastProcess.logs.push(logEntry);
    }

    // Keep only last 100 logs per process
    if (lastProcess && lastProcess.logs.length > 100) {
      lastProcess.logs = lastProcess.logs.slice(-100);
    }
  }

  private getPackageManagerForFramework(framework: FrameworkConfig): string {
    // Determine package manager based on framework language
    switch (framework.language) {
      case 'python':
        return 'pip';
      case 'javascript':
      case 'typescript':
      default:
        return 'npm';
    }
  }

  private formatSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Supporting interfaces
export interface CreateProjectOptions {
  installDependencies?: boolean;
  customOptions?: Record<string, any>;
}

export interface DevServerOptions {
  port?: number;
  host?: string;
  open?: boolean;
  env?: Record<string, string>;
}

export interface BuildProjectOptions {
  installDeps?: boolean;
  env?: Record<string, string>;
  outputDir?: string;
  minify?: boolean;
  sourcemap?: boolean;
}

export interface PreviewServerOptions {
  port?: number;
  host?: string;
  build?: boolean;
}

// Singleton instance
export const frameworkProjectManager = new FrameworkProjectManager();
