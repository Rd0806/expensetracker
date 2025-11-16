# Complete Setup Guide - Daily Expense Tracker

This guide provides a detailed, step-by-step breakdown of building your expense tracker application.

---

## Part 1: Project Setup

### Step 1.1: Create React App with Vite

We're using **Vite** instead of Create React App for faster development:

```bash
# Already done in this project, but for reference:
npm create vite@latest expense-tracker -- --template react
cd expense-tracker
npm install
```

**Why Vite?**
- Lightning-fast hot module replacement (HMR)
- Faster build times
- Better developer experience
- Native ES modules support

### Step 1.2: Install Firebase Dependencies

```bash
npm install firebase
```

This installs the Firebase SDK for:
- Authentication (Google Sign-In)
- Cloud Firestore (Database)

### Step 1.3: Create Firebase Project

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Click "Add project"

2. **Project Configuration**
   - Enter project name: "expense-tracker" (or any name)
   - Disable Google Analytics (optional)
   - Click "Create project"

3. **Wait for Setup**
   - Firebase will provision your project (takes ~30 seconds)

---

## Part 2: Firebase Connection

### Step 2.1: Get Firebase Configuration

1. **In Firebase Console:**
   - Click the gear icon (⚙️) next to "Project Overview"
   - Select "Project settings"
   - Scroll to "Your apps" section
   - Click the Web icon (`</>`)

2. **Register App:**
   - App nickname: "Expense Tracker Web"
   - Check "Also set up Firebase Hosting" (optional)
   - Click "Register app"

3. **Copy Configuration:**
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   };
   ```

### Step 2.2: Set Up Environment Variables

**Create `.env` file** in project root:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

**Important:** 
- Variables MUST start with `VITE_` to be exposed to frontend
- Never commit `.env` to Git (already in `.gitignore`)

### Step 2.3: Firebase Configuration File

**Location:** `src/firebase/config.js`

This file:
- Initializes Firebase app
- Exports `auth` for authentication
- Exports `db` for Firestore database
- Sets up Google Auth Provider

**Key Code:**
```javascript
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
```

---

## Part 3: Authentication Flow

### Step 3.1: Enable Google Sign-In in Firebase

1. **Firebase Console:**
   - Go to **Authentication** > **Sign-in method**
   - Click **Google** provider
   - Toggle "Enable"
   - Enter Project support email
   - Click **Save**

### Step 3.2: Create AuthContext

**Location:** `src/contexts/AuthContext.jsx`

**Purpose:**
- Provides authentication state globally
- Tracks current user (logged in or not)
- Provides `signInWithGoogle()` and `signOut()` functions

**How It Works:**
```javascript
// Listen to auth state changes
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setCurrentUser(user);  // null if logged out, user object if logged in
  });
  return unsubscribe;
}, []);
```

### Step 3.3: Google Sign-In Button

**Location:** `src/components/Login.jsx`

**Implementation:**
```javascript
const handleGoogleSignIn = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
    // Firebase handles the popup and OAuth flow
  } catch (error) {
    console.error('Error:', error);
  }
};
```

**What Happens:**
1. User clicks "Sign in with Google"
2. Firebase opens Google OAuth popup
3. User selects Google account
4. Firebase returns user object
5. `AuthContext` updates `currentUser`
6. App automatically shows dashboard (protected route)

### Step 3.4: Sign Out Button

**Location:** `src/components/Header.jsx`

**Implementation:**
```javascript
const handleSignOut = async () => {
  await signOut(auth);
  // currentUser becomes null
  // App automatically shows login screen
};
```

### Step 3.5: Protected Routes

**Location:** `src/App.jsx`

**Logic:**
```javascript
const { currentUser } = useAuth();

if (!currentUser) {
  return <Login />;  // Show login if not authenticated
}

