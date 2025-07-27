import { config } from '@/lib/config';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export function DebugPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [testResults, setTestResults] = useState<any>({});

  const testAuthStatus = async () => {
    try {
      console.log('Testing auth status...');
      const result = await apiClient.checkAuthStatus();
      setTestResults(prev => ({ ...prev, authStatus: result }));
    } catch (error) {
      console.error('Auth status error:', error);
      setTestResults(prev => ({ ...prev, authStatus: { error: error.message } }));
    }
  };

  const testDirectFetch = async () => {
    try {
      console.log('Testing direct fetch with credentials...');
      const response = await fetch(`${config.API_BASE_URL}/auth/status`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      setTestResults(prev => ({ 
        ...prev, 
        directFetch: { 
          status: response.status, 
          data,
          headers: Object.fromEntries(response.headers.entries())
        } 
      }));
    } catch (error) {
      console.error('Direct fetch error:', error);
      setTestResults(prev => ({ ...prev, directFetch: { error: error.message } }));
    }
  };

  const testMe = async () => {
    try {
      console.log('Testing /api/me...');
      const result = await apiClient.getMe();
      setTestResults(prev => ({ ...prev, me: result }));
    } catch (error) {
      console.error('Me error:', error);
      setTestResults(prev => ({ ...prev, me: { error: error.message } }));
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Environment Debug</h1>
        
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Current Auth State</h2>
            <pre className="bg-muted p-4 rounded text-sm overflow-auto">
              {JSON.stringify({
                isAuthenticated,
                isLoading,
                user: user ? { id: user.id, displayName: user.displayName } : null,
                cookies: document.cookie,
                currentDomain: window.location.hostname,
                currentOrigin: window.location.origin,
              }, null, 2)}
            </pre>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Test API Calls</h2>
            <div className="space-y-2">
              <button 
                onClick={testAuthStatus}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mr-2"
              >
                Test Auth Status (ApiClient)
              </button>
              <button 
                onClick={testDirectFetch}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mr-2"
              >
                Test Direct Fetch
              </button>
              <button 
                onClick={testMe}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded mr-2"
              >
                Test /api/me
              </button>
            </div>
            {Object.keys(testResults).length > 0 && (
              <pre className="bg-muted p-4 rounded text-sm overflow-auto mt-4">
                {JSON.stringify(testResults, null, 2)}
              </pre>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Configuration</h2>
            <pre className="bg-muted p-4 rounded text-sm overflow-auto">
              {JSON.stringify({
                API_BASE_URL: config.API_BASE_URL,
                ENABLE_HEATMAP: config.ENABLE_HEATMAP,
                DEFAULT_TIMEZONE: config.DEFAULT_TIMEZONE,
              }, null, 2)}
            </pre>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2">Environment Variables</h2>
            <pre className="bg-muted p-4 rounded text-sm overflow-auto">
              {JSON.stringify({
                NODE_ENV: import.meta.env.NODE_ENV,
                MODE: import.meta.env.MODE,
                DEV: import.meta.env.DEV,
                PROD: import.meta.env.PROD,
                VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
                VITE_ENABLE_HEATMAP: import.meta.env.VITE_ENABLE_HEATMAP,
                VITE_DEFAULT_TIMEZONE: import.meta.env.VITE_DEFAULT_TIMEZONE,
              }, null, 2)}
            </pre>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2">Test Endpoints</h2>
            <div className="space-y-2">
              <a 
                href={`${config.API_BASE_URL}/auth/status`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                {config.API_BASE_URL}/auth/status
              </a>
              <a 
                href={`${config.API_BASE_URL}/api/me`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                {config.API_BASE_URL}/api/me
              </a>
              <a 
                href={`${config.API_BASE_URL}/oauth2/authorization/discord`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                {config.API_BASE_URL}/oauth2/authorization/discord (OAuth2)
              </a>
              <a 
                href={`${config.API_BASE_URL}/auth/discord/login`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                {config.API_BASE_URL}/auth/discord/login (Alternative)
              </a>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2">Current URL</h2>
            <p className="text-sm text-muted-foreground break-all">
              {window.location.href}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}