# রক্তবন্ধু (RoktoBondhu) - Blood Donor Social Network

একটি আধুনিক, জীবন রক্ষাকারী ও নির্ভরযোগ্য রক্তদান সামাজিক প্ল্যাটফর্ম ও জরুরি রক্তদাতা ডিরেক্টরি।

## 🌐 GitHub Pages Deployment Guide

### কেন পূর্বে সাদা ফাঁকা পেজ (Blank White Page) দেখাত?
GitHub Pages সাধারণত একটি সাব-পাথে হোস্ট হয় (যেমন `https://<username>.github.io/<repo-name>/`)। ডিফল্টভাবে Vite-এর `base` পাথ থাকে `/` (রুট পাথ), ফলে ব্রাউজার জাভাস্ক্রিপ্ট এবং সিএসএস অ্যাসেটগুলো `https://<username>.github.io/assets/...` থেকে খুঁজতে গিয়ে ৪MD (404 Not Found) পেত এবং পৃষ্ঠাটি সাদা হয়ে যেত। 

আমরা `vite.config.ts`-এ `base: './'` (আপেক্ষিক পাথ) কনফিগার করেছি, ফলে যেকোনো সাব-পাথ বা রিপোজিটরি নামেই ফাইলগুলো নিখুঁতভাবে লোড হবে।

### GitHub Pages-এ সক্রিয় করার সহজ নিয়ম:
1. আপনার গিটহাব রিপোজিটরির **Settings** ট্যাবে যান।
2. বাঁপাশের মেনু থেকে **Pages** অপশনে ক্লিক করুন।
3. **Build and deployment > Source** ড্রপডাউন থেকে **GitHub Actions** নির্বাচন করুন।
4. আমরা ইতিমধ্যেই `.github/workflows/deploy.yml` যুক্ত করে দিয়েছি। এখন যেকোনো সময় `main` ব্রাঞ্চে কোড পুশ করলেই স্বয়ংক্রিয়ভাবে গিটহাব পেজেস-এ সাইট লাইভ হয়ে যাবে!

---

## 🚀 Vercel Deployment Guide

This project is configured and fully ready to deploy to [Vercel](https://vercel.com).

### Option 1: Deploy with Vercel Git Integration (Recommended)

1. Push this repository to **GitHub**, **GitLab**, or **Bitbucket**.
2. Open your [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New Project"**.
3. Import this repository.
4. Vercel will automatically detect the settings from `vercel.json`:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click **"Deploy"**. Your site will be live on a `*.vercel.app` URL with automatic SSL and global CDN edge routing.

### Option 2: Deploy with Vercel CLI

1. Install Vercel CLI globally (if not already installed):
   ```bash
   npm i -g vercel
   ```
2. Login to Vercel:
   ```bash
   vercel login
   ```
3. Deploy directly from the project root:
   ```bash
   vercel
   ```
4. For production deployment:
   ```bash
   vercel --prod
   ```

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Type-check and lint
npm run lint
```

## ⚙️ Configuration Files Included

- **`vercel.json`**: Configures the Vite framework preset, SPA fallback rewrites for client-side routing, and long-term caching headers for production assets.
- **`vite.config.ts`**: Configured with standard ESM path resolution for cross-platform compatibility on Vercel Node runtimes.
- **`.gitignore`**: Ignores `node_modules`, `dist`, `.vercel`, and temporary logs.
