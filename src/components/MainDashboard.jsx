import { useState, useMemo, useEffect } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { useCurrency } from '../hooks/useCurrency';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiEdit2, FiTarget, FiZap, FiTrash2, FiPlus, FiCheck } from 'react-icons/fi';

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

const MainDashboard = () => {
  const { expenses, loading } = useExpenses();
  const { formatCurrency } = useCurrency();
  const [dateRange, setDateRange] = useState('thisMonth');

  // --- Daily Budget State ---
  const [dailyBudget, setDailyBudget] = useState(() => {
    const saved = localStorage.getItem('dailyBudget');
    return saved ? parseFloat(saved) : 150;
  });
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState(dailyBudget);

  // --- Subscriptions State ---
  const [subscriptions, setSubscriptions] = useState(() => {
    const saved = localStorage.getItem('subscriptions');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Netflix', cost: 15.99, date: '15th', icon: 'N' },
      { id: 2, name: 'Spotify', cost: 9.99, date: '21st', icon: 'S' },
      { id: 3, name: 'Adobe CC', cost: 52.99, date: '1st', icon: 'A' },
    ];
  });
  const [isEditingSubs, setIsEditingSubs] = useState(false);
  const [newSub, setNewSub] = useState({ name: '', cost: '', date: '' });

  // --- Savings Goal State ---
  const [savingsGoal, setSavingsGoal] = useState(() => {
    const saved = localStorage.getItem('savingsGoal');
    return saved ? JSON.parse(saved) : {
      name: 'New MacBook Pro',
      current: 1250,
      target: 2000,
      start: '2024-01-01',
      end: '2024-06-01'
    };
  });
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(savingsGoal);

  // --- Handlers ---

  // Budget
  const saveBudget = () => {
    const newBudget = parseFloat(tempBudget);
    setDailyBudget(newBudget);
    localStorage.setItem('dailyBudget', newBudget);
    setIsEditingBudget(false);
  };

  // Subscriptions
  const addSubscription = () => {
    if (!newSub.name || !newSub.cost) return;
    const updated = [...subscriptions, {
        id: Date.now(),
        name: newSub.name,
        cost: parseFloat(newSub.cost),
        date: newSub.date || '1st',
        icon: newSub.name[0].toUpperCase()
    }];
    setSubscriptions(updated);
    localStorage.setItem('subscriptions', JSON.stringify(updated));
    setNewSub({ name: '', cost: '', date: '' });
  };

  const removeSubscription = (id) => {
    const updated = subscriptions.filter(sub => sub.id !== id);
    setSubscriptions(updated);
    localStorage.setItem('subscriptions', JSON.stringify(updated));
  };

  // Savings Goal
  const saveGoal = () => {
    if (!tempGoal.name) {
        setSavingsGoal(null);
        localStorage.removeItem('savingsGoal');
    } else {
        setSavingsGoal(tempGoal);
        localStorage.setItem('savingsGoal', JSON.stringify(tempGoal));
    }
    setIsEditingGoal(false);
  };

  const createNewGoal = () => {
      const newGoal = {
          name: 'New Goal',
          current: 0,
          target: 1000,
          start: new Date().toISOString().split('T')[0],
          end: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]
      };
      setTempGoal(newGoal);
      setSavingsGoal(newGoal);
      setIsEditingGoal(true);
  };

  const clearGoal = () => {
      setSavingsGoal(null);
      localStorage.removeItem('savingsGoal');
      setIsEditingGoal(false);
  };


  // --- Chart Data Logic ---
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

  const chartData = useMemo(() => {
      let data = [];

      if (dateRange === 'allTime') {
        const monthlyMap = {};
        filteredExpenses.forEach(expense => {
          const expenseDate = expense.date instanceof Date ? expense.date : new Date(expense.date);
          const monthKey = expenseDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
          monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + parseFloat(expense.amount || 0);
        });
        data = Object.entries(monthlyMap).map(([name, value]) => ({ name, value }));
      } else {
        const dailyMap = {};
        filteredExpenses.forEach(expense => {
          const expenseDate = expense.date instanceof Date ? expense.date : new Date(expense.date);
          const dayKey = expenseDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          dailyMap[dayKey] = (dailyMap[dayKey] || 0) + parseFloat(expense.amount || 0);
        });
        data = Object.entries(dailyMap).map(([name, value]) => ({ name, value }));
      }

      data.sort((a, b) => new Date(a.name) - new Date(b.name));

      if (data.length === 0) {
          const now = new Date();
          if (dateRange === 'lastMonth') {
             const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
             data.push({ name: lastMonth.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value: 0 });
             const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
             data.push({ name: lastMonthEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value: 0 });
          } else if (dateRange === 'thisMonth') {
             const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
             data.push({ name: startOfMonth.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value: 0 });
             data.push({ name: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value: 0 });
          } else {
             data.push({ name: 'No Data', value: 0 });
          }
      }

      return data;
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

        {/* Daily Budget Card - COMPACT & RESIZED */}
        <div className="bento-card compact-card" style={{ padding: 'var(--spacing-lg)' }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
                <h3 style={{margin: 0, fontSize: '1rem'}}>Daily Budget</h3>
                <button onClick={() => setIsEditingBudget(!isEditingBudget)} className="icon-btn">
                    <FiEdit2 />
                </button>
            </div>

            {isEditingBudget ? (
                <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                    <input
                        type="number"
                        value={tempBudget}
                        onChange={(e) => setTempBudget(e.target.value)}
                        className="filter-input"
                        autoFocus
                        style={{ width: '100%' }}
                    />
                    <button className="btn-primary" style={{ padding: '8px' }} onClick={saveBudget}><FiCheck/></button>
                </div>
            ) : (
                <>
                    <div style={{ fontSize: '1.75rem', fontWeight: '700', color: todaysSpend > dailyBudget ? 'var(--error)' : 'var(--text-primary)', lineHeight: 1.2 }}>
                        {formatCurrency(todaysSpend)} <span style={{fontSize: '0.9rem', color: 'var(--text-tertiary)', fontWeight: 500}}>/ {formatCurrency(dailyBudget)}</span>
                    </div>
                    <div style={{ marginTop: '0.75rem', height: '4px', background: 'var(--bg-app)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{
                            width: `${Math.min((todaysSpend / dailyBudget) * 100, 100)}%`,
                            height: '100%',
                            background: todaysSpend > dailyBudget ? 'var(--error)' : 'var(--accent-secondary)',
                            borderRadius: '2px'
                        }} />
                    </div>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {todaysSpend > dailyBudget ? 'Over limit.' : 'Within budget.'}
                    </p>
                </>
            )}
        </div>

        {/* Subscriptions Card - IMPROVED EMPTY STATE */}
        <div className="bento-card" style={{ padding: 'var(--spacing-lg)' }}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <FiZap style={{color: 'var(--warning)'}} />
                    <h3>Subscriptions</h3>
                </div>
                <button onClick={() => setIsEditingSubs(!isEditingSubs)} className="icon-btn">
                    {isEditingSubs ? 'Done' : <FiEdit2 />}
                </button>
            </div>

            {isEditingSubs && (
                <div style={{marginBottom: '1rem', padding: '10px', background: 'var(--bg-app)', borderRadius: '8px'}}>
                    <input
                         placeholder="Name"
                         value={newSub.name}
                         onChange={e => setNewSub({...newSub, name: e.target.value})}
                         className="filter-input" style={{marginBottom: '5px', padding: '8px'}}
                    />
                    <div style={{display: 'flex', gap: '5px'}}>
                        <input
                            type="number" placeholder="$$"
                            value={newSub.cost}
                            onChange={e => setNewSub({...newSub, cost: e.target.value})}
                            className="filter-input" style={{padding: '8px'}}
                        />
                        <button className="btn-primary" onClick={addSubscription} style={{padding: '8px'}}><FiPlus/></button>
                    </div>
                </div>
            )}

            {subscriptions.length === 0 && !isEditingSubs ? (
                <div style={{textAlign: 'center', padding: '1rem 0', color: 'var(--text-secondary)'}}>
                    <p style={{marginBottom: '1rem', fontSize: '0.9rem'}}>No subscriptions</p>
                    <button className="btn-primary" style={{width: '100%', fontSize: '0.9rem'}} onClick={() => setIsEditingSubs(true)}>Add Subscription</button>
                </div>
            ) : (
                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '200px', overflowY: 'auto'}}>
                    {subscriptions.map((sub) => (
                        <div key={sub.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <div style={{display: 'flex', gap: '0.75rem', alignItems: 'center'}}>
                                <div style={{width: '32px', height: '32px', background: 'var(--bg-app)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--text-secondary)'}}>
                                    {sub.icon}
                                </div>
                                <div>
                                    <div style={{fontWeight: '500', fontSize: '0.9rem'}}>{sub.name}</div>
                                    <div style={{fontSize: '0.75rem', color: 'var(--text-tertiary)'}}>Due {sub.date}</div>
                                </div>
                            </div>
                            <div style={{fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px'}}>
                                ${sub.cost}
                                {isEditingSubs && (
                                    <button className="icon-btn" style={{color: 'var(--error)'}} onClick={() => removeSubscription(sub.id)}><FiTrash2 size={12}/></button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

         {/* Savings Goal Card */}
         <div className="bento-card" style={{ padding: 'var(--spacing-lg)' }}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <FiTarget style={{color: 'var(--accent-tertiary)'}} />
                    <h3>Savings Goal</h3>
                </div>
                {savingsGoal && (
                    <button onClick={() => setIsEditingGoal(!isEditingGoal)} className="icon-btn">
                        <FiEdit2 />
                    </button>
                )}
            </div>

            {!savingsGoal ? (
                 <div style={{textAlign: 'center', padding: '2rem 0', color: 'var(--text-secondary)'}}>
                     <p style={{marginBottom: '1rem'}}>No goal set</p>
                     <button className="btn-primary" style={{width: '100%'}} onClick={createNewGoal}>Create Goal</button>
                 </div>
            ) : isEditingGoal ? (
                <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                    <input
                         value={tempGoal.name}
                         onChange={e => setTempGoal({...tempGoal, name: e.target.value})}
                         className="filter-input"
                         placeholder="Goal Name"
                    />
                    <div style={{display: 'flex', gap: '5px'}}>
                         <input
                            type="number" placeholder="Current"
                            value={tempGoal.current}
                            onChange={e => setTempGoal({...tempGoal, current: parseFloat(e.target.value)})}
                            className="filter-input"
                        />
                         <input
                            type="number" placeholder="Target"
                            value={tempGoal.target}
                            onChange={e => setTempGoal({...tempGoal, target: parseFloat(e.target.value)})}
                            className="filter-input"
                        />
                    </div>
                    <div style={{display: 'flex', gap: '5px'}}>
                        <input
                            type="date"
                            value={tempGoal.start}
                            onChange={e => setTempGoal({...tempGoal, start: e.target.value})}
                            className="filter-input"
                        />
                        <input
                            type="date"
                            value={tempGoal.end}
                            onChange={e => setTempGoal({...tempGoal, end: e.target.value})}
                            className="filter-input"
                        />
                    </div>
                    <div style={{display: 'flex', gap: '10px', marginTop: '5px'}}>
                        <button className="btn-primary" style={{flex: 1}} onClick={saveGoal}>Save</button>
                        <button className="btn-delete" style={{flex: 1, justifyContent: 'center'}} onClick={clearGoal}>Clear</button>
                    </div>
                </div>
            ) : (
                <>
                    <div style={{textAlign: 'center', marginBottom: '1rem'}}>
                        <div style={{fontSize: '0.9rem', color: 'var(--text-secondary)'}}>{savingsGoal.name}</div>
                        <div style={{fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)'}}>${savingsGoal.current} <span style={{fontSize: '0.9rem', color: 'var(--text-tertiary)'}}>/ ${savingsGoal.target}</span></div>
                    </div>
                    <div style={{height: '12px', background: 'var(--bg-app)', borderRadius: '6px', overflow: 'hidden', marginBottom: '0.5rem'}}>
                        <div style={{width: `${Math.min((savingsGoal.current / savingsGoal.target) * 100, 100)}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent-tertiary), var(--accent-primary))', borderRadius: '6px'}}></div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-tertiary)'}}>
                        <span>Start: {savingsGoal.start}</span>
                        <span>Target: {savingsGoal.end}</span>
                    </div>
                </>
            )}
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
