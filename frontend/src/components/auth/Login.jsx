import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import InputField from '../common/InputField';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { toast } from 'react-toastify';

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
