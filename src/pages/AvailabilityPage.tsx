import React from 'react';
import { Navigation } from '@/components/Navigation';
import { AvailabilityCalendar } from '@/components/availability/AvailabilityCalendar';

export const AvailabilityPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <AvailabilityCalendar />
      </div>
    </div>
  );
};