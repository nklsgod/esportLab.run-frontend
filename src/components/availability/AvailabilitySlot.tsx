import React, { useState } from 'react';
import type { AvailabilityDto } from '@/lib/availabilityApi';
import { dateUtils } from '@/lib/dateUtils';

interface AvailabilitySlotProps {
  availability: AvailabilityDto;
  canEdit: boolean;
  onEdit?: (availability: AvailabilityDto) => void;
  onDelete?: (id: number) => void;
}

export const AvailabilitySlot: React.FC<AvailabilitySlotProps> = ({ 
  availability, 
  canEdit,
  onEdit,
  onDelete,
}) => {
  const [showActions, setShowActions] = useState(false);

  const startTime = dateUtils.fromUTC(availability.startsAt);
  const endTime = dateUtils.fromUTC(availability.endsAt);
  const duration = dateUtils.getDurationHours(availability.startsAt, availability.endsAt);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this availability?')) {
      onDelete?.(availability.id);
    }
  };

  const handleEdit = () => {
    onEdit?.(availability);
  };

  const slotColor = availability.available
    ? 'bg-green-100 border-green-300 text-green-800'
    : 'bg-red-100 border-red-300 text-red-800';

  return (
    <div 
      className={`p-2 rounded-lg border-2 ${slotColor} ${canEdit ? 'cursor-pointer' : ''} transition-all`}
      onMouseEnter={() => canEdit && setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="text-xs font-semibold">
            {dateUtils.formatForDisplay(startTime, 'HH:mm')} - {dateUtils.formatForDisplay(endTime, 'HH:mm')}
          </div>
          <div className="text-xs mt-0.5">
            {duration}h • {availability.available ? 'Available' : 'Unavailable'}
          </div>
          {availability.note && (
            <div className="text-xs mt-1 opacity-75 line-clamp-2">
              {availability.note}
            </div>
          )}
        </div>

        {canEdit && showActions && (
          <div className="flex space-x-1 ml-2">
            <button
              onClick={handleEdit}
              className="text-blue-600 hover:text-blue-800 text-xs p-1 rounded hover:bg-white/50 transition-colors"
              title="Edit"
            >
              ✏️
            </button>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800 text-xs p-1 rounded hover:bg-white/50 transition-colors"
              title="Delete"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
};