import { useState, useMemo } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { useCurrency } from '../hooks/useCurrency';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DATE_RANGES = [
  { value: 'thisMonth', label: 'This Month' },
  { value: 'lastMonth', label: 'Last Month' },
  { value: 'last90Days', label: 'Last 90 Days' },
  { value: 'allTime', label: 'All Time' },
];

// Modern color palette for charts - matches new design system
const COLORS = [
  '#0284c7', // primary-600 (Blue)
  '#10b981', // accent-500 (Emerald)
  '#3b82f6', // info (Bright Blue)
  '#f59e0b', // warning (Amber)
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#14b8a6', // Teal
  '#f97316', // Orange
  '#06b6d4', // Cyan
  '#84cc16', // Lime
];

const MainDashboard = () => {
  const { expenses, loading } = useExpenses();
  const { formatCurrency } = useCurrency();
  const [dateRange, setDateRange] = useState('thisMonth');

  // Filter expenses based on date range
  const filteredExpenses = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];

    const now = new Date();
    let startDate = null;

    switch (dateRange) {
      case 'thisMonth':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'lastMonth':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        return expenses.filter(expense => {
          const expenseDate = expense.date instanceof Date ? expense.date : new Date(expense.date);
          return expenseDate >= startDate && expenseDate <= lastMonthEnd;
        });
      case 'last90Days':
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 90);
        break;
      case 'allTime':
        return expenses;
      default:
        return expenses;
    }

    if (!startDate) return expenses;

    return expenses.filter(expense => {
      const expenseDate = expense.date instanceof Date ? expense.date : new Date(expense.date);
      return expenseDate >= startDate;
    });
  }, [expenses, dateRange]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalSpending = filteredExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
    const totalExpenses = filteredExpenses.length;
    const averageSpend = totalExpenses > 0 ? totalSpending / totalExpenses : 0;

    return {
      totalSpending,
      totalExpenses,
      averageSpend,
    };
  }, [filteredExpenses]);

  // Prepare pie chart data (category breakdown)
  const pieChartData = useMemo(() => {
    const categoryMap = {};
    filteredExpenses.forEach(expense => {
      const category = expense.category || 'Uncategorized';
      categoryMap[category] = (categoryMap[category] || 0) + parseFloat(expense.amount || 0);
    });

    return Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredExpenses]);

  // Prepare bar chart data (spending over time)
  const barChartData = useMemo(() => {
    if (dateRange === 'allTime') {
      // Group by month for "All Time"
      const monthlyMap = {};
      filteredExpenses.forEach(expense => {
        const expenseDate = expense.date instanceof Date ? expense.date : new Date(expense.date);
        const monthKey = expenseDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + parseFloat(expense.amount || 0);
      });

      return Object.entries(monthlyMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => {
          // Sort by date
          return new Date(a.name) - new Date(b.name);
        });
    } else {
      // Group by day for other ranges
      const dailyMap = {};
      filteredExpenses.forEach(expense => {
        const expenseDate = expense.date instanceof Date ? expense.date : new Date(expense.date);
        const dayKey = expenseDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        dailyMap[dayKey] = (dailyMap[dayKey] || 0) + parseFloat(expense.amount || 0);
      });

      return Object.entries(dailyMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => {
          // Sort by date
          const dateA = new Date(a.name);
          const dateB = new Date(b.name);
          return dateA - dateB;
        });
    }
  }, [filteredExpenses, dateRange]);


  if (loading) {
    return (
      <div className="main-dashboard">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="main-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="date-range-selector">
          <label htmlFor="date-range">Time Period:</label>
          <select
            id="date-range"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="date-range-select"
          >
            {DATE_RANGES.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-label">Total Spending</div>
          <div className="stat-value">{formatCurrency(stats.totalSpending)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Expenses</div>
          <div className="stat-value">{stats.totalExpenses}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Average per Expense</div>
          <div className="stat-value">{formatCurrency(stats.averageSpend)}</div>
        </div>
      </div>

      {/* Charts Container */}
      <div className="charts-container">
        {/* Pie Chart - Category Breakdown */}
        <div className="chart-card">
          <h2>Spending by Category</h2>
          {pieChartData.length === 0 ? (
            <div className="chart-empty">No expenses in this period</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar Chart - Spending Over Time */}
        <div className="chart-card">
          <h2>Spending Over Time</h2>
          {barChartData.length === 0 ? (
            <div className="chart-empty">No expenses in this period</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b' }} />
                <YAxis stroke="#64748b" tick={{ fill: '#64748b' }} />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="value" fill="#0284c7" name="Spending" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;

