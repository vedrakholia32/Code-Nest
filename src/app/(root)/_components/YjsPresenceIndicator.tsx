"use client";

import { useEffect, useState } from 'react';
import { Awareness } from 'y-protocols/awareness';
import { Users } from 'lucide-react';

interface CollaboratorInfo {
  id: string;
  name: string;
  color: string;
}

interface YjsPresenceIndicatorProps {
  awareness: Awareness | null;
}

export default function YjsPresenceIndicator({ awareness }: YjsPresenceIndicatorProps) {
  const [collaborators, setCollaborators] = useState<CollaboratorInfo[]>([]);

  useEffect(() => {
    if (!awareness) return;

    const updateCollaborators = () => {
      const users: CollaboratorInfo[] = [];
      
      awareness.getStates().forEach((state, clientId) => {
        if (state.user && clientId !== awareness.clientID) {
          users.push({
            id: state.user.id,
            name: state.user.name,
            color: state.user.color,
          });
        }
      });
      
      setCollaborators(users);
    };

    // Initial update
    updateCollaborators();

    // Listen for awareness changes
    awareness.on('change', updateCollaborators);

    return () => {
      awareness.off('change', updateCollaborators);
    };
  }, [awareness]);

  if (!awareness || collaborators.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-black/5 dark:bg-white/5 rounded-lg">
        <Users className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-500">Only you</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-black/5 dark:bg-white/5 rounded-lg">
      <Users className="w-4 h-4 text-gray-600 dark:text-gray-300" />
      <div className="flex items-center gap-1">
        {collaborators.slice(0, 5).map((collaborator, index) => (
          <div
            key={collaborator.id}
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white shadow-sm"
            style={{ 
              backgroundColor: collaborator.color,
              marginLeft: index > 0 ? '-8px' : '0',
              zIndex: 10 - index 
            }}
            title={collaborator.name}
          >
            {collaborator.name.charAt(0).toUpperCase()}
          </div>
        ))}
        {collaborators.length > 5 && (
          <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-xs font-medium text-white shadow-sm -ml-2">
            +{collaborators.length - 5}
          </div>
        )}
      </div>
      <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">
        {collaborators.length === 1 ? '1 other' : `${collaborators.length} others`}
      </span>
    </div>
  );
}