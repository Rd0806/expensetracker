# Quick Start Guide - Using Your Firebase Config

## Step 1: Create `.env` File

Create a file named `.env` in the root of your project (same folder as `package.json`).

## Step 2: Add Your Firebase Configuration

Copy and paste the following into your `.env` file, replacing with YOUR actual values:

```env
VITE_FIREBASE_API_KEY=AIzaSyByWG6lhGKXPvxXIiGsR5m2nQ2YodNXvBE
VITE_FIREBASE_AUTH_DOMAIN=expense-tracker-32592.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=expense-tracker-32592
VITE_FIREBASE_STORAGE_BUCKET=expense-tracker-32592.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=660967900730
VITE_FIREBASE_APP_ID=1:660967900730:web:3012306066cbce1cbb1703
```

## Important Notes:

1. **measurementId** - This is for Firebase Analytics (optional). You don't need it for the expense tracker to work, so I've omitted it from the config. If you want analytics later, you can add it.

2. **Environment Variable Names** - All variables MUST start with `VITE_` to work with Vite. That's why we use `VITE_FIREBASE_API_KEY` instead of just `FIREBASE_API_KEY`.

3. **Don't Commit `.env`** - The `.env` file is already in `.gitignore` to keep your credentials safe. Never commit it to Git!

## Step 3: Next Steps

After creating your `.env` file:

1. **Enable Google Authentication:**
   - Go to Firebase Console > Authentication > Sign-in method
   - Click "Google" and enable it
   - Set a support email
   - Save

2. **Create Firestore Database:**
   - Go to Firestore Database > Create database
   - Start in test mode (we'll update rules later)
   - Choose a location

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Start the App:**
   ```bash
   npm run dev
   ```

5. **Set Firestore Security Rules:**
   - Go to Firestore Database > Rules
   - Copy rules from `firestore.rules` file
   - Paste and click "Publish"

You're all set! 🎉

