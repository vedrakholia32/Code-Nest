import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all files for a project
export const getProjectFiles = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("files")
      .withIndex("by_project_id", (q) => q.eq("projectId", args.projectId))
      .order("asc")
      .collect();
  },
});

// Get a single file
export const getFile = query({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.fileId);
  },
});

// Create a new file
export const createFile = mutation({
  args: {
    projectId: v.id("projects"),
    name: v.string(),
    content: v.string(),
    language: v.string(),
    path: v.string(),
    isEntry: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("files", {
      ...args,
      isEntry: args.isEntry || false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Update file content
export const updateFileContent = mutation({
  args: {
    fileId: v.id("files"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.fileId, {
      content: args.content,
      updatedAt: Date.now(),
    });
  },
});

// Rename a file
export const renameFile = mutation({
  args: {
    fileId: v.id("files"),
    name: v.string(),
    path: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.fileId, {
      name: args.name,
      path: args.path,
      updatedAt: Date.now(),
    });
  },
});

// Delete a file
export const deleteFile = mutation({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.fileId);
  },
});

// Set entry file
export const setEntryFile = mutation({
  args: {
    projectId: v.id("projects"),
    fileId: v.id("files"),
  },
  handler: async (ctx, args) => {
    // First, unset all other files as entry
    const allFiles = await ctx.db
      .query("files")
      .withIndex("by_project_id", (q) => q.eq("projectId", args.projectId))
      .collect();

    for (const file of allFiles) {
      if (file.isEntry) {
        await ctx.db.patch(file._id, { isEntry: false });
      }
    }

    // Set the specified file as entry
    await ctx.db.patch(args.fileId, { isEntry: true });
  },
});

// Duplicate a file
export const duplicateFile = mutation({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    const originalFile = await ctx.db.get(args.fileId);
    if (!originalFile) {
      throw new Error("File not found");
    }

    const nameWithoutExt = originalFile.name.replace(/\.[^/.]+$/, "");
    const extension = originalFile.name.split('.').pop();
    const newName = `${nameWithoutExt}_copy.${extension}`;
    const newPath = originalFile.path.replace(originalFile.name, newName);

    return await ctx.db.insert("files", {
      projectId: originalFile.projectId,
      name: newName,
      content: originalFile.content,
      language: originalFile.language,
      path: newPath,
      isEntry: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});
