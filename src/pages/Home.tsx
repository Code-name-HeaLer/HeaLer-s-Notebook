import { useEffect, useState, useRef } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Post } from '../types';
import PostCard from '../components/PostCard';
import { Search, Loader2, Terminal, Activity, Cpu, Box, Command } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';

import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

const TerminalMock = () => {
  const [logs, setLogs] = useState<Array<{ id: number; text: string }>>([]);
  const nextLogId = useRef(0);
  const logMessages = [
    "> Initializing neural engine...",
    "> Loading weights: transformer_v4.bin",
    "> Training step 1402/5000 | Loss: 0.241",
    "> Optimizing attention heads...",
    "> Inference latency: 12ms",
    "> Memory usage: 4.2GB / 16GB",
    "> System status: NOMINAL",
    "> Running RAG pipeline evaluation...",
    "> Embedding vector space updated.",
    "> New log entry detected: 'Transformer Architecture Deep Dive'",
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      const message = logMessages[i];
      setLogs((prev) => [
        ...prev.slice(-8),
        { id: nextLogId.current++, text: message }
      ]);
      i = (i + 1) % logMessages.length;
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative bg-[#0B0F14]/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/5">
          <div className="flex space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40"></div>
          </div>
          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">research_terminal_v2.0</div>
        </div>
        <div className="p-4 font-mono text-[11px] space-y-1.5 min-h-[220px]">
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={log.text.startsWith('>') ? "text-blue-400" : "text-gray-500"}
            >
              {log.text}
            </motion.div>
          ))}
          <div className="flex items-center space-x-1">
            <span className="text-blue-400">{">"}</span>
            <div className="w-1.5 h-3 bg-blue-400 animate-blink"></div>
          </div>
        </div>
        <div className="scanline"></div>
      </div>
    </div>
  );
};

const Hero = ({ postsCount, searchQuery, setSearchQuery }: { postsCount: number, searchQuery: string, setSearchQuery: (q: string) => void }) => {
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <motion.header
      ref={heroRef}
      style={{ opacity, scale }}
      className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
    >
      <div className="space-y-6 sm:space-y-8">
        {/* Status Bar */}
        <div className="inline-flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-1.5 sm:pr-4 rounded-2xl sm:rounded-full bg-white/5 border border-white/10 backdrop-blur-sm animate-pulse-glow">
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-mono uppercase tracking-widest w-fit">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
            <span>System Status: Operational</span>
          </div>
          <div className="flex items-center space-x-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest px-1">
            <span className="flex items-center space-x-1">
              <Activity className="w-3 h-3" />
              <span>Logs: {postsCount}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Cpu className="w-3 h-3" />
              <span>Domains: LLMs, CV, RL</span>
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter leading-[0.95] sm:leading-[0.9]">
            <span className="text-white">HeaLer's</span><br />
            <span className="animate-shimmer">Notebook</span>
            <span className="text-blue-400 animate-blink ml-1">_</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-xl">
            Real-time logs of building, breaking, and understanding AI systems.
            A public notebook of experiments, failures, and insights from the edge of research.
          </p>
        </div>

        {/* Current Focus */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
            <Box className="w-3 h-3" />
            <span>Current Focus</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 font-mono text-xs sm:text-sm text-blue-400/80 leading-relaxed">
            {">"} Exploring computer vision and reinforcement learning for small object detection and tracking.
          </div>
        </div>

        {/* Search Bar Upgrade */}
        <div className="relative max-w-lg group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
            <input
              type="text"
              placeholder="Search experiments..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 sm:py-4 pl-12 pr-12 sm:pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-gray-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 items-center space-x-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-gray-500">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Visual */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="hidden lg:block relative"
      >
        <TerminalMock />

        {/* Decorative Elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </motion.div>
    </motion.header>
  );
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const path = 'posts';
    const q = query(collection(db, path), orderBy('created_at', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setPosts(postsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });

    return () => unsubscribe();
  }, []);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-16 pb-20">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-sm font-mono text-gray-500 uppercase tracking-widest">Initializing lab notebook...</p>
        </div>
      ) : (
        <>
          <Hero
            postsCount={posts.length}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {/* Posts List */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <Terminal className="w-5 h-5 text-blue-400" />
                <span>Research Logs</span>
              </h2>
              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                Showing {filteredPosts.length} entries
              </div>
            </div>

            <div className="grid grid-cols-1 gap-0">
              {filteredPosts.length > 0 ? (
                filteredPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl bg-white/5">
                  <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">No logs found matching your query.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
