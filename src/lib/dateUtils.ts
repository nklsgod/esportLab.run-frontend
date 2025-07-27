import { format, parseISO, startOfWeek, endOfWeek, addDays, isSameDay } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

export const USER_TIMEZONE = 'Europe/Berlin';

export const dateUtils = {
  // Convert local date to UTC for API
  toUTC: (date: Date, timezone: string = USER_TIMEZONE): Date => {
    return fromZonedTime(date, timezone);
  },

  // Convert UTC date from API to local timezone
  fromUTC: (utcDate: string | Date, timezone: string = USER_TIMEZONE): Date => {
    const date = typeof utcDate === 'string' ? parseISO(utcDate) : utcDate;
    return toZonedTime(date, timezone);
  },

  // Format date for API (ISO string)
  toAPIFormat: (date: Date, timezone: string = USER_TIMEZONE): string => {
    return fromZonedTime(date, timezone).toISOString();
  },

  // Format date for display
  formatForDisplay: (date: Date | string, formatStr: string = 'PPP p'): string => {
    const localDate = typeof date === 'string' ? dateUtils.fromUTC(date) : date;
    return format(localDate, formatStr);
  },

  // Get current week boundaries
  getCurrentWeek: (): { start: Date; end: Date } => {
    const now = new Date();
    return {
      start: startOfWeek(now, { weekStartsOn: 1 }), // Monday
      end: endOfWeek(now, { weekStartsOn: 1 }), // Sunday
    };
  },

  // Generate week days for calendar view
  getWeekDays: (startDate: Date): Date[] => {
    return Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  },

  // Check if two dates are the same day
  isSameDay,

  // Format time for time inputs (HH:MM)
  formatTimeForInput: (date: Date | string): string => {
    const localDate = typeof date === 'string' ? dateUtils.fromUTC(date) : date;
    return format(localDate, 'HH:mm');
  },

  // Create date from date and time string
  createDateTime: (date: Date, timeString: string): Date => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const result = new Date(date);
    result.setHours(hours, minutes, 0, 0);
    return result;
  },

  // Get duration in hours between two dates
  getDurationHours: (start: Date | string, end: Date | string): number => {
    const startDate = typeof start === 'string' ? dateUtils.fromUTC(start) : start;
    const endDate = typeof end === 'string' ? dateUtils.fromUTC(end) : end;
    return Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60) * 10) / 10;
  },
};