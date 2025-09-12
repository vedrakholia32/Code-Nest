import { FrameworkConfig, FrameworkExecution, BuildConfig } from "@/types/framework";
import { BaseDependencyManager } from "./DependencyManager";

export interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  processId?: string;
  port?: number;
  url?: string;
  duration: number;
  exitCode?: number;
}

export interface BuildResult extends ExecutionResult {
  buildPath?: string;
  assets?: BuildAsset[];
  size?: number;
  warnings?: string[];
}

export interface DevServerResult extends ExecutionResult {
  serverUrl: string;
  port: number;
  isRunning: boolean;
  hotReloadEnabled: boolean;
}

export interface BuildAsset {
  name: string;
  size: number;
  type: 'js' | 'css' | 'html' | 'image' | 'font' | 'other';
  path: string;
  gzipSize?: number;
}

export interface PreviewResult extends ExecutionResult {
  previewUrl: string;
  port: number;
  isStatic: boolean;
}

// Base Framework Executor
export abstract class BaseFrameworkExecutor {
  protected framework: FrameworkConfig;
  protected projectPath: string;
  protected dependencyManager: BaseDependencyManager;
  protected runningProcesses: Map<string, any> = new Map();

  constructor(
    framework: FrameworkConfig,
    projectPath: string,
    dependencyManager: BaseDependencyManager
  ) {
    this.framework = framework;
    this.projectPath = projectPath;
    this.dependencyManager = dependencyManager;
  }

  abstract build(options?: BuildOptions): Promise<BuildResult>;
  abstract dev(options?: DevOptions): Promise<DevServerResult>;
  abstract preview(options?: PreviewOptions): Promise<PreviewResult>;
  abstract stop(processId: string): Promise<boolean>;
  abstract getStatus(processId: string): Promise<ProcessStatus>;

