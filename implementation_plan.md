# Implementation Plan - Engagement & Visual Enhancements

This plan outlines the steps to add social sharing, session-based likes/dislikes, personal social links, and thumbnail support to the Coding Panda Blog.

## 1. Database Schema Updates (Supabase)
- [ ] Add `thumbnail_image`, `likes_count`, and `dislikes_count` to `posts` table.
- [ ] Create `post_interactions` table for session-based tracking.
- [ ] Set up RLS policies for public likes/dislikes.

## 2. Type Definitions
- [ ] Update `BlogPost`, `CreatePostInput`, and `UpdatePostInput` in `types/blog.ts`.
- [ ] Add `PostInteraction` type.

## 3. Interaction Service
- [ ] Create `services/interactionService.ts` to handle:
    - Checking if a session has already interacted.
    - Adding/Removing likes/dislikes.
    - Fetching counts.

## 4. Components
### Engagement
- [ ] `ShareButtons.tsx`: Social sharing buttons (Twitter, LinkedIn, Copy Link).
- [ ] `LikeDislike.tsx`: Interaction buttons with optimistic UI updates.
- [ ] `PostActions.tsx`: Wrapper for Share and Like/Dislike components.

### Layout
- [ ] `SocialLinks.tsx`: Reusable component for brand social links.
- [ ] Update `Footer.tsx` to include `SocialLinks`.

### Admin
- [ ] Update `PostForm.tsx` to include Thumbnail image selection/upload.

## 5. Integration
- [ ] Add `PostActions` to `app/[slug]/page.tsx`.
- [ ] Update `BlogCard` to display thumbnails.
- [ ] Update `adminBlogService.ts` to handle the new fields.

## 6. Testing
- [ ] Unit tests for `interactionService`.
- [ ] Component tests for `ShareButtons` and `LikeDislike`.
- [ ] Integration test for the voting flow.
