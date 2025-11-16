import { useState } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { FiPlus } from 'react-icons/fi';

const CATEGORIES = [
  'Food',
  'Transport',
  'Bills',
  'Entertainment',
  'Shopping',
  'Healthcare',
  'Other',
  'Uncategorized',
];

const ExpenseForm = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Uncategorized');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { addExpense } = useExpenses();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!date) {
      setError('Please select a date');
      return;
    }

    try {
      await addExpense({
        amount: parseFloat(amount),
        description: description.trim(),
        category,
        date: new Date(date),
      });

      // Reset form
      setAmount('');
      setDescription('');
      setCategory('Uncategorized');
      setDate(new Date().toISOString().split('T')[0]);
      setSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to add expense. Please try again.');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <h2>Add New Expense</h2>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">Expense added successfully!</div>}

      <div className="form-group">
        <label htmlFor="amount">
          Amount <span className="required">*</span>
        </label>
        <input
          type="number"
          id="amount"
          step="0.01"
          min="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">
          Description
        </label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What did you spend on? (optional)"
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="date">
          Date <span className="required">*</span>
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary">
        <FiPlus />
        <span>Add Expense</span>
      </button>
    </form>
  );
};

export default ExpenseForm;

