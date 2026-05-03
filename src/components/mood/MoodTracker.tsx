import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft as ArrowLeftIcon, ChevronRight as ArrowRightIcon, ChevronRight } from 'lucide-react';
import { useJoin } from '../../context/JoinContext';
import MoodHistory from './MoodHistory';
import { TYPOGRAPHY } from '../../styles/typography';

const CALENDAR_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const TODAY = 28;

const MOOD_COLORS: Record<string, string> = {
  AMAZING: '#1371FF',
  ENERGETIC: '#FFD600',
  RELAXED: '#5CD1FF',
  TIRED: '#FF5C5C',
  SAD: '#94A3B8',
};

const INDEX_TO_MOOD_KEY = ['AMAZING', 'ENERGETIC', 'RELAXED', 'TIRED', 'SAD'];

interface MoodTrackerProps {
  onSeeHistory?: () => void;
  onEventClick?: (event: any) => void;
}

export default function MoodTracker({ onSeeHistory, onEventClick }: MoodTrackerProps) {
  const { eventMoods, userEvents } = useJoin();
  const [monthIdx, setMonthIdx] = useState(3); // Start with April
  const [selectedDay, setSelectedDay] = useState<number | null>(TODAY);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handlePrev = () => {
    setMonthIdx(prev => (prev === 0 ? 11 : prev - 1));
    setSelectedDay(null);
  };
  const handleNext = () => {
    setMonthIdx(prev => (prev === 11 ? 0 : prev + 1));
    setSelectedDay(null);
  };

  const calendarMoods = useMemo(() => {
    const moods: Record<number, string> = {};

    Object.entries(eventMoods).forEach(([eventId, moodIdx]) => {
      if (moodIdx === undefined || moodIdx === -1) return;

      const event = userEvents.find(e => e.id.toString() === eventId);
      if (!event) return;

      const dateParts = event.date.split(' ');
      if (dateParts.length >= 2) {
        const day = parseInt(dateParts[0]);
        const monthStr = dateParts[1];
        
        // Match either "Apr" or "April"
        const isMatch = monthStr === monthNames[monthIdx] || monthStr === monthNames[monthIdx].substring(0, 3);
        
        if (isMatch && !isNaN(day)) {
          moods[day] = INDEX_TO_MOOD_KEY[moodIdx as number];
        }
      }
    });

    return moods;
  }, [eventMoods, monthIdx, userEvents]);

  return (
    <div className="w-full">
      <div className="mt-12 mb-2">
        <button 
          onClick={onSeeHistory}
          className="flex items-center justify-between w-full group mb-4 transition-all"
        >
          <h1 className={TYPOGRAPHY.sectionTitle + " group-hover:text-blue-700 transition-colors"}>Mood tracking</h1>
          <div className="p-1.5 rounded-full group-hover:bg-blue-100 transition-colors">
            <ChevronRight size={20} className="text-blue-600" />
          </div>
        </button>
        <div className="flex items-center justify-between w-full rounded-full p-1.5">
          <button 
            onClick={handlePrev}
            className="p-2 hover:bg-white rounded-full transition-all shadow-sm active:scale-95"
            aria-label="Previous Month"
          >
            <ArrowLeftIcon size={24} className="text-[#1371FF]" />
          </button>
          <div className="text-center">
            <span className={TYPOGRAPHY.labelEmphasis + " !text-base"}>{monthNames[monthIdx]} '26</span>
          </div>
          <button 
            onClick={handleNext}
            className="p-2 hover:bg-white rounded-full transition-all shadow-sm active:scale-95"
            aria-label="Next Month"
          >
            <ArrowRightIcon size={24} className="text-[#1371FF]" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-2xl p-8 border border-gray-50">
        <div className="grid grid-cols-7 gap-y-6 text-center">
          {['S', 'M', 'T', 'W', 'TH', 'F', 'S'].map((day, index) => (
            <span key={`${day}-${index}`} className="text-sm font-bold text-gray-900">{day}</span>
          ))}

          {[29, 30, 31].map((day) => (
            <div key={`prev-${day}`} className="h-10 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-200">{day}</span>
            </div>
          ))}

          {CALENDAR_DAYS.map((day) => {
            const moodType = calendarMoods[day];
            const moodColor = moodType ? MOOD_COLORS[moodType] : null;
            const isToday = monthIdx === 3 && day === TODAY;
            const isSelected = selectedDay === day;
            
            return (
              <button 
                key={day} 
                onClick={() => setSelectedDay(day)}
                className="relative h-10 flex items-center justify-center outline-none focus:outline-none"
              >
                {isSelected && (
                  <motion.div
                    layoutId="selection-circle"
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-100" />
                  </motion.div>
                )}

                {isToday && (
                  <motion.div
                    layoutId="today-circle"
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#1371FF] shadow-sm" />
                  </motion.div>
                )}

                <span className={`text-sm font-medium z-10 ${isToday ? 'text-white' : 'text-gray-900'}`}>
                  {day}
                </span>
                
                {moodColor && (
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className="absolute bottom-1 left-3 right-3 h-1 rounded-full" 
                    style={{ backgroundColor: moodColor }} 
                  />
                )}
              </button>
            );
          })}
          
          {[1, 2, 3, 4].map((day) => (
            <div key={`next-${day}`} className="h-10 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-200">{day}</span>
            </div>
          ))}
        </div>

        <MoodHistory 
          selectedDay={selectedDay} 
          monthIdx={monthIdx} 
          onEventClick={onEventClick} 
        />
      </div>
    </div>
  );
}
