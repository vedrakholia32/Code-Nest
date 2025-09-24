import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Users, Clock, Share, Copy, Crown, UserX } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

interface CollaborationPanelProps {
  roomId: string;
  onLeaveRoom: () => void;
}

export default function CollaborationPanel({ roomId, onLeaveRoom }: CollaborationPanelProps) {
  const roomData = useQuery(api.collaboration.getRoomInfo, { roomId });
  const participants = useQuery(api.collaboration.getRoomParticipants, { roomId });

  const shareRoomLink = async () => {
    if (typeof window === 'undefined') return;
    
    const url = `${window.location.origin}/collaborate/${roomId}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Room link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const shareRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success('Room ID copied to clipboard!');
    } catch {
      toast.error('Failed to copy room ID');
    }
  };

  const formatTimeRemaining = (expiresAt: number) => {
    const now = Date.now();
    const remaining = expiresAt - now;
    
    if (remaining <= 0) return 'Expired';
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (!roomData || !participants) {
    return (
      <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          <div className="h-3 bg-gray-700 rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-8 bg-gray-700 rounded"></div>
            <div className="h-8 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/50 rounded-lg p-4 border border-gray-700 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-white">Live Collaboration</h3>
            <p className="text-xs text-gray-400">
              {participants.length}/{roomData.room.maxParticipants} participants
            </p>
          </div>
        </div>
        
        {roomData.room.expiresAt && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            {formatTimeRemaining(roomData.room.expiresAt)}
          </div>
        )}
      </div>

      {/* Participants */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-300">Participants</h4>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {participants.map((participant) => (
            <div
              key={participant._id}
              className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg"
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
                style={{ backgroundColor: participant.userColor }}
              >
                {participant.userName?.charAt(0).toUpperCase() || '?'}
              </div>
              <span className="flex-1 text-sm text-gray-300">{participant.userName || 'Anonymous'}</span>
              {participant.role === 'host' && (
                <Crown className="w-3 h-3 text-yellow-500" />
              )}
              <div
                className={`w-2 h-2 rounded-full ${
                  Date.now() - participant.lastSeenAt < 30000 ? 'bg-green-500' : 'bg-gray-500'
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Share Options */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-300">Invite Others</h4>
        <div className="flex gap-2">
          <button
            onClick={shareRoomLink}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-sm rounded-lg border border-blue-600/30 transition-colors"
          >
            <Share className="w-3 h-3" />
            Share Link
          </button>
          <button
            onClick={shareRoomId}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-lg transition-colors"
          >
            <Copy className="w-3 h-3" />
            Copy ID
          </button>
        </div>
      </div>

      {/* Room Info */}
      <div className="pt-2 border-t border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Room ID: {roomId}</span>
          <button
            onClick={onLeaveRoom}
            className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors"
          >
            <UserX className="w-3 h-3" />
            Leave
          </button>
        </div>
      </div>
    </motion.div>
  );
}