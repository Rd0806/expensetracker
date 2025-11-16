import { useState, useMemo, useCallback } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { useCurrency } from '../hooks/useCurrency';
import { FiChevronLeft, FiChevronRight, FiTrash2 } from 'react-icons/fi';

const CalendarView = () => {
  const { expenses, loading, deleteExpense } = useExpenses();
  const { formatCurrency } = useCurrency();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [deletingId, setDeletingId] = useState(null);

  // Get first day of month and number of days
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const calendarDays = getCalendarDays();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get expenses for a specific date (memoized with useCallback)
  const getExpensesForDate = useCallback((date) => {
    if (!date) return [];
    
    return expenses.filter(expense => {
      const expenseDate = expense.date instanceof Date ? expense.date : new Date(expense.date);
      return (
        expenseDate.getDate() === date.getDate() &&
        expenseDate.getMonth() === date.getMonth() &&
        expenseDate.getFullYear() === date.getFullYear()
      );
    });
  }, [expenses]);

  // Get total for a specific date
  const getTotalForDate = (date) => {
    return getExpensesForDate(date).reduce((sum, expense) => 
      sum + parseFloat(expense.amount || 0), 0
    );
  };

  // Check if date has expenses
  const hasExpenses = (date) => {
    return date && getExpensesForDate(date).length > 0;
  };

  // Navigate months
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Get selected date expenses
  const selectedDateExpenses = useMemo(() => {
    return getExpensesForDate(selectedDate);
  }, [getExpensesForDate, selectedDate]);


  // Format date
  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

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

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date) => {
    if (!date) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  if (loading) {
    return (
      <div className="calendar-view">
        <div className="loading">Loading calendar...</div>
      </div>
    );
  }

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <h1>Expense Calendar</h1>
        <p className="calendar-subtitle">Click on a day to view expenses</p>
      </div>

      {/* Calendar Navigation */}
      <div className="calendar-nav">
        <button className="calendar-nav-btn" onClick={previousMonth}>
          <FiChevronLeft />
        </button>
        <h2 className="calendar-month">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        <button className="calendar-nav-btn" onClick={nextMonth}>
          <FiChevronRight />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-container">
        <div className="calendar-weekdays">
          {weekDays.map((day) => (
            <div key={day} className="calendar-weekday">
              {day}
            </div>
          ))}
        </div>
        <div className="calendar-grid">
          {calendarDays.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="calendar-day empty" />;
            }

            const total = getTotalForDate(date);
            const hasExp = hasExpenses(date);
            
            return (
              <button
                key={date.toISOString()}
                className={`calendar-day ${isToday(date) ? 'today' : ''} ${isSelected(date) ? 'selected' : ''} ${hasExp ? 'has-expenses' : ''}`}
                onClick={() => setSelectedDate(date)}
              >
                <span className="calendar-day-number">{date.getDate()}</span>
                {hasExp && (
                  <span className="calendar-day-amount">
                    {formatCurrency(total)}
                  </span>
                )}
                {hasExp && (
                  <span className="calendar-day-dot"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Expenses */}
      <div className="calendar-expenses">
        <h3>Expenses for {formatDate(selectedDate)}</h3>
        {selectedDateExpenses.length === 0 ? (
          <div className="calendar-empty">
            <p>No expenses on this day</p>
          </div>
        ) : (
          <div className="calendar-expenses-list">
            {selectedDateExpenses.map((expense) => (
              <div key={expense.id} className="calendar-expense-item">
                <div className="calendar-expense-info">
                  <h4>{expense.description || '(No description)'}</h4>
                  <div className="calendar-expense-meta">
                    <span className="calendar-expense-category">{expense.category || 'Uncategorized'}</span>
                  </div>
                </div>
                <div className="calendar-expense-amount">{formatCurrency(expense.amount)}</div>
                <button
                  className="btn btn-delete btn-small"
                  onClick={() => handleDelete(expense.id)}
                  disabled={deletingId === expense.id}
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
            <div className="calendar-expenses-total">
              <strong>Total: {formatCurrency(
                selectedDateExpenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0)
              )}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;

