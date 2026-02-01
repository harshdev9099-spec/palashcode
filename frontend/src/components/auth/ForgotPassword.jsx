import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import authService from '../../services/authService';
import InputField from '../common/InputField';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { toast } from 'react-toastify';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

const ForgotPassword = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const initialValues = {
    email: '',
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setError('');
      setSuccess('');

      const response = await authService.forgotPassword(values.email);

      if (response.success) {
        setSuccess(response.message);
        toast.success(response.message);
        resetForm();
      }
    } catch (err) {
      setError(err.message || 'Failed to send reset link. Please try again.');
      toast.error(err.message || 'Failed to send reset link');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-heading font-bold text-center text-secondary-500 mb-6">
          Forgot Password
        </h2>

        <p className="text-center text-gray-600 mb-6">
          Enter your email address and we'll send you a link to reset your password.
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

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Send Reset Link
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

export default ForgotPassword;
