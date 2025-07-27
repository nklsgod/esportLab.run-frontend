// Test file to verify team management features
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryProvider } from '@tanstack/react-query';
import { TeamDashboard } from '@/components/team/TeamDashboard';

// Mock the auth hook
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      id: '1',
      displayName: 'Test User',
      teamIds: [],
      hasTeam: false,
      isTeamOwner: false,
      isTeamAdmin: false,
    },
  }),
}));

// Mock the team hooks
jest.mock('@/hooks/useTeam', () => ({
  useTeam: () => ({ data: null }),
  useLeaveTeam: () => ({ mutateAsync: jest.fn() }),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <QueryProvider client={queryClient}>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </QueryProvider>
);

describe('Team Management Features', () => {
  test('shows team creation options when user has no team', () => {
    render(
      <TestWrapper>
        <TeamDashboard />
      </TestWrapper>
    );

    expect(screen.getByText('Welcome to EsportLab!')).toBeInTheDocument();
    expect(screen.getByText('Create New Team')).toBeInTheDocument();
    expect(screen.getByText('Join Existing Team')).toBeInTheDocument();
  });
});

console.log('Team management features test file created successfully!');