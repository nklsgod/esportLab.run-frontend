import React, { useState } from 'react';
import { useAvailability } from '@/hooks/useAvailability';
import { useAuth } from '@/hooks/useAuth';
import { dateUtils } from '@/lib/dateUtils';
import { AvailabilitySlot } from './AvailabilitySlot';
import { CreateAvailabilityModal } from './CreateAvailabilityModal';
import { WeekNavigation } from './WeekNavigation';
import type { AvailabilityDto, CreateAvailabilityDto } from '@/lib/availabilityApi';

export const AvailabilityCalendar: React.FC = () => {
  const { user } = useAuth();
  const teamId = user?.teamIds?.[0] ? parseInt(user.teamIds[0]) : undefined;
  
  const {
    selectedWeek,
    navigateWeek,
    goToCurrentWeek,
    isCurrentWeek,
    weekDays,
    data: overview,
    isLoading,
    error,
    createAvailability,
    updateAvailability,
    deleteAvailability,
    isCreating,
    isUpdating,
    isDeleting,
  } = useAvailability(teamId);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingAvailability, setEditingAvailability] = useState<AvailabilityDto | undefined>(undefined);

  const currentMember = overview?.members.find(m => m.memberId.toString() === user?.id);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setEditingAvailability(undefined);
    setShowCreateModal(true);
  };

  const handleEditAvailability = (availability: AvailabilityDto) => {
    setSelectedDate(dateUtils.fromUTC(availability.startsAt));
    setEditingAvailability(availability);
    setShowCreateModal(true);
  };

  const handleDeleteAvailability = async (id: number) => {
    try {
      await deleteAvailability(id);
    } catch (_err) {
      alert('Failed to delete availability. Please try again.');
    }
  };

  const handleSubmitAvailability = async (data: CreateAvailabilityDto) => {
    if (editingAvailability) {
      await updateAvailability({ id: editingAvailability.id, data });
    } else {
      await createAvailability(data);
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setSelectedDate(null);
    setEditingAvailability(undefined);
  };

  if (!user) {
    return <div className="text-center p-8">Please log in to view availability.</div>;
  }

  if (!teamId) {
    return <div className="text-center p-8">You need to be part of a team to use availability features.</div>;
  }

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading availability...</div>;
  }

  if (error) {
    return <div className="text-red-600 p-4 text-center">Error: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Availability</h1>
        <p className="text-gray-600">
          Manage your availability and see when your team is available to play
        </p>
      </div>

      {/* Week Navigation */}
      <WeekNavigation 
        currentWeek={selectedWeek}
        onWeekChange={navigateWeek}
        isCurrentWeek={isCurrentWeek()}
        onGoToCurrentWeek={goToCurrentWeek}
      />

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-8 gap-0">
          {/* Header Row */}
          <div className="p-4 font-semibold bg-gray-50 border-b border-r border-gray-200">
            Member
          </div>
          {weekDays.map(day => (
            <div key={day.toISOString()} className="p-4 font-semibold text-center bg-gray-50 border-b border-r border-gray-200 last:border-r-0">
              <div className="text-sm">{dateUtils.formatForDisplay(day, 'EEE')}</div>
              <div className="text-xs text-gray-500 mt-1">
                {dateUtils.formatForDisplay(day, 'MMM d')}
              </div>
            </div>
          ))}

          {/* Member Rows */}
          {overview?.members.map((member) => (
            <React.Fragment key={member.memberId}>
              {/* Member Name */}
              <div className="p-4 flex items-center space-x-3 border-b border-r border-gray-200 bg-gray-50">
                {member.avatarUrl && (
                  <img 
                    src={member.avatarUrl} 
                    alt={member.displayName}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div>
                  <div className="font-medium text-sm">{member.displayName}</div>
                  {member.memberId.toString() === user?.id && (
                    <div className="text-xs text-blue-600">You</div>
                  )}
                </div>
              </div>

              {/* Availability Slots */}
              {weekDays.map(day => {
                const dayAvailabilities = member.availabilities.filter(availability =>
                  dateUtils.isSameDay(dateUtils.fromUTC(availability.startsAt), day)
                );

                const isCurrentUser = member.memberId.toString() === user?.id;

                return (
                  <div 
                    key={`${member.memberId}-${day.toISOString()}`}
                    className={`min-h-[120px] p-3 border-b border-r border-gray-200 last:border-r-0 space-y-2 ${
                      isCurrentUser ? 'bg-blue-50/50 cursor-pointer hover:bg-blue-50' : 'bg-white'
                    }`}
                    onClick={() => isCurrentUser && dayAvailabilities.length === 0 && handleDateClick(day)}
                  >
                    {dayAvailabilities.map(availability => (
                      <AvailabilitySlot 
                        key={availability.id}
                        availability={availability}
                        canEdit={isCurrentUser}
                        onEdit={handleEditAvailability}
                        onDelete={handleDeleteAvailability}
                      />
                    ))}

                    {isCurrentUser && dayAvailabilities.length === 0 && (
                      <div className="text-gray-400 text-sm text-center py-8 hover:text-blue-600 transition-colors">
                        + Add availability
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      {currentMember && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
          <h3 className="font-semibold mb-4 text-gray-900">Your Availability Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{currentMember.stats.availableSlots}</div>
              <div className="text-sm text-gray-600">Available Slots</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{currentMember.stats.unavailableSlots}</div>
              <div className="text-sm text-gray-600">Unavailable Slots</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(currentMember.stats.totalAvailableMinutes / 60 * 10) / 10}h
              </div>
              <div className="text-sm text-gray-600">Hours Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {currentMember.stats.availabilityPercentage.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Availability Rate</div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {(isCreating || isUpdating || isDeleting) && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <div className="text-sm text-gray-600">
                {isCreating && 'Creating availability...'}
                {isUpdating && 'Updating availability...'}
                {isDeleting && 'Deleting availability...'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && selectedDate && (
        <CreateAvailabilityModal
          date={selectedDate}
          existingAvailability={editingAvailability}
          onClose={handleCloseModal}
          onSubmit={handleSubmitAvailability}
        />
      )}
    </div>
  );
};