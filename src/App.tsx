import { NavLink, Route, Routes } from 'react-router-dom';
import { AppStoreProvider } from './state/store';
import LandingPage from './pages/LandingPage';
import PortfoliosPage from './pages/PortfoliosPage';
import PortfolioDetailPage from './pages/PortfolioDetailPage';
import InitiativeFormPage from './pages/InitiativeFormPage';
import NeedsAttentionPage from './pages/NeedsAttentionPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <AppStoreProvider>
      <div className="app-shell">
        <nav className="app-nav">
          <span className="app-nav-title">Benchmark Gap Tracker</span>
          <NavLink to="/" end>
            Overview
          </NavLink>
          <NavLink to="/portfolios">Portfolios</NavLink>
          <NavLink to="/needs-attention">Needs Attention</NavLink>
          <NavLink to="/settings">Settings</NavLink>
        </nav>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/portfolios" element={<PortfoliosPage />} />
            <Route path="/portfolios/:id" element={<PortfolioDetailPage />} />
            <Route path="/initiatives/new" element={<InitiativeFormPage />} />
            <Route path="/initiatives/:id/edit" element={<InitiativeFormPage />} />
            <Route path="/needs-attention" element={<NeedsAttentionPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </AppStoreProvider>
  );
}

export default App;

