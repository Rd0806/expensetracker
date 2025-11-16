import { useExpenses } from '../hooks/useExpenses';
import { useCurrency } from '../hooks/useCurrency';

const Dashboard = () => {
  const { getMonthlyTotal } = useExpenses();
  const { formatCurrency } = useCurrency();
  const monthlyTotal = getMonthlyTotal();

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

