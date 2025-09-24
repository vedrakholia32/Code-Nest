import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { toast } from 'react-hot-toast';
import { Users, Copy, Link, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

interface JoinCollaborationDialogProps {
  onRoomJoined: (roomId: string) => void;
  onClose: () => void;
}

export default function JoinCollaborationDialog({
  onRoomJoined,
  onClose
}: JoinCollaborationDialogProps) {
  const [roomId, setRoomId] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const joinRoom = useMutation(api.collaboration.joinRoom);

  const handleJoinRoom = async () => {
    if (!roomId.trim()) {
      toast.error('Please enter a room ID');
      return;
    }

    setIsJoining(true);
    try {
      const result = await joinRoom({ roomId: roomId.trim() });
      
      if (result.success) {
        toast.success('Joined collaboration room!');
        onRoomJoined(roomId.trim());
      } else {
        toast.error('Failed to join room');
      }
    } catch {
      toast.error('Failed to join collaboration room');
    } finally {
      setIsJoining(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      // Extract room ID from URL or use as is
      const match = text.match(/collaborate\/([a-zA-Z0-9-_]+)/);
      const extractedRoomId = match ? match[1] : text.trim();
      setRoomId(extractedRoomId);
    } catch {
      toast.error('Failed to paste from clipboard');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Join Collaboration</h3>
              <p className="text-sm text-gray-400">Enter room ID or paste invite link</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Room ID Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Link className="w-4 h-4 inline mr-2" />
              Room ID or Invite Link
            </label>
            <div className="relative">
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter room ID or paste invite link..."
                className="w-full p-3 pr-20 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
              />
              <button
                onClick={handlePaste}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-xs text-gray-300 rounded transition-colors"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Users className="w-4 h-4 text-green-400 mt-0.5" />
              <div className="text-sm text-green-200">
                <p className="font-medium">How to get a room ID?</p>
                <p className="text-green-300/80">Ask the room creator to share the invite link with you</p>
              </div>
            </div>
          </div>

          {/* Example */}
          <div className="text-xs text-gray-500">
            <p>Example formats:</p>
            <p className="font-mono bg-gray-800 px-2 py-1 rounded mt-1">
              • abc123def456<br/>
              • https://codenest.app/collaborate/abc123def456
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleJoinRoom}
            disabled={isJoining || !roomId.trim()}
            className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isJoining ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Joining...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Join Room
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}