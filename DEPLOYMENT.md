# Brick Rush - Deployment Guide

Complete guide for deploying Brick Rush to various hosting platforms.

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All dependencies are installed (`npm install`)
- [ ] Application builds successfully (`npm run build`)
- [ ] No console errors in production build
- [ ] Game works correctly in preview mode (`npm run preview`)
- [ ] High score persistence works (test localStorage)
- [ ] Responsive design tested on multiple devices
- [ ] Performance is acceptable (smooth 60 FPS)

## 🏗 Building for Production

```bash
# Install dependencies
npm install

# Create production build
npm run build

# Test production build locally
npm run preview
```

The build output will be in the `dist/` directory.

## 🚀 Deployment Platforms

### Netlify (Recommended)

**Option 1: Drag and Drop**
1. Build your app: `npm run build`
2. Go to [Netlify Drop](https://app.netlify.com/drop)
3. Drag the `dist/` folder onto the page
4. Done! Your site is live

**Option 2: Git Integration**
1. Push your code to GitHub/GitLab/Bitbucket
2. Log in to [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Click "Deploy site"

**netlify.toml** (optional):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### Vercel

**Option 1: Vercel CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

**Option 2: Git Integration**
1. Push code to GitHub/GitLab/Bitbucket
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Vercel auto-detects Vite configuration
6. Click "Deploy"

**vercel.json** (optional):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Update `package.json`:
```json
{
  "homepage": "https://yourusername.github.io/brick-rush",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Update `vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/brick-rush/', // Your repo name
})
```

4. Deploy:
```bash
npm run deploy
```

5. Enable GitHub Pages in repository settings (use `gh-pages` branch)

### Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login and initialize:
```bash
firebase login
firebase init hosting
```

3. Configure (select):
   - Public directory: `dist`
   - Single-page app: Yes
   - GitHub auto deploys: Optional

4. Build and deploy:
```bash
npm run build
firebase deploy
```

**firebase.json**:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### Cloudflare Pages

1. Push code to GitHub/GitLab
2. Go to [Cloudflare Pages](https://pages.cloudflare.com)
3. Click "Create a project"
4. Connect your repository
5. Configure build:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Framework preset:** Vite
6. Click "Save and Deploy"

### Render

1. Push code to GitHub/GitLab
2. Go to [Render](https://render.com)
3. Click "New Static Site"
4. Connect repository
5. Configure:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Click "Create Static Site"

### AWS S3 + CloudFront

**Prerequisites:**
- AWS Account
- AWS CLI installed and configured

**Steps:**
```bash
# Build the app
npm run build

# Create S3 bucket
aws s3 mb s3://brick-rush-game

# Enable static website hosting
aws s3 website s3://brick-rush-game --index-document index.html

# Upload files
aws s3 sync dist/ s3://brick-rush-game --delete

# Set public read permissions
aws s3api put-bucket-policy --bucket brick-rush-game --policy file://bucket-policy.json
```

**bucket-policy.json:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::brick-rush-game/*"
    }
  ]
}
```

For CloudFront CDN setup, see AWS documentation.

## 🔐 Environment Variables

If using environment variables:

### Netlify
- Dashboard → Site settings → Build & deploy → Environment
- Add variables with `VITE_` prefix

### Vercel
- Dashboard → Project → Settings → Environment Variables
- Add variables with `VITE_` prefix

### GitHub Pages
- Use repository secrets for sensitive data
- Add to build workflow if using GitHub Actions

## ⚡ Performance Optimization

### Before Deployment

1. **Optimize images** (if you add any):
```bash
npm install --save-dev vite-plugin-imagemin
```

2. **Enable compression**:
Most hosting platforms auto-enable gzip/brotli

3. **Analyze bundle size**:
```bash
npm run build -- --mode analyze
```

4. **Check Lighthouse scores**:
- Run in Chrome DevTools
- Aim for 90+ in all categories

### Vite Production Optimizations

Update `vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
```

## 🔍 Post-Deployment Testing

1. **Verify deployment**:
   - Game loads without errors
   - All menus function correctly
   - Canvas renders properly
   - Controls work (keyboard, mouse, touch)

2. **Test on multiple devices**:
   - Desktop browsers (Chrome, Firefox, Safari, Edge)
   - Mobile browsers (iOS Safari, Chrome Mobile)
   - Different screen sizes

3. **Check performance**:
   - Open DevTools Performance tab
   - Record gameplay session
   - Verify 60 FPS maintained
   - Check memory usage

4. **Verify localStorage**:
   - Play game and set high score
   - Refresh page
   - Confirm high score persists

## 🐛 Troubleshooting

### Blank page after deployment
- Check browser console for errors
- Verify `base` in `vite.config.js` matches deployment path
- Ensure `dist/` folder contains built files

### Assets not loading
- Check `base` path configuration
- Verify asset paths don't start with `/` if using subdirectory
- Check browser Network tab for 404 errors

### Canvas not displaying
- Verify Canvas API support in target browsers
- Check for JavaScript errors
- Ensure proper viewport meta tag

### Poor performance
- Check bundle size (should be < 500KB)
- Verify production build is being used
- Enable CDN caching
- Consider lazy loading components

### LocalStorage not working
- Check browser privacy settings
- Verify domain has storage permission
- Test in incognito mode

## 📊 Monitoring

### Analytics (Optional)

Add Google Analytics or similar:

```javascript
// src/utils/analytics.js
export const trackEvent = (category, action, label) => {
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
    });
  }
};
```

### Error Tracking (Optional)

Consider adding Sentry:
```bash
npm install @sentry/react
```

## 🔄 Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## 📝 Custom Domain

### Netlify
1. Domains → Add custom domain
2. Follow DNS instructions
3. Enable HTTPS (automatic with Let's Encrypt)

### Vercel
1. Settings → Domains
2. Add domain
3. Configure DNS records
4. HTTPS enabled automatically

### Cloudflare Pages
1. Custom domains tab
2. Add domain
3. Update nameservers or add CNAME
4. SSL/TLS automatic

## 🎉 Success!

Your Brick Rush game is now deployed! Share the URL and let players enjoy breaking bricks!

## 📚 Additional Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Deployment](https://react.dev/learn/start-a-new-react-project#deploying-to-production)
- [Netlify Documentation](https://docs.netlify.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Pages Guide](https://pages.github.com/)

---

**Need help?** Open an issue on the repository or check the troubleshooting section above.