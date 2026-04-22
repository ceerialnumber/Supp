import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, Inbox } from 'lucide-react';
import JoinButton from '../components/JoinButton';
import { useJoin } from '../context/JoinContext';
import { ALL_EVENTS } from '../data/events';

interface JoinedEventsPageProps {
  onEventClick: (event: any, joined?: boolean) => void;
  customEvents?: any[];
}

export default function JoinedEventsPage({ onEventClick, customEvents = [] }: JoinedEventsPageProps) {
  const { isEventJoined } = useJoin();

  const allPossibleEvents = [...ALL_EVENTS, ...customEvents];
  const joinedEvents = allPossibleEvents.filter(event => isEventJoined(event.id));

  const handleRedirect = (event: any) => {
    onEventClick(event, true);
  };

  return (
    <div className="max-w-6xl mx-auto pb-24">
      <div className="px-6 py-4 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex items-center justify-between mb-8 mt-2">
          <h1 className="text-3xl font-bold text-blue-600">Joined Events</h1>
        </div>

        {joinedEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <Inbox className="w-10 h-10 text-blue-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No events joined yet</h2>
            <p className="text-gray-500 max-w-xs">
              Explore the activity feed and click "Join" to see your events here!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {joinedEvents.map((event, index) => (
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
                    {event.Icon && (
                      <div className="absolute top-4 left-4">
                        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-2 shadow-sm">
                          <event.Icon size={20} className="!w-8 !h-8" noBackground noShadow />
                        </div>
                      </div>
                    )}
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
        )}
      </div>
    </div>
  );
}
