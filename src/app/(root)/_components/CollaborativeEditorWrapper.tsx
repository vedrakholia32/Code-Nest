"use client";

import { useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { defineMonacoThemes } from '../_constants';
import { LANGUAGE_CONFIG } from '../_constants';
import { useUser } from '@clerk/clerk-react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { nanoid } from 'nanoid';
import { useRef, useState } from 'react';
import { editor, Range } from 'monaco-editor';

interface CollaborativeEditorWrapperProps {
  roomId: string;
  language: string;
  theme: string;
  fontSize: number;
  initialContent?: string;
}

interface TextOperation {
  type: 'insert' | 'delete' | 'replace';
  position: number;
  content?: string;
  length?: number;
}

export default function CollaborativeEditorWrapper({
  roomId,
  language,
  theme,
  fontSize,
  initialContent,
}: CollaborativeEditorWrapperProps) {
  const { user } = useUser();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<number>(0);
  const pendingOperationsRef = useRef<string[]>([]);
  const isApplyingRemoteChange = useRef(false);
  const lastKnownContent = useRef<string>('');
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Convex hooks
  const documentState = useQuery(api.collaboration.getDocumentState, { roomId });
  const recentOperations = useQuery(api.collaboration.getRecentOperations, { 
    roomId, 
    since: lastSyncTime 
  });
  const applyOperation = useMutation(api.collaboration.applyOperation);
  const initializeDocument = useMutation(api.collaboration.initializeDocument);
  const updatePresence = useMutation(api.collaboration.updatePresence);

  const defaultContent = initialContent || LANGUAGE_CONFIG[language].defaultCode;

  // Initialize document with initial content
  useEffect(() => {
    if (!user || !documentState || isInitialized) return;

    const initDoc = async () => {
      if (documentState.content === '' && defaultContent) {
        console.log('Initializing document with initial content');
        await initializeDocument({
          roomId,
          initialContent: defaultContent,
        });
      }
      setIsInitialized(true);
    };

    initDoc();
  }, [user, documentState, defaultContent, roomId, initializeDocument, isInitialized]);

  // Apply remote operations to Monaco editor - improved to prevent conflicts
  useEffect(() => {
    if (!recentOperations || !editorRef.current || !user || recentOperations.length === 0) return;

    const editor = editorRef.current;
    const model = editor.getModel();
    if (!model || isApplyingRemoteChange.current) return;

    console.log('Processing remote operations:', recentOperations.length);

    // Only apply operations that are genuinely new
    const newOperations = recentOperations.filter(op => {
      // Skip our own operations
      if (op.userId === user.id) return false;
      
      // Skip already processed operations
      if (pendingOperationsRef.current.includes(op.operationId)) return false;
      
      // Skip operations older than what we've seen
      return op.timestamp > lastSyncTime;
    });

    if (newOperations.length === 0) return;

    console.log('Applying', newOperations.length, 'new remote operations');

    isApplyingRemoteChange.current = true;

    newOperations.forEach((op) => {
      const { operation } = op;
      
      try {
        console.log(`Applying remote ${operation.type} at position ${operation.position}`);
        
        switch (operation.type) {
          case 'insert':
            if (operation.content) {
              const position = model.getPositionAt(operation.position);
              editor.executeEdits('remote-insert', [{
                range: new Range(
                  position.lineNumber,
                  position.column,
                  position.lineNumber,
                  position.column
                ),
                text: operation.content,
              }]);
            }
            break;
            
          case 'delete':
            if (operation.length) {
              const startPos = model.getPositionAt(operation.position);
              const endPos = model.getPositionAt(operation.position + operation.length);
              editor.executeEdits('remote-delete', [{
                range: new Range(
                  startPos.lineNumber,
                  startPos.column,
                  endPos.lineNumber,
                  endPos.column
                ),
                text: '',
              }]);
            }
            break;
            
          case 'replace':
            if (operation.length && operation.content) {
              const startPos = model.getPositionAt(operation.position);
              const endPos = model.getPositionAt(operation.position + operation.length);
              editor.executeEdits('remote-replace', [{
                range: new Range(
                  startPos.lineNumber,
                  startPos.column,
                  endPos.lineNumber,
                  endPos.column
                ),
                text: operation.content,
              }]);
            }
            break;
        }
        
        // Mark operation as processed
        pendingOperationsRef.current.push(op.operationId);
        
      } catch (error) {
        console.error('Error applying remote operation:', error);
      }
    });

    // Update last sync time
    if (newOperations.length > 0) {
      const lastOp = newOperations[newOperations.length - 1];
      setLastSyncTime(lastOp.timestamp);
      
      // Update our known content
      lastKnownContent.current = model.getValue();
    }

    // Reset the flag after a short delay to allow Monaco to process
    setTimeout(() => {
      isApplyingRemoteChange.current = false;
    }, 100);
  }, [recentOperations, user, lastSyncTime]);

  // Sync document state with Monaco editor - improved logic to prevent blinking
  useEffect(() => {
    if (!documentState || !editorRef.current || isApplyingRemoteChange.current) return;

    const editor = editorRef.current;
    const model = editor.getModel();
    if (!model) return;

    const currentContent = model.getValue();
    const docContent = documentState.content;
    
    // Only sync if there's a meaningful difference and it's not just our own changes
    if (docContent !== currentContent && 
        docContent !== lastKnownContent.current &&
        !pendingOperationsRef.current.length) {
      
      console.log('Syncing document state with editor - length diff:', Math.abs(docContent.length - currentContent.length));
      
      // Use a more gentle approach - only update if the difference is substantial
      if (Math.abs(docContent.length - currentContent.length) > 1 || 
          (docContent.trim() !== currentContent.trim() && docContent.length > 0)) {
        
        isApplyingRemoteChange.current = true;
        
        // Store cursor position
        const position = editor.getPosition();
        
        // Set the new content
        model.setValue(docContent);
        lastKnownContent.current = docContent;
        
        // Restore cursor position if possible
        if (position && docContent.length >= position.column) {
          setTimeout(() => {
            try {
              editor.setPosition(position);
            } catch {
              // If position is invalid, place cursor at end
              const lineCount = model.getLineCount();
              const lastLineLength = model.getLineLength(lineCount);
              editor.setPosition({ lineNumber: lineCount, column: lastLineLength + 1 });
            }
          }, 10);
        }
        
        setTimeout(() => {
          isApplyingRemoteChange.current = false;
        }, 50);
      }
    }
  }, [documentState]);

  // Handle editor content changes with debouncing
  const handleContentChange = async (value: string | undefined) => {
    if (!value || !user || !editorRef.current || isApplyingRemoteChange.current) return;

    const editor = editorRef.current;
    const model = editor.getModel();
    if (!model) return;

    // Update our known content immediately to prevent sync conflicts
    lastKnownContent.current = value;

    // Clear existing timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Debounce the operation to avoid too many API calls
    debounceTimeout.current = setTimeout(async () => {
      // Get the current document state
      const currentDoc = documentState?.content || '';
      
      if (value === currentDoc) return; // No change

      // Calculate the operation
      const operation = calculateOperation(currentDoc, value);
      if (!operation) return;

      // Apply operation via Convex
      const operationId = nanoid();
      
      try {
        console.log('Applying local operation:', operation.type, 'at position', operation.position);
        
        const result = await applyOperation({
          roomId,
          operation,
          operationId,
        });
        
        if (result.success) {
          // Mark this operation as ours to skip in remote updates
          pendingOperationsRef.current.push(operationId);
          
          // Clean up old operation IDs to prevent memory leaks
          if (pendingOperationsRef.current.length > 50) {
            pendingOperationsRef.current = pendingOperationsRef.current.slice(-25);
          }
        } else {
          console.warn('Operation failed:', result.reason);
          // If operation failed, revert to server state
          if (documentState && documentState.content !== value) {
            isApplyingRemoteChange.current = true;
            model.setValue(documentState.content);
            lastKnownContent.current = documentState.content;
            setTimeout(() => {
              isApplyingRemoteChange.current = false;
            }, 50);
          }
        }
        
      } catch (error) {
        console.error('Error applying operation:', error);
      }
    }, 300); // 300ms debounce
  };

  // Calculate text operation between old and new content
  const calculateOperation = (oldContent: string, newContent: string): TextOperation | null => {
    if (oldContent === newContent) return null;

    // Simple diff algorithm - find first difference
    let position = 0;
    const minLength = Math.min(oldContent.length, newContent.length);
    
    // Find where content starts differing
    while (position < minLength && oldContent[position] === newContent[position]) {
      position++;
    }

    if (newContent.length > oldContent.length) {
      // Insertion
      const insertedText = newContent.slice(position, position + (newContent.length - oldContent.length));
      return {
        type: 'insert',
        position,
        content: insertedText,
      };
    } else if (newContent.length < oldContent.length) {
      // Deletion
      const deletedLength = oldContent.length - newContent.length;
      return {
        type: 'delete',
        position,
        length: deletedLength,
      };
    } else {
      // Replacement - find the end of the change
      let endPosition = oldContent.length - 1;
      let newEndPosition = newContent.length - 1;
      
      while (endPosition >= position && newEndPosition >= position && 
             oldContent[endPosition] === newContent[newEndPosition]) {
        endPosition--;
        newEndPosition--;
      }
      
      const replacedLength = endPosition - position + 1;
      const replacementText = newContent.slice(position, newEndPosition + 1);
      
      return {
        type: 'replace',
        position,
        length: replacedLength,
        content: replacementText,
      };
    }
  };

  // Setup Monaco editor event handlers
  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    console.log('Monaco editor mounted for collaboration');

    // Listen for content changes
    const model = editor.getModel();
    if (model) {
      model.onDidChangeContent(() => {
        if (!isApplyingRemoteChange.current) {
          const content = model.getValue();
          handleContentChange(content);
        }
      });
    }

    // Track cursor position for presence
    editor.onDidChangeCursorPosition((event) => {
      if (user) {
        const position = event.position;
        updatePresence({
          roomId,
          cursorPosition: {
            line: position.lineNumber,
            column: position.column,
            // fileId omitted due to type issues
          },
        }).catch(console.error);
      }
    });
  };

  const isReady = isInitialized && documentState !== undefined;
  const content = documentState?.content || defaultContent;

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">Please sign in to collaborate</p>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">
            Connecting to collaboration room...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Editor
      height="100%"
      language={LANGUAGE_CONFIG[language].monacoLanguage}
      theme={theme}
      value={content}
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
  );
}