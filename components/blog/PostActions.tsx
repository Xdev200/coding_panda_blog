import React from "react";
import ShareButtons from "./ShareButtons";
import LikeDislike from "./LikeDislike";

interface PostActionsProps {
  postId: string;
  title: string;
  slug: string;
  likes: number;
  dislikes: number;
  thumbnailImage?: string;
}

const PostActions: React.FC<PostActionsProps> = ({ postId, title, slug, likes, dislikes, thumbnailImage }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 py-8 border-t-4 border-retro-black dark:border-retro-white mt-12 mb-8 border-dashed">
      <LikeDislike postId={postId} initialLikes={likes} initialDislikes={dislikes} />
      <ShareButtons title={title} slug={slug} image={thumbnailImage} />
    </div>
  );
};

export default PostActions;
