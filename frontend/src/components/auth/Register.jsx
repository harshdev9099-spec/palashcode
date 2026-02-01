import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import InputField from '../common/InputField';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { toast } from 'react-toastify';

const validationSchema = Yup.object({
  first_name: Yup.string()
    .required('First name is required')
    .max(255, 'First name must be less than 255 characters'),
  last_name: Yup.string()
    .required('Last name is required')
    .max(255, 'Last name must be less than 255 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  mobile_number: Yup.string()
    .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits')
    .nullable(),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const initialValues = {
    first_name: '',
    last_name: '',
    email: '',
    mobile_number: '',
    password: '',
    password_confirmation: '',
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      setError('');
      setSuccess('');

      const response = await register(values);

      if (response.success) {
        setSuccess(response.message);
        toast.success(response.message);
        // Redirect to email verification notice page
        setTimeout(() => {
          navigate('/email/verification-notice', { state: { email: values.email } });
        }, 2000);
      }
    } catch (err) {
      if (err.errors) {
        // Handle validation errors
        Object.keys(err.errors).forEach((key) => {
          setFieldError(key, err.errors[key][0]);
        });
      } else {
        setError(err.message || 'Registration failed. Please try again.');
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
            Create Account
          </h2>
          <p className="text-earth-600">
            Join Palash Academy and start your IELTS journey
          </p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} />}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="First Name"
                  name="first_name"
                  value={values.first_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.first_name}
                  touched={touched.first_name}
                  placeholder="John"
                  required
                />

                <InputField
                  label="Last Name"
                  name="last_name"
                  value={values.last_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.last_name}
                  touched={touched.last_name}
                  placeholder="Doe"
                  required
                />
              </div>

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
                label="Mobile Number"
                name="mobile_number"
                type="tel"
                value={values.mobile_number}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.mobile_number}
                touched={touched.mobile_number}
                placeholder="1234567890"
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

              <InputField
                label="Confirm Password"
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
                className="bg-gradient-to-r from-secondary-500 to-accent-500 hover:from-secondary-600 hover:to-accent-600 text-white"
              >
                Create Account
              </Button>
            </Form>
          )}
        </Formik>

        <div className="mt-6 text-center">
          <p className="text-sm text-earth-600">
            Already have an account?{' '}
            <Link to="/login" className="text-secondary-600 hover:text-accent-600 font-semibold transition-colors duration-200">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