return <Dashboard />;  // Show app if authenticated
```

---

## Part 4: Firestore Database (CRUD)

### Step 4.1: Create Firestore Database

1. **Firebase Console:**
   - Go to **Firestore Database**
   - Click **Create database**
   - Select **Start in test mode** (temporary)
   - Choose location (closest to your users)
   - Click **Enable**

### Step 4.2: Firestore Security Rules

**Location:** `firestore.rules`

**Rules Explained:**
```javascript
match /expenses/{expenseId} {
  // READ: User can only read their own expenses
  allow read: if request.auth != null && 
               request.auth.uid == resource.data.uid;
  
  // CREATE: User can create expenses with their own uid
  allow create: if request.auth != null && 
                 request.auth.uid == request.resource.data.uid;
  
  // DELETE: User can only delete their own expenses
  allow delete: if request.auth != null && 
                 request.auth.uid == resource.data.uid;
}
```

**Key Security Points:**
- `request.auth != null` - User must be authenticated
- `request.auth.uid` - Current user's unique ID
- `resource.data.uid` - The expense document's user ID
- Prevents users from accessing other users' data

**Deploy Rules:**
- Copy rules from `firestore.rules` file
- Paste in Firebase Console > Firestore Database > Rules
- Click **Publish**

### Step 4.3: Custom Hook for Expenses

**Location:** `src/hooks/useExpenses.js`

This hook encapsulates all CRUD operations.

### CREATE Operation

**Function:** `addExpense(expenseData)`

```javascript
const addExpense = async (expenseData) => {
  const expense = {
    amount: expenseData.amount,
    description: expenseData.description,
    category: expenseData.category,
    date: Timestamp.fromDate(expenseData.date),  // Convert to Firestore Timestamp
    uid: currentUser.uid,  // Link to user
    createdAt: Timestamp.now(),
  };
  
  await addDoc(collection(db, 'expenses'), expense);
};
```

**Key Points:**
- `addDoc()` creates a new document with auto-generated ID
- `uid` links expense to the current user
- `Timestamp.fromDate()` converts JavaScript Date to Firestore Timestamp
- Firestore automatically validates against security rules

### READ Operation

**Function:** Real-time listener in `useEffect`

```javascript
useEffect(() => {
  if (!currentUser) return;
  
  // Query: expenses where uid == currentUser.uid, ordered by date desc
  const expensesQuery = query(
    collection(db, 'expenses'),
    where('uid', '==', currentUser.uid),
    orderBy('date', 'desc')
  );
  
  // Real-time listener (updates automatically on changes)
  const unsubscribe = onSnapshot(expensesQuery, (snapshot) => {
    const expensesData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(),  // Convert Timestamp to Date
    }));
    setExpenses(expensesData);
  });
  
  return () => unsubscribe();  // Cleanup on unmount
}, [currentUser]);
```

**Key Points:**
- `onSnapshot()` provides real-time updates (no manual refresh needed)
- `where()` filters by user ID
- `orderBy()` sorts by date (newest first)
- Automatically updates when expenses are added/deleted

**Important:** You may need to create a composite index:
- If Firestore shows an error link, click it to auto-create the index
- Or create manually: Firestore Console > Indexes > Create Index

### DELETE Operation

**Function:** `deleteExpense(expenseId)`

```javascript
const deleteExpense = async (expenseId) => {
  await deleteDoc(doc(db, 'expenses', expenseId));
  // Real-time listener automatically updates UI
};
```

**Key Points:**
- `doc(db, 'expenses', expenseId)` creates a document reference
- `deleteDoc()` removes the document
- Security rules ensure users can only delete their own expenses
- Real-time listener updates the UI automatically

---

## Part 5: Recommended Folder Structure

```
src/
├── components/          # UI Components (Presentational)
│   ├── Dashboard.jsx   # Monthly spending summary card
│   ├── ExpenseForm.jsx # Form to add new expenses
│   ├── ExpenseList.jsx # List of all user expenses
│   ├── Header.jsx      # App header with user info & sign out
│   └── Login.jsx       # Google Sign-In component
│
├── contexts/           # Global State Management
│   └── AuthContext.jsx # Authentication state (user, login, logout)
│
├── hooks/              # Custom React Hooks (Business Logic)
│   └── useExpenses.js  # Expense CRUD operations
│
├── firebase/           # Firebase Configuration
│   └── config.js       # Firebase initialization & exports
│
├── App.jsx             # Main app component (routing logic)
├── App.css             # App-specific styles
├── main.jsx            # Entry point (renders App)
└── index.css           # Global styles
```

### Why This Structure?

**Separation of Concerns:**
- **Components**: Pure UI, no business logic
- **Hooks**: Business logic reusable across components
- **Contexts**: Global state (auth, user)
- **Firebase**: Configuration isolated

**Benefits:**
- Easy to find files
- Scalable (easy to add features)
- Testable (logic separated from UI)
- Maintainable (clear responsibilities)

### Component Hierarchy

```
App
├── AuthProvider (Context)
│   └── AppContent
│       ├── Login (if not authenticated)
│       └── (if authenticated)
│           ├── Header
│           └── Main
│               ├── Dashboard (uses useExpenses)
│               ├── ExpenseForm (uses useExpenses)
│               └── ExpenseList (uses useExpenses)
```

---

## Data Flow Diagram

```
User Action
    ↓
