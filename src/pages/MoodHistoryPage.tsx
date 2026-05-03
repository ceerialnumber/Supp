import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useJoin } from '../context/JoinContext';
import MoodCard from '../components/mood/MoodCard';
import MoodSummary from '../components/mood/MoodSummary';
import { TYPOGRAPHY } from '../styles/typography';

const INDEX_TO_MOOD_KEY = ['AMAZING', 'ENERGETIC', 'RELAXED', 'TIRED', 'SAD'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_ABBR_MAP: Record<string, number> = {
  'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
  'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11,
  'January': 0, 'February': 1, 'March': 2, 'April': 3, 'June': 5,
  'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
};

interface MoodHistoryPageProps {
  onBack: () => void;
  onEventClick: (event: any) => void;
}

export default function MoodHistoryPage({ onBack, onEventClick }: MoodHistoryPageProps) {
  const { eventMoods, userEvents } = useJoin();

  // Initialize to April 2026 (based on current metadata)
  const [selectedMonth, setSelectedMonth] = useState(3); // 0-indexed, 3 = April
  const [selectedYear, setSelectedYear] = useState(2026);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const fullHistory = useMemo(() => {
    return Object.entries(eventMoods)
      .filter(([_, moodIdx]) => moodIdx !== undefined && moodIdx !== -1)
      .map(([eventId, moodIdx]) => {
        const event = userEvents.find(e => e.id.toString() === eventId);
        if (!event) return null;
        
        const moodKey = INDEX_TO_MOOD_KEY[moodIdx as number];
        
        // Parse date "20 Apr 2026"
        const [d, mStr, y] = event.date.split(' ');
        const monthIdx = MONTH_ABBR_MAP[mStr];
        const yearNum = parseInt(y);

        return {
          id: event.id,
          date: event.date,
          monthIdx,
          yearNum,
          time: event.time?.split(' - ')[0] || '',
          mood: moodKey,
          moodIdx: moodIdx as number,
          event: event.title,
          fullEvent: event
        };
      })
      .filter((e): e is NonNullable<typeof e> => e !== null);
  }, [eventMoods, userEvents]);

  const allStats = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    fullHistory.forEach(entry => {
      counts[entry.moodIdx]++;
    });
    return counts;
  }, [fullHistory]);

  const totalAllMoods = fullHistory.length;

  const filteredHistory = useMemo(() => {
    return fullHistory.filter(entry => entry.monthIdx === selectedMonth && entry.yearNum === selectedYear);
  }, [fullHistory, selectedMonth, selectedYear]);

  const totalFilteredMoods = filteredHistory.length;

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(prev => prev - 1);
    } else {
      setSelectedMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(prev => prev + 1);
    } else {
      setSelectedMonth(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      const activeElement = scrollRef.current.querySelector('[data-active="true"]');
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [selectedMonth]);

  return (
    <div className="max-w-6xl mx-auto pb-24 px-4 md:px-0">
      <div className="px-2 mb-8">
        <h1 className={TYPOGRAPHY.sectionTitle}>Mood History</h1>

        {fullHistory.length > 0 && (
          <div className="mb-8">
            <MoodSummary stats={allStats} total={totalAllMoods} />
          </div>
        )}
        
        {/* Month Selector */}
        <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-[28px] border border-gray-100 mb-8">
          <button 
            onClick={handlePrevMonth}
            className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-400" />
          </button>
          
          <div 
            ref={scrollRef}
            className="flex-1 flex overflow-x-auto no-scrollbar gap-2 px-2 py-1 items-center"
          >
            {MONTHS.map((month, idx) => (
              <button
                key={month}
                data-active={idx === selectedMonth}
                onClick={() => setSelectedMonth(idx)}
                className={`flex-none px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                  idx === selectedMonth 
                    ? 'bg-[#1371FF] text-white shadow-md' 
                    : 'bg-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {month}
              </button>
            ))}
          </div>

          <button 
            onClick={handleNextMonth}
            className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className={TYPOGRAPHY.h2}>
            {MONTHS[selectedMonth]} {selectedYear}
          </h2>
          <div className={TYPOGRAPHY.label + " text-blue-600 bg-blue-50 px-3 py-1 rounded-full"}>
            {totalFilteredMoods} Entries
          </div>
        </div>
      </div>

      {totalFilteredMoods > 0 ? (
        <>
          <div className="space-y-4">
            {filteredHistory.map((entry, index) => (
              <MoodCard
                key={entry.id}
                id={entry.id}
                title={entry.event}
                time={entry.time}
                date={entry.date}
                moodKey={entry.mood}
                index={index}
                onClick={() => onEventClick(entry.fullEvent)}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-[40px] p-16 flex flex-col items-center text-center gap-4 mt-8">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm text-gray-300">
            <Calendar size={40} />
          </div>
          <div className="space-y-2">
            <h2 className={TYPOGRAPHY.sectionTitle}>No entries for this month</h2>
            <p className={TYPOGRAPHY.body + " max-w-xs mx-auto text-gray-500"}>You haven't tracked any moods for {MONTHS[selectedMonth]}. Start joining events!</p>
          </div>
        </div>
      )}
    </div>
  );
}
