import { useExpenses } from '../hooks/useExpenses';

const Dashboard = () => {
  const { getMonthlyTotal } = useExpenses();
  const monthlyTotal = getMonthlyTotal();

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Get current month name
  const getCurrentMonthName = () => {
    return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="dashboard-card">
      <h2>Monthly Spending</h2>
      <div className="dashboard-content">
        <p className="dashboard-month">{getCurrentMonthName()}</p>
        <p className="dashboard-total">{formatCurrency(monthlyTotal)}</p>
      </div>
    </div>
  );
};

export default Dashboard;

