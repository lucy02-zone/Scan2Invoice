import { Routes, Route, Navigate } from 'react-router-dom';

import { Layout } from './layouts/Layout.jsx';
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

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="history" element={<InvoiceHistoryPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
      <Route path="/404" element={<NotFoundPage />} />
    </Routes>
  );
}
