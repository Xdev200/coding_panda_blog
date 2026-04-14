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
