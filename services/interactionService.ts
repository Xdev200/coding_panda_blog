import { supabase } from "@/lib/supabase";
import type { PostInteraction } from "@/types/blog";

/**
 * Service to handle post interactions (likes/dislikes).
 */
export const interactionService = {
  /**
   * Toggles an interaction (like/dislike) for a post and session.
   * If the user clicks the same type again, it removes it.
   * If they click the other type, it switches.
   */
  async toggleInteraction(
    postId: string,
    sessionId: string,
    type: 'like' | 'dislike'
  ): Promise<{ success: boolean; likes: number; dislikes: number; userAction: 'like' | 'dislike' | null }> {
    try {
      // 1. Get existing interaction
      const { data: existing, error: fetchError } = await supabase
        .from('post_interactions')
        .select('*')
        .eq('post_id', postId)
        .eq('session_id', sessionId)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      let likesDelta = 0;
      let dislikesDelta = 0;
      let newUserAction: 'like' | 'dislike' | null = type;

      if (existing) {
        if (existing.type === type) {
          // Remove interaction
          const { error: deleteError } = await supabase
            .from('post_interactions')
            .delete()
            .eq('id', existing.id);
          
          if (deleteError) throw deleteError;
          
          if (type === 'like') likesDelta = -1;
          else dislikesDelta = -1;
          
          newUserAction = null;
        } else {
          // Switch interaction
          const { error: updateError } = await supabase
            .from('post_interactions')
            .update({ type })
            .eq('id', existing.id);

          if (updateError) throw updateError;
          
          if (type === 'like') {
            likesDelta = 1;
            dislikesDelta = -1;
          } else {
            likesDelta = -1;
            dislikesDelta = 1;
          }
        }
      } else {
        // Create new interaction
        const { error: insertError } = await supabase
          .from('post_interactions')
          .insert({ post_id: postId, session_id: sessionId, type });

        if (insertError) throw insertError;
        
        if (type === 'like') likesDelta = 1;
        else dislikesDelta = 1;
      }

      // 2. Update denormalized counts in posts table
      // We use rpc or fetch + update. For simplicity here, fetch + update but ideally an atomic increment/decrement.
      // Since we don't have a stored procedure yet, let's just fetch and update.
      const { data: post, error: postError } = await supabase
        .from('posts')
        .select('likes_count, dislikes_count')
        .eq('id', postId)
        .single();

      if (postError) throw postError;

      const newLikes = Math.max(0, (post.likes_count || 0) + likesDelta);
      const newDislikes = Math.max(0, (post.dislikes_count || 0) + dislikesDelta);

      const { error: finalUpdateError } = await supabase
        .from('posts')
        .update({
          likes_count: newLikes,
          dislikes_count: newDislikes
        })
        .eq('id', postId);

      if (finalUpdateError) throw finalUpdateError;

      return { success: true, likes: newLikes, dislikes: newDislikes, userAction: newUserAction };
    } catch (err) {
      console.error('Interaction toggle failed:', err);
      return { success: false, likes: 0, dislikes: 0, userAction: null };
    }
  },

  /**
   * Gets the current interaction status for a session.
   */
  async getInteractionStatus(postId: string, sessionId: string): Promise<'like' | 'dislike' | null> {
    const { data, error } = await supabase
      .from('post_interactions')
      .select('type')
      .eq('post_id', postId)
      .eq('session_id', sessionId)
      .maybeSingle();

    if (error || !data) return null;
    return data.type as 'like' | 'dislike' | null;
  }
};
