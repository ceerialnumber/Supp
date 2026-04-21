import React, { useState } from 'react';
import { ArrowLeft, Sun, Smile, Laugh, Meh, Frown, User, Mail, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import JoinButton from '../components/JoinButton';

interface EventDetailsPageProps {
  event: {
    id: number | string;
    title: string;
    date: string;
    time?: string;
    location: string;
    image: string;
    Icon?: React.FC<any>;
  };
  onBack: () => void;
}

const MOODS = [
  { icon: Laugh, color: 'text-blue-600', bgColor: 'bg-blue-600', label: 'Great' },
  { icon: Smile, color: 'text-cyan-500', bgColor: 'bg-cyan-500', label: 'Good' },
  { icon: Meh, color: 'text-yellow-500', bgColor: 'bg-yellow-500', label: 'Okay' },
  { icon: Frown, color: 'text-orange-500', bgColor: 'bg-orange-500', label: 'Bad' },
];

import { useJoin } from '../context/JoinContext';

export default function EventDetailsPage({ event, onBack }: EventDetailsPageProps) {
  const { isEventJoined } = useJoin();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const isJoined = isEventJoined(event.id);

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
      </div>

      <div className="max-w-6xl mx-auto pb-32">
        <div className="px-6 py-12">
          <div className="flex items-start justify-between mb-10 gap-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-blue-600 leading-tight mb-2">
              {event.title}
            </h1>
            <div className="flex flex-col gap-0.5">
              <p className="text-blue-600 font-medium text-base leading-tight">
                {event.date}
              </p>
              {event.time && (
                <p className="text-blue-500 font-medium text-base">
                  {event.time}
                </p>
              )}
              <p className="text-blue-400 font-medium text-sm mt-1">{event.location}</p>
            </div>
          </div>

          <div className="flex-shrink-0 pt-1">
            {event.Icon ? (
              <event.Icon noShadow size={48} />
            ) : (
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border border-blue-100 shadow-sm">
                <Sun className="w-10 h-10 text-blue-600" />
              </div>
            )}
          </div>
        </div>

        <div className="text-blue-500 leading-relaxed space-y-4 mb-10">
          <p>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
          </p>
          <p>
            Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla.
          </p>
        </div>

        {/* Mood Tracking Section - Only visible when joined */}
        {isJoined && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-blue-600 mb-6">Mood tracking</h2>
            <div className="flex justify-between items-center px-2">
              {MOODS.map((mood, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedMood(selectedMood === idx ? null : idx)}
                  className={`w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
                    selectedMood === idx 
                      ? `${mood.bgColor} scale-110` 
                      : selectedMood !== null 
                        ? 'bg-white opacity-30 scale-95' 
                        : 'bg-white hover:scale-105'
                  }`}
                >
                  <mood.icon className={`w-8 h-8 transition-colors duration-300 ${selectedMood === idx ? 'text-white' : mood.color}`} />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Organizers Section - Minimalist */}
        <div className="mb-10 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100">
                <User className="text-blue-600 w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">CU Student Union</h3>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Organizer</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <div className="flex items-center gap-2">
              <Mail className="text-blue-400 w-4 h-4" />
              <p className="text-sm text-blue-600 font-medium cursor-pointer hover:underline">contact@cu-events.com</p>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="text-blue-400 w-4 h-4" />
              <p className="text-sm text-blue-600 font-medium">+66 2 215 0871</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <JoinButton 
            id={event.id} 
            size="lg" 
          />
        </div>
      </div>
      </div>
    </div>
  );
}
