import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, MapPin, Inbox, ArrowUpDown } from 'lucide-react';
import JoinButton from '../components/events/JoinButton';
import MoodPicker from '../components/mood/MoodPicker';
import MoodStatsBoard from '../components/mood/MoodStatsBoard';
import Countdown from '../components/events/Countdown';
import { useJoin } from '../context/JoinContext';
import { ALL_EVENTS } from '../data/events';
import SearchBar from '../components/ui/SearchBar';
import HistoryEventCard from '../components/events/HistoryEventCard';
import { isUpcoming, getEventDate } from '../lib/dateUtils';
import { TYPOGRAPHY } from '../styles/typography';

interface JoinedEventsPageProps {
  onEventClick: (event: any, joined?: boolean) => void;
  customEvents?: any[];
  userData?: any;
}

export default function JoinedEventsPage({ onEventClick, customEvents = [], userData }: JoinedEventsPageProps) {
  const { isEventJoined, eventMoods } = useJoin();
  const [viewTab, setViewTab] = useState<'joined' | 'created'>('joined');
  const [sortBy, setSortBy] = useState<'title' | 'date' | 'upcoming' | 'done' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAndSortedEvents = (events: any[]) => {
    const now = new Date();
    let result = [...events];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(event => 
        event.title.toLowerCase().includes(query) || 
        event.location.toLowerCase().includes(query)
      );
    }

    if (sortBy === 'upcoming') {
      result = result.filter(e => getEventDate(e.date, e.time) >= now);
    } else if (sortBy === 'done') {
      result = result.filter(e => getEventDate(e.date, e.time) < now);
    }

    return result.sort((a, b) => {
      if (sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || '', 'en');
      }

      const dateA = getEventDate(a.date, a.time);
      const dateB = getEventDate(b.date, b.time);
      const isUpcomingA = dateA >= now;
      const isUpcomingB = dateB >= now;

      // When no explicit sort (or for general date sorting), prioritize upcoming
      if (sortBy === null || sortBy === 'date') {
        if (isUpcomingA && !isUpcomingB) return -1;
        if (!isUpcomingA && isUpcomingB) return 1;
        
        if (isUpcomingA) {
          // Upcoming: Closest to now first
          return dateA.getTime() - dateB.getTime();
        } else {
          // Completed: Most recent first (reverse chronological)
          return dateB.getTime() - dateA.getTime();
        }
      }

      if (sortBy === 'upcoming') {
        return dateA.getTime() - dateB.getTime();
      }
      if (sortBy === 'done') {
        return dateB.getTime() - dateA.getTime();
      }
      
      return dateA.getTime() - dateB.getTime();
    });
  };

  const joinedEvents = useMemo(() => {
    const joined = ALL_EVENTS.filter(event => isEventJoined(event.id));
    return filteredAndSortedEvents(joined);
  }, [isEventJoined, sortBy, searchQuery]);

  const createdEvents = useMemo(() => {
    return filteredAndSortedEvents(customEvents);
  }, [customEvents, sortBy, searchQuery]);

  const currentEvents = viewTab === 'joined' ? joinedEvents : createdEvents;

  const handleRedirect = (event: any) => {
    onEventClick(event, true);
  };

  return (
    <div className="max-w-6xl mx-auto pb-24">
      <div className="px-6 py-4 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex flex-col gap-2 mb-8 mt-2">
          <h1 className={TYPOGRAPHY.sectionTitle}>History</h1>
          
          {/* Search Bar */}
          <div className="mb-4">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          {/* Segmented Control Tabs */}
          <div className="bg-gray-100 p-1 rounded-[30px] flex text-sm font-bold shadow-inner">
            <button
              onClick={() => setViewTab('joined')}
              className={`flex-1 py-4 rounded-[26px] transition-all duration-300 ${
                viewTab === 'joined' 
                  ? 'bg-white text-blue-600 shadow-sm scale-[1.02]' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Joined ({joinedEvents.length})
            </button>
            <button
              onClick={() => setViewTab('created')}
              className={`flex-1 py-4 rounded-[26px] transition-all duration-300 ${
                viewTab === 'created' 
                  ? 'bg-white text-blue-600 shadow-sm scale-[1.02]' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Created ({createdEvents.length})
            </button>
          </div>

          {/* Sorting Controls */}
          <div className="flex items-center gap-4 px-2 overflow-x-auto no-scrollbar py-1">
            <span className={TYPOGRAPHY.label + " flex-shrink-0"}>Sort by</span>
            <button
              onClick={() => setSortBy(prev => prev === 'upcoming' ? null : 'upcoming')}
              className={`${TYPOGRAPHY.nav} py-1 transition-all relative flex-shrink-0 ${
                sortBy === 'upcoming' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Upcoming
              {sortBy === 'upcoming' && (
                <motion.div 
                  layoutId="sortUnderline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                />
              )}
            </button>
            <button
              onClick={() => setSortBy(prev => prev === 'done' ? null : 'done')}
              className={`${TYPOGRAPHY.nav} py-1 transition-all relative flex-shrink-0 ${
                sortBy === 'done' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Done
              {sortBy === 'done' && (
                <motion.div 
                  layoutId="sortUnderline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                />
              )}
            </button>
            <button
              onClick={() => setSortBy(prev => prev === 'date' ? null : 'date')}
              className={`${TYPOGRAPHY.nav} flex items-center gap-1.5 py-1 transition-all relative flex-shrink-0 ${
                sortBy === 'date' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <ArrowUpDown size={12} />
              Date
              {sortBy === 'date' && (
                <motion.div 
                  layoutId="sortUnderline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                />
              )}
            </button>
            <button
              onClick={() => setSortBy(prev => prev === 'title' ? null : 'title')}
              className={`${TYPOGRAPHY.nav} flex items-center gap-1.5 py-1 transition-all relative flex-shrink-0 ${
                sortBy === 'title' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <ArrowUpDown size={12} />
              Title
              {sortBy === 'title' && (
                <motion.div 
                  layoutId="sortUnderline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={viewTab + sortBy}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            {currentEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-[40px] border-2 border-gray-200">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <Inbox className="w-10 h-10 text-gray-200" />
                </div>
                <h2 className={TYPOGRAPHY.sectionTitle + " capitalize mb-2"}>
                  {sortBy === 'upcoming' 
                    ? "No upcoming events" 
                    : sortBy === 'done' 
                      ? "No done events" 
                      : `No ${viewTab} events`}
                </h2>
                <p className={TYPOGRAPHY.body + " max-w-xs"}>
                  {sortBy === 'upcoming' 
                    ? "You haven't joined any events that are happening soon."
                    : sortBy === 'done'
                      ? "You haven't completed any events yet."
                      : viewTab === 'joined' 
                        ? "Explore the activity feed to join your first event!" 
                        : "Tap the Plus button below to create your first memory!"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentEvents.map((event, index) => (
                  <HistoryEventCard 
                    key={event.id}
                    event={event}
                    index={index}
                    status={viewTab}
                    userData={userData}
                    onClick={onEventClick}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
