import React from 'react';
import { Smile, Zap, Coffee, Cloud, Frown } from 'lucide-react';
import { motion } from 'motion/react';
import { useJoin } from '../../context/JoinContext';

export const MOODS = [
  { icon: Smile, color: 'text-blue-600', bgColor: 'bg-blue-600', hex: '#1371FF', label: 'Amazing' },
  { icon: Zap, color: 'text-yellow-500', bgColor: 'bg-yellow-500', hex: '#FFD600', label: 'Energetic' },
  { icon: Coffee, color: 'text-cyan-500', bgColor: 'bg-cyan-500', hex: '#5CD1FF', label: 'Relaxed' },
  { icon: Cloud, color: 'text-red-500', bgColor: 'bg-red-500', hex: '#FF5C5C', label: 'Tired' },
  { icon: Frown, color: 'text-gray-500', bgColor: 'bg-gray-500', hex: '#94A3B8', label: 'Sad' },
];

interface MoodPickerProps {
  eventId: string | number;
  className?: string;
  variant?: 'collapsed' | 'expanded';
}

export default function MoodPicker({ eventId, className = '', variant = 'collapsed' }: MoodPickerProps) {
  const { eventMoods, setMood } = useJoin();
  const selectedMoodIdx = eventMoods[eventId.toString()];
  const hasSelectedMood = selectedMoodIdx !== undefined && selectedMoodIdx !== -1;

  if (variant === 'expanded') {
    return (
      <div className={`flex justify-between items-center px-2 w-full ${className}`}>
        {MOODS.map((mood, idx) => {
          const isSelected = selectedMoodIdx === idx;
          return (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                setMood(eventId, isSelected ? -1 : idx);
              }}
              className={`w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
                isSelected 
                  ? `${mood.bgColor} scale-110` 
                  : hasSelectedMood 
                    ? 'bg-white opacity-30 scale-95' 
                    : 'bg-white hover:scale-105'
              }`}
            >
              <mood.icon className={`w-8 h-8 transition-colors duration-300 ${isSelected ? 'text-white' : mood.color}`} />
            </motion.button>
          );
        })}
      </div>
    );
  }

  if (hasSelectedMood) {
    const mood = MOODS[selectedMoodIdx];
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={(e) => {
          e.stopPropagation();
          setMood(eventId, -1); // Reset
        }}
        className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg transition-all duration-300 ${mood.bgColor} ${className}`}
      >
        {React.createElement(mood.icon, { 
          className: "w-6 h-6 text-white",
          strokeWidth: 3 
        })}
        <span className="text-white font-bold text-lg">{mood.label}</span>
      </motion.button>
    );
  }

  return (
    <div className={`flex justify-between items-center bg-blue-50/50 rounded-3xl p-3 border border-blue-100/50 w-full ${className}`}>
      {MOODS.map((mood, idx) => (
        <button
          key={idx}
          onClick={(e) => {
            e.stopPropagation();
            setMood(eventId, idx);
          }}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 bg-white hover:scale-110 hover:shadow-md"
        >
          <mood.icon className={`w-5 h-5 ${mood.color}`} />
        </button>
      ))}
    </div>
  );
}
