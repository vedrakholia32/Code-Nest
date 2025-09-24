# Vercel Deployment Guide for Yjs Collaborative Editor

## Deployment Options

### Option 1: Public Demo Server (Quick Start) ⚡
**Best for**: Testing, demos, proof of concept
**Pros**: Zero setup, works immediately
**Cons**: Shared server, not production-ready

**Setup**: Already configured! Just deploy to Vercel.

```bash
# Deploy to Vercel
vercel --prod
```

### Option 2: Hocuspocus Cloud (Recommended) 🏆
**Best for**: Production applications
**Pros**: Professional hosting, scalable, reliable
**Cons**: Paid service (starts at $29/month)

**Setup**:
1. Sign up at [hocuspocus.dev](https://hocuspocus.dev)
2. Create a new project
3. Get your WebSocket URL
4. Update environment variables

```bash
# Add to .env.local
NEXT_PUBLIC_YJS_WS_URL=wss://your-app.hocuspocus.dev
```

### Option 3: Railway/Render WebSocket Server 🚂
**Best for**: Custom deployments with control
**Pros**: Full control, cost-effective
**Cons**: Requires server management

**Setup**:
1. Deploy `yjs-server.js` to Railway/Render
2. Get the WebSocket URL
3. Update environment variables

## Production Environment Variables

Create these environment variables in Vercel:

```bash
NEXT_PUBLIC_YJS_WS_URL=wss://your-yjs-server.com
NEXT_PUBLIC_NODE_ENV=production
```

## Vercel Configuration

Create `vercel.json` in your root directory:

```json
{
  "functions": {
    "src/app/**/*.tsx": {
      "runtime": "@vercel/node"
    }
  },
  "env": {
    "NEXT_PUBLIC_YJS_WS_URL": "@yjs_ws_url"
  }
}
```

## Build Optimization

Update your build script for production:

```json
{
  "scripts": {
    "build": "next build",
    "build:production": "NODE_ENV=production next build",
    "start": "next start"
  }
}
```

## Deployment Commands

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_YJS_WS_URL
```

## Performance Considerations

### 1. WebSocket Connection Optimization
- Use WSS (secure WebSocket) in production
- Implement connection retry logic
- Add connection state management

### 2. Bundle Size Optimization
- Yjs libraries are already optimized
- Use dynamic imports for collaboration components
- Enable Next.js bundle analyzer

### 3. Caching Strategy
- Static assets cached by Vercel CDN
- WebSocket connections bypass CDN
- Implement service worker for offline support

## Security Considerations

### 1. Room Access Control
```typescript
// Add room authentication
const roomId = `${userId}-${projectId}-${timestamp}`;
```

### 2. Rate Limiting
```typescript
// Implement connection rate limiting
const MAX_CONNECTIONS_PER_IP = 10;
```

### 3. Data Validation
```typescript
// Validate user permissions before joining
if (!user.canAccessRoom(roomId)) {
  throw new Error('Unauthorized');
}
```

## Monitoring and Analytics

### 1. Connection Health
- Monitor WebSocket connection status
- Track reconnection rates
- Alert on high latency

### 2. User Engagement
- Track active collaboration sessions
- Monitor concurrent user counts
- Measure collaboration effectiveness

## Cost Estimation

### Option 1: Public Demo Server
- **Cost**: Free
- **Reliability**: Basic
- **Scalability**: Limited

### Option 2: Hocuspocus Cloud
- **Cost**: $29-99/month
- **Reliability**: High
- **Scalability**: Excellent

### Option 3: Self-hosted (Railway)
- **Cost**: $5-20/month
- **Reliability**: Good
- **Scalability**: Moderate

## Recommended Production Stack

```
Frontend: Next.js on Vercel
WebSocket: Hocuspocus Cloud
Database: Convex (for persistence)
Auth: Clerk
Monitoring: Vercel Analytics
```

This provides enterprise-grade collaboration with 99.9% uptime!