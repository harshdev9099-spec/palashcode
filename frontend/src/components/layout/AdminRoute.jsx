import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">403</h1>
          <p className="text-xl text-gray-600 mb-4">Access Denied</p>
          <p className="text-gray-500 mb-6">You don't have permission to access this page.</p>
          <a
            href="/"
            className="inline-block bg-gradient-to-r from-secondary-500 to-accent-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-secondary-600 hover:to-accent-600 transition-all"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default AdminRoute;
