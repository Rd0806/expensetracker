# Daily Expense Tracker

A modern, serverless expense tracking web application built with React and Firebase. Track your daily expenses with Google Sign-In authentication and real-time data synchronization.

## Features

- 🔐 **Google Authentication** - Secure sign-in with Google
- 📝 **Add Expenses** - Track expenses with amount, description, category, and date
- 📊 **Dashboard** - View total spending for the current month
- 📋 **Expense List** - View all expenses sorted by date (newest first)
- 🗑️ **Delete Expenses** - Remove expenses with a single click
- 🔄 **Real-time Updates** - Automatic synchronization with Firestore
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Firebase (Authentication + Firestore)
- **Styling**: CSS3 with modern design

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn
- A Google account for Firebase setup

## Project Structure

```
Expense_Tracker/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── Dashboard.jsx   # Monthly total spending card
│   │   ├── ExpenseForm.jsx # Form to add new expenses
│   │   ├── ExpenseList.jsx # List of all expenses
│   │   ├── Header.jsx      # App header with user info
│   │   └── Login.jsx       # Google Sign-In component
│   ├── contexts/           # React Context providers
│   │   └── AuthContext.jsx # Authentication context
│   ├── firebase/           # Firebase configuration
│   │   └── config.js       # Firebase initialization
│   ├── hooks/              # Custom React hooks
│   │   └── useExpenses.js  # Expense CRUD operations hook
│   ├── App.jsx             # Main app component
│   ├── App.css             # App styles
│   ├── main.jsx            # App entry point
│   └── index.css           # Global styles
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── firestore.rules         # Firestore security rules
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
└── README.md               # This file
```

## How It Works

### Authentication Flow

1. **User Signs In**: Click "Sign in with Google" button
2. **Firebase Handles OAuth**: Redirects to Google for authentication
3. **Auth State Tracking**: `AuthContext` monitors authentication state
4. **Protected Routes**: App shows login screen if not authenticated, dashboard if authenticated

### Data Flow

1. **Create Expense**: 
   - User fills form → `ExpenseForm` component
   - Submits → `useExpenses` hook → `addExpense()` function
   - Writes to Firestore with user's `uid`

2. **Read Expenses**:
   - `useExpenses` hook listens to Firestore changes
   - Queries expenses where `uid == currentUser.uid`
   - Sorts by date (descending)
   - Updates React state in real-time

3. **Delete Expense**:
   - User clicks delete → `ExpenseList` component
   - Calls `deleteExpense(expenseId)` from hook
   - Removes document from Firestore
   - Real-time listener updates UI automatically

### Security

- **Firestore Rules**: Ensure users can only read/write their own expenses
- **Client-side Validation**: Form validation before submission
- **Authentication Required**: All operations require authenticated user

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Future Enhancements

- Edit expenses functionality
- Filter expenses by category or date range
- Export expenses to CSV/PDF
- Charts and visualizations
- Recurring expenses
- Budget tracking

## License

This project is open source and available for personal use.

## Support

If you encounter any issues or have questions, please dm me.

---

**Happy Expense Tracking! 💰**

