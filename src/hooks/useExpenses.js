import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  deleteDoc, 
  doc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Create a new expense
  const addExpense = async (expenseData) => {
    if (!currentUser) {
      throw new Error('User must be logged in to add expenses');
    }

    try {
      const expense = {
        amount: expenseData.amount,
        description: expenseData.description?.trim() || '',
        category: expenseData.category?.trim() || 'Uncategorized',
        uid: currentUser.uid,
        // Convert Date to Firestore Timestamp
        date: expenseData.date instanceof Date 
          ? Timestamp.fromDate(expenseData.date)
          : Timestamp.fromDate(new Date(expenseData.date)),
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, 'expenses'), expense);
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  };

  // Delete an expense
  const deleteExpense = async (expenseId) => {
    if (!currentUser) {
      throw new Error('User must be logged in to delete expenses');
    }

    try {
      await deleteDoc(doc(db, 'expenses', expenseId));
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  };

  // Fetch expenses in real-time
  useEffect(() => {
    if (!currentUser) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Query expenses for the current user
    // Note: We filter by uid first, then sort in JavaScript to avoid needing a composite index
    const expensesQuery = query(
      collection(db, 'expenses'),
      where('uid', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(
      expensesQuery,
      (snapshot) => {
        const expensesData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            // Convert Firestore Timestamp to Date for easier handling
            date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
          };
        });
        
        // Sort by date in JavaScript (newest first) - this avoids needing a composite index
        expensesData.sort((a, b) => {
          const dateA = a.date instanceof Date ? a.date : new Date(a.date);
          const dateB = b.date instanceof Date ? b.date : new Date(b.date);
          return dateB - dateA; // Descending order (newest first)
        });
        
        setExpenses(expensesData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching expenses:', error);
        // Check if it's a missing index error
        if (error.code === 'failed-precondition') {
          console.error('Firestore index required. Check browser console for index creation link.');
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // Calculate total spending for current month
  const getMonthlyTotal = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return expenses
      .filter((expense) => {
        const expenseDate = expense.date?.toDate ? expense.date.toDate() : new Date(expense.date);
        return (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      })
      .reduce((total, expense) => total + parseFloat(expense.amount || 0), 0);
  };

  return {
    expenses,
    loading,
    addExpense,
    deleteExpense,
    getMonthlyTotal,
  };
};

