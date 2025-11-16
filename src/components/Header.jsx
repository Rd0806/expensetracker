import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FiLogOut } from 'react-icons/fi';

const Header = () => {
  const { currentUser, signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    if (!window.confirm('Are you sure you want to sign out?')) {
      return;
    }

    setLoading(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <h1>Daily Expense Tracker</h1>
        {currentUser && (
          <div className="header-user">
            <span className="user-email">{currentUser.email}</span>
            <button 
              className="btn btn-secondary"
              onClick={handleSignOut}
              disabled={loading}
            >
              <FiLogOut />
              <span>{loading ? 'Signing out...' : 'Sign Out'}</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

