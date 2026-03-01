import { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Analytics from './pages/Analytics';
import SettingsPage from './pages/Settings';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AuthPage from './pages/AuthPage';

type View = 'dashboard' | 'inventory' | 'analytics' | 'settings';

const AppContent = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '100vh', background: 'hsl(var(--background))' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="animate-pulse" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'hsl(var(--primary))', margin: '0 auto 1rem' }}></div>
          <p style={{ color: 'hsl(var(--muted-foreground))' }}>Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <AuthPage />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{ display: 'flex', flex: 1, marginTop: '64px' }}>
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />

        <main style={{
          flex: 1,
          marginLeft: '292px',
          padding: '2rem',
          maxWidth: 'calc(100vw - 292px)',
          overflowX: 'hidden'
        }}>
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'inventory' && <Inventory />}
          {currentView === 'analytics' && <Analytics />}
          {currentView === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
};

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
