"use client";

import { useEffect, useRef, useState } from 'react';
import { editor } from 'monaco-editor';
import { useUser } from '@clerk/clerk-react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { nanoid } from 'nanoid';
import { Range } from 'monaco-editor';

interface CollaborativeEditorProps {
  roomId: string;
  initialContent?: string;
  onContentChange?: (content: string) => void;
}

interface TextOperation {
  type: 'insert' | 'delete' | 'replace';
  position: number;
  content?: string;
  length?: number;
}

const useCollaborativeEditor = ({
  roomId,
  initialContent = '',
  onContentChange,
}: CollaborativeEditorProps) => {
  const { user } = useUser();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<number>(0);
  const pendingOperationsRef = useRef<string[]>([]);
  const isApplyingRemoteChange = useRef(false);

  // Convex hooks
  const documentState = useQuery(api.collaboration.getDocumentState, { roomId });
  const recentOperations = useQuery(api.collaboration.getRecentOperations, { 
    roomId, 
    since: lastSyncTime 
  });
  const applyOperation = useMutation(api.collaboration.applyOperation);
  const initializeDocument = useMutation(api.collaboration.initializeDocument);
  const updatePresence = useMutation(api.collaboration.updatePresence);

  // Initialize document with initial content
  useEffect(() => {
    if (!user || !documentState || isInitialized) return;

    const initDoc = async () => {
      if (documentState.content === '' && initialContent) {
        console.log('Initializing document with initial content');
        await initializeDocument({
          roomId,
          initialContent,
        });
      }
      setIsInitialized(true);
    };

    initDoc();
  }, [user, documentState, initialContent, roomId, initializeDocument, isInitialized]);

  // Apply remote operations to Monaco editor
  useEffect(() => {
    if (!recentOperations || !editorRef.current || !user) return;

    const editor = editorRef.current;
    const model = editor.getModel();
    if (!model || isApplyingRemoteChange.current) return;

    console.log('Applying remote operations:', recentOperations.length);

    isApplyingRemoteChange.current = true;

    recentOperations.forEach((op) => {
      // Skip operations from current user
      if (op.userId === user.id) return;
      
      // Skip operations we've already processed
      if (pendingOperationsRef.current.includes(op.operationId)) return;

      const { operation } = op;
      
      try {
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
        
        pendingOperationsRef.current.push(op.operationId);
      } catch (error) {
        console.error('Error applying remote operation:', error);
      }
    });

    // Update last sync time
    if (recentOperations.length > 0) {
      const lastOp = recentOperations[recentOperations.length - 1];
      setLastSyncTime(lastOp.timestamp);
    }

    isApplyingRemoteChange.current = false;
  }, [recentOperations, user]);

  // Sync document state with Monaco editor
  useEffect(() => {
    if (!documentState || !editorRef.current || isApplyingRemoteChange.current) return;

    const editor = editorRef.current;
    const model = editor.getModel();
    if (!model) return;

    const currentContent = model.getValue();
    
    // Only sync if content differs significantly (avoid infinite loops)
    if (documentState.content !== currentContent && Math.abs(documentState.content.length - currentContent.length) > 0) {
      console.log('Syncing document state with editor');
      isApplyingRemoteChange.current = true;
      model.setValue(documentState.content);
      isApplyingRemoteChange.current = false;
      
      if (onContentChange) {
        onContentChange(documentState.content);
      }
    }
  }, [documentState, onContentChange]);

  // Handle editor content changes
  const handleContentChange = async (value: string | undefined) => {
    if (!value || !user || !editorRef.current || isApplyingRemoteChange.current) return;

    const editor = editorRef.current;
    const model = editor.getModel();
    if (!model) return;

    // Get the current document state
    const currentDoc = documentState?.content || '';
    
    if (value === currentDoc) return; // No change

    // Calculate the operation
    const operation = calculateOperation(currentDoc, value);
    if (!operation) return;

    // Apply operation via Convex
    const operationId = nanoid();
    
    try {
      const result = await applyOperation({
        roomId,
        operation,
        operationId,
      });
      
      if (result.success) {
        // Mark this operation as ours to skip in remote updates
        pendingOperationsRef.current.push(operationId);
        console.log('Operation applied successfully:', operation);
      } else {
        console.warn('Operation failed:', result.reason);
      }
      
    } catch (error) {
      console.error('Error applying operation:', error);
    }
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
          
          if (onContentChange) {
            onContentChange(content);
          }
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
            // fileId, // Commenting out since type mismatch
          },
        }).catch(console.error);
      }
    });
  };

  if (!user) {
    return <div>Please sign in to collaborate</div>;
  }

  return {
    handleEditorDidMount,
    isReady: isInitialized && documentState !== undefined,
    content: documentState?.content || initialContent,
  };
};

export default useCollaborativeEditor;