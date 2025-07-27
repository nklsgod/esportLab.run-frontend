import { apiClient } from './api';

export interface AvailabilityDto {
  id: number;
  memberId: number;
  memberDisplayName: string;
  memberAvatarUrl?: string;
  startsAt: string; // ISO 8601 format
  endsAt: string;   // ISO 8601 format
  available: boolean;
  note?: string;
  createdAt: string;
}

export interface CreateAvailabilityDto {
  startsAt: string; // ISO 8601 format in user timezone
  endsAt: string;   // ISO 8601 format in user timezone
  available: boolean;
  note?: string;
  timezone?: string; // defaults to "Europe/Berlin"
}

export interface TeamAvailabilityOverview {
  teamId: number;
  teamName?: string;
  fromDate: string;
  toDate: string;
  members: MemberAvailability[];
}

export interface MemberAvailability {
  memberId: number;
  displayName: string;
  avatarUrl?: string;
  availabilities: AvailabilityDto[];
  stats: AvailabilityStats;
}

export interface AvailabilityStats {
  totalAvailableMinutes: number;
  totalUnavailableMinutes: number;
  availableSlots: number;
  unavailableSlots: number;
  availabilityPercentage: number;
}

export const availabilityApi = {
  // Get team availability overview
  getTeamAvailability: async (
    teamId: number,
    from: Date,
    to: Date
  ): Promise<TeamAvailabilityOverview> => {
    const params = new URLSearchParams({
      from: from.toISOString(),
      to: to.toISOString(),
    });

    return apiClient.request(`/api/teams/${teamId}/availability?${params}`);
  },

  // Create availability
  createAvailability: async (data: CreateAvailabilityDto): Promise<AvailabilityDto> => {
    return apiClient.request('/api/availability', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update availability
  updateAvailability: async (id: number, data: CreateAvailabilityDto): Promise<AvailabilityDto> => {
    return apiClient.request(`/api/availability/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete availability
  deleteAvailability: async (id: number): Promise<void> => {
    return apiClient.request(`/api/availability/${id}`, {
      method: 'DELETE',
    });
  },
};