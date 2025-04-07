import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.string(),
    clerkId: v.string(),
    role: v.optional(v.string())
  }).index("by_clerk_id", ["clerkId"]),

  projects: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    icon: v.string(),
    type: v.string(), // "hub", "bireysel", "remote", "vcamp"
    views: v.number(),
    userId: v.string(),
    isArchived: v.boolean()
  })
    .index("by_user", ["userId"])
    .index("by_type", ["type"])
});
