import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Post, PostStatus } from '../types';
import { useAuth } from '../hooks/useAuth';
import { Plus, Trash2, Edit3, Save, X, Loader2, Terminal, AlertCircle } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export default function Admin() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState<PostStatus>('idea');
  const [readingTime, setReadingTime] = useState(5);
  const [featured, setFeatured] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchPosts();
    }
  }, [isAdmin]);

  const fetchPosts = async () => {
    const path = 'posts';
    try {
      const q = query(collection(db, path), orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Post[];
      setPosts(postsData);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const path = 'posts';

    const postData = {
      title,
      slug: slug || title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
      summary,
      content,
      tags: tags.split(',').map(t => t.trim()).filter(t => t !== ''),
      status,
      reading_time: Number(readingTime),
      featured,
      updated_at: new Date().toISOString(),
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, path, editingId), postData);
      } else {
        await addDoc(collection(db, path), {
          ...postData,
          created_at: new Date().toISOString(),
        });
      }
      resetForm();
      fetchPosts();
    } catch (error) {
      handleFirestoreError(error, editingId ? OperationType.UPDATE : OperationType.CREATE, path);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (post: Post) => {
    setEditingId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setSummary(post.summary);
    setContent(post.content);
    setTags(post.tags.join(', '));
    setStatus(post.status);
    setReadingTime(post.reading_time);
    setFeatured(post.featured);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this log?')) return;
    const path = `posts/${id}`;
    try {
      await deleteDoc(doc(db, 'posts', id));
      fetchPosts();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setSummary('');
    setContent('');
    setTags('');
    setStatus('idea');
    setReadingTime(5);
    setFeatured(false);
  };

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-sm font-mono text-gray-500 uppercase tracking-widest">Accessing secure terminal...</p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      <header className="space-y-4">
        <div className="flex items-center space-x-3">
          <Terminal className="w-6 h-6 text-blue-400" />
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Admin Terminal</h1>
        </div>
        <p className="text-gray-400">Create and manage your research logs.</p>
      </header>

      {/* Post Form */}
      <section className="bg-white/5 border border-white/5 rounded-3xl p-8 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            {editingId ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            <span>{editingId ? 'Edit Log' : 'New Log Entry'}</span>
          </h2>
          {editingId && (
            <button onClick={resetForm} className="text-gray-500 hover:text-white flex items-center space-x-1 text-sm">
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">Post Title</label>
            <input 
              type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#0B0F14] border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              placeholder="The Future of Neural Networks"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">URL Slug (Optional)</label>
            <input 
              type="text" value={slug} onChange={(e) => setSlug(e.target.value)}
              className="w-full bg-[#0B0F14] border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              placeholder="future-of-nn"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">Tags (Comma separated)</label>
            <input 
              type="text" value={tags} onChange={(e) => setTags(e.target.value)}
              className="w-full bg-[#0B0F14] border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              placeholder="ai, ml, research"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">Status</label>
            <select 
              value={status} onChange={(e) => setStatus(e.target.value as PostStatus)}
              className="w-full bg-[#0B0F14] border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            >
              <option value="idea">Idea</option>
              <option value="learning">Learning</option>
              <option value="building">Building</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">Reading Time (min)</label>
            <input 
              type="number" value={readingTime} onChange={(e) => setReadingTime(Number(e.target.value))}
              className="w-full bg-[#0B0F14] border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">Summary</label>
            <textarea 
              required rows={2} value={summary} onChange={(e) => setSummary(e.target.value)}
              className="w-full bg-[#0B0F14] border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
              placeholder="A brief overview of this experiment..."
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">Content (Markdown)</label>
            <textarea 
              required rows={12} value={content} onChange={(e) => setContent(e.target.value)}
              className="w-full bg-[#0B0F14] border border-white/10 rounded-xl py-3 px-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
              placeholder="# Log Entry..."
            />
          </div>

          <div className="flex items-center space-x-3 md:col-span-2">
            <input 
              type="checkbox" id="featured" checked={featured} onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 rounded border-white/10 bg-[#0B0F14] text-blue-500 focus:ring-blue-500/50"
            />
            <label htmlFor="featured" className="text-sm text-gray-400">Mark as featured post</label>
          </div>

          <div className="md:col-span-2 pt-4">
            <button 
              type="submit" disabled={submitting}
              className="w-full md:w-auto inline-flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white font-bold py-3 px-12 rounded-xl transition-all text-sm uppercase tracking-widest"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{editingId ? 'Update Log' : 'Commit Log'}</span>
            </button>
          </div>
        </form>
      </section>

      {/* Posts List */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Existing Logs</h2>
        <div className="grid grid-cols-1 gap-4">
          {posts.map(post => (
            <div key={post.id} className="bg-white/5 border border-white/5 rounded-2xl p-6 flex items-center justify-between group hover:border-white/10 transition-all">
              <div className="space-y-1">
                <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">{post.title}</h3>
                <div className="flex items-center space-x-3 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                  <span>{post.slug}</span>
                  <span>•</span>
                  <span>{post.status}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => handleEdit(post)} className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(post.id)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
