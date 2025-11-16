# Troubleshooting - Not Seeing Anything

## Quick Checks:

1. **Open the Browser**
   - Open Chrome/Firefox/Edge
   - Go to: `http://localhost:5173/`
   - You should see the login page with "Sign in with Google" button

2. **Check Browser Console**
   - Press `F12` to open Developer Tools
   - Click the "Console" tab
   - Look for RED error messages
   - Common errors:
     - Firebase config issues (missing env variables)
     - Module not found errors
     - CORS errors

3. **Restart Dev Server**
   - Stop server: Press `Ctrl + C` in terminal
   - Start again: `npm run dev`
   - Wait for "ready" message
   - Refresh browser (F5)

4. **Verify .env File**
   - Make sure `.env` is in project root (same folder as `package.json`)
   - Check all values start with `VITE_`
   - No quotes around values in .env file
   - Restart server after creating/editing .env

5. **Check Network Tab**
   - Open DevTools (F12) > Network tab
   - Refresh page (F5)
   - Look for failed requests (red)

## Common Issues:

### Issue: Blank White Page
**Solution:** Check browser console for errors. Usually Firebase config not loaded.

### Issue: "Firebase config not found"
**Solution:** 
- Verify `.env` file exists
- Check variable names start with `VITE_`
- Restart dev server

### Issue: Page loads but nothing shows
**Solution:** 
- Check console for React errors
- Verify all dependencies installed (`npm install`)

### Issue: Port already in use
**Solution:**
- Change port: `npm run dev -- --port 5174`
- Or kill process using port 5173

