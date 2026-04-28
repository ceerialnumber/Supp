import React, { useMemo } from 'react';
import FeaturedStack from '../components/events/FeaturedStack';
import Snapshots from '../components/events/Snapshots';
import CountdownTimer from '../components/events/CountdownTimer';
import { motion } from 'motion/react';
import { ALL_EVENTS } from '../data/events';
import { Calendar, ArrowRight, Clock, MapPin, Plus, Bell } from 'lucide-react';
import { useJoin } from '../context/JoinContext';
import { getEventDate } from '../lib/dateUtils';
import { TYPOGRAPHY } from '../styles/typography';

interface HomePageProps {
  onEventClick: (event: any, joined?: boolean) => void;
  onDiscoverMore: () => void;
  onHistoryClick: () => void;
  onSnapshotsClick: () => void;
}

export default function HomePage({ onEventClick, onDiscoverMore, onHistoryClick, onSnapshotsClick }: HomePageProps) {
  const { joinedEventIds, userEvents } = useJoin();

  // Combine joined external events and user created events
  const { scheduleToDisplay, totalScheduleCount, nextEvent } = useMemo(() => {
    const joined = ALL_EVENTS.filter(e => joinedEventIds.has(e.id as number));
    const created = userEvents.filter(ue => !joinedEventIds.has(ue.id as number));
    const combined = [...joined, ...created];
    
    const now = new Date();

    const sortedCombined = combined
      .filter(event => getEventDate(event.date, event.time) >= now)
      .sort((a, b) => getEventDate(a.date, a.time).getTime() - getEventDate(b.date, b.time).getTime());

    return {
      nextEvent: sortedCombined[0] || null,
      scheduleToDisplay: sortedCombined.slice(1, 4), // Next 3 after the immediate next
      totalScheduleCount: sortedCombined.length
    };
  }, [joinedEventIds, userEvents]);

  const parseDateBadge = (dateStr: string) => {
    const parts = dateStr.split(' ');
    // Expecting format "6 August 2025" or "1 April 2026"
    const day = parts[0] || '??';
    const month = (parts[1] || '??').substring(0, 3);
    return { day, month };
  };

  return (
    <div className="max-w-6xl mx-auto pb-24">
      {/* 1. Featured Section */}
      <FeaturedStack onEventClick={onEventClick} onSeeMore={onDiscoverMore} />

      {/* 2. My Schedule / Upcoming Events */}
      <section className="px-6 py-6 overflow-hidden">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h2 className={TYPOGRAPHY.sectionTitle}>My Schedule</h2>
            {totalScheduleCount > 0 && (
              <div className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                {totalScheduleCount}
              </div>
            )}
          </div>
          {totalScheduleCount > 0 && (
            <button 
              onClick={onHistoryClick}
              className={TYPOGRAPHY.labelEmphasis + " flex items-center gap-1 group active:opacity-70 transition-opacity"}
            >
              See all
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>

        <div className="space-y-6">
          {nextEvent ? (
            <>
              {/* Highlight Card: Next Immediate Event */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => onEventClick(nextEvent)}
                className="relative overflow-hidden bg-white p-6 rounded-[40px] border border-blue-100 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] cursor-pointer group"
              >
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />
                
                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="bg-blue-600 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                        <Bell size={10} strokeWidth={3} />
                        Next Up
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        {nextEvent.date}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 leading-tight mb-4 group-hover:text-blue-600 transition-colors">
                      {nextEvent.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-blue-500" />
                        {nextEvent.time}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-blue-500" />
                        {nextEvent.location}
                      </div>
                    </div>
                  </div>

                  {/* Countdown Timer */}
                  <div className="bg-gray-50/50 px-6 py-4 rounded-[32px] border border-gray-100 flex flex-col items-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Starting in</p>
                    <CountdownTimer targetDate={getEventDate(nextEvent.date, nextEvent.time)} />
                  </div>
                </div>
              </motion.div>

              {/* Smaller List for Other Upcoming Events */}
              {scheduleToDisplay.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {scheduleToDisplay.map((event, index) => {
                    const { day, month } = parseDateBadge(event.date);
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + (index * 0.05) }}
                        onClick={() => onEventClick(event)}
                        className="flex items-center gap-4 bg-white p-4 rounded-[32px] border border-gray-100 shadow-sm active:scale-[0.98] transition-all cursor-pointer hover:border-blue-100 hover:shadow-md"
                      >
                        <div className="flex flex-col items-center justify-center w-12 h-14 bg-gray-50 rounded-[22px] flex-shrink-0 text-gray-900 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                          <span className="text-[8px] font-black uppercase tracking-[0.1em] leading-none mb-1 opacity-60">
                            {month}
                          </span>
                          <span className="text-lg font-black leading-none">
                            {day}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-gray-900 truncate mb-0.5">{event.title}</h4>
                          <p className="text-[10px] font-bold text-gray-400">{event.time}</p>
                        </div>
                        <ArrowRight size={16} className="text-gray-300 mr-2" />
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-50/50 border-2 border-gray-200 rounded-[40px] p-10 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-md mb-6 rotate-3">
                <Plus className="text-blue-600 w-8 h-8" strokeWidth={3} />
              </div>
              <h3 className={TYPOGRAPHY.sectionTitle + " mb-2"}>Build Your Calendar</h3>
              <p className={TYPOGRAPHY.body + " mb-8 max-w-[200px] mx-auto"}>Join events you're interested in to build your social schedule here.</p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onDiscoverMore}
                className="px-8 py-3.5 bg-blue-600 text-white rounded-full text-sm font-bold shadow-lg shadow-blue-200"
              >
                Find Events to Join
              </motion.button>
            </motion.div>
          )}
        </div>
      </section>

      {/* 3. Snapshots Section */}
      <Snapshots onHeaderClick={onSnapshotsClick} onSnapshotClick={onEventClick} />
    </div>
  );
}
