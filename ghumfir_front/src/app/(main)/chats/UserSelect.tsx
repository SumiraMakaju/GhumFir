import React, { useState } from 'react';
import { X } from 'lucide-react'; // Assuming you're using lucide-react for icons
import { UserData } from '@/lib/types';

interface UserListPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  users: UserData[];
}

const UserListPopup: React.FC<UserListPopupProps> = ({ isOpen, onClose, title, users }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <ul className="mb-4 max-h-60 overflow-y-auto">
          {users.map((user) => (
            <li key={user.id} className="flex items-center mb-2">
              {user.avatarUrl && (
                <img src={user.avatarUrl} alt={user.username} className="w-8 h-8 rounded-full mr-2" />
              )}
              <div>
                <div className="font-semibold">{user.displayName}</div>
                <div className="text-sm text-gray-500">@{user.username}</div>
                {user.bio && <div className="text-sm text-gray-500">{user.bio}</div>}
              </div>
            </li>
          ))}
        </ul>
        <button className="bg-primary text-white p-2 rounded w-full" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default UserListPopup;