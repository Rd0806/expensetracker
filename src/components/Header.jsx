import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FiLogOut, FiSearch } from 'react-icons/fi';

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="app-header glass-panel">
      <div className="header-search">
        <FiSearch className="search-icon" />
        <input type="text" placeholder="Search transactions..." className="search-input" />
      </div>

      <div className="header-actions">
        {currentUser && (
          <div className="user-menu">
            <div className="avatar">
              {currentUser.email ? currentUser.email[0].toUpperCase() : 'U'}
            </div>
            <button 
              className="btn-logout"
              onClick={handleSignOut}
              disabled={loading}
              title="Sign Out"
            >
              <FiLogOut />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
