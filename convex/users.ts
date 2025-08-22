import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const syncUser = mutation({
    args:{
        userId:v.istring(),
    }
})