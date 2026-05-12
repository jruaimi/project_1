import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';
import WebGLBackground from '../components/WebGLBackground';

const shellStyle = {
  padding: '1px',
  borderRadius: '17px',
  background: 'linear-gradient(to right bottom, rgba(255,255,255,0.95), rgba(255,255,255,0.5), rgba(203,213,225,0.3))',
  boxShadow: `rgba(0,0,0,0.06) 0px 0px 0px 1px,
    rgba(0,0,0,0.06) 0px 1px 1px -0.5px,
    rgba(0,0,0,0.06) 0px 3px 3px -1.5px,
    rgba(0,0,0,0.06) 0px 6px 6px -3px,
    rgba(0,0,0,0.06) 0px 12px 12px -6px,
    rgba(0,0,0,0.06) 0px 24px 24px -12px`,
  width: '100%',
  maxWidth: '400px',
};

const cardStyle = {
  borderRadius: '16px',
  background: 'rgba(248,249,250,0.92)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  padding: '40px 36px 36px',
};

const labelStyle = {
  display: 'block',
  fontSize: '14px',
  lineHeight: '20px',
  color: '#64748B',
  marginBottom: '6px',
  fontWeight: 400,
};

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  fontSize: '14px',
  lineHeight: '20px',
  color: '#0F172A',
  background: 'rgba(255,255,255,0.8)',
  border: '1px solid #E2E8F0',
  borderRadius: '4px',
  outline: 'none',
  transition: 'border-color 160ms ease, box-shadow 160ms ease',
  fontFamily: 'inherit',
};

const buttonStyle = {
  width: '100%',
  padding: '11px 16px',
  fontSize: '14px',
  lineHeight: '20px',
  fontWeight: 500,
  color: '#FFFFFF',
  background: '#0F172A',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  transition: 'background 160ms ease, opacity 160ms ease',
  fontFamily: 'inherit',
};

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/welcome', { replace: true });
    } catch {
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getFocusedInputStyle = (field) => ({
    ...inputStyle,
    borderColor: focusedField === field ? '#94A3B8' : '#E2E8F0',
    boxShadow: focusedField === field ? '0 0 0 3px rgba(15,23,42,0.06)' : 'none',
  });

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <WebGLBackground />

      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '400px' }}>
        <div style={shellStyle}>
          <div style={cardStyle}>
            {/* Logo / Title */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '44px',
                  height: '44px',
                  background: '#0F172A',
                  borderRadius: '12px',
                  marginBottom: '16px',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h1
                style={{
                  fontSize: '22px',
                  fontWeight: 600,
                  color: '#0F172A',
                  lineHeight: '28px',
                  letterSpacing: '-0.01em',
                  marginBottom: '6px',
                }}
              >
                Compliance Platform
              </h1>
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '20px' }}>
                Sign in to your account to continue
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate>
              <div style={{ marginBottom: '16px' }}>
                <label htmlFor="username" style={labelStyle}>Username</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  style={getFocusedInputStyle('username')}
                  placeholder="Enter your username"
                  autoComplete="username"
                  required
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label htmlFor="password" style={labelStyle}>Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  style={getFocusedInputStyle('password')}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
              </div>

              {error && (
                <div
                  style={{
                    marginBottom: '16px',
                    padding: '10px 12px',
                    background: 'rgba(239,68,68,0.06)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: '4px',
                    fontSize: '14px',
                    color: '#DC2626',
                    lineHeight: '20px',
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...buttonStyle,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>

        <p
          style={{
            textAlign: 'center',
            marginTop: '20px',
            fontSize: '13px',
            color: '#94A3B8',
          }}
        >
          Compliance Platform &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
