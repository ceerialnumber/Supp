import React, { useState } from 'react';
import { ArrowLeft, Sun, User, Mail, Phone, Pencil, Users, MapPin, Share2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import JoinButton from '../components/events/JoinButton';
import MoodPicker from '../components/mood/MoodPicker';
import MoodStatsBoard from '../components/mood/MoodStatsBoard';
import EventCountdownCard from '../components/events/EventCountdownCard';
import { useJoin } from '../context/JoinContext';
import { isUpcoming, getEventDate } from '../lib/dateUtils';
import { TYPOGRAPHY } from '../styles/typography';

interface EventDetailsPageProps {
  event: any;
  userData?: any;
  isUserEvent?: boolean;
  onOrganizerClick?: (organizer: any) => void;
  onEdit?: () => void;
  onBack: () => void;
}

export default function EventDetailsPage({ event, onBack, userData, isUserEvent, onOrganizerClick, onEdit }: EventDetailsPageProps) {
  const { isEventJoined, unjoinEvent, getEventParticipantCount } = useJoin();
  const [copied, setCopied] = useState(false);
  const isJoined = isEventJoined(event.id);

  const handleShare = async () => {
    // Create a shareable URL with event ID
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${baseUrl}?event=${event.id}`;
    
    const shareData = {
      title: event.title,
      text: `Check out this event: ${event.title} on ${event.date}`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Error sharing:', err);
      }
    }
  };

  const displayParticipants = getEventParticipantCount(event.id);

  const organizer = isUserEvent 
    ? {
        name: userData?.name || "Me",
        image: userData?.profileImage || "/images/User.jpg",
        email: userData?.email || "",
        username: userData?.username || ""
      }
    : event.organizer || {
        name: "CU Student Union",
        image: null,
        email: "contact@cu-events.com"
      };

  const organizerName = organizer.name;
  const organizerImage = organizer.image;
  const organizerEmail = organizer.email;

  return (
    <div className="bg-white min-h-screen">
      {/* High-Impact Full-Bleed Hero Image */}
      <div className="relative w-full aspect-[4/5] sm:aspect-video lg:aspect-[21/9] overflow-hidden shadow-2xl ">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        {/* Subtle bottom edge gradient for smooth transition */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />

        {/* Overlay Actions */}
        <div className="absolute top-6 right-6 z-10 flex gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            className="w-12 h-12 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-blue-600 shadow-xl border border-white/40 relative"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <Check className="w-6 h-6 text-green-500" />
                </motion.div>
              ) : (
                <motion.div
                  key="share"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <Share2 className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
            
            <AnimatePresence>
              {copied && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute -bottom-10 right-0 bg-gray-900 text-white text-[10px] font-bold py-1 px-3 rounded-full whitespace-nowrap shadow-lg"
                >
                  Link Copied!
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {isUserEvent && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              className="w-12 h-12 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-blue-600 shadow-xl border border-white/40"
            >
              <Pencil className="w-6 h-6" />
            </motion.button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto pb-32">
        <div className="px-6 py-12">
          <div className="flex items-start justify-between mb-10 gap-8">
          <div className="flex-1 min-w-0">
            <h1 className={TYPOGRAPHY.h1 + " !leading-tight !text-3xl mb-2"}>
              {event.title}
            </h1>
            <div className="flex flex-col gap-0.5">
              <p className={TYPOGRAPHY.labelEmphasis + " !text-base"}>
                {event.date}
              </p>
              {event.time && (
                <p className={TYPOGRAPHY.labelEmphasis + " !text-blue-500 !text-base"}>
                  {event.time}
                </p>
              )}
              <div className="flex items-center gap-1.5 text-blue-400 font-medium text-sm mt-1">
                <MapPin className="w-3.5 h-3.5" />
                <p>{event.location}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="flex-shrink-0 pt-1">
              {event.Icon ? (
                <event.Icon noShadow size={48} />
              ) : (
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border border-blue-100 shadow-sm">
                  <Sun className="w-10 h-10 text-blue-600" />
                </div>
              )}
            </div>
            
            {/* Participant Counter */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full shadow-sm">
                <Users className="w-4 h-4 text-blue-500" />
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={displayParticipants}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-s font-bold text-blue-600"
                  >
                    {displayParticipants}
                  </motion.span>
                </AnimatePresence>
              </div>
              
            </div>
          </div>
        </div>

        <div className="text-gray-500 leading-relaxed space-y-4 mb-10">
          <p className={TYPOGRAPHY.body}>
            {event.description || "No description provided for this event."}
          </p>
        </div>

        <div className="mb-12">
          <h2 className={TYPOGRAPHY.sectionTitle + " mb-6 px-2"}>Location</h2>
          <div className="relative w-full aspect-video rounded-[32px] overflow-hidden shadow-xl border border-blue-50">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(event.location.replace(/^@/, ''))}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
            />
            {/* Overlay to catch clicks and provide a cleaner feel if needed, but the user wants it interactive */}
          </div>
          <div className="mt-4 flex items-center gap-2 px-4 py-3 bg-blue-50 rounded-2xl border border-blue-100">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
              <MapPin className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-sm font-bold text-blue-600 truncate">{event.location}</p>
          </div>
        </div>

        {/* Mood Tracking Section or Countdown */}
        {(isJoined || isUserEvent) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            {isUpcoming(event.date, event.time) ? (
              <EventCountdownCard targetDate={getEventDate(event.date, event.time)} />
            ) : (
              <>
                <h2 className={TYPOGRAPHY.sectionTitle + " mb-6 px-2"}>
                  {isUserEvent ? "Participant Feedback" : "Mood tracking"}
                </h2>
                <div className={`grid grid-cols-1 ${isUserEvent ? '' : 'md:grid-cols-2'} gap-8 items-start`}>
                  {!isUserEvent && <MoodPicker eventId={event.id} variant="expanded" />}
                  <MoodStatsBoard eventId={event.id} />
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Organizers Section - Minimalist */}
        <div className="mb-10 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => onOrganizerClick?.(organizer)}
            >
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100 overflow-hidden">
                {organizerImage ? (
                  <img src={organizerImage} alt={organizerName} className="w-full h-full object-cover" />
                ) : (
                  <User className="text-blue-600 w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className={TYPOGRAPHY.h3 + ` ${isUserEvent ? 'group-hover:text-blue-600 transition-colors' : ''}`}>
                  {organizerName}
                </h3>
                <p className={TYPOGRAPHY.label}>Organizer</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <div className="flex items-center gap-2">
              <Mail className="text-blue-400 w-4 h-4" />
              <p className="text-sm text-blue-600 font-medium cursor-pointer hover:underline">{organizerEmail}</p>
            </div>
            {!isUserEvent && (
              <div className="flex items-center gap-2">
                <Phone className="text-blue-400 w-4 h-4" />
                <p className="text-sm text-blue-600 font-medium">+66 2 215 0871</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Button - Only show if it's NOT the user's own event */}
        {!isUserEvent && (
          <div className="flex justify-center items-center gap-4">
            {isJoined && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => unjoinEvent(event.id)}
                className="px-8 py-5 bg-gray-100 text-gray-500 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors"
              >
                Later
              </motion.button>
            )}
            <JoinButton 
              id={event.id} 
              date={event.date}
              time={event.time}
              size="lg" 
            />
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
