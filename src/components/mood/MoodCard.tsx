import React from 'react';
import { motion } from 'motion/react';
import { Smile, Zap, Coffee, Cloud, Frown, LucideIcon } from 'lucide-react';
import { useJoin } from '../../context/JoinContext';

export const MOOD_TYPES: Record<string, { label: string; color: string; icon: LucideIcon; bg: string; text: string; bgColor: string }> = {
  AMAZING: { label: 'Amazing', color: '#1371FF', icon: Smile, bg: 'bg-blue-50', text: 'text-blue-600', bgColor: 'bg-[#1371FF]' },
  ENERGETIC: { label: 'Energetic', color: '#FFD600', icon: Zap, bg: 'bg-yellow-50', text: 'text-yellow-600', bgColor: 'bg-[#FFD600]' },
  RELAXED: { label: 'Relaxed', color: '#5CD1FF', icon: Coffee, bg: 'bg-cyan-50', text: 'text-cyan-600', bgColor: 'bg-[#5CD1FF]' },
  TIRED: { label: 'Tired', color: '#FF5C5C', icon: Cloud, bg: 'bg-red-50', text: 'text-red-600', bgColor: 'bg-[#FF5C5C]' },
  SAD: { label: 'Sad', color: '#94A3B8', icon: Frown, bg: 'bg-gray-50', text: 'text-gray-600', bgColor: 'bg-[#94A3B8]' },
};

interface MoodCardProps {
  key?: React.Key;
  id: string | number; // Added id to fetch stats
  title: string;
  time: string;
  date: string;
  moodKey: string;
  onClick?: () => void;
  index?: number;
}

export default function MoodCard({ id, title, time, date, moodKey, onClick, index = 0 }: MoodCardProps) {
  const { getEventMoodStats } = useJoin();
  const mood = MOOD_TYPES[moodKey as keyof typeof MOOD_TYPES];
  const stats = getEventMoodStats(id);
  const total = stats.reduce((a, b) => a + b, 0);

  if (!mood) return null;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="flex flex-col gap-4 bg-white p-5 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-left w-full overflow-hidden"
    >
      <div className="flex items-center gap-4 w-full">
        <div className={`${mood.bg} ${mood.text} p-4 rounded-3xl`}>
          <mood.icon size={28} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-gray-900 truncate text-lg">{title}</h3>
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest flex-shrink-0">{time}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#1371FF] uppercase tracking-tighter">{mood.label}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />
            <span className="text-sm text-gray-400 font-medium">{date}</span>
          </div>
        </div>
      </div>

      <div className="mt-2 space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Community Mood</span>
          <span className="text-[10px] font-bold text-blue-600">{total} active</span>
        </div>
        <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden flex shadow-inner">
          {Object.keys(MOOD_TYPES).map((key, idx) => {
            const count = stats[idx] || 0;
            if (count === 0) return null;
            const percentage = (count / total) * 100;
            const m = MOOD_TYPES[key];
            return (
              <div 
                key={key} 
                className={`h-full ${m.bgColor} opacity-80 border-r border-white/20 last:border-r-0`}
                style={{ width: `${percentage}%` }}
              />
            );
          })}
        </div>
      </div>
    </motion.button>
  );
}
