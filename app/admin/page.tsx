/**
 * Admin Dashboard Page.
 *
 * Displays key statistics and recent activity for the admin.
 * Uses NeoBrutalism design system components.
 *
 * @module app/admin/page
 */

import { adminBlogService } from "@/services/adminBlogService";
import { userService } from "@/services/userService";
import { StatsCard } from "@/components/admin/StatsCard";
import { FileText, Users, Star, FolderOpen } from "lucide-react";
import Link from "next/link";

/**
 * Admin Dashboard page component.
 * Server component that fetches stats and renders the dashboard.
 */
export default async function AdminDashboard() {
  // Fetch stats in parallel for performance
  const [postStats, userStats] = await Promise.all([
    adminBlogService.getStats(),
    userService.getStats(),
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-archivo text-3xl text-retro-black dark:text-retro-white">
          Dashboard
        </h1>
        <p className="font-space text-retro-black/60 dark:text-retro-white/60 mt-1">
          Welcome back to Coding Panda Admin
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Total Posts"
          value={postStats.totalPosts}
          icon={<FileText size={24} className="text-retro-black" />}
          colorClass="bg-retro-yellow"
        />
        <StatsCard
          label="Featured"
          value={postStats.featuredPosts}
          icon={<Star size={24} className="text-retro-black" />}
          colorClass="bg-retro-pink"
        />
        <StatsCard
          label="Categories"
          value={postStats.categories}
          icon={<FolderOpen size={24} className="text-retro-black" />}
          colorClass="bg-retro-blue"
        />
        <StatsCard
          label="Total Users"
          value={userStats.totalUsers}
          icon={<Users size={24} className="text-retro-black" />}
          colorClass="bg-retro-green"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-archivo text-xl text-retro-black dark:text-retro-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/admin/posts/new"
            className="border-2 border-retro-black dark:border-retro-white bg-retro-green p-4 shadow-neo dark:shadow-neo-dark hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover dark:hover:shadow-neo-dark-hover transition-all block"
          >
            <span className="font-archivo text-lg text-retro-black font-black">
              ✏️ New Post
            </span>
            <p className="font-space text-sm text-retro-black/70 mt-1">
              Create a new blog post
            </p>
          </Link>

          <Link
            href="/admin/posts"
            className="border-2 border-retro-black dark:border-retro-white bg-retro-yellow p-4 shadow-neo dark:shadow-neo-dark hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover dark:hover:shadow-neo-dark-hover transition-all block"
          >
            <span className="font-archivo text-lg text-retro-black font-black">
              📋 Manage Posts
            </span>
            <p className="font-space text-sm text-retro-black/70 mt-1">
              View and edit all posts
            </p>
          </Link>

          <Link
            href="/admin/users"
            className="border-2 border-retro-black dark:border-retro-white bg-retro-blue p-4 shadow-neo dark:shadow-neo-dark hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover dark:hover:shadow-neo-dark-hover transition-all block"
          >
            <span className="font-archivo text-lg text-retro-black font-black">
              👥 Manage Users
            </span>
            <p className="font-space text-sm text-retro-black/70 mt-1">
              Add and manage admin users
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
