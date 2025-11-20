import { useState, useMemo } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { useCurrency } from '../hooks/useCurrency';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiEdit2, FiArrowUp, FiArrowDown, FiTarget, FiZap, FiCheckCircle } from 'react-icons/fi';

const DATE_RANGES = [
  { value: 'thisMonth', label: 'This Month' },
  { value: 'lastMonth', label: 'Last Month' },
  { value: 'last90Days', label: 'Last 90 Days' },
  { value: 'allTime', label: 'All Time' },
];

const COLORS = [
  '#8B5CF6', // Electric Purple
  '#10B981', // Neon Green
  '#F472B6', // Pink
  '#60A5FA', // Blue
  '#FBBF24', // Amber
];

const MOCK_SUBSCRIPTIONS = [
  { name: 'Netflix', cost: 15.99, date: '15th', icon: 'N' },
  { name: 'Spotify', cost: 9.99, date: '21st', icon: 'S' },
  { name: 'Adobe CC', cost: 52.99, date: '1st', icon: 'A' },
];

const MainDashboard = () => {
  const { expenses, loading } = useExpenses();
  const { formatCurrency } = useCurrency();
  const [dateRange, setDateRange] = useState('thisMonth');

  // UI State for Daily Budget
  const [dailyBudget, setDailyBudget] = useState(150); // Default $150
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState(150);

  // Filter expenses
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

  // Prepare chart data
  const chartData = useMemo(() => {
    if (dateRange === 'allTime') {
        const monthlyMap = {};
        filteredExpenses.forEach(expense => {
          const expenseDate = expense.date instanceof Date ? expense.date : new Date(expense.date);
          const monthKey = expenseDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
          monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + parseFloat(expense.amount || 0);
        });

        return Object.entries(monthlyMap)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => new Date(a.name) - new Date(b.name));
      } else {
        const dailyMap = {};
        filteredExpenses.forEach(expense => {
          const expenseDate = expense.date instanceof Date ? expense.date : new Date(expense.date);
          const dayKey = expenseDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          dailyMap[dayKey] = (dailyMap[dayKey] || 0) + parseFloat(expense.amount || 0);
        });

        return Object.entries(dailyMap)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => new Date(a.name) - new Date(b.name));
      }
  }, [filteredExpenses, dateRange]);

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

  // Calculate Today's Spend
  const todaysSpend = useMemo(() => {
    const today = new Date();
    return expenses.reduce((total, expense) => {
      const expenseDate = expense.date instanceof Date ? expense.date : new Date(expense.date);
      if (expenseDate.toDateString() === today.toDateString()) {
        return total + parseFloat(expense.amount || 0);
      }
      return total;
    }, 0);
  }, [expenses]);

  const saveBudget = () => {
    setDailyBudget(parseFloat(tempBudget));
    setIsEditingBudget(false);
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="main-dashboard">
      <div className="dashboard-header">
        <h1>Overview</h1>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="date-select"
        >
          {DATE_RANGES.map((range) => (
            <option key={range.value} value={range.value}>{range.label}</option>
          ))}
        </select>
      </div>

      <div className="bento-grid">
        {/* Main Spending Graph */}
        <div className="bento-card grid-col-span-2 grid-row-span-2" style={{ padding: 'var(--spacing-xl)' }}>
          <h2>Spending Trend</h2>
          <div style={{ width: '100%', height: 350, marginTop: '20px' }}>
            <ResponsiveContainer>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--text-secondary)" tick={{fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-subtle)', borderRadius: '12px', color: 'var(--text-primary)' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Budget Card */}
        <div className="bento-card" style={{ padding: 'var(--spacing-lg)' }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                <h3>Daily Budget</h3>
                <button onClick={() => setIsEditingBudget(!isEditingBudget)} className="icon-btn">
                    <FiEdit2 />
                </button>
            </div>

            {isEditingBudget ? (
                <div style={{display: 'flex', gap: '0.5rem'}}>
                    <input
                        type="number"
                        value={tempBudget}
                        onChange={(e) => setTempBudget(e.target.value)}
                        className="filter-input"
                        autoFocus
                    />
                    <button className="btn-primary" onClick={saveBudget}>Save</button>
                </div>
            ) : (
                <>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: todaysSpend > dailyBudget ? 'var(--error)' : 'var(--text-primary)' }}>
                        {formatCurrency(todaysSpend)} <span style={{fontSize: '1rem', color: 'var(--text-tertiary)'}}>/ {formatCurrency(dailyBudget)}</span>
                    </div>
                    <div style={{ marginTop: '0.5rem', height: '6px', background: 'var(--bg-app)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                            width: `${Math.min((todaysSpend / dailyBudget) * 100, 100)}%`,
                            height: '100%',
                            background: todaysSpend > dailyBudget ? 'var(--error)' : 'var(--accent-secondary)',
                            borderRadius: '3px'
                        }} />
                    </div>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {todaysSpend > dailyBudget ? 'You have exceeded your daily limit.' : 'You are within your daily budget.'}
                    </p>
                </>
            )}
        </div>

        {/* Subscriptions Card */}
        <div className="bento-card" style={{ padding: 'var(--spacing-lg)' }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
                <FiZap style={{color: 'var(--warning)'}} />
                <h3>Subscriptions</h3>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                {MOCK_SUBSCRIPTIONS.map((sub, i) => (
                    <div key={i} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div style={{display: 'flex', gap: '0.75rem', alignItems: 'center'}}>
                            <div style={{width: '32px', height: '32px', background: 'var(--bg-app)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--text-secondary)'}}>
                                {sub.icon}
                            </div>
                            <div>
                                <div style={{fontWeight: '500', fontSize: '0.9rem'}}>{sub.name}</div>
                                <div style={{fontSize: '0.75rem', color: 'var(--text-tertiary)'}}>Due {sub.date}</div>
                            </div>
                        </div>
                        <div style={{fontWeight: '600'}}>${sub.cost}</div>
                    </div>
                ))}
            </div>
        </div>

         {/* Savings Goal Card */}
         <div className="bento-card" style={{ padding: 'var(--spacing-lg)' }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
                <FiTarget style={{color: 'var(--accent-tertiary)'}} />
                <h3>Savings Goal</h3>
            </div>
            <div style={{textAlign: 'center', marginBottom: '1rem'}}>
                <div style={{fontSize: '0.9rem', color: 'var(--text-secondary)'}}>New MacBook Pro</div>
                <div style={{fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)'}}>$1,250 <span style={{fontSize: '0.9rem', color: 'var(--text-tertiary)'}}>/ $2,000</span></div>
            </div>
            <div style={{height: '12px', background: 'var(--bg-app)', borderRadius: '6px', overflow: 'hidden', marginBottom: '0.5rem'}}>
                 <div style={{width: '62.5%', height: '100%', background: 'linear-gradient(90deg, var(--accent-tertiary), var(--accent-primary))', borderRadius: '6px'}}></div>
            </div>
             <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-tertiary)'}}>
                <span>Start: Jan 1</span>
                <span>Target: June 1</span>
            </div>
        </div>

        {/* Category Pie Chart (Smaller) */}
        <div className="bento-card" style={{ padding: 'var(--spacing-lg)' }}>
            <h3>Distribution</h3>
            <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="var(--bg-panel)" strokeWidth={2} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)' }}
                        itemStyle={{ color: 'var(--text-primary)' }}
                    />
                </PieChart>
                </ResponsiveContainer>
            </div>
        </div>

      </div>
    </div>
  );
};

export default MainDashboard;
