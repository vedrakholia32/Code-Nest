import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { nanoid } from "nanoid";

// Create a new collaboration room
export const createRoom = mutation({
  args: {
    projectId: v.optional(v.id("projects")), // Make projectId optional
    maxParticipants: v.optional(v.number()),
    expiresIn: v.optional(v.number()), // minutes from now
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Not authenticated");

    // If projectId is provided, check if user owns the project
    if (args.projectId) {
      const project = await ctx.db.get(args.projectId);
      if (!project || project.userId !== identity.subject) {
        throw new ConvexError("Not authorized to create room for this project");
      }
    }

    const roomId = nanoid(10);
    const now = Date.now();
    const expiresAt = args.expiresIn ? now + (args.expiresIn * 60 * 1000) : undefined;

    // Create the room (projectId can be undefined for standalone sessions)
    const roomDocId = await ctx.db.insert("collaborationRooms", {
      projectId: args.projectId,
      roomId,
      hostUserId: identity.subject,
      isActive: true,
      maxParticipants: args.maxParticipants || 10,
      createdAt: now,
      expiresAt,
    });

    // Add host as first participant
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];
    const userColor = colors[Math.floor(Math.random() * colors.length)];
    
    await ctx.db.insert("roomParticipants", {
      roomId,
      userId: identity.subject,
      userName: identity.name || "Unknown User",
      userColor,
      role: "host",
      joinedAt: now,
      lastSeenAt: now,
      isActive: true,
    });

    return { roomId, roomDocId };
  },
});

// Join an existing room
export const joinRoom = mutation({
  args: {
    roomId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Not authenticated");

    console.log(`Attempting to join room: ${args.roomId}`);

    // Check if room exists and is active
    const room = await ctx.db
      .query("collaborationRooms")
      .withIndex("by_room_id")
      .filter((q) => q.eq(q.field("roomId"), args.roomId))
      .first();

    console.log(`Room found:`, room);

    if (!room) {
      throw new ConvexError("Room not found");
    }

    if (!room.isActive) {
      throw new ConvexError("Room is inactive");
    }

    // Check if room has expired
    if (room.expiresAt && room.expiresAt < Date.now()) {
      throw new ConvexError("Room has expired");
    }

    // Check if user is already in the room
    const existingParticipant = await ctx.db
      .query("roomParticipants")
      .withIndex("by_room_id_and_user_id")
      .filter((q) => 
        q.and(
          q.eq(q.field("roomId"), args.roomId),
          q.eq(q.field("userId"), identity.subject)
        )
      )
      .first();

    if (existingParticipant) {
      // Update last seen and set active
      await ctx.db.patch(existingParticipant._id, {
        lastSeenAt: Date.now(),
        isActive: true,
      });
      return { success: true, participant: existingParticipant };
    }

    // Check room capacity
    const activeParticipants = await ctx.db
      .query("roomParticipants")
      .withIndex("by_room_id")
      .filter((q) => 
        q.and(
          q.eq(q.field("roomId"), args.roomId),
          q.eq(q.field("isActive"), true)
        )
      )
      .collect();

    if (activeParticipants.length >= room.maxParticipants) {
      throw new ConvexError("Room is full");
    }

    // Add user to room
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];
    const userColor = colors[Math.floor(Math.random() * colors.length)];
    
    const participantId = await ctx.db.insert("roomParticipants", {
      roomId: args.roomId,
      userId: identity.subject,
      userName: identity.name || "Unknown User",
      userColor,
      role: "collaborator",
      joinedAt: Date.now(),
      lastSeenAt: Date.now(),
      isActive: true,
    });

    const participant = await ctx.db.get(participantId);
    return { success: true, participant };
  },
});

// Leave a room
export const leaveRoom = mutation({
  args: {
    roomId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Not authenticated");

    const participant = await ctx.db
      .query("roomParticipants")
      .withIndex("by_room_id_and_user_id")
      .filter((q) => 
        q.and(
          q.eq(q.field("roomId"), args.roomId),
          q.eq(q.field("userId"), identity.subject)
        )
      )
      .first();

    if (participant) {
      await ctx.db.patch(participant._id, {
        isActive: false,
        lastSeenAt: Date.now(),
      });
    }

    return { success: true };
  },
});

// Update user presence (cursor position, last seen)
export const updatePresence = mutation({
  args: {
    roomId: v.string(),
    cursorPosition: v.optional(v.object({
      line: v.number(),
      column: v.number(),
      fileId: v.optional(v.id("files")),
    })),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Not authenticated");

    const participant = await ctx.db
      .query("roomParticipants")
      .withIndex("by_room_id_and_user_id")
      .filter((q) => 
        q.and(
          q.eq(q.field("roomId"), args.roomId),
          q.eq(q.field("userId"), identity.subject)
        )
      )
      .first();

    if (participant) {
      await ctx.db.patch(participant._id, {
        cursorPosition: args.cursorPosition,
        lastSeenAt: Date.now(),
        isActive: true,
      });
    }

    return { success: true };
  },
});

// Get room participants and their presence
export const getRoomParticipants = query({
  args: {
    roomId: v.string(),
  },
  handler: async (ctx, args) => {
    const participants = await ctx.db
      .query("roomParticipants")
      .withIndex("by_room_id")
      .filter((q) => q.eq(q.field("roomId"), args.roomId))
      .collect();

    // Filter out inactive participants (haven't been seen in 5 minutes)
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    const activeParticipants = participants.filter(
      (p) => p.isActive && p.lastSeenAt > fiveMinutesAgo
    );

    return activeParticipants;
  },
});

