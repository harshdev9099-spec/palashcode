import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
// TODO: Add your logo file to frontend/src/assets/logo/palash-academy-logo.png
// import logo from '../../assets/logo/palash-academy-logo.png';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-primary-50 via-white to-golden-50 shadow-md border-b-2 border-primary-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              {/* Placeholder for logo - uncomment when you add the logo file */}
              {/* <img src={logo} alt="Palash Academy" className="h-12 w-auto transition-transform duration-300 group-hover:scale-105" /> */}

              {/* Temporary logo placeholder with autumn tree icon */}
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-secondary-400 to-accent-500 flex items-center justify-center shadow-lg">
                <span className="text-2xl">🍂</span>
              </div>

              <div className="flex flex-col">
                <span className="text-2xl font-heading font-bold bg-gradient-to-r from-accent-600 to-secondary-600 bg-clip-text text-transparent">
                  Palash Academy
                </span>
                <span className="text-xs text-earth-600 font-medium tracking-wide">
                  IELTS Excellence
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-primary-100 rounded-full">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-secondary-400 to-accent-500 flex items-center justify-center text-white font-semibold text-sm shadow">
                    {user?.first_name?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-earth-800">
                    {user?.first_name}
                  </span>
                </div>
                <Link
                  to="/dashboard"
                  className="text-earth-700 hover:text-secondary-600 hover:bg-primary-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  Dashboard
                </Link>
                <Link
                  to="/listening-tests"
                  className="text-earth-700 hover:text-secondary-600 hover:bg-primary-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  Listening Tests
                </Link>
                <Link
                  to="/my-attempts"
                  className="text-earth-700 hover:text-secondary-600 hover:bg-primary-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  My Attempts
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-secondary-500 to-accent-500 text-white hover:from-secondary-600 hover:to-accent-600 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-earth-700 hover:text-secondary-600 hover:bg-primary-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-secondary-500 to-accent-500 text-white hover:from-secondary-600 hover:to-accent-600 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
