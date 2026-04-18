# Work Breakdown Structure (WBS) — Supabase Integration & Rebranding

## Phase 1: Environment & Client Setup
- [x] 1.1 Configure `.env.local` with Supabase credentials <!-- id: 0 -->
- [x] 1.2 Initialize Supabase client in `lib/supabase.ts` <!-- id: 1 -->

## Phase 2: Data Models & Types
- [x] 2.1 Update `types/blog.ts` to match Supabase schema <!-- id: 2 -->
- [ ] 2.2 Generate/Update TypeScript types for Supabase (optional, but good) <!-- id: 3 -->

## Phase 3: Service Layer Implementation
- [x] 3.1 Create `services/blogService.ts` for database access <!-- id: 4 -->
- [x] 3.2 Implement `getAllPosts`, `getPostBySlug`, `getPostsByCategory`, `getFeaturedPosts`, `getCategories` in the service <!-- id: 5 -->

## Phase 4: Integration
- [x] 4.1 Refactor `lib/posts.ts` to use `blogService` <!-- id: 6 -->
- [x] 4.2 Update Next.js pages (`app/blogs/page.tsx`, `app/blogs/[slug]/page.tsx`) to handle async fetching <!-- id: 7 -->
- [x] 4.3 Update API routes if necessary <!-- id: 8 -->

## Phase 5: Testing & Validation
- [x] 5.1 Update existing tests to mock Supabase client <!-- id: 9 -->
- [x] 5.2 Ensure test coverage is >90% <!-- id: 10 -->
- [x] 5.3 Manual validation of the blog page and post detail page <!-- id: 11 -->

## Phase 6: Documentation
- [x] 6.1 Update `README.md` with Supabase setup instructions <!-- id: 12 -->
- [x] 6.2 README viral/lead-magnet rewrite with hero banner, badges, architecture diagrams, and premium copy <!-- id: 31 -->

## Phase 7: Rebranding (Coding Panda)
- [x] 7.1 Update brand name in `Navbar` and `Footer` <!-- id: 13 -->
- [x] 7.2 Update metadata in `layout.tsx` <!-- id: 14 -->
- [x] 7.3 Replace `RetroUI` occurrences in blog content templates and page labels <!-- id: 15 -->
- [x] 7.4 Update `package.json` and `manifest.json` <!-- id: 16 -->
- [x] 7.5 Update tests to reflect new labels <!-- id: 17 -->

## Phase 8: Header Update & Dynamic Filtering [COMPLETED]
- [x] 8.1 Remove legacy navigation ("Get Started", Home, etc.) from Navbar <!-- id: 18 -->
- [x] 8.2 Integrate ThemeToggle component with `next-themes` <!-- id: 19 -->
- [x] 8.3 Add GitHub icon to header actions <!-- id: 20 -->
- [x] 8.4 Remove "THE CODING PANDA BLOG" text badge from Blogs page <!-- id: 21 -->
- [x] 8.5 Implement `getPostsByTag` and `getAllTags` in `blogService` <!-- id: 22 -->
- [x] 8.6 Replace hard-coded categories with dynamic tags from Supabase <!-- id: 23 -->
- [x] 8.7 Achieve >90% test coverage for new functionality (Current: 98.6%) <!-- id: 24 -->

## Phase 9: Root Migration [COMPLETED]
- [x] 9.1 Move blog listing from `/blogs` to `/` (root) <!-- id: 25 -->
- [x] 9.2 Move blog post detail from `/blogs/[slug]` to `/[slug]` <!-- id: 26 -->
- [x] 9.3 Update internal links in BlogCard, Footer, and Post pages <!-- id: 27 -->
- [x] 9.4 Update PWA manifest `start_url` and shortcuts <!-- id: 28 -->
- [x] 9.5 Update test suites and imports for new route structure <!-- id: 29 -->
- [x] 9.6 Verify build and 100% test pass rate <!-- id: 30 -->

