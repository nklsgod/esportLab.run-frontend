import React, { useState } from 'react';
import { useTeamInvites, useCreateTeamInvite, useDeactivateInvite } from '@/hooks/useTeam';
import type { CreateTeamInviteDto } from '@/lib/teamApi';
import { format, addDays } from 'date-fns';

interface TeamInviteManagerProps {
  teamId: number;
}

export const TeamInviteManager: React.FC<TeamInviteManagerProps> = ({ teamId }) => {
  const { data: invites = [], isLoading } = useTeamInvites(teamId);
  const createInviteMutation = useCreateTeamInvite();
  const deactivateInviteMutation = useDeactivateInvite();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createData, setCreateData] = useState<CreateTeamInviteDto>({
    expiresAt: addDays(new Date(), 7).toISOString(),
    maxUses: undefined,
  });

  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createInviteMutation.mutateAsync({ teamId, data: createData });
      setShowCreateForm(false);
      setCreateData({
        expiresAt: addDays(new Date(), 7).toISOString(),
        maxUses: undefined,
      });
    } catch (error) {
      alert('Failed to create invite. You may have reached the limit (5 active invites max).');
    }
  };

  const handleDeactivateInvite = async (inviteId: number) => {
    if (!window.confirm('Are you sure you want to deactivate this invite?')) return;

    try {
      await deactivateInviteMutation.mutateAsync({ teamId, inviteId });
    } catch (error) {
      alert('Failed to deactivate invite');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could show a toast notification here
      alert('Copied to clipboard!');
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Team Invites</h3>
        <div className="text-center py-4">Loading invites...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Team Invites</h3>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          disabled={invites.length >= 5}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {showCreateForm ? 'Cancel' : 'Create Invite'}
        </button>
      </div>

      {invites.length >= 5 && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded text-yellow-800 text-sm">
          Maximum of 5 active invites reached. Deactivate an existing invite to create a new one.
        </div>
      )}

      {/* Create Invite Form */}
      {showCreateForm && (
        <form onSubmit={handleCreateInvite} className="mb-6 p-4 border border-gray-200 rounded">
          <h4 className="font-medium mb-3">Create New Invite</h4>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Expires At</label>
              <input
                type="datetime-local"
                value={createData.expiresAt?.slice(0, 16)}
                onChange={(e) => setCreateData(prev => ({
                  ...prev,
                  expiresAt: new Date(e.target.value).toISOString()
                }))}
                className="w-full border border-gray-300 rounded px-3 py-2"
                min={new Date().toISOString().slice(0, 16)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Max Uses (optional)</label>
              <input
                type="number"
                value={createData.maxUses || ''}
                onChange={(e) => setCreateData(prev => ({
                  ...prev,
                  maxUses: e.target.value ? parseInt(e.target.value) : undefined
                }))}
                className="w-full border border-gray-300 rounded px-3 py-2"
                min={1}
                max={100}
                placeholder="Unlimited"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty for unlimited uses</p>
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={createInviteMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {createInviteMutation.isPending ? 'Creating...' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Invites List */}
      <div className="space-y-3">
        {invites.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No active invites</p>
        ) : (
          invites.map(invite => (
            <div 
              key={invite.id} 
              className={`p-4 border rounded ${
                invite.isValid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <code className="text-lg font-mono bg-gray-100 px-2 py-1 rounded">
                      {invite.inviteCode}
                    </code>
                    <button
                      onClick={() => copyToClipboard(invite.inviteCode)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                      title="Copy to clipboard"
                    >
                      📋
                    </button>
                  </div>

                  <div className="mt-2 text-sm text-gray-600">
                    <div>Expires: {format(new Date(invite.expiresAt), 'PPP p')}</div>
                    <div>
                      Uses: {invite.usedCount}
                      {invite.maxUses ? ` / ${invite.maxUses}` : ' (unlimited)'}
                      {invite.remainingUses !== Infinity && (
                        <span> ({invite.remainingUses} remaining)</span>
                      )}
                    </div>
                    <div>Created by: {invite.createdByDisplayName}</div>
                  </div>

                  {!invite.isValid && (
                    <div className="mt-1 text-sm text-red-600">
                      {invite.isExpired ? 'Expired' : 'Usage limit reached'}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleDeactivateInvite(invite.id)}
                  disabled={deactivateInviteMutation.isPending}
                  className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                >
                  Deactivate
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};