import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, User, CheckCircle2, History as HistoryIcon } from 'lucide-react';
import { TYPOGRAPHY } from '../../styles/typography';
import { isUpcoming, getEventDate } from '../../lib/dateUtils';
import { getEventIcon } from '../../lib/eventUtils';
import { auth } from '../../lib/firebase';
import Countdown from './Countdown';
import MoodStatsBoard from '../mood/MoodStatsBoard';
import MoodPicker from '../mood/MoodPicker';

interface HistoryEventCardProps {
  key?: any;
  event: any;
  index: number;
  status: 'created' | 'joined';
  userData?: any;
  onClick: (event: any, joined?: boolean) => void;
}

export default function HistoryEventCard({ event, index, status, userData, onClick }: HistoryEventCardProps) {
  const upcoming = isUpcoming(event.date, event.time);
  const isCreatorOfEvent = event.creatorId === auth.currentUser?.uid;
  const resolvedIcon = event.Icon || getEventIcon(event.type);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ 
        delay: index * 0.05,
        type: "spring",
        stiffness: 260,
        damping: 20 
      }}
      onClick={() => onClick(event)}
      className="group cursor-pointer active:scale-[0.98] transition-all duration-300"
    >
      <div className="bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 h-full flex flex-col transition-all">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          
          {/* Status Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {/* Created vs Joined Badge */}
            <div className={`px-4 py-2 rounded-2xl backdrop-blur-md flex items-center gap-2 shadow-sm ${
              isCreatorOfEvent ? 'bg-blue-600/90 text-white' : 'bg-white/90 text-gray-900 border border-white/20'
            }`}>
              {isCreatorOfEvent ? <User size={14} className="fill-current" /> : <CheckCircle2 size={14} className="text-blue-600" />}
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {isCreatorOfEvent ? "Organizer" : "Joined"}
              </span>
            </div>

            {/* Before vs After Badge */}
            <div className={`px-4 py-2 rounded-2xl backdrop-blur-md flex items-center gap-2 shadow-sm ${
              upcoming ? 'bg-green-500/90 text-white' : 'bg-gray-900/80 text-white'
            }`}>
              {upcoming ? <Clock size={14} /> : <HistoryIcon size={14} />}
              <span className="text-[10px] font-bold uppercase tracking-wider font-mono">
                {upcoming ? "Upcoming" : "Memory"}
              </span>
            </div>
          </div>

          {/* Event Type Floating Icon */}
          {resolvedIcon && (
            <div className="absolute bottom-4 right-4 translate-y-0 group-hover:-translate-y-1 transition-transform duration-300">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-lg border border-white/50">
                {React.createElement(resolvedIcon, { size: 24, className: "!w-10 !h-10", noBackground: true, noShadow: true } as any)}
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="mb-2">
            <h3 className={TYPOGRAPHY.h3 + " line-clamp-2 group-hover:text-blue-600 transition-colors"}>
              {event.title}
            </h3>
            <p className={TYPOGRAPHY.label + " mt-1 text-gray-400 line-clamp-1"}>
              Organized by {isCreatorOfEvent ? (userData?.name || "Me") : (event.organizer?.name || "Student Union")}
            </p>
          </div>
          
          <div className="space-y-2 mb-4 bg-gray-50/50 p-3 rounded-2xl border border-gray-50">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-500 font-medium font-mono">
              <div className="flex items-center gap-1.5">
                <Calendar size={13} className="text-blue-500" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={13} className="text-blue-500" />
                <span>{event.time}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium min-w-0">
              <MapPin size={13} className="text-blue-500 flex-shrink-0" />
              <span className="line-clamp-2">{event.location}</span>
            </div>
          </div>

          <p className="text-xs text-gray-400 line-clamp-2 mb-6 leading-relaxed flex-1 italic">
            &ldquo;{event.description}&rdquo;
          </p>

          {upcoming ? (
            <div className="pt-4 pb-2 border-t border-gray-50 flex items-center justify-between">
              <div className="flex flex-col">
                <span className={TYPOGRAPHY.label + " !text-[9px] !text-blue-600"}>Happening in</span>
              </div>
              <div className="scale-[0.8] origin-right">
                <Countdown targetDate={getEventDate(event.date, event.time)} />
              </div>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between px-1">
                <p className={TYPOGRAPHY.labelEmphasis + " !text-gray-900"}>Recall your mood</p>
                <span className="text-[10px] text-blue-500 font-bold bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                  {isCreatorOfEvent ? "Organizer" : "Done"}
                </span>
              </div>
              <MoodPicker eventId={event.id} />
              
              {isCreatorOfEvent && (
                <div className="pt-4 border-t border-gray-50">
                  <p className="text-[11px] font-bold text-gray-400 uppercase mb-2">Overall Feedback</p>
                  <MoodStatsBoard eventId={event.id} compact />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
