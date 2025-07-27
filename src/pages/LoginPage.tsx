import { config } from '@/lib/config';

export function LoginPage() {
  const handleDiscordLogin = () => {
    const loginUrl = `${config.API_BASE_URL}/oauth2/authorization/discord`;
    console.log('Redirecting to:', loginUrl);
    
    // Direct redirect to Discord OAuth2 endpoint
    window.location.href = loginUrl;
  };

  const handleAlternativeLogin = () => {
    // Direct navigation to Discord OAuth login endpoint
    window.location.href = `${config.API_BASE_URL}/auth/discord/login`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-foreground">
            Esports Planner
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Melde dich mit Discord an, um fortzufahren
          </p>
        </div>
        <div>
          <div className="space-y-3">
            <button
              onClick={handleDiscordLogin}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Mit Discord anmelden (Direct)
            </button>
            
            <button
              onClick={handleAlternativeLogin}
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Mit Discord anmelden (Alternative)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}