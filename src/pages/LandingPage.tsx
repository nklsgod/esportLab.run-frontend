import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.png';

export function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <img src={logo} alt="EsportLab" className="w-8 h-8" />
              <h1 className="text-xl font-bold text-gray-900">EsportLab</h1>
            </div>
            <button
              onClick={handleGetStarted}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Anmelden
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Dein <span className="text-purple-600">Esports Team</span> perfekt organisiert
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            EsportLab hilft dir dabei, Trainings zu planen, Verfügbarkeiten zu verwalten und dein Team optimal zu koordinieren. Alles an einem Ort.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors shadow"
            >
              Kostenlos starten
            </button>
            <button className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg transition-colors bg-white">
              Demo ansehen
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Alles was dein Team braucht
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Von der Trainingsplanung bis zur Leistungsanalyse - EsportLab bietet alle Tools für erfolgreiche Esports Teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-8 shadow border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">📅</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Trainingsplanung</h4>
              <p className="text-gray-600">
                Plane Trainings, verwalte Verfügbarkeiten und koordiniere Termine mit deinem gesamten Team mühelos.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-8 shadow border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">👥</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Team Management</h4>
              <p className="text-gray-600">
                Verwalte Spieler, Rollen und Berechtigungen. Behalte den Überblick über dein gesamtes Team.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-8 shadow border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">📊</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Performance Analytics</h4>
              <p className="text-gray-600">
                Analysiere Trainingsdaten, verfolge Fortschritte und identifiziere Verbesserungsmöglichkeiten.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl p-8 shadow border border-gray-200">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">⏰</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Zeitmanagement</h4>
              <p className="text-gray-600">
                Optimiere Trainingszeiten basierend auf Verfügbarkeiten und maximiere die Produktivität deines Teams.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-xl p-8 shadow border border-gray-200">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">🏆</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Turnier Planung</h4>
              <p className="text-gray-600">
                Plane und organisiere Turniere, Scrimmages und Wettkämpfe mit anderen Teams effizient.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-xl p-8 shadow border border-gray-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">💬</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Kommunikation</h4>
              <p className="text-gray-600">
                Integrierte Discord-Anbindung für nahtlose Kommunikation und Benachrichtigungen für dein Team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              So einfach funktioniert's
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              In nur drei Schritten zu einem perfekt organisierten Esports Team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Mit Discord anmelden</h4>
              <p className="text-gray-600">
                Melde dich einfach mit deinem Discord-Account an. Keine komplizierte Registrierung nötig.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Team erstellen</h4>
              <p className="text-gray-600">
                Erstelle dein Team und lade deine Mitspieler ein. Jeder kann seine Verfügbarkeiten eintragen.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Trainings planen</h4>
              <p className="text-gray-600">
                Plane Trainings, analysiere Performance und führe dein Team zum Erfolg.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-white mb-4">
            Bereit für den nächsten Level?
          </h3>
          <p className="text-xl text-white mb-8 opacity-90">
            Starte noch heute und bringe dein Esports Team auf die nächste Stufe.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-white hover:bg-gray-100 text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg transition-colors shadow-lg"
          >
            Jetzt kostenlos starten
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src={logo} alt="EsportLab" className="w-8 h-8" />
                <h4 className="text-xl font-bold">EsportLab</h4>
              </div>
              <p className="text-gray-400">
                Die ultimative Plattform für professionelle Esports Team Organisation.
              </p>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Produkt</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Preise</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Hilfe Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kontakt</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Unternehmen</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Über uns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Karriere</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 EsportLab. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}