## Phase 10: Admin Backend Service [COMPLETED]
- [x] 10.1 Install `@supabase/ssr` and create SSR client infrastructure <!-- id: 32 -->
- [x] 10.2 Create `profiles` table with RLS policies and triggers <!-- id: 33 -->
- [x] 10.3 Add admin CRUD RLS policies on `posts` table <!-- id: 34 -->
- [x] 10.4 Extend type system with CreatePostInput, UpdatePostInput, UserProfile types <!-- id: 35 -->
- [x] 10.5 Create `adminBlogService.ts` with server-side CRUD operations <!-- id: 36 -->
- [x] 10.6 Create `userService.ts` for user management <!-- id: 37 -->
- [x] 10.7 Implement Next.js middleware for admin route protection <!-- id: 38 -->
- [x] 10.8 Build NeoBrutalism login page with server actions <!-- id: 39 -->
- [x] 10.9 Create admin dashboard with stats cards and quick actions <!-- id: 40 -->
- [x] 10.10 Build posts management pages (list, create, edit, delete) <!-- id: 41 -->
- [x] 10.11 Build users management pages (list, create, edit, delete) <!-- id: 42 -->
- [x] 10.12 Create reusable admin components (DataTable, PostForm, UserForm, StatsCard, AdminSidebar) <!-- id: 43 -->
- [x] 10.13 Verify TypeScript compilation (0 errors) and route protection <!-- id: 44 -->

## Phase 11: Tag Management Enhancements
- [x] 11.1 Display tags column in admin posts table view <!-- id: 45 -->
- [x] 11.2 Verify tag input functionality in post creation form and Supabase sync <!-- id: 46 -->

## Phase 12: Image Management & Branding Refinement
- [x] 12.1 Replace cover color with image upload in `PostForm` <!-- id: 47 -->
- [x] 12.2 Implement image upload to Supabase Storage in server actions <!-- id: 48 -->
- [x] 12.3 Update post detail page to render uploaded cover images <!-- id: 49 -->
- [x] 12.4 Add image preview and view CTA to admin posts table <!-- id: 50 -->
- [x] 12.5 Sync `cover_image` field with database and handling existing images on update <!-- id: 51 -->

## Phase 13: Security & Stability [COMPLETED]
- [x] 13.1 Fix RLS policy on tags table by setting sync function to SECURITY DEFINER <!-- id: 52 -->
- [x] 13.2 Fix image upload by adding storage RLS policies and server-side error handling <!-- id: 53 -->
- [x] 13.3 Add image requirement rules and client-side validation (format, size, dimension) <!-- id: 54 -->

## Phase 14: Google Indexing & Advanced SEO [COMPLETED]
- [x] 14.1 Implement `robots.ts` and dynamic `sitemap.ts` <!-- id: 55 -->
- [x] 14.2 Enhance `layout.tsx` metadata with specific OG/Twitter images and `metadataBase` <!-- id: 56 -->
- [x] 14.3 Add dynamic metadata and canonical URLs to blog post pages <!-- id: 57 -->
- [x] 14.4 Implement JSON-LD `Article` structured data for rich search results <!-- id: 58 -->
- [x] 14.5 Refactor homepage to Server Component for pre-rendered SEO metadata <!-- id: 59 -->
- [x] 14.6 Verify production build and route generation for SEO crawlers <!-- id: 60 -->

## Phase 15: Post Date Customization
- [x] 15.1 Add `date` field to `CreatePostInput` and `UpdatePostInput` types <!-- id: 61 -->
- [x] 15.2 Add date input field to `PostForm` with NeoBrutalism styling <!-- id: 62 -->
- [x] 15.3 Update `createPost` and `updatePost` server actions to handle custom dates <!-- id: 63 -->
- [x] 15.4 Update `adminBlogService` to support custom dates in creation and updates <!-- id: 64 -->
- [x] 15.5 Manual verification of date persistence in Supabase <!-- id: 65 -->

## Phase 16: Post Scheduling
- [x] 16.1 Implement date filtering in `blogService.ts` for public pages <!-- id: 66 -->
- [x] 16.2 Add "Status" indicator to `PostsTable` (Scheduled vs Published) <!-- id: 67 -->
- [x] 16.3 Verify admin access to future posts <!-- id: 68 -->
- [x] 16.4 Verify public hiding of future posts <!-- id: 69 -->

## Phase 17: User Management Permissions & Bugfixes
- [x] 17.1 Create `createAdminClient` for auth administrative operations <!-- id: 70 -->
- [x] 17.2 Fix "User not allowed" error by using admin client in `userService` <!-- id: 71 -->
- [x] 17.3 Manual verification after adding `SUPABASE_SERVICE_ROLE_KEY` to environment <!-- id: 72 -->

