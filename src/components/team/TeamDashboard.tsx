import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTeam, useLeaveTeam } from '@/hooks/useTeam';
import { CreateTeamModal } from './CreateTeamModal';
import { JoinTeamModal } from './JoinTeamModal';
import { TeamInviteManager } from './TeamInviteManager';
import { TeamMemberList } from './TeamMemberList';

export const TeamDashboard: React.FC = () => {
  const { user } = useAuth();
  const teamId = user?.teamIds?.[0] ? parseInt(user.teamIds[0]) : undefined;
  const { data: team } = useTeam(teamId);
  const leaveTeamMutation = useLeaveTeam();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const hasTeam = user?.teamIds && user.teamIds.length > 0;
  const isTeamOwner = user?.roles?.includes('OWNER') || false;
  const isTeamAdmin = user?.roles?.includes('ADMIN') || user?.roles?.includes('OWNER') || false;

  const handleLeaveTeam = async () => {
    if (!window.confirm('Are you sure you want to leave this team?')) return;

    try {
      await leaveTeamMutation.mutateAsync();
    } catch (error) {
      alert('Failed to leave team');
    }
  };

  const handleTeamCreated = () => {
    setShowCreateModal(false);
  };

  const handleTeamJoined = () => {
    setShowJoinModal(false);
  };

  // No team state
  if (!hasTeam) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Welcome to EsportLab!</h1>
            <p className="text-gray-600 mb-8">
              You're not part of a team yet. Create a new team or join an existing one to get started.
            </p>

            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <button
                onClick={() => setShowCreateModal(true)}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Create New Team
              </button>
              <button
                onClick={() => setShowJoinModal(true)}
                className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                Join Existing Team
              </button>
            </div>
          </div>

          {/* Modals */}
          {showCreateModal && (
            <CreateTeamModal
              onClose={() => setShowCreateModal(false)}
              onSuccess={handleTeamCreated}
            />
          )}
          {showJoinModal && (
            <JoinTeamModal
              onClose={() => setShowJoinModal(false)}
              onSuccess={handleTeamJoined}
            />
          )}
        </div>
      </div>
    );
  }

  // Has team state
  const currentTeam = team;
  if (!currentTeam) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading team...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Team Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{currentTeam.name}</h1>
              <p className="text-gray-600 mt-1">
                {currentTeam.memberCount} members • Created {new Date(currentTeam.createdAt).toLocaleDateString()}
              </p>
              {currentTeam.ownerDisplayName && (
                <p className="text-sm text-gray-500 mt-1">
                  Owner: {currentTeam.ownerDisplayName}
                </p>
              )}
            </div>

            <div className="flex space-x-2">
              {isTeamOwner && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  Owner
                </span>
              )}
              {isTeamAdmin && !isTeamOwner && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Admin
                </span>
              )}
            </div>
          </div>

          {/* Team Settings Summary */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Min Players:</span> {currentTeam.minPlayers}
            </div>
            <div>
              <span className="font-medium">Min Duration:</span> {currentTeam.minDurationMinutes}m
            </div>
            <div>
              <span className="font-medium">Timezone:</span> {currentTeam.timezone}
            </div>
            <div>
              <span className="font-medium">Reminders:</span> {currentTeam.reminderHours.join(', ')}:00
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={handleLeaveTeam}
              disabled={leaveTeamMutation.isPending}
              className="px-4 py-2 border border-red-300 text-red-700 rounded hover:bg-red-50 disabled:opacity-50"
            >
              {leaveTeamMutation.isPending ? 'Leaving...' : 'Leave Team'}
            </button>
          </div>
        </div>

        {/* Team Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Invite Management (Admin only) */}
          {isTeamAdmin && (
            <TeamInviteManager teamId={currentTeam.id} />
          )}

          {/* Team Members */}
          <TeamMemberList teamId={currentTeam.id} />
        </div>
      </div>
    </div>
  );
};