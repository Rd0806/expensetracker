# Vercel Environment Variables - Exact Setup

## Copy these EXACTLY into Vercel

Go to: **Vercel Dashboard** > **Your Project** > **Settings** > **Environment Variables**

Add each variable one by one:

### 1. VITE_FIREBASE_API_KEY
**Name:** `VITE_FIREBASE_API_KEY`  
**Value:** `AIzaSyByWG6lhGKXPvxXIiGsR5m2nQ2YodNXvBE`  
**Environment:** Production, Preview, Development

### 2. VITE_FIREBASE_AUTH_DOMAIN
**Name:** `VITE_FIREBASE_AUTH_DOMAIN`  
**Value:** `expense-tracker-32592.firebaseapp.com`  
**Environment:** Production, Preview, Development

### 3. VITE_FIREBASE_PROJECT_ID
**Name:** `VITE_FIREBASE_PROJECT_ID`  
**Value:** `expense-tracker-32592`  
**Environment:** Production, Preview, Development

### 4. VITE_FIREBASE_STORAGE_BUCKET
**Name:** `VITE_FIREBASE_STORAGE_BUCKET`  
**Value:** `expense-tracker-32592.firebasestorage.app`  
**Environment:** Production, Preview, Development

### 5. VITE_FIREBASE_MESSAGING_SENDER_ID
**Name:** `VITE_FIREBASE_MESSAGING_SENDER_ID`  
**Value:** `660967900730`  
**Environment:** Production, Preview, Development

### 6. VITE_FIREBASE_APP_ID
**Name:** `VITE_FIREBASE_APP_ID`  
**Value:** `1:660967900730:web:3012306066cbce1cbb1703`  
**Environment:** Production, Preview, Development

---

## ⚠️ Important Notes:

1. **NO QUOTES** - Don't put quotes around the values
2. **NO SPACES** - No spaces before or after the `=` sign
3. **EXACT NAMES** - Variable names must match exactly (case-sensitive)
4. **VITE_ Prefix** - All variables MUST start with `VITE_`

## After Adding Variables:

1. Go to **Deployments** tab
2. Click **"..."** menu on latest deployment
3. Click **"Redeploy"**
4. Wait for build to complete
5. Test your site again

## Verify in Firebase Console:

If you're not sure about your Firebase config values:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `expense-tracker-32592`
3. Click the **gear icon** ⚙️ > **Project Settings**
4. Scroll down to **"Your apps"** section
5. Click on your web app
6. Find **"SDK setup and configuration"**
7. Copy the config values from there

