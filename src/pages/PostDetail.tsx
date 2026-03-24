import { ReactNode, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Post, Comment } from '../types';
import StatusBadge from '../components/StatusBadge';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { format } from 'date-fns';
import { Clock, Calendar, ArrowLeft, Send, MessageSquare, Loader2 } from 'lucide-react';
import 'highlight.js/styles/github-dark.css';
import GithubSlugger from 'github-slugger';

import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { createHeadingSlug, scrollToHash } from '../lib/hashScroll';

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentName, setCommentName] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const headingSlugger = new GithubSlugger();

  const getTextContent = (node: ReactNode): string => {
    if (typeof node === 'string' || typeof node === 'number') return String(node);
    if (!node) return '';
    if (Array.isArray(node)) return node.map(getTextContent).join('');
    if (typeof node === 'object' && 'props' in node) {
      return getTextContent((node as { props?: { children?: ReactNode } }).props?.children);
    }
    return '';
  };

  const renderHeading = (Tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') => {
    return ({ children, ...props }: { children?: ReactNode }) => {
      const slug = createHeadingSlug(headingSlugger, getTextContent(children));
      return (
        <Tag id={slug} {...props}>
          {children}
        </Tag>
      );
    };
  };

  useEffect(() => {
    if (!slug) return;

    const path = 'posts';
    const q = query(collection(db, path), where('slug', '==', slug), limit(1));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const postData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Post;
        setPost(postData);
        
        // Fetch comments
        const commentsPath = `posts/${postData.id}/comments`;
        const commentsQ = query(
          collection(db, 'posts', postData.id, 'comments'),
          orderBy('created_at', 'desc')
        );
        onSnapshot(commentsQ, (commentSnapshot) => {
          const commentsData = commentSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Comment[];
          setComments(commentsData);
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, commentsPath);
        });
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });

    return () => unsubscribe();
  }, [slug]);

  useEffect(() => {
    if (!post) return;
    const hash = window.location.hash;
    if (!hash) return;

    // Markdown is async-rendered after data load; defer once to ensure DOM nodes exist.
    window.setTimeout(() => scrollToHash(hash, false), 0);
  }, [post]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !commentName || !commentContent) return;

    setSubmitting(true);
    const path = `posts/${post.id}/comments`;
    try {
      await addDoc(collection(db, 'posts', post.id, 'comments'), {
        post_id: post.id,
        name: commentName,
        content: commentContent,
        created_at: new Date().toISOString()
      });
      setCommentName('');
      setCommentContent('');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-sm font-mono text-gray-500 uppercase tracking-widest">Retrieving lab data...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Post not found</h1>
        <Link to="/" className="text-blue-400 hover:text-blue-300 flex items-center justify-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <Link to="/" className="inline-flex items-center space-x-2 text-sm text-gray-500 hover:text-white transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to logs</span>
      </Link>

      <article className="space-y-8">
        <header className="space-y-6">
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-500 uppercase tracking-widest">
            <div className="flex items-center space-x-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>{format(new Date(post.created_at), 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.reading_time} min read</span>
            </div>
            <StatusBadge status={post.status} />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap gap-2">
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
        </header>

        <div className="prose prose-invert prose-blue markdown-body max-w-none prose-headings:text-white prose-p:text-gray-400 prose-strong:text-white prose-code:text-blue-400 prose-code:bg-blue-400/5 prose-code:px-1 prose-code:rounded prose-pre:bg-[#0B0F14] prose-pre:border prose-pre:border-white/5">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              h1: renderHeading('h1'),
              h2: renderHeading('h2'),
              h3: renderHeading('h3'),
              h4: renderHeading('h4'),
              h5: renderHeading('h5'),
              h6: renderHeading('h6'),
              a: ({ href, children, ...props }) => {
                if (href?.startsWith('#')) {
                  return (
                    <a
                      {...props}
                      href={href}
                      onClick={(e) => {
                        e.preventDefault();
                        window.history.pushState(null, '', href);
                        scrollToHash(href);
                      }}
                    >
                      {children}
                    </a>
                  );
                }
                return (
                  <a {...props} href={href}>
                    {children}
                  </a>
                );
              }
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        <div className="pt-12 border-t border-white/5 text-xs font-mono text-gray-500 uppercase tracking-widest">
          Last updated: {format(new Date(post.updated_at || post.created_at), 'MMM dd, yyyy HH:mm')}
        </div>
      </article>

      {/* Comments Section */}
      <section className="pt-20 space-y-12">
        <div className="flex items-center space-x-3">
          <MessageSquare className="w-5 h-5 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">Public Discussion</h2>
        </div>

        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit} className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/5">
          <div className="space-y-2">
            <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">Your Name</label>
            <input 
              type="text" 
              required
              className="w-full bg-[#0B0F14] border border-white/10 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              value={commentName}
              onChange={(e) => setCommentName(e.target.value)}
              placeholder="e.g. Alan Turing"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">Observation</label>
            <textarea 
              required
              rows={4}
              className="w-full bg-[#0B0F14] border border-white/10 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Share your thoughts or questions..."
            />
          </div>
          <button 
            type="submit" 
            disabled={submitting}
            className="inline-flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white font-bold py-2 px-6 rounded-lg transition-all text-sm uppercase tracking-widest"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Post Observation</span>
          </button>
        </form>

        {/* Comments List */}
        <div className="space-y-8">
          {comments.length > 0 ? (
            comments.map(comment => (
              <div key={comment.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{comment.name}</span>
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                    {format(new Date(comment.created_at), 'MMM dd, yyyy HH:mm')}
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {comment.content}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 font-mono text-sm uppercase tracking-widest py-12 border border-dashed border-white/10 rounded-2xl">
              No observations recorded yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
