import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import Alert from '../components/common/Alert';
import Button from '../components/common/Button';

const VerifyEmailPage = () => {
  const { id, hash } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await authService.verifyEmail(id, hash);

        if (response.success) {
          setStatus('success');
          setMessage(response.message);

          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      } catch (err) {
        setStatus('error');
        setMessage(err.message || 'Email verification failed. The link may be invalid or expired.');
      }
    };

    if (id && hash) {
      verifyEmail();
    } else {
      setStatus('error');
      setMessage('Invalid verification link.');
    }
  }, [id, hash, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="text-center mb-6">
            {status === 'verifying' && (
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                <svg className="animate-spin h-10 w-10 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}

            {status === 'success' && (
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg className="h-10 w-10 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}

            {status === 'error' && (
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <svg className="h-10 w-10 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}

            <h2 className="text-3xl font-heading font-bold text-secondary-500 mb-4">
              {status === 'verifying' && 'Verifying Email...'}
              {status === 'success' && 'Email Verified!'}
              {status === 'error' && 'Verification Failed'}
            </h2>
          </div>

          {status === 'verifying' && (
            <p className="text-center text-gray-600">
              Please wait while we verify your email address...
            </p>
          )}

          {status === 'success' && (
            <>
              <Alert type="success" message={message} />
              <p className="text-center text-gray-600 mt-4">
                Redirecting to login page...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <Alert type="error" message={message} />
              <div className="mt-6 space-y-3">
                <Link to="/email/verification-notice">
                  <Button variant="primary" fullWidth>
                    Resend Verification Email
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" fullWidth>
                    Register Again
                  </Button>
                </Link>
                <div className="text-center">
                  <Link to="/login" className="text-sm text-primary-500 hover:text-primary-600 font-medium">
                    ← Back to login
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
