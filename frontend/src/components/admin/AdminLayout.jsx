import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
    { name: 'Users', href: '/admin/users', icon: '👥' },
    { name: 'Contacts', href: '/admin/contacts', icon: '📧' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="bg-white shadow-lg border-b-2 border-primary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/admin/dashboard" className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-secondary-400 to-accent-500 flex items-center justify-center">
                  <span className="text-xl">🍂</span>
                </div>
                <div>
                  <span className="text-xl font-bold text-gray-800">Admin Panel</span>
                  <p className="text-xs text-gray-500">Palash Academy</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium"
              >
                View Site
              </Link>
              <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-secondary-400 to-accent-500 flex items-center justify-center text-white font-semibold text-sm">
                  {user?.first_name?.charAt(0)?.toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.full_name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gradient-to-r from-secondary-500 to-accent-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
