import { PostStatus } from '../types';
import { clsx } from 'clsx';

const statusConfig: Record<PostStatus, { label: string; color: string; bg: string }> = {
  idea: { label: 'Idea', color: 'text-gray-400', bg: 'bg-gray-400/10' },
  learning: { label: 'Learning', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  building: { label: 'Building', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  failed: { label: 'Failed', color: 'text-red-400', bg: 'bg-red-400/10' },
  success: { label: 'Success', color: 'text-green-400', bg: 'bg-green-400/10' },
};

export default function StatusBadge({ status }: { status: PostStatus }) {
  const config = statusConfig[status];
  return (
    <span className={clsx(
      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/5",
      config.color,
      config.bg
    )}>
      {config.label}
    </span>
  );
}
