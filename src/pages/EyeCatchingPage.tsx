import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, ArrowUpDown } from 'lucide-react';
import JoinButton from '../components/JoinButton';
import { 
  OutdoorIcon, 
  WorkoutIcon, 
  LearningIcon, 
  PartyIcon, 
  ArtIcon, 
  FilmIcon, 
  MusicIcon 
} from '../components/EventType';
import { ALL_EVENTS } from '../data/events';

const SORT_ICONS = [
  { id: 'outdoor', Icon: OutdoorIcon, label: 'Outdoor' },
  { id: 'workout', Icon: WorkoutIcon, label: 'Workout' },
  { id: 'learning', Icon: LearningIcon, label: 'Learning' },
  { id: 'party', Icon: PartyIcon, label: 'Party' },
  { id: 'art', Icon: ArtIcon, label: 'Art' },
  { id: 'film', Icon: FilmIcon, label: 'Film' },
  { id: 'music', Icon: MusicIcon, label: 'Music' },
];

const THAI_MONTHS: { [key: string]: number } = {
  'มกราคม': 0, 'กุมภาพันธ์': 1, 'มีนาคม': 2, 'เมษายน': 3, 'พฤษภาคม': 4, 'มิถุนายน': 5,
  'กรกฎาคม': 6, 'สิงหาคม': 7, 'กันยายน': 8, 'ตุลาคม': 9, 'พฤศจิกายน': 10, 'ธันวาคม': 11
};

const parseThaiDate = (dateStr: string) => {
  const [day, month, year] = dateStr.split(' ');
  const monthIndex = THAI_MONTHS[month] || 0;
  return new Date(parseInt(year) - 543, monthIndex, parseInt(day)).getTime();
};

const FILTERED_EVENTS = ALL_EVENTS.filter(e => typeof e.id === 'string' && e.id.startsWith('e'));

interface EyeCatchingPageProps {
  onEventClick: (event: any, joined?: boolean) => void;
  customEvents?: any[];
}

export default function EyeCatchingPage({ onEventClick, customEvents = [] }: EyeCatchingPageProps) {
  const [sortBy, setSortBy] = useState<string | null>(null);

  const allVisibleEvents = useMemo(() => {
    return [...customEvents, ...FILTERED_EVENTS];
  }, [customEvents]);

  const sortedEvents = useMemo(() => {
    if (!sortBy) return allVisibleEvents;

    return [...allVisibleEvents].sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title, 'th');
      }
      
      // If sortBy is a specific type, prioritize that type
      if (a.type === sortBy && b.type !== sortBy) return -1;
      if (a.type !== sortBy && b.type === sortBy) return 1;
      
      // Secondary sort by title
      return a.title.localeCompare(b.title, 'th');
    });
  }, [allVisibleEvents, sortBy]);

  const handleSort = (id: string) => {
    setSortBy(prev => prev === id ? null : id);
  };

  const handleRedirect = (event: any) => {
    // Navigate with joined=true to show details in joined state
    onEventClick(event, true);
  };
  return (
    <div className="max-w-6xl mx-auto pb-24">
      <div className="px-6 py-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between mb-8 mt-2">
        <h1 className="text-3xl font-bold text-blue-600">Eye-catching!</h1>
      </div>

      {/* Sorting Controls */}
      <div className="flex items-center gap-4 mb-8 overflow-x-auto no-scrollbar py-4 px-2">
        <button
          onClick={() => handleSort('title')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-all duration-300 h-10 ${
            sortBy === 'title' 
              ? 'bg-blue-600 text-white shadow-md scale-105' 
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          <ArrowUpDown size={14} />
          Title
        </button>
        
        <div className="w-px h-8 bg-gray-200 flex-shrink-0" />

        {SORT_ICONS.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSort(option.id)}
            className={`flex-shrink-0 transition-all duration-300 ${
              sortBy === option.id 
                ? 'scale-110 ring-2 ring-blue-600 ring-offset-2 rounded-full' 
                : 'opacity-60 grayscale hover:opacity-100 hover:grayscale-0'
            }`}
          >
            <option.Icon size={20} className="!w-10 !h-10" />
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {sortedEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onEventClick(event)}
            className="group cursor-pointer active:scale-[0.98] transition-all duration-300"
          >
            <div className="bg-white rounded-[40px] overflow-hidden shadow-md border border-gray-100 h-full flex flex-col">
              {/* Image Container with Floating Icon */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <div className="bg-white/90 backdrop-blur-md rounded-2xl p-2 shadow-sm">
                    <event.Icon size={20} className="!w-8 !h-8" noBackground noShadow />
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-black text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                  {event.title}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-blue-500" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-blue-500" />
                      <span>{event.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium min-w-0">
                    <MapPin size={14} className="text-blue-500 flex-shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-400 line-clamp-2 mb-6 leading-relaxed flex-1">
                  {event.description}
                </p>

                <JoinButton 
                  id={event.id}
                  variant="full"
                  onStateChange={(isJoined) => {
                    if (isJoined) {
                      setTimeout(() => {
                        handleRedirect(event);
                      }, 400);
                    }
                  }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      </div>
    </div>
  );
}
