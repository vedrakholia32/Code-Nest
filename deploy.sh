#!/bin/bash

# CodeNest Vercel Deployment Script
echo "🚀 Deploying CodeNest to Vercel with Yjs Collaboration..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
echo "🔐 Checking Vercel authentication..."
vercel whoami || vercel login

# Set environment variables for production
echo "⚙️ Setting up environment variables..."

# Check if environment variables exist, if not, prompt user
echo "Setting up Yjs WebSocket URL..."
vercel env ls | grep -q "NEXT_PUBLIC_YJS_WS_URL" || {
    echo "Please enter your Yjs WebSocket URL (default: wss://demos.yjs.dev):"
    read -r YJS_URL
    YJS_URL=${YJS_URL:-"wss://demos.yjs.dev"}
    echo "$YJS_URL" | vercel env add NEXT_PUBLIC_YJS_WS_URL production
}

# Set production environment
echo "production" | vercel env add NODE_ENV production 2>/dev/null || echo "NODE_ENV already set"

# Build the project locally to check for errors
echo "🏗️ Building project locally..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Local build successful!"
    
    # Deploy to Vercel
    echo "🚀 Deploying to Vercel..."
    vercel --prod
    
    echo "🎉 Deployment complete!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Your app is now live on Vercel"
    echo "2. Yjs collaboration will work using the configured WebSocket server"
    echo "3. For production use, consider upgrading to Hocuspocus Cloud"
    echo ""
    echo "🔗 Useful links:"
    echo "- Hocuspocus Cloud: https://hocuspocus.dev"
    echo "- Yjs Documentation: https://docs.yjs.dev"
    echo "- Vercel Dashboard: https://vercel.com/dashboard"
    
else
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi