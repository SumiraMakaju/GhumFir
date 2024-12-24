import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { UserData } from '@/lib/types';
import { StreamChat } from 'stream-chat';

interface UserListPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  users: UserData[];
  client: StreamChat;
  currentUserId: string;
}

const UserListPopup: React.FC<UserListPopupProps> = ({ isOpen, onClose, title, users, client, currentUserId }) => {
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);

  useEffect(() => {
    const filterExistingChats = async () => {
      if (!client || !users.length) return;

      try {
        // Get all existing channels for the current user
        const existingChannels = await client.queryChannels({
          type: 'messaging',
          members: { $in: [currentUserId] }
        });

        // Create a Set of user IDs who are already in chats
        const existingChatUserIds = new Set<string>();
        existingChannels.forEach(channel => {
          Object.keys(channel.state.members).forEach(memberId => {
            if (memberId !== currentUserId) {
              existingChatUserIds.add(memberId);
            }
          });
        });

        // Filter out users who are already in chats
        const availableUsers = users.filter(user => !existingChatUserIds.has(user.id));
        setFilteredUsers(availableUsers);

      } catch (error) {
        console.error('Error filtering users:', error);
      }
    };

    if (isOpen) {
      filterExistingChats();
    }
  }, [users, client, currentUserId, isOpen]);

  const handleUserSelect = async (selectedUser: UserData) => {
    if (isCreatingChat) return;
    
    setIsCreatingChat(true);
    setSelectedUserId(selectedUser.id);

    try {
      const members = [currentUserId, selectedUser.id].sort();
      const channelId = `messaging_${members.join('_')}`;
      
      const channel = client.channel('messaging', channelId, {
        members,
        created_by_id: currentUserId
      });

      await channel.create();
      await channel.watch();
      
      onClose();
    } catch (error) {
      console.error('Failed to create chat:', error);
    } finally {
      setIsCreatingChat(false);
      setSelectedUserId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-black p-4 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} disabled={isCreatingChat}>
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <ul className="mb-4 max-h-60 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <li className="text-gray-500 text-center py-4">No available users to chat with</li>
          ) : (
            filteredUsers.map((user) => (
              <li 
                key={user.id} 
                className="flex items-center mb-2 p-2 hover:bg-gray-800 rounded-lg cursor-pointer"
                onClick={() => handleUserSelect(user)}
              >
                <div className="flex items-center flex-1">
                  {user.avatarUrl && (
                    <img src={user.avatarUrl} alt={user.username} className="w-8 h-8 rounded-full mr-2" />
                  )}
                  <div>
                    <div className="font-semibold">{user.displayName}</div>
                    <div className="text-sm text-gray-500">@{user.username}</div>
                  </div>
                </div>
                {isCreatingChat && selectedUserId === user.id && (
                  <Loader2 className="w-4 h-4 animate-spin ml-2" />
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default UserListPopup;