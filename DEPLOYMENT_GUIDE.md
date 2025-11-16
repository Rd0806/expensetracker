# Deployment Guide - Make Your App Live

This guide covers how to deploy your Expense Tracker app to the internet. Since you're using Firebase, I recommend **Firebase Hosting** as the primary option, with **Vercel** as an easy alternative.

---

## 🚀 Option 1: Firebase Hosting (Recommended)

Since you're already using Firebase (Authentication + Firestore), Firebase Hosting is the most integrated solution.

### Step 1: Install Firebase CLI

Open your terminal and install Firebase CLI globally:

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

This will open a browser window. Sign in with your Google account (the same one you used for Firebase Console).

### Step 3: Initialize Firebase Hosting

Navigate to your project directory and run:

```bash
cd c:\Users\rudra\Desktop\Expense_Tracker
firebase init hosting
```

**When prompted, select these options:**

1. **"What do you want to use as your public directory?"**
   - Type: `dist` (this is where Vite builds your production files)

2. **"Configure as a single-page app (rewrite all urls to /index.html)?"**
   - Type: `Yes` (important for React Router to work)

3. **"Set up automatic builds and deploys with GitHub?"**
   - Type: `No` (we'll do manual deployment for now)

4. **"File dist/index.html already exists. Overwrite?"**
   - Type: `No` (keep your existing files)

### Step 4: Build Your App for Production

Before deploying, you need to build the production version:

```bash
npm run build
```

This creates an optimized `dist` folder with all your production files.

### Step 5: Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

🎉 **Done!** Your app will be live at: `https://your-project-id.web.app`

### Step 6: Configure Environment Variables in Firebase Hosting

Your `.env` file won't work in production. You need to add environment variables to your build:

**Option A: Use `.env.production` file (Recommended for Vite)**

1. Create a `.env.production` file in your project root (same location as `.env`)
2. Copy your Firebase config values:

```env
VITE_FIREBASE_API_KEY=AIzaSyByWG6lhGKXPvxXIiGsR5m2nQ2YodNXvBE
VITE_FIREBASE_AUTH_DOMAIN=expense-tracker-32592.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=expense-tracker-32592
VITE_FIREBASE_STORAGE_BUCKET=expense-tracker-32592.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=660967900730
VITE_FIREBASE_APP_ID=1:660967900730:web:3012306066cbce1cbb1703
```

3. Rebuild and redeploy:

```bash
npm run build
firebase deploy --only hosting
```

**Option B: Set variables in Firebase Hosting Console**

Firebase Hosting doesn't support environment variables directly, so Option A is better.

### Step 7: Add Authorized Domains for Google Sign-In

Since your app is now on a new domain, you need to authorize it:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication** > **Settings** > **Authorized domains**
4. Your Firebase domain (`your-project.web.app`) should already be there
5. If you use a custom domain, add it here

### Updating Your App After Changes

Whenever you make changes:

```bash
# 1. Build the production version
npm run build

# 2. Deploy to Firebase
firebase deploy --only hosting
```

---

## 🌐 Option 2: Vercel (Alternative - Very Easy)

Vercel is another excellent option that's very easy to set up and free for personal projects.

### Step 1: Create a Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account (or email)

### Step 2: Install Vercel CLI (Optional)

You can deploy via web interface OR command line:

```bash
npm install -g vercel
```

### Step 3: Prepare for Deployment

1. Make sure your code is in a GitHub repository (recommended) or use Vercel CLI

**If using GitHub:**
- Push your code to GitHub first
- Then import the repository in Vercel

**If using CLI:**
- Make sure you've built your app: `npm run build`
- Navigate to your project directory

### Step 4: Deploy via Vercel Website

1. **Go to Vercel Dashboard:** [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your GitHub repository (or upload via CLI)
4. Configure project:
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. **Add Environment Variables:**
   - Click "Environment Variables" section
   - Add each variable from your `.env` file:
     ```
     VITE_FIREBASE_API_KEY
     VITE_FIREBASE_AUTH_DOMAIN
     VITE_FIREBASE_PROJECT_ID
     VITE_FIREBASE_STORAGE_BUCKET
     VITE_FIREBASE_MESSAGING_SENDER_ID
     VITE_FIREBASE_APP_ID
     ```

6. Click **"Deploy"**

🎉 **Done!** Your app will be live at: `https://your-app-name.vercel.app`

### Step 5: Update Firebase Authorized Domains

1. Go to Firebase Console > Authentication > Settings > Authorized domains
2. Add your Vercel domain: `your-app-name.vercel.app`

### Deploying Updates

Vercel automatically deploys when you push to GitHub, OR you can deploy manually:

```bash
vercel --prod
```

---

## 🔧 Pre-Deployment Checklist

Before deploying, make sure:

- [ ] ✅ Your app builds successfully (`npm run build` works)
- [ ] ✅ Firebase Authentication is enabled
- [ ] ✅ Firestore security rules are deployed
- [ ] ✅ Your `.env` values are ready (or `.env.production` for Vite)
- [ ] ✅ Test your app locally with `npm run preview` first

---

## 🛠️ Troubleshooting

### Issue: "Build failed"

**Solution:**
- Make sure all dependencies are installed: `npm install`
- Check for TypeScript/linting errors
- Try building locally: `npm run build`

### Issue: "Environment variables not working"

**Solution:**
- For Vite apps, variables must start with `VITE_`
- Rebuild after changing environment variables
- In Vercel, make sure variables are added in the dashboard

### Issue: "Google Sign-In not working after deployment"

**Solution:**
- Add your deployment domain to Firebase Console > Authentication > Settings > Authorized domains
- Make sure `authDomain` in your config matches your Firebase project

### Issue: "404 errors on page refresh"

**Solution:**
- For Firebase Hosting: Make sure you answered "Yes" to "single-page app" question
- Check `firebase.json` has the rewrite rule:
  ```json
  "rewrites": [
    {
      "source": "**",
      "destination": "/index.html"
    }
  ]
  ```

---

## 📝 Firebase Hosting Configuration File

After running `firebase init`, you'll have a `firebase.json` file. It should look like:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

## 🎯 Quick Start Commands

### Firebase Hosting:
```bash
# First time setup
npm install -g firebase-tools
firebase login
firebase init hosting

# Build and deploy
npm run build
firebase deploy --only hosting
```

### Vercel:
```bash
# Via CLI
npm install -g vercel
vercel login
vercel --prod

# Or use the web interface at vercel.com
```

---

## 🌍 Custom Domain (Optional)

Both platforms support custom domains:

### Firebase Hosting:
1. Firebase Console > Hosting > Add custom domain
2. Follow the DNS configuration steps

### Vercel:
1. Vercel Dashboard > Project Settings > Domains
2. Add your domain and configure DNS

---

## 📊 Which Should I Choose?

**Choose Firebase Hosting if:**
- You want everything in one place (Firebase ecosystem)
- You're already using Firebase for backend
- You want tight integration with Firebase services

**Choose Vercel if:**
- You want the easiest deployment experience
- You want automatic deployments from GitHub
- You prefer a modern developer experience
- You want free SSL and CDN automatically

**Both are:**
- ✅ Free for personal projects
- ✅ Easy to set up
- ✅ Support custom domains
- ✅ Fast CDN
- ✅ SSL certificates automatically

---

## 🎉 You're Live!

Once deployed, your app will be accessible worldwide. Share your URL and start tracking expenses!

**Need Help?**
- Firebase Hosting Docs: https://firebase.google.com/docs/hosting
- Vercel Docs: https://vercel.com/docs

