import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryProvider } from '@/providers/QueryProvider';
import { useAuth } from '@/hooks/useAuth';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { CallbackPage } from '@/pages/CallbackPage';
import { DebugPage } from '@/pages/DebugPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoading, isUnauthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Lade...</div>
      </div>
    );
  }

  if (isUnauthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} 
      />
      <Route 
        path="/api/me" 
        element={<CallbackPage />} 
      />
      <Route 
        path="/auth/callback" 
        element={<CallbackPage />} 
      />
      <Route 
        path="/debug" 
        element={<DebugPage />} 
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryProvider>
  );
}

export default App
