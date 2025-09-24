#!/usr/bin/env node

/**
 * Simple WebSocket server for Yjs collaboration
 */

const WebSocket = require('ws');
const http = require('http');
const Y = require('yjs');

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 1234;

// Store Yjs documents
const docs = new Map();

// Create HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Yjs WebSocket Server Running');
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
  console.log('New WebSocket connection');
  
  // Extract room name from URL
  const url = new URL(req.url, `http://${req.headers.host}`);
  const roomName = url.pathname.slice(1) || 'default-room';
  
  console.log(`Client joined room: ${roomName}`);
  
  // Get or create Yjs document for this room
  if (!docs.has(roomName)) {
    const doc = new Y.Doc();
    docs.set(roomName, {
      doc,
      clients: new Set()
    });
    console.log(`Created new document for room: ${roomName}`);
  }
  
  const room = docs.get(roomName);
  room.clients.add(ws);
  
  // Handle incoming messages
  ws.on('message', (message) => {
    try {
      // Broadcast message to all other clients in the same room
      room.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });
  
  // Handle client disconnect
  ws.on('close', () => {
    console.log(`Client left room: ${roomName}`);
    room.clients.delete(ws);
    
    // Clean up empty rooms
    if (room.clients.size === 0) {
      docs.delete(roomName);
      console.log(`Cleaned up empty room: ${roomName}`);
    }
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    room.clients.delete(ws);
  });
});

server.listen(port, host, () => {
  console.log(`Yjs WebSocket server running on ws://${host}:${port}`);
  console.log(`Active rooms: ${docs.size}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  
  wss.close(() => {
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
});