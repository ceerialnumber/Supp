import React, { useMemo } from 'react';
import { useJoin } from '../../context/JoinContext';
import { 
  Wine, 
  Dumbbell, 
  Sun, 
  Palette, 
  BookOpen,
  Film,
  Music
} from 'lucide-react';

interface StatConfig {
  type: string;
  color: string;
  icon: any;
}

const STATS_CONFIG: StatConfig[] = [
  { type: 'party', color: 'bg-[#FF6B4A]', icon: Wine },
  { type: 'workout', color: 'bg-[#007AFF]', icon: Dumbbell },
  { type: 'outdoor', color: 'bg-[#4ADE80]', icon: Sun },
  { type: 'art', color: 'bg-[#A855F7]', icon: Palette },
  { type: 'learning', color: 'bg-[#FACC15]', icon: BookOpen },
  { type: 'film', color: 'bg-[#EF4444]', icon: Film },
  { type: 'music', color: 'bg-[#EC4899]', icon: Music },
];

export default function StatsBar() {
  const { isEventJoined, userEvents } = useJoin();

  const stats = useMemo(() => {
    const counts: Record<string, number> = {};
    
    // Initialize counts
    STATS_CONFIG.forEach(config => counts[config.type] = 0);

    // Count events (both hardcoded and custom) if they are joined or created by user
    userEvents.forEach(event => {
      // isEventJoined returns true if the user joined the event OR if they created it
      if (isEventJoined(event.id)) {
        counts[event.type] = (counts[event.type] || 0) + 1;
      }
    });

    const total = Object.values(counts).reduce((acc, curr) => acc + curr, 0);
    
    return {
      items: STATS_CONFIG.map(config => ({
        ...config,
        count: counts[config.type] || 0,
        percentage: total > 0 ? ((counts[config.type] || 0) / total) * 100 : 0
      })).filter(item => item.count > 0),
      total
    };
  }, [isEventJoined, userEvents]);

  if (stats.total === 0) return null;

  return (
    <div className="mt-2">
      <div className="flex w-full h-11 bg-gray-100 rounded-full overflow-hidden p-1.5 gap-1.5">
        {stats.items.map((item) => (
          <div 
            key={item.type}
            className={`flex items-center justify-between px-3 ${item.color} rounded-full text-white transition-all duration-500 min-w-fit`}
            style={{ width: `${Math.max(item.percentage, 15)}%` }}
          >
            <item.icon size={14} strokeWidth={2.5} />
            <span className="text-[11px] font-bold ml-1">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
