import { useState } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import EventDetailsPage from './pages/EventDetailsPage';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [initialJoined, setInitialJoined] = useState(false);

  const handleEventClick = (event: any, joined: boolean = false) => {
    setSelectedEvent(event);
    setInitialJoined(joined);
  };

  return (
    <div className="min-h-screen bg-white pb-32 font-sans selection:bg-blue-100">
      <Header />
      
      <main className="max-w-md mx-auto relative">
        <AnimatePresence mode="wait">
          {!selectedEvent ? (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <HomePage onEventClick={handleEventClick} />
            </motion.div>
          ) : (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <EventDetailsPage 
                event={selectedEvent} 
                initialJoined={initialJoined}
                onBack={() => setSelectedEvent(null)} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
}