Component (UI)
    ↓
Hook (Business Logic) → useExpenses.js
    ↓
Firebase SDK → firebase/firestore
    ↓
Cloud Firestore Database
    ↓
Security Rules Validation
    ↓
Data Stored/Retrieved
    ↓
Real-time Listener (onSnapshot)
    ↓
Hook Updates State
    ↓
Component Re-renders
    ↓
UI Updates Automatically
```

---

## Testing the Application

### 1. Start Development Server
```bash
npm run dev
```

### 2. Test Authentication
- Click "Sign in with Google"
- Complete Google OAuth flow
- Verify you're logged in (header shows email)

### 3. Test Create Expense
- Fill out expense form
- Submit
- Verify expense appears in list immediately

### 4. Test Delete Expense
- Click "Delete" on an expense
- Confirm deletion
- Verify expense disappears immediately

### 5. Test Dashboard
- Add multiple expenses
- Verify monthly total updates correctly

### 6. Test Security
- Sign in with different Google account
- Verify you only see your own expenses
- Try to access other user's expenses (should fail)

---

## Common Issues & Solutions

### Issue 1: "Missing or insufficient permissions"
**Solution:** 
- Check Firestore security rules are deployed
- Verify rules match the code in `firestore.rules`
- Ensure user is authenticated

### Issue 2: "Index required" error
**Solution:**
- Click the error link to auto-create index
- Or create manually: Firestore Console > Indexes

### Issue 3: Environment variables not working
**Solution:**
- Verify `.env` file exists in root
- Variables must start with `VITE_`
- Restart dev server after changing `.env`

### Issue 4: Date formatting issues
**Solution:**
- Always convert Date to Timestamp when saving: `Timestamp.fromDate(date)`
- Convert Timestamp to Date when reading: `timestamp.toDate()`

---

## Next Steps & Enhancements

1. **Edit Expenses**
   - Add `updateExpense()` function in hook
   - Add edit button to ExpenseList
   - Create edit form modal

2. **Filtering & Sorting**
   - Filter by category
   - Filter by date range
   - Sort by amount

3. **Charts & Analytics**
   - Monthly spending trends
   - Category breakdown (pie chart)
   - Weekly/daily comparisons

4. **Budget Tracking**
   - Set monthly budgets per category
   - Show progress bars
   - Budget alerts

5. **Export Data**
   - Export to CSV
   - Export to PDF
   - Email monthly reports

---

**Congratulations! You now have a complete expense tracking application! 🎉**

