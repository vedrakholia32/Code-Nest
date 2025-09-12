import { editor } from "monaco-editor";
import { Id } from "../../convex/_generated/dataModel";

// Framework types
export * from "./framework";

export interface Theme {
  id: string;
  label: string;
  color: string;
}

export interface Language {
  id: string;
  label: string;
  logoPath: string;
  monacoLanguage: string;
  defaultCode: string;
  pistonRuntime: LanguageRuntime;
}

export interface LanguageRuntime {
  language: string;
  version: string;
}

export interface ExecuteCodeResponse {
  compile?: {
    output: string;
  };
  run?: {
    output: string;
    stderr: string;
  };
}

export interface ExecutionResult {
  code: string;
  output: string;
  error: string | null;
}

// Multi-file project types
export interface ProjectFile {
  _id: Id<"files">;
  projectId: Id<"projects">;
  name: string;
  content: string;
  language: string;
  path: string;
  isEntry: boolean;
  _creationTime: number;
}

export interface Project {
  _id: Id<"projects">;
  name: string;
  description?: string;
  userId: string;
  userName: string;
  isPublic: boolean;
  language: string;
  _creationTime: number;
}

export interface FileTreeItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileTreeItem[];
  path: string;
  fileId?: Id<"files">;
}

export interface CodeEditorState {
  language: string;
  output: string;
  isRunning: boolean;
  error: string | null;
  theme: string;
  fontSize: number;
  editor: editor.IStandaloneCodeEditor | null;
  executionResult: ExecutionResult | null;

  // Multi-file support
  currentProject: Project | null;
  activeFileId: string | null;
  openTabs: string[];

  loadSavedState: () => void;
  setEditor: (editor: editor.IStandaloneCodeEditor) => void;
  getCode: () => string;
  setLanguage: (language: string) => void;
  setTheme: (theme: string) => void;
  setFontSize: (fontSize: number) => void;
  runCode: () => Promise<void>;
}

export interface Snippet {
  _id: Id<"snippets">;
  _creationTime: number;
  userId: string;
  language: string;
  code: string;
  title: string;
  userName: string;
}