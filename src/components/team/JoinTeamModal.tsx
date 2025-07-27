import React, { useState } from 'react';
import { useJoinTeam } from '@/hooks/useTeam';

interface JoinTeamModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const JoinTeamModal: React.FC<JoinTeamModalProps> = ({ onClose, onSuccess }) => {
  const joinTeamMutation = useJoinTeam();
  const [inviteCode, setInviteCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteCode.trim().length < 6) {
      alert('Please enter a valid invite code');
      return;
    }

    try {
      await joinTeamMutation.mutateAsync({ inviteCode: inviteCode.trim().toUpperCase() });
      onSuccess();
    } catch (error) {
      alert('Invalid or expired invite code. Please check the code and try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-full">
        <h2 className="text-xl font-semibold mb-4">Join Team</h2>
        <p className="text-gray-600 mb-4">
          Enter the invite code provided by a team admin to join their team.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Invite Code</label>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              className="w-full border border-gray-300 rounded px-3 py-2 font-mono text-lg tracking-wider"
              placeholder="ABC12345"
              maxLength={16}
              style={{ textTransform: 'uppercase' }}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Invite codes are usually 8 characters (letters and numbers)
            </p>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={joinTeamMutation.isPending || inviteCode.trim().length < 6}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {joinTeamMutation.isPending ? 'Joining...' : 'Join Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};