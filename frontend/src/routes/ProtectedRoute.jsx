import { Navigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext.jsx';
import { ROUTES } from '../utils/constants.js';

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
}