// Get room info
export const getRoomInfo = query({
  args: {
    roomId: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query("collaborationRooms")
      .withIndex("by_room_id")
      .filter((q) => q.eq(q.field("roomId"), args.roomId))
      .first();

    if (!room) return null;

    const project = room.projectId ? await ctx.db.get(room.projectId) : null;
    const participants = await ctx.db
      .query("roomParticipants")
      .withIndex("by_room_id")
      .filter((q) => 
        q.and(
          q.eq(q.field("roomId"), args.roomId),
          q.eq(q.field("isActive"), true)
        )
      )
      .collect();

    return {
      room,
      project,
      participantCount: participants.length,
    };
  },
});

// Clean up expired rooms and inactive participants
export const cleanupRooms = mutation({
  handler: async (ctx) => {
    const now = Date.now();
    const thirtyMinutesAgo = now - 30 * 60 * 1000;

    // Mark expired rooms as inactive
    const expiredRooms = await ctx.db
      .query("collaborationRooms")
      .filter((q) => 
        q.and(
          q.eq(q.field("isActive"), true),
          q.lt(q.field("expiresAt"), now)
        )
      )
      .collect();

    for (const room of expiredRooms) {
      await ctx.db.patch(room._id, { isActive: false });
    }

    // Mark participants as inactive if not seen in 30 minutes
    const staleParticipants = await ctx.db
      .query("roomParticipants")
      .filter((q) => 
        q.and(
          q.eq(q.field("isActive"), true),
          q.lt(q.field("lastSeenAt"), thirtyMinutesAgo)
        )
      )
      .collect();

    for (const participant of staleParticipants) {
      await ctx.db.patch(participant._id, { isActive: false });
    }

    return { 
      expiredRooms: expiredRooms.length, 
      staleParticipants: staleParticipants.length 
    };
  },
});

// Debug: List all rooms (for debugging purposes)
export const listAllRooms = query({
  args: {},
  handler: async (ctx, args) => {
    const rooms = await ctx.db.query("collaborationRooms").collect();
    console.log("All rooms:", rooms);
    return rooms;
  }
});

// Document Operations for Real-Time Collaboration

// Get current document state
export const getDocumentState = query({
  args: { roomId: v.string() },
  handler: async (ctx, args) => {
    const docState = await ctx.db
      .query("documentStates")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .first();
    
    return docState || { 
      roomId: args.roomId, 
      content: "", 
      version: 0, 
      lastModified: Date.now() 
    };
  },
});

// Apply text operation (insert, delete, replace)
export const applyOperation = mutation({
  args: {
    roomId: v.string(),
    operation: v.object({
      type: v.union(v.literal("insert"), v.literal("delete"), v.literal("replace")),
      position: v.number(),
      content: v.optional(v.string()),
      length: v.optional(v.number()),
    }),
    operationId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Not authenticated");

    // Check if operation already exists (prevent duplicates)
    const existingOp = await ctx.db
      .query("documentOperations")
      .withIndex("by_operation_id", (q) => q.eq("operationId", args.operationId))
      .first();
    
    if (existingOp) {
      return { success: false, reason: "Operation already applied" };
    }

    // Get current document state
    let docState = await ctx.db
      .query("documentStates")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .first();

    let currentContent = docState?.content || "";
    
    // Apply the operation
    let newContent = currentContent;
    const { operation } = args;

    try {
      switch (operation.type) {
        case "insert":
          if (operation.content !== undefined) {
            newContent = 
              currentContent.slice(0, operation.position) + 
              operation.content + 
              currentContent.slice(operation.position);
          }
          break;
        case "delete":
          if (operation.length !== undefined) {
            newContent = 
              currentContent.slice(0, operation.position) + 
              currentContent.slice(operation.position + operation.length);
          }
          break;
        case "replace":
          if (operation.content !== undefined && operation.length !== undefined) {
            newContent = 
              currentContent.slice(0, operation.position) + 
              operation.content + 
              currentContent.slice(operation.position + operation.length);
          }
          break;
      }

      // Store the operation
      await ctx.db.insert("documentOperations", {
        roomId: args.roomId,
        operation: args.operation,
        timestamp: Date.now(),
        userId: identity.subject,
        operationId: args.operationId,
      });

      // Update document state
      const newVersion = (docState?.version || 0) + 1;
      if (docState) {
        await ctx.db.patch(docState._id, {
          content: newContent,
          lastModified: Date.now(),
          version: newVersion,
        });
      } else {
        await ctx.db.insert("documentStates", {
          roomId: args.roomId,
          content: newContent,
          lastModified: Date.now(),
          version: newVersion,
        });
      }

      return { success: true, newContent, version: newVersion };
    } catch (error) {
      console.error("Error applying operation:", error);
      return { success: false, reason: "Failed to apply operation" };
    }
  },
});

// Initialize document with initial content
export const initializeDocument = mutation({
  args: {
    roomId: v.string(),
    initialContent: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Not authenticated");

    // Check if document already exists
    const existingDoc = await ctx.db
      .query("documentStates")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .first();

    if (existingDoc) {
      return { success: false, reason: "Document already initialized" };
    }

    // Create new document state
    await ctx.db.insert("documentStates", {
      roomId: args.roomId,
      content: args.initialContent,
      lastModified: Date.now(),
      version: 1,
    });

    return { success: true };
  },
});

// Get recent operations for synchronization
// Get recent operations for real-time collaboration
export const getRecentOperations = query({
  args: { 
    roomId: v.string(),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    
    const operations = await ctx.db
      .query("documentOperations")
      .withIndex("by_room_timestamp", (q) => 
        q.eq("roomId", args.roomId)
      )
      .order("desc") // Most recent first
      .take(limit);

    // Return in ascending order (oldest first) for proper application
    return operations.reverse();
  },
});