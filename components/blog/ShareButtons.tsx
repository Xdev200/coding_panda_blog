"use client";

import React, { useState } from "react";
import { 
  TwitterShareButton, 
  LinkedinShareButton, 
  FacebookShareButton,
  WhatsappShareButton,
  RedditShareButton,
  PinterestShareButton
} from "react-share";
import { Twitter, Linkedin, Link, Check, Facebook, MessageCircle, Share2, PinIcon } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  slug: string;
  image?: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ title, slug, image }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/${slug}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const buttonBaseClass = "flex items-center justify-center w-10 h-10 border-2 border-retro-black dark:border-retro-white bg-retro-white dark:bg-retro-dark-surface text-retro-black dark:text-retro-white shadow-neo dark:shadow-neo-dark transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Share2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <span className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Share Article</span>
      </div>
      <div className="flex flex-wrap gap-3">
        <TwitterShareButton url={shareUrl} title={title}>
          <div className={`${buttonBaseClass} hover:bg-[#1DA1F2] hover:text-white`} title="Share on X">
            <Twitter className="w-5 h-5" />
          </div>
        </TwitterShareButton>

        <LinkedinShareButton url={shareUrl} title={title}>
          <div className={`${buttonBaseClass} hover:bg-[#0077b5] hover:text-white`} title="Share on LinkedIn">
            <Linkedin className="w-5 h-5" />
          </div>
        </LinkedinShareButton>

        <FacebookShareButton url={shareUrl}>
          <div className={`${buttonBaseClass} hover:bg-[#1877F2] hover:text-white`} title="Share on Facebook">
            <Facebook className="w-5 h-5" />
          </div>
        </FacebookShareButton>

        {image && (
          <PinterestShareButton url={shareUrl} media={image} description={title}>
            <div className={`${buttonBaseClass} hover:bg-[#E60023] hover:text-white`} title="Share on Pinterest">
              <PinIcon className="w-5 h-5" />
            </div>
          </PinterestShareButton>
        )}

        <RedditShareButton url={shareUrl} title={title}>
          <div className={`${buttonBaseClass} hover:bg-[#FF4500] hover:text-white`} title="Share on Reddit">
            <Share2 className="w-5 h-5 -rotate-45" />
          </div>
        </RedditShareButton>

        <WhatsappShareButton url={shareUrl} title={title} separator=":: ">
          <div className={`${buttonBaseClass} hover:bg-[#25D366] hover:text-white`} title="Share on WhatsApp">
            <MessageCircle className="w-5 h-5" />
          </div>
        </WhatsappShareButton>

        <button
          onClick={copyToClipboard}
          className={`${buttonBaseClass} hover:bg-yellow-400`}
          title="Copy Link"
        >
          {copied ? <Check className="w-5 h-5 text-green-600" /> : <Link className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;

