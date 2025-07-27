import React from 'react';
import { dateUtils } from '@/lib/dateUtils';

interface WeekNavigationProps {
  currentWeek: { start: Date; end: Date };
  onWeekChange: (direction: 'prev' | 'next') => void;
  isCurrentWeek: boolean;
  onGoToCurrentWeek: () => void;
}

export const WeekNavigation: React.FC<WeekNavigationProps> = ({
  currentWeek,
  onWeekChange,
  isCurrentWeek,
  onGoToCurrentWeek,
}) => {
  return (
    <div className="flex items-center justify-between">
      <button
        onClick={() => onWeekChange('prev')}
        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        ← Previous
      </button>

      <div className="text-center">
        <div className="font-semibold text-lg">
          {dateUtils.formatForDisplay(currentWeek.start, 'MMM d')} - {dateUtils.formatForDisplay(currentWeek.end, 'MMM d, yyyy')}
        </div>
        <div className="flex items-center gap-2 mt-1">
          {isCurrentWeek ? (
            <span className="text-sm text-blue-600 font-medium">Current Week</span>
          ) : (
            <button
              onClick={onGoToCurrentWeek}
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              Go to current week
            </button>
          )}
        </div>
      </div>

      <button
        onClick={() => onWeekChange('next')}
        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Next →
      </button>
    </div>
  );
};