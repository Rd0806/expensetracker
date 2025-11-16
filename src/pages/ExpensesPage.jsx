import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';

const ExpensesPage = () => {
  return (
    <div className="expenses-page">
      <ExpenseForm />
      <ExpenseList />
    </div>
  );
};

export default ExpensesPage;

