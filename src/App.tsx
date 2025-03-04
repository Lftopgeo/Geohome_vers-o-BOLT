import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/Layout/MainLayout';
import { LoginPage } from './pages/LoginPage';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { NewInspectionPage } from './pages/NewInspectionPage';
import { InspectionAreasPage } from './pages/InspectionAreasPage';
import { InternalRoomsPage } from './pages/InternalRoomsPage';
import { ExternalInspectionPage } from './pages/ExternalInspectionPage';
import { KeysAndMetersPage } from './pages/KeysAndMetersPage';
import { ReportPage } from './pages/ReportPage';

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="nova-vistoria" element={<NewInspectionPage />} />
          <Route path="areas-vistoria/:id" element={<InspectionAreasPage />} />
          <Route path="ambiente-interno/:id" element={<InternalRoomsPage />} />
          <Route path="ambiente-externo/:id" element={<ExternalInspectionPage />} />
          <Route path="chaves-medidores/:id" element={<KeysAndMetersPage />} />
          <Route path="relatorio/:id" element={<ReportPage />} />
        </Route>
      </Routes>
    </Router>
  );
}