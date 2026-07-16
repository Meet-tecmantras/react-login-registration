import { useEffect, useState } from 'react';
import './AuthPage.css';

const FORM_CONFIG = {
  login: [
    { name: 'email', label: 'Email address', type: 'email', autoComplete: 'username' },
    { name: 'password', label: 'Password', type: 'password', autoComplete: 'current-password' },
  ],
  register: [
    { name: 'fullName', label: 'Full name', type: 'text', autoComplete: 'name' },
    { name: 'email', label: 'Email address', type: 'email', autoComplete: 'email' },
    { name: 'password', label: 'Password', type: 'password', autoComplete: 'new-password' },
    { name: 'confirmPassword', label: 'Confirm password', type: 'password', autoComplete: 'new-password' },
  ],
};

const initialValues = {
  login: { email: '', password: '' },
  register: { fullName: '', email: '', password: '', confirmPassword: '' },
};

const fieldLabels = {
  fullName: 'Full name',
  email: 'Email address',
  password: 'Password',
  confirmPassword: 'Confirm password',
};

const emailPattern = /^\S+@\S+\.\S+$/;

function AuthPage() {
  const [mode, setMode] = useState('login');
  const [values, setValues] = useState({ ...initialValues[mode] });
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('default');

  useEffect(() => {
    setValues({ ...initialValues[mode] });
    setErrors({});
    setStatusMessage('');
    setStatusType('default');
  }, [mode]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (statusMessage) {
      setStatusMessage('');
      setStatusType('default');
    }
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const validationErrors = {};

    FORM_CONFIG[mode].forEach((field) => {
      const trimmedValue = values[field.name]?.toString().trim();
      if (!trimmedValue) {
        validationErrors[field.name] = `${fieldLabels[field.name]} is required.`;
      }
    });

    if (!validationErrors.email && values.email && !emailPattern.test(values.email)) {
      validationErrors.email = 'Please use a valid email address.';
    }

    if (mode === 'register') {
      if (
        !validationErrors.password &&
        values.password &&
        values.password.length < 6
      ) {
        validationErrors.password = 'Password must be at least 6 characters.';
      }

      if (
        !validationErrors.confirmPassword &&
        values.password &&
        values.confirmPassword &&
        values.password !== values.confirmPassword
      ) {
        validationErrors.confirmPassword = 'Passwords must match.';
      }
    }

    return validationErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      setStatusMessage('');
      setStatusType('default');
      return;
    }

    setErrors({});
    setStatusMessage(
      mode === 'login'
        ? 'Login successful! Redirecting you to your dashboard...'
        : 'Account created! Check your inbox for the confirmation link.'
    );
    setStatusType('success');
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <header className="auth-card__header">
          <p className="eyebrow">{mode === 'login' ? 'Welcome back' : 'Create account'}</p>
          <h1>{mode === 'login' ? 'Log in' : 'Register'}</h1>
          <p className="lead">
            {mode === 'login'
              ? 'Sign in to continue to your personal dashboard.'
              : 'Create a profile and get started with the experience.'}
          </p>
        </header>

        {statusMessage && (
          <div
            className={`status-message ${
              statusType === 'success' ? 'status-message--success' : ''
            }`}
          >
            {statusMessage}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {FORM_CONFIG[mode].map((field) => (
            <label className="form-group" htmlFor={field.name} key={field.name}>
              <span>{field.label}</span>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                autoComplete={field.autoComplete}
                value={values[field.name]}
                onChange={handleChange}
                aria-invalid={errors[field.name] ? 'true' : 'false'}
                aria-describedby={
                  errors[field.name] ? `${field.name}-error` : undefined
                }
              />
              {errors[field.name] && (
                <span className="field-error" id={`${field.name}-error`}>
                  {errors[field.name]}
                </span>
              )}
            </label>
          ))}

          <button type="submit" className="primary-button">
            {mode === 'login' ? 'Log in' : 'Create account'}
          </button>
        </form>

        <div className="switch-mode">
          <p>
            {mode === 'login' ? 'New here?' : 'Already have an account?'}{' '}
            <button type="button" className="switch-link" onClick={toggleMode}>
              {mode === 'login' ? 'Create an account' : 'Log in instead'}
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}

export default AuthPage;
