"use client";

import { useEffect, useRef, useState } from 'react';
import { Editor, OnMount } from '@monaco-editor/react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';
import { editor } from 'monaco-editor';
import { useUser } from '@clerk/nextjs';
import { defineMonacoThemes } from '../_constants';
import { LANGUAGE_CONFIG } from '../_constants';
import YjsPresenceIndicator from './YjsPresenceIndicator';

interface YjsCollaborativeEditorProps {
  roomId: string;
  language: string;
  theme: string;
  fontSize: number;
  initialContent?: string;
}

export default function YjsCollaborativeEditor({
  roomId,
  language,
  theme,
  fontSize,
  initialContent,
}: YjsCollaborativeEditorProps) {
  const { user } = useUser();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  
  const defaultContent = initialContent || LANGUAGE_CONFIG[language]?.defaultCode || '';

  useEffect(() => {
    if (!user || !editorRef.current) return;

    // Create Yjs document
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    // Create WebSocket provider with environment-aware server selection
    const wsUrl = process.env.NODE_ENV === 'production' 
      ? 'wss://demos.yjs.dev'  // Public demo server for production
      : 'ws://localhost:1234'; // Local server for development
    
    console.log(`Connecting to Yjs server: ${wsUrl}`);
    
    const provider = new WebsocketProvider(wsUrl, `codenest-${roomId}`, ydoc);
    providerRef.current = provider;
    
    if (!user) return;
    
    // Set user information for awareness
    provider.awareness.setLocalStateField('user', {
      name: user.fullName || user.firstName || 'Anonymous',
      id: user.id,
      color: getRandomColor(user.id),
    });

    // Connection event listeners
    provider.on('status', (event: { status: string }) => {
      const status = event.status as 'connecting' | 'connected' | 'disconnected';
      setConnectionStatus(status);
      console.log(`Yjs connection status: ${status}`);
    });

    // Get or create the shared text type
    const ytext = ydoc.getText('monaco');
    
    // Initialize with default content if empty
    if (ytext.length === 0 && defaultContent) {
      ytext.insert(0, defaultContent);
    }

    // Create Monaco binding
    const model = editorRef.current.getModel();
    if (model) {
      const binding = new MonacoBinding(
        ytext,
        model,
        new Set([editorRef.current]),
        provider.awareness
      );
      bindingRef.current = binding;
    }

    // Cleanup function
    return () => {
      bindingRef.current?.destroy();
      providerRef.current?.destroy();
      ydocRef.current?.destroy();
    };
  }, [user, roomId, defaultContent]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    defineMonacoThemes(monaco);
  };

  // Generate consistent color for user based on ID
  const getRandomColor = (userId: string) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
      '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
      '#C44569', '#F8B500', '#3742FA', '#2F3542', '#40739E'
    ];
    
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">Please sign in to collaborate</p>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      {/* Connection Status and Presence Indicator */}
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        {/* Connection Status */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/10 dark:bg-white/10 backdrop-blur-sm">
          <div className={`w-2 h-2 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-500' : 
            connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' : 
            'bg-red-500'
          }`} />
          <span className="text-xs text-gray-600 dark:text-gray-300">
            {connectionStatus === 'connected' ? 'Connected' :
             connectionStatus === 'connecting' ? 'Connecting...' :
             'Disconnected'}
          </span>
        </div>
        
        {/* Presence Indicator */}
        <YjsPresenceIndicator awareness={providerRef.current?.awareness || null} />
      </div>

      <Editor
        height="100%"
        language={LANGUAGE_CONFIG[language]?.monacoLanguage || language}
        theme={theme}
        beforeMount={defineMonacoThemes}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          padding: { top: 16, bottom: 16 },
          renderWhitespace: "selection",
          fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
          fontLigatures: true,
          cursorBlinking: "smooth",
          smoothScrolling: true,
          contextmenu: true,
          renderLineHighlight: "all",
          lineHeight: 1.6,
          letterSpacing: 0.5,
          roundedSelection: true,
          scrollbar: {
            vertical: "hidden",
            horizontal: "hidden",
          },
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          overviewRulerBorder: false,
        }}
      />
    </div>
  );
}