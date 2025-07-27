import React, { useState } from 'react';
import { useCreateTeam } from '@/hooks/useTeam';
import type { CreateTeamDto } from '@/lib/teamApi';

interface CreateTeamModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ onClose, onSuccess }) => {
  const createTeamMutation = useCreateTeam();
  const [formData, setFormData] = useState<CreateTeamDto>({
    name: '',
    timezone: 'Europe/Berlin',
    minPlayers: 4,
    minDurationMinutes: 90,
    reminderHours: [0, 6, 12, 18],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim().length < 2) {
      alert('Team name must be at least 2 characters');
      return;
    }

    try {
      await createTeamMutation.mutateAsync(formData);
      onSuccess();
    } catch (error) {
      alert('Failed to create team. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Create New Team</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Team Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter team name"
              maxLength={50}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Timezone</label>
            <select
              value={formData.timezone}
              onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="Europe/Berlin">Europe/Berlin</option>
              <option value="Europe/London">Europe/London</option>
              <option value="America/New_York">America/New_York</option>
              <option value="America/Los_Angeles">America/Los_Angeles</option>
              <option value="Asia/Tokyo">Asia/Tokyo</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Min Players</label>
              <input
                type="number"
                value={formData.minPlayers}
                onChange={(e) => setFormData(prev => ({ ...prev, minPlayers: parseInt(e.target.value) }))}
                className="w-full border border-gray-300 rounded px-3 py-2"
                min={2}
                max={20}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Min Duration (min)</label>
              <input
                type="number"
                value={formData.minDurationMinutes}
                onChange={(e) => setFormData(prev => ({ ...prev, minDurationMinutes: parseInt(e.target.value) }))}
                className="w-full border border-gray-300 rounded px-3 py-2"
                min={30}
                max={480}
                step={15}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Discord Guild ID (optional)</label>
            <input
              type="text"
              value={formData.discordGuildId || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, discordGuildId: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Discord server ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Reminder Channel ID (optional)</label>
            <input
              type="text"
              value={formData.reminderChannelId || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, reminderChannelId: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Discord channel ID for reminders"
            />
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
              disabled={createTeamMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {createTeamMutation.isPending ? 'Creating...' : 'Create Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};