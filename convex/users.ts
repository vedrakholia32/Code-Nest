import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const syncUser = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!existingUser) {
      await ctx.db.insert("users", {
        userId: args.userId,
        email: args.email,
        name: args.name,
        isPro: false,
      });
    } else {
      // Update existing user data while preserving isPro status
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        name: args.name,
      });
    }
  },
});

export const updateProStatus = mutation({
  args: {
    userId: v.string(),
    isPro: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (user) {
      await ctx.db.patch(user._id, {
        isPro: args.isPro,
        proSince: args.isPro ? Date.now() : undefined,
      });
    }
  },
});

export const getUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    if (!args.userId) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!user) return null;

    return user;
  },
});
