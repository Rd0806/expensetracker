# Quick Deployment - Get Live in 5 Minutes! 🚀

## 🎯 Fastest Way: Vercel (Recommended for Beginners)

### Step 1: Push to GitHub (if not already done)

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Expense Tracker"

# Create a repository on GitHub.com, then:
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. **Go to:** [vercel.com/new](https://vercel.com/new)
2. **Sign in** with GitHub
3. **Import your repository**
4. **Configure:**
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Add Environment Variables** (Click "Environment Variables"):
   ```
   VITE_FIREBASE_API_KEY = AIzaSyByWG6lhGKXPvxXIiGsR5m2nQ2YodNXvBE
   VITE_FIREBASE_AUTH_DOMAIN = expense-tracker-32592.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID = expense-tracker-32592
   VITE_FIREBASE_STORAGE_BUCKET = expense-tracker-32592.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID = 660967900730
   VITE_FIREBASE_APP_ID = 1:660967900730:web:3012306066cbce1cbb1703
   ```

6. **Click "Deploy"**

✅ **Done!** Your app is live at `https://your-app.vercel.app`

---

## 🔥 Alternative: Firebase Hosting

### One-Time Setup

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Initialize (in your project folder)
cd c:\Users\rudra\Desktop\Expense_Tracker
firebase init hosting
```

**When prompted:**
- Public directory: `dist`
- Single-page app: `Yes`
- Set up GitHub: `No`
- Overwrite index.html: `No`

### Every Time You Deploy

```bash
# 1. Build
npm run build

# 2. Deploy
firebase deploy --only hosting
```

✅ **Your app is live at:** `https://your-project-id.web.app`

---

## ⚠️ Important: Add Domain to Firebase

After deploying, add your domain to Firebase:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. **Authentication** > **Settings** > **Authorized domains**
4. Add your deployment URL (e.g., `your-app.vercel.app`)

---

## 🧪 Test Before Deploying

Test your production build locally first:

```bash
npm run build
npm run preview
```

Visit `http://localhost:4173` to test before going live!

---

## 📝 Need More Details?

See `DEPLOYMENT_GUIDE.md` for complete instructions and troubleshooting.

