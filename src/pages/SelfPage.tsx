import { motion } from 'motion/react';
import { GlassWater, Dumbbell, Palette } from 'lucide-react';
import Snapshots from '../components/Snapshots';

const CATEGORIES = [
  { id: 'party', label: 'Party', current: 4, total: 10, icon: GlassWater, color: '#FF5C5C' },
  { id: 'workout', label: 'Workout', current: 3, total: 10, icon: Dumbbell, color: '#1371FF' },
  { id: 'art', label: 'Art', current: 2, total: 10, icon: Palette, color: '#5CD1FF' },
];

const CALENDAR_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const START_DAY = 0; // Sunday

const HIGHLIGHTS = [
  { day: 1, color: '#1371FF', type: 'full' },
  { day: 2, color: '#1371FF', type: 'bottom' },
  { day: 3, color: '#1371FF', type: 'bottom' },
  { day: 5, color: '#FF5C5C', type: 'top' },
  { day: 8, color: '#1371FF', type: 'left' },
  { day: 9, color: '#1371FF', type: 'left' },
  { day: 10, color: '#FFD600', type: 'left' },
  { day: 14, color: '#5CD1FF', type: 'right' },
  { day: 18, color: '#FF5C5C', type: 'top' },
  { day: 23, color: '#FFD600', type: 'left' },
  { day: 24, color: '#FFD600', type: 'left' },
  { day: 26, color: '#5CD1FF', type: 'left' },
  { day: 27, color: '#1371FF', type: 'left' },
  { day: 28, color: '#1371FF', type: 'bottom' },
];

export default function SelfPage() {
  return (
    <div className="max-w-6xl mx-auto pb-24">
      <div className="bg-white">
      <div className="px-6 py-4">
        {/* Profile Section */}
        <div className="flex flex-col items-center mb-10 mt-4">
          <div className="w-60 h-60 rounded-full overflow-hidden shadow-l mb-4">
            <img
              src="/images/user-large.jpg"
              alt="Profile"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <h2 className="text-4xl font-bold text-[#1D72FE]">Pristine Kai</h2>
        </div>

        <h1 className="text-2xl font-bold text-blue-600 mb-8">Snapshots!</h1>

        {/* Category Progress */}
        <div className="flex justify-between gap-4 mb-10 overflow-x-auto no-scrollbar py-2">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="50"
                    fill="none"
                    stroke="#F3F4F6"
                    strokeWidth="8"
                  />
                  <motion.circle
                    cx="56"
                    cy="56"
                    r="50"
                    fill="none"
                    stroke={cat.color}
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 50}
                    initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - cat.current / cat.total) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <cat.icon className="w-6 h-6 text-blue-600 mb-1" />
                  <span className="text-xs font-bold text-gray-900">{cat.label}</span>
                  <span className="text-[10px] font-medium text-gray-400">{cat.current}/{cat.total}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Snapshots Gallery */}
        <div className="-mx-6">
          <Snapshots showHeader={false} />
        </div>

        {/* Mood Tracking Calendar */}
        <div className="mt-8 bg-white rounded-[40px] shadow-2xl p-8 border border-gray-50">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-blue-600">Mood tracking</h2>
            <span className="text-lg font-medium text-gray-900">March '26</span>
          </div>

          <div className="grid grid-cols-7 gap-y-6 text-center">
            {['S', 'M', 'T', 'W', 'TH', 'F', 'S'].map((day, index) => (
              <span key={`${day}-${index}`} className="text-sm font-bold text-gray-900">{day}</span>
            ))}
            
            {/* Empty spaces for start of month */}
            {Array.from({ length: START_DAY }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {CALENDAR_DAYS.map((day) => {
              const highlight = HIGHLIGHTS.find(h => h.day === day);
              
              return (
                <div key={day} className="relative h-10 flex items-center justify-center">
                  <span className={`text-sm font-medium z-10 ${highlight?.type === 'full' ? 'text-white' : 'text-gray-900'}`}>
                    {day}
                  </span>
                  
                  {highlight && (
                    <div 
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                      {highlight.type === 'full' && (
                        <div className="w-8 h-8 rounded-full" style={{ backgroundColor: highlight.color }} />
                      )}
                      {highlight.type === 'bottom' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: highlight.color }} />
                      )}
                      {highlight.type === 'top' && (
                        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: highlight.color }} />
                      )}
                      {highlight.type === 'left' && (
                        <div className="absolute top-0 bottom-0 left-0 w-0.5" style={{ backgroundColor: highlight.color }} />
                      )}
                      {highlight.type === 'right' && (
                        <div className="absolute top-0 bottom-0 right-0 w-0.5" style={{ backgroundColor: highlight.color }} />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* Next month preview */}
            {[1, 2, 3, 4].map((day) => (
              <div key={`next-${day}`} className="h-10 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-300">{day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
