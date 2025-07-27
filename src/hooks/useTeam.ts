import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { 
  teamApi, 
  type CreateTeamDto, 
  type CreateTeamInviteDto, 
  type JoinTeamDto
} from '@/lib/teamApi';

export function useTeam(teamId?: number) {
  return useQuery({
    queryKey: ['team', teamId],
    queryFn: () => {
      if (!teamId) throw new Error('Team ID is required');
      return teamApi.getTeam(teamId);
    },
    enabled: !!teamId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useTeamInvites(teamId?: number) {
  return useQuery({
    queryKey: ['team-invites', teamId],
    queryFn: () => {
      if (!teamId) throw new Error('Team ID is required');
      return teamApi.getTeamInvites(teamId);
    },
    enabled: !!teamId,
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useTeamMembers(teamId?: number) {
  return useQuery({
    queryKey: ['team-members', teamId],
    queryFn: () => {
      if (!teamId) throw new Error('Team ID is required');
      return teamApi.getTeamMembers(teamId);
    },
    enabled: !!teamId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useCreateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTeamDto) => teamApi.createTeam(data),
    onSuccess: () => {
      // Invalidate user data to refresh team info
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['team'] });
    },
  });
}

export function useCreateTeamInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, data }: { teamId: number; data: CreateTeamInviteDto }) => 
      teamApi.createInvite(teamId, data),
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: ['team-invites', teamId] });
    },
  });
}

export function useDeactivateInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, inviteId }: { teamId: number; inviteId: number }) => 
      teamApi.deactivateInvite(teamId, inviteId),
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: ['team-invites', teamId] });
    },
  });
}

export function useJoinTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: JoinTeamDto) => teamApi.joinTeam(data),
    onSuccess: () => {
      // Invalidate user data to refresh team info
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['team'] });
    },
  });
}

export function useLeaveTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => teamApi.leaveTeam(),
    onSuccess: () => {
      // Invalidate user data and clear team-related queries
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.removeQueries({ queryKey: ['team'] });
      queryClient.removeQueries({ queryKey: ['team-invites'] });
      queryClient.removeQueries({ queryKey: ['team-members'] });
      queryClient.removeQueries({ queryKey: ['team-availability'] });
    },
  });
}