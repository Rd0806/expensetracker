import { useState } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { useCurrency } from '../hooks/useCurrency';
import { FiTrash2 } from 'react-icons/fi';

const ExpenseList = () => {
  const { expenses, loading, deleteExpense } = useExpenses();
  const { formatCurrency } = useCurrency();
  const [deletingId, setDeletingId] = useState(null);
  const [descriptionFilter, setDescriptionFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Format date
  const formatDate = (date) => {
    if (!date) return 'No date';
    const d = date?.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get unique categories from expenses
  const getUniqueCategories = () => {
    const categories = expenses.map(expense => expense.category || 'Uncategorized');
    return ['All', ...Array.from(new Set(categories))].sort();
  };

  // Filter expenses based on filters
  const filteredExpenses = expenses.filter(expense => {
    const matchesDescription = !descriptionFilter || 
      (expense.description || '').toLowerCase().includes(descriptionFilter.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || expense.category === categoryFilter;
    return matchesDescription && matchesCategory;
  });

  const handleDelete = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    setDeletingId(expenseId);
    try {
      await deleteExpense(expenseId);
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Failed to delete expense. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="expense-list">
        <h2>Your Expenses</h2>
        <div className="loading">Loading expenses...</div>
      </div>
    );
  }

  return (
    <div className="expense-list">
      <h2>Your Expenses</h2>
      
      {/* Filter Controls */}
      <div className="filter-controls">
        <div className="filter-group">
          <label htmlFor="description-filter">Filter by Description:</label>
          <input
            type="text"
            id="description-filter"
            className="filter-input"
            placeholder="Search expenses..."
            value={descriptionFilter}
            onChange={(e) => setDescriptionFilter(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="category-filter">Filter by Category:</label>
          <select
            id="category-filter"
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {getUniqueCategories().map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {expenses.length === 0 ? (
        <div className="empty-state">
          <p>No expenses yet. Add your first expense above!</p>
        </div>
      ) : filteredExpenses.length === 0 ? (
        <div className="empty-state">
          <p>No expenses match your filters.</p>
        </div>
      ) : (
        <>
          <div className="expense-count">
            Showing {filteredExpenses.length} of {expenses.length} expenses
          </div>
          <div className="expenses-container">
            {filteredExpenses.map((expense) => (
          <div key={expense.id} className="expense-item">
            <div className="expense-main">
              <div className="expense-info">
                <h3 className="expense-description">
                  {expense.description || '(No description)'}
                </h3>
                <div className="expense-meta">
                  <span className="expense-category">{expense.category || 'Uncategorized'}</span>
                  <span className="expense-date">{formatDate(expense.date)}</span>
                </div>
              </div>
              <div className="expense-amount">{formatCurrency(expense.amount)}</div>
            </div>
            <button
              className="btn btn-delete"
              onClick={() => handleDelete(expense.id)}
              disabled={deletingId === expense.id}
            >
              <FiTrash2 />
              <span>{deletingId === expense.id ? 'Deleting...' : 'Delete'}</span>
            </button>
            </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ExpenseList;

