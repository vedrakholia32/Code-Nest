import { NextRequest, NextResponse } from "next/server";

const PISTON_API = "https://emkc.org/api/v2/piston";

interface PistonRequest {
  language: string;
  version: string;
  files: Array<{
    name?: string;
    content: string;
  }>;
  stdin?: string;
  args?: string[];
  compile_timeout?: number;
  run_timeout?: number;
  compile_memory_limit?: number;
  run_memory_limit?: number;
}

interface PistonResponse {
  language: string;
  version: string;
  compile?: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    output: string;
  };
  run: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    output: string;
  };
}

// Language configuration mapping
const LANGUAGE_CONFIG: Record<string, { language: string; version: string }> = {
  javascript: { language: "javascript", version: "18.15.0" },
  typescript: { language: "typescript", version: "5.0.3" },
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
  cpp: { language: "cpp", version: "10.2.0" },
  c: { language: "c", version: "10.2.0" },
  csharp: { language: "csharp", version: "6.12.0" },
  go: { language: "go", version: "1.16.2" },
  rust: { language: "rust", version: "1.68.2" },
  php: { language: "php", version: "8.2.3" },
  ruby: { language: "ruby", version: "3.0.1" },
  swift: { language: "swift", version: "5.3.3" },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { language, code } = body;

    if (!language || !code) {
      return NextResponse.json(
        { error: "Language and code are required" },
        { status: 400 }
      );
    }

    const config = LANGUAGE_CONFIG[language.toLowerCase()];
    if (!config) {
      return NextResponse.json(
        { error: `Unsupported language: ${language}` },
        { status: 400 }
      );
    }

    const pistonRequest: PistonRequest = {
      language: config.language,
      version: config.version,
      files: [
        {
          name: getFileName(language),
          content: code,
        },
      ],
      compile_timeout: 10000,
      run_timeout: 3000,
      compile_memory_limit: -1,
      run_memory_limit: -1,
    };

    const response = await fetch(`${PISTON_API}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pistonRequest),
    });

    if (!response.ok) {
      throw new Error(`Piston API error: ${response.status}`);
    }

    const result: PistonResponse = await response.json();
    
    // Format the response for our frontend
    const formattedResponse = {
      compile: result.compile ? {
        output: result.compile.stdout || result.compile.stderr || result.compile.output,
      } : undefined,
      run: {
        output: result.run.stdout || "",
        stderr: result.run.stderr || "",
      },
    };

    return NextResponse.json(formattedResponse);
  } catch (error) {
    console.error("Code execution error:", error);
    return NextResponse.json(
      { error: "Failed to execute code" },
      { status: 500 }
    );
  }
}

function getFileName(language: string): string {
  const fileNames: Record<string, string> = {
    javascript: "main.js",
    typescript: "main.ts",
    python: "main.py",
    java: "Main.java",
    cpp: "main.cpp",
    c: "main.c",
    csharp: "main.cs",
    go: "main.go",
    rust: "main.rs",
    php: "main.php",
    ruby: "main.rb",
    swift: "main.swift",
  };
  return fileNames[language.toLowerCase()] || "main.txt";
}
