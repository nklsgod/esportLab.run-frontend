import { config } from '@/lib/config';

export function LoginPage() {
  const handleDiscordLogin = () => {
    window.location.href = `${config.API_BASE_URL}/oauth2/authorization/discord`;
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
          <button
            onClick={handleDiscordLogin}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Mit Discord anmelden
          </button>
        </div>
      </div>
    </div>
  );
}