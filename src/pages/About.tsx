import { Terminal, Cpu, Brain, Zap, FlaskConical } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-3xl mx-auto space-y-16">
      <header className="space-y-6">
        <h1 className="text-5xl font-extrabold text-white tracking-tight leading-tight">
          About the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Lab</span>
        </h1>
        <p className="text-xl text-gray-400 leading-relaxed">
          This is a public engineering notebook dedicated to the exploration of artificial intelligence, machine learning, and the systems that power them.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 bg-white/5 border border-white/5 rounded-3xl space-y-4">
          <div className="p-3 bg-blue-500/10 rounded-xl w-fit">
            <Brain className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Research Focus</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Exploring large language models, reinforcement learning, and the intersection of hardware and software for efficient AI.
          </p>
        </div>
        <div className="p-8 bg-white/5 border border-white/5 rounded-3xl space-y-4">
          <div className="p-3 bg-purple-500/10 rounded-xl w-fit">
            <Cpu className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Engineering Log</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Documenting the "how" behind the "what". Code snippets, architecture diagrams, and performance benchmarks.
          </p>
        </div>
        <div className="p-8 bg-white/5 border border-white/5 rounded-3xl space-y-4">
          <div className="p-3 bg-yellow-500/10 rounded-xl w-fit">
            <Zap className="w-6 h-6 text-yellow-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Rapid Iteration</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Embracing failure as a data point. The lab follows a "build fast, break things, learn faster" philosophy.
          </p>
        </div>
        <div className="p-8 bg-white/5 border border-white/5 rounded-3xl space-y-4">
          <div className="p-3 bg-green-500/10 rounded-xl w-fit">
            <FlaskConical className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Open Science</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Everything here is public. Knowledge should be shared to accelerate the development of beneficial AI.
          </p>
        </div>
      </section>

      <section className="space-y-8 bg-blue-500/5 border border-blue-500/10 p-12 rounded-3xl">
        <div className="flex items-center space-x-3">
          <Terminal className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">The Engineer</h2>
        </div>
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            Hi! I am HeaLer, an AI/ML engineer focused on building robust, scalable, and ethical AI systems. My background spans from low-level systems programming to high-level model architecture.
          </p>
          <p>
            When I'm not training models or debugging CUDA kernels, I'm usually documenting my findings here. This notebook serves as my external memory and a way to connect with the broader research community.
          </p>
        </div>
      </section>
    </div>
  );
}