  // Common methods
  protected async executeScript(
    scriptName: string,
    args: string[] = [],
    options: ExecutionOptions = {}
  ): Promise<ExecutionResult> {
    const startTime = Date.now();
    
    try {
      const script = this.framework.scripts[scriptName];
      if (!script) {
        throw new Error(`Script '${scriptName}' not found in framework configuration`);
      }

      const command = `${script} ${args.join(' ')}`;
      const result = await this.executeCommand(command, options);

      return {
        success: result.exitCode === 0,
        output: result.stdout,
        error: result.exitCode !== 0 ? result.stderr : undefined,
        processId: result.processId,
        duration: Date.now() - startTime,
        exitCode: result.exitCode
      };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime
      };
    }
  }

  protected async executeCommand(
    command: string,
    options: ExecutionOptions = {}
  ): Promise<CommandResult> {
    console.log(`Executing: ${command} in ${this.projectPath}`);
    
    // In a real implementation, this would:
    // 1. Execute the command in a sandboxed environment
    // 2. Stream output in real-time
    // 3. Handle process management
    // 4. Return proper process IDs
    
    // For now, simulate execution
    const processId = `proc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    if (options.background) {
      // Simulate background process
      this.runningProcesses.set(processId, {
        command,
        startTime: Date.now(),
        status: 'running'
      });
    }

    return {
      stdout: `Simulated output for: ${command}`,
      stderr: '',
      exitCode: 0,
      processId: options.background ? processId : undefined
    };
  }

  protected getAvailablePort(): Promise<number> {
    // In a real implementation, this would find an available port
    return Promise.resolve(3000 + Math.floor(Math.random() * 1000));
  }

  protected async waitForServer(url: string, timeout: number = 30000): Promise<boolean> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok) {
          return true;
        }
      } catch (error) {
        // Server not ready yet
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return false;
  }
}

// React/Vite Framework Executor
export class ReactViteExecutor extends BaseFrameworkExecutor {
  async build(options: BuildOptions = {}): Promise<BuildResult> {
    const startTime = Date.now();
    
    try {
      // Install dependencies first if needed
      if (options.installDeps) {
        await this.dependencyManager.install([]);
      }

      const result = await this.executeScript('build', [], {
        cwd: this.projectPath,
        env: { NODE_ENV: 'production', ...options.env }
      });

      if (!result.success) {
        return {
          ...result,
          duration: Date.now() - startTime
        };
      }

      // Parse build output for assets (simulated)
      const assets: BuildAsset[] = [
        { name: 'index.html', size: 1024, type: 'html', path: 'dist/index.html' },
        { name: 'main.js', size: 50000, type: 'js', path: 'dist/assets/main.js' },
        { name: 'main.css', size: 10000, type: 'css', path: 'dist/assets/main.css' }
      ];

      return {
        ...result,
        buildPath: 'dist',
        assets,
        size: assets.reduce((total, asset) => total + asset.size, 0),
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Build failed',
        duration: Date.now() - startTime
      };
    }
  }

  async dev(options: DevOptions = {}): Promise<DevServerResult> {
    try {
      const port = options.port || await this.getAvailablePort();
      const host = options.host || 'localhost';

      const result = await this.executeScript('dev', [`--port=${port}`, `--host=${host}`], {
        background: true,
        cwd: this.projectPath,
        env: { NODE_ENV: 'development', ...options.env }
      });

      if (!result.success || !result.processId) {
        throw new Error('Failed to start development server');
      }

      const serverUrl = `http://${host}:${port}`;

      // Wait for server to be ready
      const isReady = await this.waitForServer(serverUrl);
      if (!isReady) {
        throw new Error('Development server failed to start');
      }

      return {
        ...result,
        serverUrl,
        port,
        isRunning: true,
        hotReloadEnabled: true
      };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Failed to start dev server',
        serverUrl: '',
        port: 0,
        isRunning: false,
        hotReloadEnabled: false,
        duration: 0
      };
    }
  }

  async preview(options: PreviewOptions = {}): Promise<PreviewResult> {
    try {
      // First build the project
      const buildResult = await this.build();
      if (!buildResult.success) {
        throw new Error('Build failed, cannot preview');
      }

      const port = options.port || await this.getAvailablePort();
      const host = options.host || 'localhost';

      const result = await this.executeScript('preview', [`--port=${port}`, `--host=${host}`], {
        background: true,
        cwd: this.projectPath
      });

      if (!result.success || !result.processId) {
        throw new Error('Failed to start preview server');
      }

      const previewUrl = `http://${host}:${port}`;

      return {
        ...result,
        previewUrl,
        port,
        isStatic: true
      };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Failed to start preview',
        previewUrl: '',
        port: 0,
        isStatic: false,
        duration: 0
      };
    }
  }

  async stop(processId: string): Promise<boolean> {
    const process = this.runningProcesses.get(processId);
    if (!process) {
      return false;
    }

    try {
      // In a real implementation, this would kill the actual process
      console.log(`Stopping process ${processId}`);
      this.runningProcesses.delete(processId);
      return true;
    } catch (error) {
      console.error('Error stopping process:', error);
      return false;
    }
  }

  async getStatus(processId: string): Promise<ProcessStatus> {
    const process = this.runningProcesses.get(processId);
    if (!process) {
      return { status: 'not-found', processId };
    }

    return {
      status: process.status,
      processId,
      startTime: process.startTime,
      uptime: Date.now() - process.startTime,
      command: process.command
    };
  }
}

// Next.js Framework Executor
export class NextJSExecutor extends BaseFrameworkExecutor {
  async build(options: BuildOptions = {}): Promise<BuildResult> {
    const startTime = Date.now();
    
    try {
      const result = await this.executeScript('build', [], {
        cwd: this.projectPath,
        env: { NODE_ENV: 'production', ...options.env }
      });

      const assets: BuildAsset[] = [
        { name: '_app.js', size: 75000, type: 'js', path: '.next/static/chunks/_app.js' },
        { name: 'index.js', size: 25000, type: 'js', path: '.next/static/chunks/pages/index.js' },
        { name: 'globals.css', size: 5000, type: 'css', path: '.next/static/css/globals.css' }
      ];

      return {
        ...result,
        buildPath: '.next',
        assets,
        size: assets.reduce((total, asset) => total + asset.size, 0),
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Build failed',
        duration: Date.now() - startTime
      };
    }
  }

  async dev(options: DevOptions = {}): Promise<DevServerResult> {
    try {
      const port = options.port || 3000;
      const host = options.host || 'localhost';

      const result = await this.executeScript('dev', [`--port=${port}`, `--hostname=${host}`], {
        background: true,
        cwd: this.projectPath,
        env: { NODE_ENV: 'development', ...options.env }
      });

      const serverUrl = `http://${host}:${port}`;

      return {
        ...result,
        serverUrl,
        port,
        isRunning: true,
        hotReloadEnabled: true
      };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Failed to start dev server',
        serverUrl: '',
        port: 0,
        isRunning: false,
        hotReloadEnabled: false,
        duration: 0
      };
    }
  }

  async preview(options: PreviewOptions = {}): Promise<PreviewResult> {
    try {
      const port = options.port || await this.getAvailablePort();
      
      const result = await this.executeScript('start', [`--port=${port}`], {
        background: true,
        cwd: this.projectPath
      });

      const previewUrl = `http://localhost:${port}`;

      return {
        ...result,
        previewUrl,
        port,
        isStatic: false
      };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Failed to start preview',
        previewUrl: '',
        port: 0,
        isStatic: false,
        duration: 0
      };
    }
  }

  async stop(processId: string): Promise<boolean> {
    return this.runningProcesses.delete(processId);
  }

  async getStatus(processId: string): Promise<ProcessStatus> {
    const process = this.runningProcesses.get(processId);
    return process ? {
      status: process.status,
      processId,
      startTime: process.startTime,
      uptime: Date.now() - process.startTime,
      command: process.command
    } : { status: 'not-found', processId };
  }
}

