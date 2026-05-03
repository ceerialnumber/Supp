import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, ArrowUpDown, History, ArrowUp, ArrowDown } from 'lucide-react';
import JoinButton from '../components/events/JoinButton';
import SearchBar from '../components/ui/SearchBar';
import { useJoin } from '../context/JoinContext';
import { getEventIcon } from '../lib/eventUtils';
import { 
  OutdoorIcon, 
  WorkoutIcon, 
  LearningIcon, 
  PartyIcon, 
  ArtIcon, 
  FilmIcon, 
  MusicIcon 
} from '../components/events/EventType';
import { auth } from '../lib/firebase';
import { isFutureEvent, getEventDate, isOngoingToday } from '../lib/dateUtils';
import { TYPOGRAPHY } from '../styles/typography';

const isUpcoming = (dateStr: string) => {
  return isFutureEvent(dateStr) || isOngoingToday(dateStr);
};

const SORT_ICONS = [
  { id: 'outdoor', Icon: OutdoorIcon, label: 'Outdoor' },
  { id: 'workout', Icon: WorkoutIcon, label: 'Workout' },
  { id: 'learning', Icon: LearningIcon, label: 'Learning' },
  { id: 'party', Icon: PartyIcon, label: 'Party' },
  { id: 'art', Icon: ArtIcon, label: 'Art' },
  { id: 'film', Icon: FilmIcon, label: 'Film' },
  { id: 'music', Icon: MusicIcon, label: 'Music' },
];

interface EyeCatchingPageProps {
  onEventClick: (event: any, joined?: boolean) => void;
  customEvents?: any[];
}

export default function EyeCatchingPage({ onEventClick, customEvents = [] }: EyeCatchingPageProps) {
  const { isEventJoined, userEvents } = useJoin();
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [dateSortOrder, setDateSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAndSortedEvents = useMemo(() => {
    let result = [...userEvents];
    const isDefaultDiscover = !sortBy && !searchQuery.trim() && !dateSortOrder;

    if (sortBy === 'past') {
      result = result.filter(event => !isUpcoming(event.date));
    } else {
      // Default behavior: show upcoming
      result = result.filter(event => isUpcoming(event.date));
      
      if (sortBy && sortBy !== 'title') {
        result = result.filter(event => event.type === sortBy);
      }
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(event => 
        event.title.toLowerCase().includes(query) || 
        (event.location && event.location.toLowerCase().includes(query))
      );
    }

    // If we are in default discovery mode, show a random subset of 8 events
    if (isDefaultDiscover) {
      return [...result].sort(() => 0.5 - Math.random()).slice(0, 8);
    }

    return result.sort((a, b) => {
      if (dateSortOrder) {
        const dateA = getEventDate(a.date).getTime();
        const dateB = getEventDate(b.date).getTime();
        return dateSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }
      // Default: sort by title
      return (a.title || '').localeCompare(b.title || '', 'en');
    });
  }, [userEvents, sortBy, searchQuery, dateSortOrder]);

  const handleDateSortToggle = () => {
    setDateSortOrder(prev => {
      if (prev === null) return 'asc';
      if (prev === 'asc') return 'desc';
      return null;
    });
  };

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
      <div className="flex items-center justify-between mb-4 mt-2">
        <h1 className={TYPOGRAPHY.sectionTitle}>Eye-catching!</h1>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Sorting Controls */}
      <div className="flex items-center gap-4 mb-8 overflow-x-auto no-scrollbar py-4 px-2">
        <button
          onClick={handleDateSortToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-all duration-300 h-10 ${
            dateSortOrder 
              ? 'bg-blue-600 text-white shadow-md scale-105' 
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200 shadow-sm'
          }`}
        >
          {dateSortOrder === 'asc' ? (
            <ArrowUp size={14} className="animate-in fade-in slide-in-from-bottom-1" />
          ) : dateSortOrder === 'desc' ? (
            <ArrowDown size={14} className="animate-in fade-in slide-in-from-top-1" />
          ) : (
            <Calendar size={14} />
          )}
          Date
        </button>

        <button
          onClick={() => handleSort('past')}
          className={`flex-shrink-0 transition-all duration-300 w-10 h-10 rounded-full flex items-center justify-center ${
            sortBy === 'past' 
              ? 'bg-orange-500 text-white shadow-md scale-110' 
              : 'bg-gray-100 text-gray-400 hover:bg-gray-200 opacity-60 grayscale hover:opacity-100 hover:grayscale-0'
          }`}
          title="Past Events"
        >
          <History size={20} strokeWidth={3} />
        </button>
        
        <div className="w-px h-8 bg-gray-200 flex-shrink-0 mx-1" />

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

      {filteredAndSortedEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in zoom-in duration-500">
          {(() => {
            if (sortBy === 'past') {
              return (
                <div className="mb-6 bg-gray-50 p-8 rounded-[40px] shadow-inner">
                  <History size={48} className="!w-24 !h-24 opacity-10 text-orange-500" />
                </div>
              );
            }
            const option = SORT_ICONS.find(s => s.id === sortBy);
            return option && (
              <div className="mb-6 bg-gray-50 p-8 rounded-[40px] shadow-inner">
                <option.Icon size={48} className="!w-24 !h-24 opacity-10" />
              </div>
            );
          })()}
          <h2 className={TYPOGRAPHY.sectionTitle + " mb-2"}>
            {sortBy === 'past' ? 'No Past Events' : 'No Event'}
          </h2>
          <p className="text-gray-400 max-w-xs text-sm font-medium">
            {sortBy === 'past' 
              ? "There are no completed events recorded. Go join some adventures!" 
              : "There are currently no events matching this category. Try exploring other eye-catching activities!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {filteredAndSortedEvents.map((event, index) => (
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
                      {React.createElement(event.Icon || getEventIcon(event.type), { size: 20, className: "!w-8 !h-8", noBackground: true, noShadow: true } as any)}
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-black text-gray-900 mb-1 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-3">
                    By {event.organizer?.name || "CU Student Union"}
                  </p>
                  
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
                      <span className="line-clamp-2">{event.location}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 line-clamp-2 mb-6 leading-relaxed flex-1">
                    {event.description}
                  </p>

                  <JoinButton 
                    id={event.id}
                    date={event.date}
                    time={event.time}
                    variant="full"
                    isCreator={event.creatorId === auth.currentUser?.uid}
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
      )}
      </div>
    </div>
  );
}
