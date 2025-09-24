import { useState } from 'react';
import { Users, UserPlus } from 'lucide-react';
import StartCollaborationDialog from './StartCollaborationDialog';
import JoinCollaborationDialog from './JoinCollaborationDialog';
import { Id } from '../../../../convex/_generated/dataModel';

interface CollaborationButtonProps {
  projectId?: Id<"projects">;
  projectName?: string;
  onCollaborationStart: (roomId: string) => void;
  className?: string;
}

export default function CollaborationButton({
  projectId,
  projectName = "Current Project",
  onCollaborationStart,
  className = ""
}: CollaborationButtonProps) {
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleStartCollaboration = () => {
    setShowStartDialog(true);
    setShowOptions(false);
  };

  const handleJoinCollaboration = () => {
    setShowJoinDialog(true);
    setShowOptions(false);
  };

  const handleRoomCreated = (roomId: string) => {
    setShowStartDialog(false);
    onCollaborationStart(roomId);
  };

  const handleRoomJoined = (roomId: string) => {
    setShowJoinDialog(false);
    onCollaborationStart(roomId);
  };

  return (
    <>
      <div className="relative">
        <div>
          <button
            onClick={() => setShowOptions(!showOptions)}
            className={`flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors ${className}`}
          >
            <Users className="w-4 h-4" />
            Collaborate
          </button>
          
          {showOptions && (
            <div className="absolute top-full left-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 min-w-40">
              <button
                onClick={handleStartCollaboration}
                className="w-full text-left px-4 py-2 hover:bg-gray-700 text-white text-sm flex items-center gap-2 rounded-t-lg"
              >
                <Users className="w-4 h-4" />
                Start Session
              </button>
              <button
                onClick={handleJoinCollaboration}
                className="w-full text-left px-4 py-2 hover:bg-gray-700 text-white text-sm flex items-center gap-2 rounded-b-lg"
              >
                <UserPlus className="w-4 h-4" />
                Join Session
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      {showStartDialog && (
        <StartCollaborationDialog
          projectId={projectId}
          projectName={projectName}
          onRoomCreated={handleRoomCreated}
          onClose={() => setShowStartDialog(false)}
        />
      )}

      {showJoinDialog && (
        <JoinCollaborationDialog
          onRoomJoined={handleRoomJoined}
          onClose={() => setShowJoinDialog(false)}
        />
      )}

      {/* Backdrop for dropdown */}
      {showOptions && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowOptions(false)}
        />
      )}
    </>
  );
}