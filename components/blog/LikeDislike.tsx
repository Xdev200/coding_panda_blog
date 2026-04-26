"use client";

import React, { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { interactionService } from "@/services/interactionService";

interface LikeDislikeProps {
  postId: string;
  initialLikes: number;
  initialDislikes: number;
}

const LikeDislike: React.FC<LikeDislikeProps> = ({ postId, initialLikes, initialDislikes }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userAction, setUserAction] = useState<'like' | 'dislike' | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Get or create session ID
    let sid = localStorage.getItem("panda_blog_session");
    if (!sid) {
      sid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem("panda_blog_session", sid);
    }
    setSessionId(sid);

    // Fetch user's current interaction status
    const checkStatus = async () => {
      if (sid) {
        const action = await interactionService.getInteractionStatus(postId, sid);
        setUserAction(action);
      }
    };
    checkStatus();
  }, [postId]);

  const handleToggle = async (type: 'like' | 'dislike') => {
    if (!sessionId || isLoading) return;

    setIsLoading(true);
    
    // Call service
    const result = await interactionService.toggleInteraction(postId, sessionId, type);
    
    if (result.success) {
      setLikes(result.likes);
      setDislikes(result.dislikes);
      setUserAction(result.userAction);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">How's the Article?</span>
      <div className="flex gap-4">
        <button
          onClick={() => handleToggle('like')}
          disabled={isLoading}
          className={`flex items-center gap-2 px-4 py-2 border-2 border-retro-black dark:border-retro-white shadow-neo dark:shadow-neo-dark transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
            userAction === 'like' ? 'bg-retro-green' : 'bg-retro-white dark:bg-retro-dark-surface hover:bg-retro-green/10 text-retro-black dark:text-retro-white'
          }`}
        >
          <ThumbsUp className={`w-5 h-5 ${userAction === 'like' ? 'fill-current' : ''}`} />
          <span className="font-bold">{likes}</span>
        </button>

        <button
          onClick={() => handleToggle('dislike')}
          disabled={isLoading}
          className={`flex items-center gap-2 px-4 py-2 border-2 border-retro-black dark:border-retro-white shadow-neo dark:shadow-neo-dark transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
            userAction === 'dislike' ? 'bg-retro-pink' : 'bg-retro-white dark:bg-retro-dark-surface hover:bg-retro-pink/10 text-retro-black dark:text-retro-white'
          }`}
        >
          <ThumbsDown className={`w-5 h-5 ${userAction === 'dislike' ? 'fill-current' : ''}`} />
          <span className="font-bold">{dislikes}</span>
        </button>
      </div>
    </div>
  );
};

export default LikeDislike;
