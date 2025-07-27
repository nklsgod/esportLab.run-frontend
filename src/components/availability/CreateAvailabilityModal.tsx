import React, { useState } from 'react';
import { dateUtils } from '@/lib/dateUtils';
import type { CreateAvailabilityDto, AvailabilityDto } from '@/lib/availabilityApi';

interface CreateAvailabilityModalProps {
  date: Date;
  existingAvailability?: AvailabilityDto;
  onClose: () => void;
  onSubmit: (data: CreateAvailabilityDto) => Promise<void>;
}

export const CreateAvailabilityModal: React.FC<CreateAvailabilityModalProps> = ({
  date,
  existingAvailability,
  onClose,
  onSubmit,
}) => {
  const isEditing = !!existingAvailability;
  
  const [formData, setFormData] = useState({
    startTime: existingAvailability 
      ? dateUtils.formatTimeForInput(existingAvailability.startsAt)
      : '09:00',
    endTime: existingAvailability 
      ? dateUtils.formatTimeForInput(existingAvailability.endsAt)
      : '17:00',
    available: existingAvailability?.available ?? true,
    note: existingAvailability?.note ?? '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const startDateTime = dateUtils.createDateTime(date, formData.startTime);
      const endDateTime = dateUtils.createDateTime(date, formData.endTime);

      if (startDateTime >= endDateTime) {
        setError('End time must be after start time');
        return;
      }

      await onSubmit({
        startsAt: dateUtils.toAPIFormat(startDateTime),
        endsAt: dateUtils.toAPIFormat(endDateTime),
        available: formData.available,
        note: formData.note || undefined,
        timezone: 'Europe/Berlin',
      });

      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save availability');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">
          {isEditing ? 'Edit Availability' : 'Add Availability'} for {dateUtils.formatForDisplay(date, 'PPP')}
        </h3>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Start Time</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">End Time</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Availability</label>
            <select
              value={formData.available.toString()}
              onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.value === 'true' }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Note (optional)</label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
              placeholder="Add a note about your availability..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={500}
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.note.length}/500 characters
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};