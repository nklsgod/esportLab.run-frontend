import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { availabilityApi } from '@/lib/availabilityApi';
import type { CreateAvailabilityDto } from '@/lib/availabilityApi';
import { dateUtils } from '@/lib/dateUtils';
import { useState, useCallback } from 'react';

export function useTeamAvailability(teamId: number | undefined, week: { start: Date; end: Date }) {
  return useQuery({
    queryKey: ['team-availability', teamId, week.start.toISOString(), week.end.toISOString()],
    queryFn: () => {
      if (!teamId) throw new Error('Team ID is required');
      return availabilityApi.getTeamAvailability(teamId, week.start, week.end);
    },
    enabled: !!teamId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAvailabilityDto) => availabilityApi.createAvailability(data),
    onSuccess: () => {
      // Invalidate team availability queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['team-availability'] });
    },
  });
}

export function useUpdateAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateAvailabilityDto }) => 
      availabilityApi.updateAvailability(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-availability'] });
    },
  });
}

export function useDeleteAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => availabilityApi.deleteAvailability(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-availability'] });
    },
  });
}

export function useAvailabilityWeek(initialWeek?: { start: Date; end: Date }) {
  const [selectedWeek, setSelectedWeek] = useState(
    initialWeek || dateUtils.getCurrentWeek()
  );

  const navigateWeek = useCallback((direction: 'prev' | 'next') => {
    const days = direction === 'next' ? 7 : -7;
    const newStart = new Date(selectedWeek.start);
    newStart.setDate(newStart.getDate() + days);
    const newEnd = new Date(selectedWeek.end);
    newEnd.setDate(newEnd.getDate() + days);

    setSelectedWeek({ start: newStart, end: newEnd });
  }, [selectedWeek]);

  const goToCurrentWeek = useCallback(() => {
    setSelectedWeek(dateUtils.getCurrentWeek());
  }, []);

  const isCurrentWeek = useCallback(() => {
    const thisWeek = dateUtils.getCurrentWeek();
    return dateUtils.isSameDay(selectedWeek.start, thisWeek.start);
  }, [selectedWeek]);

  return {
    selectedWeek,
    setSelectedWeek,
    navigateWeek,
    goToCurrentWeek,
    isCurrentWeek,
  };
}

// Combined hook for ease of use
export function useAvailability(teamId: number | undefined) {
  const { selectedWeek, navigateWeek, goToCurrentWeek, isCurrentWeek } = useAvailabilityWeek();
  
  const teamAvailabilityQuery = useTeamAvailability(teamId, selectedWeek);
  const createMutation = useCreateAvailability();
  const updateMutation = useUpdateAvailability();
  const deleteMutation = useDeleteAvailability();

  const weekDays = dateUtils.getWeekDays(selectedWeek.start);

  return {
    // Week navigation
    selectedWeek,
    navigateWeek,
    goToCurrentWeek,
    isCurrentWeek,
    weekDays,

    // Data
    data: teamAvailabilityQuery.data,
    isLoading: teamAvailabilityQuery.isLoading,
    error: teamAvailabilityQuery.error,

    // Mutations
    createAvailability: createMutation.mutateAsync,
    updateAvailability: updateMutation.mutateAsync,
    deleteAvailability: deleteMutation.mutateAsync,
    
    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    
    // Errors
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  };
}