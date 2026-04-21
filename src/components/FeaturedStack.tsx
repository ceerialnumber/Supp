import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import JoinButton from './JoinButton';
import { ALL_EVENTS } from '../data/events';

const FEATURED_IDS = [1, 2, 3];
const FEATURED_EVENTS = ALL_EVENTS.filter(e => FEATURED_IDS.includes(e.id as number));

interface FeaturedStackProps {
  onEventClick: (event: any, joined?: boolean) => void;
  onSeeMore: () => void;
}

export default function FeaturedStack({ onEventClick, onSeeMore }: FeaturedStackProps) {
  const [cards, setCards] = useState(FEATURED_EVENTS);

  const shuffle = () => {
    setCards((prev) => {
      const newCards = [...prev];
      const first = newCards.shift();
      if (first) newCards.push(first);
      return newCards;
    });
  };

  const handleCardClick = (event: any) => {
    onEventClick(event, false);
  };

  const handleJoinStateChange = (event: any, isJoined: boolean) => {
    if (isJoined) {
      // Small delay to let the animation finish before navigating
      setTimeout(() => {
        onEventClick(event, true);
      }, 300);
    }
  };

  return (
    <section className="px-6 py-4">
      <button 
        onClick={onSeeMore}
        className="flex items-center justify-between w-full mb-4 group active:scale-95 transition-transform"
      >
        <h2 className="text-2xl font-bold text-blue-600">Eye-catching!</h2>
        <ArrowRight className="text-blue-600 w-6 h-6 group-hover:translate-x-1 transition-transform" />
      </button>

      <div className="relative h-[450px] w-full flex items-center justify-center perspective-1000">
        <AnimatePresence mode="popLayout">
          {cards.map((event, index) => {
            const isTop = index === 0;

            return (
              <motion.div
                key={event.id}
                layout
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{
                  scale: 1 - index * 0.05,
                  y: index * -15,
                  zIndex: cards.length - index,
                  opacity: 1,
                }}
                exit={{ x: 300, opacity: 0, rotate: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute w-full h-full rounded-[40px] overflow-hidden shadow-xl cursor-pointer"
                onClick={() => isTop && handleCardClick(event)}
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-1">{event.title}</h3>
                      <div className="text-sm font-medium">
                        <p>{event.date}</p>
                        <p className="opacity-80">{event.location}</p>
                      </div>
                    </div>
                    <JoinButton 
                      id={event.id} 
                      onStateChange={(isJoined) => handleJoinStateChange(event, isJoined)}
                    />
                  </div>
                </div>

                {isTop && (
                  <>
                    <button 
                      onClick={(e) => { e.stopPropagation(); shuffle(); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white z-20 hover:bg-white/40"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); shuffle(); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white z-20 hover:bg-white/40"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}
