import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import { toast } from 'react-hot-toast';
import { Users, Share, Timer, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

interface StartCollaborationDialogProps {
  projectId?: Id<"projects">; // Made optional
  projectName?: string;
  onRoomCreated: (roomId: string) => void;
  onClose: () => void;
}

export default function StartCollaborationDialog({
  projectId,
  projectName,
  onRoomCreated,
  onClose
}: StartCollaborationDialogProps) {
  const [maxParticipants, setMaxParticipants] = useState(5);
  const [expiresIn, setExpiresIn] = useState(120); // 2 hours
  const [isCreating, setIsCreating] = useState(false);

  const createRoom = useMutation(api.collaboration.createRoom);

  const handleCreateRoom = async () => {
    setIsCreating(true);
    try {
      const result = await createRoom({
        projectId, // This can be undefined now
        maxParticipants,
        expiresIn,
      });

      if (result.roomId) {
        toast.success('Collaboration room created!');
        onRoomCreated(result.roomId);
      }
    } catch (error) {
      toast.error('Failed to create collaboration room');
      console.error(error);
    } finally {
      setIsCreating(false);
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
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Start Collaboration</h3>
              <p className="text-sm text-gray-400">{projectName || "Standalone Session"}</p>
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
          {/* Max Participants */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Crown className="w-4 h-4 inline mr-2" />
              Max Participants
            </label>
            <select
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(Number(e.target.value))}
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            >
              <option value={2}>2 people</option>
              <option value={5}>5 people</option>
              <option value={10}>10 people</option>
              <option value={20}>20 people</option>
            </select>
          </div>

          {/* Session Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Timer className="w-4 h-4 inline mr-2" />
              Session Duration
            </label>
            <select
              value={expiresIn}
              onChange={(e) => setExpiresIn(Number(e.target.value))}
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            >
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
              <option value={240}>4 hours</option>
              <option value={480}>8 hours</option>
              <option value={0}>No expiration</option>
            </select>
          </div>

          {/* Info Box */}
          <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Share className="w-4 h-4 text-blue-400 mt-0.5" />
              <div className="text-sm text-blue-200">
                <p className="font-medium">You&apos;ll get a shareable link</p>
                <p className="text-blue-300/80">Share it with collaborators to let them join your coding session</p>
              </div>
            </div>
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
            onClick={handleCreateRoom}
            disabled={isCreating}
            className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isCreating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Users className="w-4 h-4" />
                Create Room
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}