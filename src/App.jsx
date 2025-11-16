import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import DashboardPage from './pages/DashboardPage';
import ExpensesPage from './pages/ExpensesPage';
import './App.css';

const AppContent = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Login />;
  }

  return (
    <Router>
      <div className="app">
        <Header />
        <div className="app-layout">
          <Sidebar />
          <main className="app-main">
            <div className="container">
              <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/expenses" element={<ExpensesPage />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

