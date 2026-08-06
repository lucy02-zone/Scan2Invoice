import { Routes, Route, Navigate } from 'react-router-dom';

import { Layout } from './layouts/Layout.jsx';
import { ProtectedRoute } from './routes/ProtectedRoute.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { InvoicesPage } from './pages/InvoicesPage.jsx';
import { InvoiceHistoryPage } from './pages/InvoiceHistoryPage.jsx';
import { AnalyticsPage } from './pages/AnalyticsPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { SettingsPage } from './pages/SettingsPage.jsx';
import { LoginPage } from './pages/auth/LoginPage.jsx';
import { RegisterPage } from './pages/auth/RegisterPage.jsx';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';
import { ROUTES } from './utils/constants.js';

export default function App() {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<DashboardPage />} />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="history" element={<InvoiceHistoryPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />
      </Route>
      <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
    </Routes>
  );
}
