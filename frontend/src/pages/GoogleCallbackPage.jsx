import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const GoogleCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState('');
  const isProcessingRef = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      // Prevent multiple executions
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      const token = searchParams.get('token');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        setError('Google authentication failed. Please try again.');
        toast.error('Google authentication failed');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      if (!token) {
        setError('No authentication token received.');
        toast.error('Authentication failed');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      try {
        await loginWithGoogle(token);
        toast.success('Successfully logged in with Google!');
        navigate('/dashboard', { replace: true });
      } catch (err) {
        setError(err.message || 'Failed to complete Google login');
        toast.error('Failed to complete Google login');
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    handleCallback();
  }, [searchParams, loginWithGoogle, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full text-center">
        {error ? (
          <>
            <div className="inline-flex h-16 w-16 rounded-full bg-red-100 items-center justify-center mb-4">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Failed</h2>
            <p className="text-gray-600">{error}</p>
            <p className="text-sm text-gray-500 mt-4">Redirecting to login...</p>
          </>
        ) : (
          <>
            <div className="inline-flex h-16 w-16 rounded-full bg-gradient-to-br from-secondary-400 to-accent-500 items-center justify-center mb-4">
              <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Completing Sign In...</h2>
            <p className="text-gray-600">Please wait while we log you in with Google.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleCallbackPage;
