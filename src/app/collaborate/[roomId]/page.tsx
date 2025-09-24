"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Users, ArrowLeft, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import CollaborationPanel from '../../(root)/_components/CollaborationPanel';
import { useCodeEditorStore } from '@/store/useCodeEditorStore';
import { LANGUAGE_CONFIG } from '../../(root)/_constants';
import dynamic from 'next/dynamic';

// Dynamically import YjsCollaborativeEditor to prevent SSR issues
const YjsCollaborativeEditor = dynamic(
  () => import('../../(root)/_components/YjsCollaborativeEditor'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading collaborative editor...</p>
        </div>
      </div>
    )
  }
);

export default function CollaboratePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const roomId = params.roomId as string;
  const [isJoining, setIsJoining] = useState(true);
  const [hasJoined, setHasJoined] = useState(false);
  const { language, theme, fontSize } = useCodeEditorStore();
  
  const roomData = useQuery(api.collaboration.getRoomInfo, { roomId });
  const joinRoom = useMutation(api.collaboration.joinRoom);
  const leaveRoom = useMutation(api.collaboration.leaveRoom);

  const handleJoinRoom = useCallback(async () => {
    if (!user) {
      toast.error('Please sign in to join collaboration');
      return;
    }

    try {
      const result = await joinRoom({ roomId });
      if (result.success) {
        setHasJoined(true);
        toast.success('Successfully joined collaboration room!');
      } else {
        toast.error('Failed to join room');
        router.push('/');
      }
    } catch (error) {
      console.error('Failed to join room:', error);
      toast.error('Failed to join collaboration room');
      router.push('/');
    } finally {
      setIsJoining(false);
    }
  }, [user, joinRoom, roomId, router]);

  useEffect(() => {
    if (roomData && user && !hasJoined && isJoining) {
      handleJoinRoom();
    }
  }, [roomData, user, hasJoined, isJoining, handleJoinRoom]);

  const handleLeaveRoom = async () => {
    try {
      await leaveRoom({ roomId });
      toast.success('Left collaboration room');
      router.push('/');
    } catch (error) {
      console.error('Failed to leave room:', error);
      toast.error('Failed to leave room');
    }
  };

  // Loading state
  if (!roomData || isJoining) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8"
        >
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            {isJoining ? (
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            ) : (
              <Users className="w-8 h-8 text-white" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {isJoining ? 'Joining Collaboration Room...' : 'Loading Room...'}
          </h1>
          <p className="text-gray-400">
            Room ID: {roomId}
          </p>
        </motion.div>
      </div>
    );
  }

  // Room not found or invalid
  if (!roomData.room || !roomData.room.isActive) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 max-w-md"
        >
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Room Not Found</h1>
          <p className="text-gray-400 mb-6">
            This collaboration room doesn&apos;t exist or has been closed.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Home
          </Link>
        </motion.div>
      </div>
    );
  }

  // Room expired
  if (roomData.room.expiresAt && roomData.room.expiresAt < Date.now()) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 max-w-md"
        >
          <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Room Expired</h1>
          <p className="text-gray-400 mb-6">
            This collaboration room has expired and is no longer available.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Home
          </Link>
        </motion.div>
      </div>
    );
  }

  // Success - show collaborative editor
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              <div className="h-6 w-px bg-gray-700" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-white">
                    Collaboration Room
                  </h1>
                  <p className="text-sm text-gray-400">
                    {roomData.project?.name || 'Untitled Project'}
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleLeaveRoom}
              className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/50 rounded-lg transition-colors"
            >
              Leave Room
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="h-[calc(100vh-64px)] flex">
        {/* Editor */}
        <div className="flex-1 p-4">
          <div className="h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden">
            <YjsCollaborativeEditor
              roomId={roomId}
              language={language}
              initialContent={LANGUAGE_CONFIG[language]?.defaultCode || '// Welcome to collaborative coding!'}
              theme={theme}
              fontSize={fontSize}
            />
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="w-80 p-4 pl-0 flex-shrink-0">
          <CollaborationPanel
            roomId={roomId}
            onLeaveRoom={handleLeaveRoom}
          />
        </div>
      </div>
    </div>
  );
}