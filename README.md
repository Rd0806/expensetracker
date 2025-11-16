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

## Project Setup

### Part 1: Firebase Project Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" or select an existing project
   - Follow the setup wizard (disable Google Analytics if you don't need it)

2. **Enable Authentication**
   - In Firebase Console, go to **Authentication** > **Sign-in method**
   - Click on **Google** and enable it
   - Set a project support email
   - Click **Save**

3. **Create Firestore Database**
   - Go to **Firestore Database** > **Create database**
   - Start in **test mode** (we'll update security rules later)
   - Choose a location (prefer closest to your users)

4. **Get Firebase Configuration**
   - Go to **Project Settings** (gear icon) > **General**
   - Scroll down to "Your apps" section
   - Click the **Web** icon (`</>`) to add a web app
   - Register your app (e.g., "Expense Tracker")
   - Copy the Firebase configuration object

5. **Set Firestore Security Rules**
   - Go to **Firestore Database** > **Rules**
   - Replace the default rules with the rules from `firestore.rules` file in this project:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /expenses/{expenseId} {
         allow read: if request.auth != null && request.auth.uid == resource.data.uid;
         allow create: if request.auth != null && request.auth.uid == request.resource.data.uid;
         allow delete: if request.auth != null && request.auth.uid == resource.data.uid;
         allow update: if request.auth != null && 
                        request.auth.uid == resource.data.uid &&
                        request.auth.uid == request.resource.data.uid;
       }
     }
   }
   ```
   - Click **Publish**

### Part 2: Local Development Setup

1. **Clone or Download this Repository**
   ```bash
   cd Expense_Tracker
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   - Create a `.env` file in the root directory
   - Copy the contents from `.env.example`
   - Fill in your Firebase configuration values:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
   VITE_FIREBASE_PROJECT_ID=your_project_id_here
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
   VITE_FIREBASE_APP_ID=your_app_id_here
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open in Browser**
   - The app will be available at `http://localhost:5173` (or the port shown in terminal)

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

## Firebase Configuration Details

### Part 3: Firebase Connection

The Firebase connection is handled in `src/firebase/config.js`:

- **initializeApp**: Initializes Firebase with your config
- **getAuth**: Sets up Firebase Authentication
- **getFirestore**: Initializes Cloud Firestore database
- **GoogleAuthProvider**: Configures Google Sign-In provider

Environment variables are loaded using `import.meta.env.VITE_*` (Vite's convention).

### Part 4: Firestore Database (CRUD)

#### Create Operation
```javascript
// In useExpenses.js
const addExpense = async (expenseData) => {
  const expense = {
    ...expenseData,
    uid: currentUser.uid,  // Link to user
    date: Timestamp.fromDate(expenseData.date),
    createdAt: Timestamp.now(),
  };
  await addDoc(collection(db, 'expenses'), expense);
};
```

#### Read Operation
```javascript
// Real-time listener with query
const expensesQuery = query(
  collection(db, 'expenses'),
  where('uid', '==', currentUser.uid),  // Filter by user
  orderBy('date', 'desc')  // Sort by date
);

onSnapshot(expensesQuery, (snapshot) => {
  // Update state with new data
});
```

#### Delete Operation
```javascript
// In useExpenses.js
const deleteExpense = async (expenseId) => {
  await deleteDoc(doc(db, 'expenses', expenseId));
};
```

### Part 5: Recommended Folder Structure

The project follows a clean, scalable structure:

- **components/**: Reusable UI components (Dashboard, Forms, Lists)
- **contexts/**: Global state management (AuthContext for user state)
- **hooks/**: Custom React hooks (useExpenses for business logic)
- **firebase/**: Firebase configuration and initialization

This structure makes it easy to:
- Find files quickly
- Scale the application
- Maintain and test code
- Separate concerns (UI, logic, configuration)

## Troubleshooting

### Common Issues

1. **"Firebase: Error (auth/popup-closed-by-user)"**
   - User closed the Google sign-in popup
   - This is normal behavior, just try again

2. **"Missing or insufficient permissions"**
   - Check Firestore security rules are deployed correctly
   - Verify user is authenticated (`currentUser` is not null)

3. **Environment variables not loading**
   - Ensure `.env` file exists in root directory
   - Variable names must start with `VITE_`
   - Restart dev server after changing `.env`

4. **"Firestore index required"**
   - Firestore may need a composite index for the query
   - Follow the error link to create the index automatically
   - Or create it manually in Firestore Console > Indexes

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/) and import your repository
3. Add environment variables in Vercel dashboard
4. Deploy!

### Deploy to Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Build: `npm run build`
5. Deploy: `firebase deploy`

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

If you encounter any issues or have questions, please check the troubleshooting section or review the Firebase documentation.

---

**Happy Expense Tracking! 💰**

