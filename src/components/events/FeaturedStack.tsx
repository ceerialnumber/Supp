import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useJoin } from '../../context/JoinContext';

interface FeaturedStackProps {
  onEventClick: (event: any, joined?: boolean) => void;
  onSeeMore: () => void;
}

export default function FeaturedStack({ onEventClick, onSeeMore }: FeaturedStackProps) {
  const { userEvents } = useJoin();

  const featured = useMemo(() => {
    return userEvents.filter(e => {
      const parts = e.date.split(' ');
      if (parts.length < 3) return true;
      const MONTH_MAP: Record<string, number> = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11,
        'January': 0, 'February': 1, 'March': 2, 'April': 3, 'June': 5,
        'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
      };
      const eventDate = new Date(parseInt(parts[2]), MONTH_MAP[parts[1]] || 0, parseInt(parts[0]));
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return eventDate >= today;
    }).slice(0, 5);
  }, [userEvents]);

  const [cards, setCards] = useState(featured);

  // Sync cards when featured events change (e.g., when DB events load)
  useEffect(() => {
    setCards(featured);
  }, [featured]);

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

  return (
    <section className="px-6 py-4">
      <button 
        onClick={onSeeMore}
        className="flex items-center justify-between w-full mb-4 group active:scale-95 transition-transform"
      >
        <h2 className="text-2xl font-bold text-blue-600 uppercase">Eye-catching!</h2>
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
                  <div>
                    <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest mb-1">
                      By {event.organizer?.name || "CU Student Union"}
                    </p>
                    <h3 className="text-2xl font-bold mb-1 line-clamp-2">{event.title}</h3>
                    <div className="text-sm font-medium min-w-0">
                      <p>{event.date}</p>
                      <p className="opacity-80 line-clamp-2">{event.location}</p>
                    </div>
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
