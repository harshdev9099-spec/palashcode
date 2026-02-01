import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import authService from '../../services/authService';
import InputField from '../common/InputField';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { toast } from 'react-toastify';

const validationSchema = Yup.object({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const initialValues = {
    password: '',
    password_confirmation: '',
  };

  if (!token) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <Alert type="error" message="Invalid or missing reset token. Please request a new password reset link." />
          <div className="mt-6 text-center">
            <Link to="/forgot-password" className="text-primary-500 hover:text-primary-600 font-medium">
              Request new reset link →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      setSuccess('');

      const response = await authService.resetPassword({
        ...values,
        token,
      });

      if (response.success) {
        setSuccess(response.message);
        toast.success(response.message);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.');
      toast.error(err.message || 'Failed to reset password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-heading font-bold text-center text-secondary-500 mb-6">
          Reset Password
        </h2>

        <p className="text-center text-gray-600 mb-6">
          Enter your new password below.
        </p>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} />}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              <InputField
                label="New Password"
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

              <InputField
                label="Confirm New Password"
                name="password_confirmation"
                type="password"
                value={values.password_confirmation}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.password_confirmation}
                touched={touched.password_confirmation}
                placeholder="••••••••"
                required
              />

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Reset Password
              </Button>
            </Form>
          )}
        </Formik>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-primary-500 hover:text-primary-600 font-medium">
            ← Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
