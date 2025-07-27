import { useAuth } from '@/hooks/useAuth';

export function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Willkommen, {user?.displayName}
              </span>
              <button
                onClick={logout}
                className="text-sm bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3 py-1 rounded-md"
              >
                Abmelden
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Wochenübersicht
          </h2>
          <p className="text-muted-foreground">
            Hier wird später der Kalender für die Verfügbarkeiten angezeigt.
          </p>
        </div>
      </main>
    </div>
  );
}