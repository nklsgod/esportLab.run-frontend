import { config } from '@/lib/config';

export function DebugPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Environment Debug</h1>
        
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
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