import React from 'react';
import { useTeamMembers } from '@/hooks/useTeam';

interface TeamMemberListProps {
  teamId: number;
}

export const TeamMemberList: React.FC<TeamMemberListProps> = ({ teamId }) => {
  const { data: members = [], isLoading } = useTeamMembers(teamId);

  const getRoleDisplay = (roles: string) => {
    const roleList = roles.split(',').map(r => r.trim());
    if (roleList.includes('OWNER')) return 'Owner';
    if (roleList.includes('ADMIN')) return 'Admin';
    return 'Player';
  };

  const getRoleColor = (roles: string) => {
    const roleList = roles.split(',').map(r => r.trim());
    if (roleList.includes('OWNER')) return 'bg-yellow-100 text-yellow-800';
    if (roleList.includes('ADMIN')) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Team Members</h3>
        <div className="text-center py-4">Loading members...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">
        Team Members ({members.length})
      </h3>

      <div className="space-y-3">
        {members.map(member => (
          <div key={member.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded">
            {member.avatarUrl ? (
              <img 
                src={member.avatarUrl} 
                alt={member.displayName}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-medium">
                  {member.displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            <div className="flex-1">
              <div className="font-medium">{member.displayName}</div>
              <div className="text-sm text-gray-500">
                Joined {new Date(member.createdAt).toLocaleDateString()}
              </div>
            </div>

            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.roles)}`}>
              {getRoleDisplay(member.roles)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};