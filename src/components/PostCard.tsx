import { Link } from 'react-router-dom';
import { Post } from '../types';
import StatusBadge from './StatusBadge';
import { format } from 'date-fns';
import { Clock, Calendar, ArrowRight } from 'lucide-react';

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="group relative py-12 border-b border-white/5 last:border-0">
      <div className="flex flex-col md:flex-row md:items-start gap-8">
        {/* Date & Metadata */}
        <div className="md:w-48 flex-shrink-0 flex flex-col space-y-3">
          <div className="flex items-center space-x-2 text-xs font-mono text-gray-500 uppercase tracking-widest">
            <Calendar className="w-3.5 h-3.5" />
            <span>{format(new Date(post.created_at), 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono text-gray-500 uppercase tracking-widest">
            <Clock className="w-3.5 h-3.5" />
            <span>{post.reading_time} min read</span>
          </div>
          <div className="pt-2">
            <StatusBadge status={post.status} />
          </div>
        </div>

        {/* Content Preview */}
        <div className="flex-1 space-y-4">
          <Link to={`/post/${post.slug}`} className="block group-hover:translate-x-1 transition-transform duration-300">
            <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors leading-tight">
              {post.title}
            </h2>
          </Link>
          
          <p className="text-gray-400 leading-relaxed max-w-2xl">
            {post.summary}
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {post.tags.map(tag => (
              <Link 
                key={tag} 
                to={`/tags/${tag}`}
                className="text-[10px] font-mono uppercase tracking-widest text-gray-500 hover:text-blue-400 transition-colors px-2 py-1 border border-white/5 rounded hover:bg-blue-400/5"
              >
                #{tag}
              </Link>
            ))}
          </div>
          
          <Link 
            to={`/post/${post.slug}`} 
            className="inline-flex items-center space-x-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors pt-4 group/link"
          >
            <span>Read full log</span>
            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
