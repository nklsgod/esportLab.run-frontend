import { apiClient } from './api';

export interface TeamDto {
  id: number;
  name: string;
  discordGuildId?: string;
  reminderChannelId?: string;
  timezone: string;
  minPlayers: number;
  minDurationMinutes: number;
  reminderHours: number[];
  createdAt: string;
  memberCount: number;
  ownerDisplayName?: string;
  isCurrentUserOwner: boolean;
  isCurrentUserAdmin: boolean;
}

export interface CreateTeamDto {
  name: string;
  discordGuildId?: string;
  reminderChannelId?: string;
  timezone?: string;
  minPlayers?: number;
  minDurationMinutes?: number;
  reminderHours?: number[];
}

export interface TeamInviteDto {
  id: number;
  inviteCode: string;
  teamId: number;
  teamName: string;
  createdByDisplayName: string;
  expiresAt: string;
  maxUses?: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
  isExpired: boolean;
  isValid: boolean;
  remainingUses: number;
}

export interface CreateTeamInviteDto {
  expiresAt?: string;
  maxUses?: number;
}

export interface JoinTeamDto {
  inviteCode: string;
}

export interface TeamMemberDto {
  id: number;
  displayName: string;
  avatarUrl?: string;
  roles: string;
  createdAt: string;
}

// Updated UserProfile to include team info
export interface UserProfileDto {
  id: number;
  discordUserId: string;
  displayName: string;
  avatarUrl?: string;
  tz: string;
  roles: string;
  teamIds: number[];
  team?: TeamDto;
  hasTeam: boolean;
  isTeamOwner: boolean;
  isTeamAdmin: boolean;
}

export const teamApi = {
  // Create a new team
  createTeam: async (data: CreateTeamDto): Promise<TeamDto> => {
    return apiClient.request('/api/teams', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get team information
  getTeam: async (teamId: number): Promise<TeamDto> => {
    return apiClient.request(`/api/teams/${teamId}`);
  },

  // Create team invite
  createInvite: async (teamId: number, data: CreateTeamInviteDto): Promise<TeamInviteDto> => {
    return apiClient.request(`/api/teams/${teamId}/invites`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get team invites
  getTeamInvites: async (teamId: number): Promise<TeamInviteDto[]> => {
    return apiClient.request(`/api/teams/${teamId}/invites`);
  },

  // Deactivate invite
  deactivateInvite: async (teamId: number, inviteId: number): Promise<void> => {
    return apiClient.request(`/api/teams/${teamId}/invites/${inviteId}`, {
      method: 'DELETE',
    });
  },

  // Join team with invite code
  joinTeam: async (data: JoinTeamDto): Promise<TeamDto> => {
    return apiClient.request('/api/teams/join', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Leave current team
  leaveTeam: async (): Promise<void> => {
    return apiClient.request('/api/teams/leave', {
      method: 'POST',
    });
  },

  // Get team members
  getTeamMembers: async (teamId: number): Promise<TeamMemberDto[]> => {
    return apiClient.request(`/api/teams/${teamId}/members`);
  },

  // Get current user profile (updated)
  getCurrentUser: async (): Promise<UserProfileDto> => {
    return apiClient.request('/api/me');
  },
};