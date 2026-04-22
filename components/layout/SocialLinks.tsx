import React from "react";
import { Twitter, Linkedin, Github } from "lucide-react";

interface SocialLinksProps {
  className?: string;
  iconOnly?: boolean;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ className = "", iconOnly = false }) => {
  const socialLinks = [
    {
      name: "Twitter",
      icon: <Twitter className="w-5 h-5" />,
      href: "https://twitter.com/", // Replace with actual if known, or leave as placeholder
      color: "hover:bg-sky-400",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
      href: "https://linkedin.com/in/xdev200",
      color: "hover:bg-blue-600",
    },
    {
      name: "GitHub",
      icon: <Github className="w-5 h-5" />,
      href: "https://github.com/xdev200",
      color: "hover:bg-gray-800",
    },
  ];

  return (
    <div className={`flex gap-3 ${className}`}>
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center p-2 border-2 border-black bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:text-white ${link.color}`}
          title={link.name}
        >
          {link.icon}
          {!iconOnly && <span className="ml-2 font-bold hidden sm:inline">{link.name}</span>}
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
