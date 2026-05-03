import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Camera } from 'lucide-react';
import { useJoin } from '../../context/JoinContext';
import { auth } from '../../lib/firebase';
import { MOODS } from '../mood/MoodPicker';
import { TYPOGRAPHY } from '../../styles/typography';


import StatsBar from '../mood/StatsBar';

interface SnapshotsProps {
  showHeader?: boolean;
  onHeaderClick?: () => void;
  onSnapshotClick?: (event: any) => void;
  showStats?: boolean;
}

interface SnapshotItem {
  id: string | number;
  image: string;
  rotate: number;
  icon?: any;
  iconColor?: string;
  bgColor?: string;
  event: any;
}

export default function Snapshots({ showHeader = true, onHeaderClick, onSnapshotClick, showStats = true }: SnapshotsProps) {
  const { userEvents, eventMoods, isEventJoined } = useJoin();

  const allSnapshots = useMemo(() => {
    const combined: SnapshotItem[] = [];
    
    // Use userEvents and filter for involvements
    userEvents.forEach((event) => {
      if (event.image && isEventJoined(event.id)) {
        const moodIdx = eventMoods[event.id.toString()];
        const hasMood = moodIdx !== undefined && moodIdx !== -1;

        combined.push({
          id: `${event.id}`,
          image: event.image,
          rotate: Math.floor(Math.random() * 10) - 5,
          icon: hasMood ? MOODS[moodIdx].icon : null,
          iconColor: hasMood ? 'text-white' : '',
          bgColor: hasMood ? MOODS[moodIdx].bgColor : '',
          event: event
        });
      }
    });

    return combined;
  }, [userEvents, eventMoods, isEventJoined]);

  if (allSnapshots.length === 0) {
    return (
      <section className="px-6 py-4 overflow-hidden">
        {showHeader && (
          <div 
            className="flex items-center justify-between mb-1 cursor-pointer group active:scale-[0.98] transition-transform"
            onClick={onHeaderClick}
          >
            <h2 className={TYPOGRAPHY.sectionTitle}>Snapshots</h2>
            <ArrowRight className="text-blue-600 w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </div>
        )}
        
        <div className="bg-gray-50 border-2  border-gray-200 rounded-[32px] p-8 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
            <Camera className="w-8 h-8 text-blue-600/30" />
          </div>
          <div>
            <h3 className={TYPOGRAPHY.h3}>No Memories Yet</h3>
            <p className="text-sm text-gray-500 max-w-[200px] mx-auto">Join events to capture and share your snapshots here!</p>
          </div>
        </div>
        
        {showStats && <StatsBar />}
      </section>
    );
  }

  return (
    <section className="px-6 py-4 overflow-hidden">
      {showHeader && (
        <div 
          className="flex items-center justify-between mb-2 cursor-pointer group active:scale-[0.98] transition-transform"
          onClick={onHeaderClick}
        >
          <h2 className={TYPOGRAPHY.sectionTitle}>Snapshots</h2>
          <ArrowRight className="text-blue-600 w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar snap-x px-2">
        {allSnapshots.map((snap) => (
          <motion.div
            key={snap.id}
            whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
            whileTap={{ scale: 0.95 }}
            style={{ rotate: snap.rotate }}
            className="flex-shrink-0 w-48 h-64 rounded-[28px] overflow-hidden shadow-md snap-center bg-white p-2 border border-gray-100 relative cursor-pointer"
            onClick={() => onSnapshotClick?.(snap.event)}
          >
            <div className="w-full h-full rounded-[20px] overflow-hidden relative">
              <img
                src={snap.image}
                alt={`Snapshot ${snap.id}`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              
              {/* Event Type / Mood Icon Overlay */}
              {snap.icon && (
                <div className="absolute bottom-3 right-3">
                  <div className={`${snap.bgColor} rounded-full p-2 shadow-lg `}>
                    <snap.icon size={18} className={snap.iconColor} strokeWidth={2} />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      {showStats && <StatsBar />}
    </section>
  );
}
