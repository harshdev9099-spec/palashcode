import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import authService from '../services/authService';
import { toast } from 'react-toastify';

const EmailVerificationNoticePage = () => {
  const location = useLocation();
  const email = location.state?.email || '';
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleResendEmail = async () => {
    if (!email) {
      setError('Email address not found. Please try registering again.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await authService.resendVerificationEmail(email);

      if (response.success) {
        setSuccess(response.message);
        toast.success(response.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to resend verification email.');
      toast.error(err.message || 'Failed to resend email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
              <svg className="h-10 w-10 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-heading font-bold text-secondary-500">
              Verify Your Email
            </h2>
          </div>

          {success && <Alert type="success" message={success} />}
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}

          <div className="text-center text-gray-600 mb-6">
            <p className="mb-4">
              We've sent a verification email to:
            </p>
            <p className="font-semibold text-secondary-500 mb-4">
              {email || 'your email address'}
            </p>
            <p className="text-sm">
              Please check your inbox and click the verification link to activate your account.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleResendEmail}
              variant="primary"
              fullWidth
              loading={loading}
              disabled={loading || !email}
            >
              Resend Verification Email
            </Button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-primary-500 hover:text-primary-600 font-medium"
              >
                ← Back to login
              </Link>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">
              <strong>Didn't receive the email?</strong> Check your spam folder or click the button above to resend the verification email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationNoticePage;
