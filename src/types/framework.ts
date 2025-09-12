// Framework-related type definitions
export interface FrameworkConfig {
  id: string;
  name: string;
  description: string;
  language: string;
  category: FrameworkCategory;
  version: string;
  template: string;
  dependencies: string[];
  devDependencies?: string[];
  scripts: Record<string, string>;
  supportedExtensions: string[];
  logoPath: string;
  isPopular?: boolean;
  tags: string[];
}

export type FrameworkCategory = 
  | 'frontend' 
  | 'backend' 
  | 'fullstack' 
  | 'mobile' 
  | 'desktop' 
  | 'cli' 
  | 'api' 
  | 'static';

export interface ProjectTemplate {
  id: string;
  name: string;
  framework: string;
  description: string;
  files: TemplateFile[];
  packageJson?: Record<string, any>;
  config?: Record<string, any>;
  readme?: string;
}

export interface TemplateFile {
  path: string;
  content: string;
  isEntry?: boolean;
  type: FileType;
  language: string;
}

export type FileType = 
  | 'component' 
  | 'page' 
  | 'config' 
  | 'style' 
  | 'test' 
  | 'asset' 
  | 'api' 
  | 'middleware' 
  | 'utils' 
  | 'types';

export interface BuildConfig {
  buildCommand: string;
  devCommand: string;
  previewCommand?: string;
  testCommand?: string;
  lintCommand?: string;
  outputDir?: string;
  publicDir?: string;
}

export interface FrameworkExecution {
  type: 'dev' | 'build' | 'preview' | 'test';
  command: string;
  args?: string[];
  env?: Record<string, string>;
  port?: number;
  timeout?: number;
}

export interface DependencyManager {
  type: 'npm' | 'yarn' | 'pnpm' | 'pip' | 'poetry' | 'maven' | 'gradle';
  installCommand: string;
  uninstallCommand: string;
  updateCommand: string;
  listCommand: string;
}

export interface FrameworkFeatures {
  hasHotReload: boolean;
  hasLivePreview: boolean;
  hasTypeScript: boolean;
  hasRouting: boolean;
  hasStateManagement: boolean;
  hasSSR: boolean;
  hasSSG: boolean;
  hasAPI: boolean;
  hasDatabase: boolean;
  hasTesting: boolean;
}
