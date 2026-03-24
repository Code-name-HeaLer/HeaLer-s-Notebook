export type PostStatus = 'idea' | 'learning' | 'building' | 'failed' | 'success';

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  tags: string[];
  status: PostStatus;
  reading_time: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  name: string;
  content: string;
  created_at: string;
}