// Express.js Framework Executor
export class ExpressExecutor extends BaseFrameworkExecutor {
  async build(options: BuildOptions = {}): Promise<BuildResult> {
    const startTime = Date.now();
    
    try {
      // For Express, build typically means TypeScript compilation
      const result = await this.executeScript('build', [], {
        cwd: this.projectPath,
        env: { NODE_ENV: 'production', ...options.env }
      });

      return {
        ...result,
        buildPath: 'dist',
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Build failed',
        duration: Date.now() - startTime
      };
    }
  }

  async dev(options: DevOptions = {}): Promise<DevServerResult> {
    try {
      const port = options.port || 3000;

      const result = await this.executeScript('dev', [], {
        background: true,
        cwd: this.projectPath,
        env: { 
          NODE_ENV: 'development', 
          PORT: port.toString(),
          ...options.env 
        }
      });

      const serverUrl = `http://localhost:${port}`;

      return {
        ...result,
        serverUrl,
        port,
        isRunning: true,
        hotReloadEnabled: true // Via nodemon
      };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Failed to start dev server',
        serverUrl: '',
        port: 0,
        isRunning: false,
        hotReloadEnabled: false,
        duration: 0
      };
    }
  }

  async preview(options: PreviewOptions = {}): Promise<PreviewResult> {
    try {
      const port = options.port || await this.getAvailablePort();
      
      const result = await this.executeScript('start', [], {
        background: true,
        cwd: this.projectPath,
        env: { 
          NODE_ENV: 'production', 
          PORT: port.toString()
        }
      });

      const previewUrl = `http://localhost:${port}`;

      return {
        ...result,
        previewUrl,
        port,
        isStatic: false
      };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Failed to start preview',
        previewUrl: '',
        port: 0,
        isStatic: false,
        duration: 0
      };
    }
  }

  async stop(processId: string): Promise<boolean> {
    return this.runningProcesses.delete(processId);
  }

  async getStatus(processId: string): Promise<ProcessStatus> {
    const process = this.runningProcesses.get(processId);
    return process ? {
      status: process.status,
      processId,
      startTime: process.startTime,
      uptime: Date.now() - process.startTime,
      command: process.command
    } : { status: 'not-found', processId };
  }
}

// Supporting types and interfaces
export interface BuildOptions {
  installDeps?: boolean;
  env?: Record<string, string>;
  outputDir?: string;
  minify?: boolean;
  sourcemap?: boolean;
}

export interface DevOptions {
  port?: number;
  host?: string;
  open?: boolean;
  env?: Record<string, string>;
}

export interface PreviewOptions {
  port?: number;
  host?: string;
  build?: boolean;
}

export interface ExecutionOptions {
  background?: boolean;
  cwd?: string;
  env?: Record<string, string>;
  timeout?: number;
}

export interface CommandResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  processId?: string;
}

export interface ProcessStatus {
  status: 'running' | 'stopped' | 'error' | 'not-found';
  processId: string;
  startTime?: number;
  uptime?: number;
  command?: string;
  error?: string;
}

// Factory function to create appropriate executor
export function createFrameworkExecutor(
  framework: FrameworkConfig,
  projectPath: string,
  dependencyManager: BaseDependencyManager
): BaseFrameworkExecutor {
  switch (framework.id) {
    case 'react-vite':
    case 'vue-vite':
      return new ReactViteExecutor(framework, projectPath, dependencyManager);
    case 'nextjs':
      return new NextJSExecutor(framework, projectPath, dependencyManager);
    case 'express':
      return new ExpressExecutor(framework, projectPath, dependencyManager);
    default:
      // Default to React executor for unknown frameworks
      return new ReactViteExecutor(framework, projectPath, dependencyManager);
  }
}
