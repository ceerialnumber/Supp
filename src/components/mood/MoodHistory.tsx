import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Info } from 'lucide-react';
import { useJoin } from '../../context/JoinContext';
import { ALL_EVENTS } from '../../data/events';
import MoodCard from './MoodCard';
import { TYPOGRAPHY } from '../../styles/typography';

// Map index from MoodPicker to MOOD_TYPES key
const INDEX_TO_MOOD_KEY = ['AMAZING', 'ENERGETIC', 'RELAXED', 'TIRED', 'SAD'];

interface MoodHistoryProps {
  selectedDay: number | null;
  monthIdx: number;
  onEventClick?: (event: any) => void;
}

export default function MoodHistory({ selectedDay, monthIdx, onEventClick }: MoodHistoryProps) {
  const { eventMoods, userEvents } = useJoin();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  // Combine all possible events (predefined + user created)
  const allEvents = [...ALL_EVENTS, ...userEvents];

  // Filter events that have a mood picked AND match the selected day/month
  const entry = useMemo(() => {
    if (!selectedDay) return null;

    const matchedEvent = allEvents.find(e => {
      const dateParts = e.date.split(' ');
      const mMatch = dateParts[1] === monthNames[monthIdx] || dateParts[1] === monthNames[monthIdx].substring(0, 3);
      return dateParts[0] === selectedDay.toString() && mMatch;
    });

    if (!matchedEvent) return null;
    
    const moodIdx = eventMoods[matchedEvent.id];
    if (moodIdx === undefined || moodIdx === -1) return null;

    const moodKey = INDEX_TO_MOOD_KEY[moodIdx as number];
    return {
      id: matchedEvent.id,
      date: matchedEvent.date,
      time: matchedEvent.time?.split(' - ')[0] || '',
      mood: moodKey,
      event: matchedEvent.title,
      fullEvent: matchedEvent // Store the full event object for clicking
    };
  }, [eventMoods, selectedDay, monthIdx, allEvents]);

  if (!entry) {
    return (
      <div className="mt-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 border border-gray-200 rounded-[32px] p-8 flex flex-col items-center text-center gap-2"
        >
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-gray-300">
            <Info size={24} />
          </div>
          <p className={TYPOGRAPHY.h3}>Select a day to see details</p>
          <p className={TYPOGRAPHY.body + " !text-xs max-w-[200px]"}>Join event and history mood will show here</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <MoodCard
        key={entry.id}
        id={entry.id}
        title={entry.event}
        time={entry.time}
        date={entry.date}
        moodKey={entry.mood}
        onClick={() => onEventClick && onEventClick(entry.fullEvent)}
      />
    </div>
  );
}
