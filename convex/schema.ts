import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(), // clerkId
    email: v.string(),
    name: v.string(),
    isPro: v.boolean(),
    proSince: v.optional(v.number()),
    lemonSqueezyCustomerId: v.optional(v.string()),
    lemonSqueezyOrderId: v.optional(v.string()),
  }).index("by_user_id", ["userId"]),

  // Updated projects table for multi-file support
  projects: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    userId: v.string(),
    userName: v.string(),
    isPublic: v.boolean(),
    language: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user_id", ["userId"]),

  // New files table for project files
  files: defineTable({
    projectId: v.id("projects"),
    name: v.string(),
    content: v.string(),
    language: v.string(),
    path: v.string(), // folder/subfolder/file.ext
    isEntry: v.boolean(), // main file to run
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_project_id", ["projectId"]),

  // Updated code executions for projects
  codeExecutions: defineTable({
    userId: v.string(),
    projectId: v.optional(v.id("projects")),
    language: v.string(),
    code: v.string(),
    output: v.optional(v.string()),
    error: v.optional(v.string()),
    entryFile: v.optional(v.string()),
    fileName: v.optional(v.string()),
    executionType: v.optional(v.string()),
  }).index("by_user_id", ["userId"]),

  snippets: defineTable({
    userId: v.string(),
    title: v.string(),
    language: v.string(),
    code: v.string(),
    userName: v.string(), // store user's name for easy access
  }).index("by_user_id", ["userId"]),

  snippetComments: defineTable({
    snippetId: v.id("snippets"),
    userId: v.string(),
    userName: v.string(),
    content: v.string(), // This will store HTML content
  }).index("by_snippet_id", ["snippetId"]),

  stars: defineTable({
    userId: v.string(),
    snippetId: v.id("snippets"),
  })
    .index("by_user_id", ["userId"])
    .index("by_snippet_id", ["snippetId"])
    .index("by_user_id_and_snippet_id", ["userId", "snippetId"]),

  // Real-time collaboration tables
  collaborationRooms: defineTable({
    projectId: v.optional(v.id("projects")), // Made optional for standalone sessions
    roomId: v.string(), // unique room identifier
    hostUserId: v.string(),
    isActive: v.boolean(),
    maxParticipants: v.number(),
    createdAt: v.number(),
    expiresAt: v.optional(v.number()), // for temporary rooms
  })
    .index("by_room_id", ["roomId"])
    .index("by_host_user_id", ["hostUserId"]),

  roomParticipants: defineTable({
    roomId: v.string(),
    userId: v.string(),
    userName: v.string(),
    userColor: v.string(), // Color for participant identification
    role: v.union(v.literal("host"), v.literal("collaborator"), v.literal("viewer")),
    joinedAt: v.number(),
    lastSeenAt: v.number(),
    cursorPosition: v.optional(v.object({
      line: v.number(),
      column: v.number(),
      fileId: v.optional(v.id("files")),
    })),
    isActive: v.boolean(),
  })
    .index("by_room_id", ["roomId"])
    .index("by_user_id", ["userId"])
    .index("by_room_id_and_user_id", ["roomId", "userId"]),

  // Store Yjs document updates for persistence
  yjsDocuments: defineTable({
    roomId: v.string(),
    fileId: v.id("files"),
    update: v.bytes(), // Yjs document update as binary data
    version: v.number(),
    createdAt: v.number(),
  })
    .index("by_room_id", ["roomId"])
    .index("by_file_id", ["fileId"])
    .index("by_room_id_and_file_id", ["roomId", "fileId"]),
});
