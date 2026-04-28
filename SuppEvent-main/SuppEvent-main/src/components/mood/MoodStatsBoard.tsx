import React from 'react';
import { motion } from 'motion/react';
import { useJoin } from '../../context/JoinContext';
import { MOODS } from './MoodPicker';
import { TYPOGRAPHY } from '../../styles/typography';

interface MoodStatsBoardProps {
  eventId: string | number;
  compact?: boolean;
}

export default function MoodStatsBoard({ eventId, compact = false }: MoodStatsBoardProps) {
  const { getEventMoodStats } = useJoin();
  const stats = getEventMoodStats(eventId);
  const total = stats.reduce((a, b) => a + b, 0);

  if (compact) {
    return (
      <div className="flex items-center gap-0.5 w-full">
        {MOODS.map((mood, idx) => {
          const count = stats[idx] || 0;
          if (count === 0) return null;
          const percentage = total > 0 ? (count / total) * 100 : 0;
          
          return (
            <div 
              key={idx} 
              className={`h-3 rounded-full ${mood.bgColor} shadow-sm border border-black/5`}
              style={{ width: `${percentage}%` }}
              title={`${mood.label}: ${Math.round(percentage)}%`}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-[32px] p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className={TYPOGRAPHY.h3}>Community Mood</h3>
        <span className={TYPOGRAPHY.label + " text-blue-600 bg-blue-50 px-2 py-1 rounded-full"}>
          {total} Responses
        </span>
      </div>

      <div className="space-y-4">
        {MOODS.map((mood, idx) => {
          const count = stats[idx] || 0;
          const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <mood.icon className={`w-4 h-4 ${mood.color}`} />
                  <span className={TYPOGRAPHY.body.replace('text-gray-500', 'text-gray-700') + " !text-xs"}>{mood.label}</span>
                </div>
                <span className={TYPOGRAPHY.label + " !text-gray-400"}>{percentage}%</span>
              </div>
              <div className="h-4 w-full bg-white rounded-full overflow-hidden shadow-inner border border-gray-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                  className={`h-full ${mood.bgColor} rounded-full flex items-center justify-end px-1`}
                >
                   {percentage > 15 && <span className="text-[8px] font-bold text-white/80">{percentage}%</span>}
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
