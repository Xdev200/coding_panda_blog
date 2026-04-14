export interface BlogPost {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  author: string;
  category: string;
  readTime: number; // For backward compatibility with UI
  coverColor: string; // For backward compatibility with UI
  tags: string[];
  featured?: boolean;
}

export interface BlogCategory {
  id: string;
  label: string;
  count: number;
}
