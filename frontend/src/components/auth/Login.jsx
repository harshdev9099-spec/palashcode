import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import InputField from '../common/InputField';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { toast } from 'react-toastify';
import authService from '../../services/authService';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const initialValues = {
    email: '',
    password: '',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');

      const response = await login(values);

      if (response.success) {
        toast.success(response.message);
        // Redirect to the page they were trying to access or dashboard
        navigate(from, { replace: true });
      }
    } catch (err) {
      if (err.requires_verification) {
        // Email not verified
        setError(err.message);
        toast.error(err.message);
        setTimeout(() => {
          navigate('/email/verification-notice', { state: { email: values.email } });
        }, 2000);
      } else {
        setError(err.message || 'Login failed. Please check your credentials.');
        toast.error(err.message || 'Login failed');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white shadow-2xl rounded-2xl p-8 border-t-4 border-secondary-500">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 rounded-full bg-gradient-to-br from-secondary-400 to-accent-500 items-center justify-center shadow-lg mb-4">
            <span className="text-3xl">🍂</span>
          </div>
          <h2 className="text-3xl font-heading font-bold bg-gradient-to-r from-secondary-600 to-accent-600 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h2>
          <p className="text-earth-600">
            Sign in to your Palash Academy account
          </p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={() => window.location.href = authService.getGoogleAuthUrl()}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors duration-200 mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="text-gray-700 font-medium">Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or sign in with email</span>
          </div>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              <InputField
                label="Email Address"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
                touched={touched.email}
                placeholder="john@example.com"
                required
              />

              <InputField
                label="Password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.password}
                touched={touched.password}
                placeholder="••••••••"
                required
              />

              <div className="flex items-center justify-between mb-6">
                <Link
                  to="/forgot-password"
                  className="text-sm text-secondary-600 hover:text-accent-600 font-medium transition-colors duration-200"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={isSubmitting}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-secondary-500 to-accent-500 hover:from-secondary-600 hover:to-accent-600 text-white"
              >
                Sign In
              </Button>
            </Form>
          )}
        </Formik>

        <div className="mt-6 text-center">
          <p className="text-sm text-earth-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-secondary-600 hover:text-accent-600 font-semibold transition-colors duration-200">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
