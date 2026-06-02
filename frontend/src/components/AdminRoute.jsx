import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminRoute({ children }) {
  const { loggedIn, user } = useAuth();
  const location = useLocation();

  if (!loggedIn) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/admin/login" state={{ from: location, reason: 'not-admin' }} replace />;
  }

  return children;
}

export default AdminRoute;
