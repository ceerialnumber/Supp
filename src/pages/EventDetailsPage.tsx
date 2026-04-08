import { useState } from 'react';
import { ArrowLeft, Sun, Smile, Laugh, Meh, Frown } from 'lucide-react';
import { motion } from 'motion/react';
import JoinButton from '../components/JoinButton';

interface EventDetailsPageProps {
  event: {
    id: number;
    title: string;
    date: string;
    location: string;
    image: string;
  };
  initialJoined?: boolean;
  onBack: () => void;
}

const MOODS = [
  { icon: Laugh, color: 'text-blue-600', label: 'Great' },
  { icon: Smile, color: 'text-cyan-500', label: 'Good' },
  { icon: Meh, color: 'text-yellow-500', label: 'Okay' },
  { icon: Frown, color: 'text-orange-500', label: 'Bad' },
];

export default function EventDetailsPage({ event, initialJoined = false, onBack }: EventDetailsPageProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [isJoined, setIsJoined] = useState(initialJoined);

  return (
    <div className="min-h-screen bg-white pb-32">
      <div className="px-6 py-4">
        <div className="relative rounded-[40px] overflow-hidden shadow-2xl aspect-[4/5] mb-6">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          
          <button
            onClick={onBack}
            className="absolute top-6 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div className="absolute bottom-6 right-6 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Sun className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-blue-600 leading-tight">
            {event.title}
          </h1>
          <div className="text-right">
            <p className="text-blue-600 font-medium">{event.date}</p>
            <p className="text-blue-400 text-sm">{event.location}</p>
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
            <h2 className="text-3xl font-bold text-blue-600 mb-6">Mood tracking</h2>
            <div className="flex justify-between items-center px-2">
              {MOODS.map((mood, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedMood(idx)}
                  className={`w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 ${
                    selectedMood === idx ? 'scale-110 ring-2 ring-blue-100' : 'hover:scale-105'
                  }`}
                >
                  <mood.icon className={`w-8 h-8 ${mood.color}`} />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action Button */}
        <div className="flex justify-center">
          <JoinButton 
            id={`details_${event.id}`} 
            size="lg" 
            initialJoined={initialJoined}
            onStateChange={setIsJoined}
          />
        </div>
      </div>
    </div>
  );
}
