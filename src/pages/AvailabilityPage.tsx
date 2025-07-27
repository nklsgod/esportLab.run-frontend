import React from 'react';
import { AvailabilityCalendar } from '@/components/availability/AvailabilityCalendar';

export const AvailabilityPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <AvailabilityCalendar />
    </div>
  );
};