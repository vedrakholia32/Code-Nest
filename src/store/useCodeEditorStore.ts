import { CodeEditorState } from "../types/index";
import { LANGUAGE_CONFIG } from "@/app/(root)/_constants";
import { create } from "zustand";
import { editor } from "monaco-editor";

const defaultState = {
  language: "javascript",
  fontSize: 16,
  theme: "vs-dark",
};

const getInitialState = () => {
  // Always return default values during initialization
  // We'll load from localStorage after mount
  return defaultState;
};

export const useCodeEditorStore = create<CodeEditorState>((set, get) => {
  const initialState = getInitialState();

  return {
    ...initialState,
    output: "",
    isRunning: false,
    error: null,
    editor: null,
    executionResult: null,
    
    // Multi-file project support
    currentProject: null,
    activeFileId: null,
    openTabs: [],

    getCode: () => get().editor?.getValue() || "",

    loadSavedState: () => {
      if (typeof window === "undefined") return;
      
      const savedLanguage = localStorage.getItem("editor-language");
      const savedTheme = localStorage.getItem("editor-theme");
      const savedFontSize = localStorage.getItem("editor-font-size");

      if (savedLanguage) set({ language: savedLanguage });
      if (savedTheme) set({ theme: savedTheme });
      if (savedFontSize) set({ fontSize: Number(savedFontSize) });
    },

    setEditor: (editor: editor.IStandaloneCodeEditor) => {
      const savedCode = localStorage.getItem(`editor-code-${get().language}`);
      if (savedCode) editor.setValue(savedCode);

      set({ editor });
    },

    setTheme: (theme: string) => {
      localStorage.setItem("editor-theme", theme);
      set({ theme });
    },

    setFontSize: (fontSize: number) => {
      localStorage.setItem("editor-font-size", fontSize.toString());
      set({ fontSize });
    },

    setLanguage: (language: string) => {
      const currentCode = get().editor?.getValue();
      if (currentCode) {
        localStorage.setItem(`editor-code-${get().language}`, currentCode);
      }

      localStorage.setItem("editor-language", language);

      set({
        language,
        output: "",
        error: null,
      });
    },

    runCode: async () => {
      const { language, getCode } = get();
      const code = getCode();

      if (!code) {
        set({ error: "Please enter some code" });
        return;
      }

      set({ isRunning: true, error: null, output: "" });

      try {
        const runtime = LANGUAGE_CONFIG[language].pistonRuntime;
        const response = await fetch("https://emkc.org/api/v2/piston/execute", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            language: runtime.language,
            version: runtime.version,
            files: [{ content: code }],
          }),
        });

        const data = await response.json();

        console.log("data back from piston:", data);

        if (data.message) {
          set({ error: data.message, executionResult: { code, output: "", error: data.message } });
          return;
        }

        if (data.compile && data.compile.code !== 0) {
          const error = data.compile.stderr || data.compile.output;
          set({
            error,
            executionResult: {
              code,
              output: "",
              error,
            },
          });
          return;
        }

        if (data.run && data.run.code !== 0) {
          const error = data.run.stderr || data.run.output;
          set({
            error,
            executionResult: {
              code,
              output: "",
              error,
            },
          });
          return;
        }

        const output = data.run.output;

        set({
          output: output.trim(),
          error: null,
          executionResult: {
            code,
            output: output.trim(),
            error: null,
          },
        });
      } catch (error) {
        console.log("Error running code:", error);
        set({
          error: "Error running code",
          executionResult: { code, output: "", error: "Error running code" },
        });
      } finally {
        set({ isRunning: false });
      }
    },
  };
});

export const getExecutionResult = () => useCodeEditorStore.getState().executionResult;