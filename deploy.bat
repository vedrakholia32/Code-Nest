@echo off
echo 🚀 Deploying CodeNest to Vercel with Yjs Collaboration...

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 📦 Installing Vercel CLI...
    npm install -g vercel
)

REM Login to Vercel
echo 🔐 Checking Vercel authentication...
vercel whoami >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Please login to Vercel:
    vercel login
)

REM Set environment variables
echo ⚙️ Setting up environment variables...

REM Build the project locally
echo 🏗️ Building project locally...
npm run build

if %ERRORLEVEL% EQU 0 (
    echo ✅ Local build successful!
    
    REM Deploy to Vercel
    echo 🚀 Deploying to Vercel...
    vercel --prod
    
    echo 🎉 Deployment complete!
    echo.
    echo 📋 Next steps:
    echo 1. Your app is now live on Vercel
    echo 2. Yjs collaboration will work using the configured WebSocket server
    echo 3. For production use, consider upgrading to Hocuspocus Cloud
    echo.
    echo 🔗 Useful links:
    echo - Hocuspocus Cloud: https://hocuspocus.dev
    echo - Yjs Documentation: https://docs.yjs.dev
    echo - Vercel Dashboard: https://vercel.com/dashboard
) else (
    echo ❌ Build failed. Please fix errors before deploying.
    exit /b 1
)

pause