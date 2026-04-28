import React from 'react';
import { motion } from 'motion/react';
import { MOODS } from './MoodPicker';

interface MoodSummaryProps {
  stats: number[];
  total: number;
}

export default function MoodSummary({ stats, total }: MoodSummaryProps) {
  const gradientStyle = React.useMemo(() => {
    const pickedMoods = MOODS.filter((_, idx) => stats[idx] > 0);
    if (pickedMoods.length === 0) return { background: '#f9fafb' };
    
    const shuffled = [...pickedMoods].sort(() => Math.random() - 0.5);
    const colors = shuffled.map(m => `${m.hex}15`); 
    
    if (colors.length === 1) {
      return { background: `linear-gradient(135deg, ${colors[0]}, #f9fafb)` };
    }
    
    return { background: `linear-gradient(135deg, ${colors.join(', ')})` };
  }, [stats]);

  if (total === 0) return null;

  return (
    <div 
      style={gradientStyle}
      className="rounded-[32px] p-6 text-gray-900 border border-gray-100 shadow-sm transition-all duration-500"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Mood Summary</h2>
        <span className="text-[10px] font-black bg-[#1371FF]/10 text-[#1371FF] px-2 py-1 rounded-lg">
          {total} Check-ins
        </span>
      </div>

      <div className="grid grid-cols-5 gap-1">
        {MOODS.map((mood, idx) => {
          const count = stats[idx];
          
          return (
            <div key={idx} className="flex flex-col items-center gap-2">
              <div className="relative">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm">
                  <mood.icon className={`w-5 h-5 ${mood.color}`} />
                </div>
              </div>
              <p className="text-[10px] font-black text-gray-400">{count}</p>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 h-2 w-full bg-gray-200/50 rounded-full overflow-hidden flex">
        {MOODS.map((mood, idx) => {
          const count = stats[idx];
          if (count === 0) return null;
          const percentage = (count / total) * 100;
          
          return (
            <motion.div
              key={idx}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
              className={`h-full ${mood.bgColor} opacity-80`}
            />
          );
        })}
      </div>
    </div>
  );
}
