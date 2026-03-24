import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Post } from '../types';
import PostCard from '../components/PostCard';
import { Tag, Loader2, ArrowLeft } from 'lucide-react';

import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export default function Tags() {
  const { tag } = useParams<{ tag: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const path = 'posts';
    // Fetch all tags for the sidebar/list
    const allPostsQ = query(collection(db, path));
    const unsubscribeAll = onSnapshot(allPostsQ, (snapshot) => {
      const tags = new Set<string>();
      snapshot.docs.forEach(doc => {
        const data = doc.data() as Post;
        data.tags?.forEach(t => tags.add(t));
      });
      setAllTags(Array.from(tags).sort());
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });

    // Fetch posts for the specific tag if provided
    let unsubscribeTag = () => {};
    if (tag) {
      const tagQ = query(
        collection(db, path), 
        where('tags', 'array-contains', tag),
        orderBy('created_at', 'desc')
      );
      unsubscribeTag = onSnapshot(tagQ, (snapshot) => {
        const postsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Post[];
        setPosts(postsData);
        setLoading(false);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      });
    } else {
      setLoading(false);
    }

    return () => {
      unsubscribeAll();
      unsubscribeTag();
    };
  }, [tag]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-sm font-mono text-gray-500 uppercase tracking-widest">Filtering lab records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <div className="flex items-center space-x-3">
          <Tag className="w-6 h-6 text-blue-400" />
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            {tag ? `Logs tagged with #${tag}` : 'Explore by Tag'}
          </h1>
        </div>
        {tag && (
          <Link to="/tags" className="inline-flex items-center space-x-2 text-sm text-gray-500 hover:text-white transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>View all tags</span>
          </Link>
        )}
      </header>

      {!tag ? (
        <div className="flex flex-wrap gap-4">
          {allTags.map(t => (
            <Link 
              key={t} 
              to={`/tags/${t}`}
              className="px-6 py-4 bg-white/5 border border-white/5 rounded-2xl hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group"
            >
              <span className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">#{t}</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-0">
          {posts.length > 0 ? (
            posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl">
              <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">No logs found for this tag.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
