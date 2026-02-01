import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/layout/PrivateRoute';
import AdminRoute from './components/layout/AdminRoute';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import EmailVerificationNoticePage from './pages/EmailVerificationNoticePage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import DashboardPage from './pages/DashboardPage';
import ContactPage from './pages/ContactPage';
import GoogleCallbackPage from './pages/GoogleCallbackPage';

// Admin Components & Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import UsersPage from './pages/admin/UsersPage';
import ContactsPage from './pages/admin/ContactsPage';
import ContactDetailPage from './pages/admin/ContactDetailPage';
import AdminListeningTestsPage from './pages/admin/ListeningTestsPage';
import ListeningTestCreatePage from './pages/admin/ListeningTestCreatePage';
import ListeningTestEditPage from './pages/admin/ListeningTestEditPage';
import ListeningTestResultsPage from './pages/admin/ListeningTestResultsPage';

// User Listening Pages
import ListeningTestsPage from './pages/ListeningTestsPage';
import ListeningTestTakePage from './pages/ListeningTestTakePage';
import ListeningResultPage from './pages/ListeningResultPage';
import MyAttemptsPage from './pages/MyAttemptsPage';

function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <div className="flex flex-col min-h-screen">
        {!isAdminRoute && <Header />}

        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/email/verification-notice" element={<EmailVerificationNoticePage />} />
            <Route path="/email/verify/:id/:hash" element={<VerifyEmailPage />} />
            <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/listening-tests" element={<ListeningTestsPage />} />
              <Route path="/listening-tests/:id" element={<ListeningTestTakePage />} />
              <Route path="/listening-tests/:id/result/:attemptId" element={<ListeningResultPage />} />
              <Route path="/my-attempts" element={<MyAttemptsPage />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="contacts" element={<ContactsPage />} />
                <Route path="contacts/:id" element={<ContactDetailPage />} />
                <Route path="listening-tests" element={<AdminListeningTestsPage />} />
                <Route path="listening-tests/create" element={<ListeningTestCreatePage />} />
                <Route path="listening-tests/:id/edit" element={<ListeningTestEditPage />} />
                <Route path="listening-tests/:id/results" element={<ListeningTestResultsPage />} />
              </Route>
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                  <p className="text-xl text-gray-600">Page not found</p>
                </div>
              </div>
            } />
          </Routes>
        </main>

        {!isAdminRoute && <Footer />}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;
