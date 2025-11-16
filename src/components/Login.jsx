import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
    } catch (err) {
      setError('Failed to sign in. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Daily Expense Tracker</h1>
        <p>Track your daily expenses with ease</p>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <button 
          className="btn btn-google" 
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <FcGoogle />
          <span>{loading ? 'Signing in...' : 'Sign in with Google'}</span>
        </button>
      </div>
    </div>
  );
};

export default Login;

