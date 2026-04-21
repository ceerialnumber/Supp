import { useState } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import EyeCatchingPage from './pages/EyeCatchingPage';
import JoinedEventsPage from './pages/JoinedEventsPage';
import CreateEventPage from './pages/CreateEventPage';
import EventDetailsPage from './pages/EventDetailsPage';
import SelfPage from './pages/SelfPage';
import { AnimatePresence, motion } from 'motion/react';

import { JoinProvider } from './context/JoinContext';

export default function App() {
  return (
    <JoinProvider>
      <AppContent />
    </JoinProvider>
  );
}

function AppContent() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEyeCatchingList, setIsEyeCatchingList] = useState(false);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [activeTab, setActiveTab] = useState<'activity' | 'joined' | 'self'>('activity');
  const [userEvents, setUserEvents] = useState<any[]>([]);

  const handleEventClick = (event: any, joined: boolean = false) => {
    setSelectedEvent(event);
    setIsCreatingEvent(false);
  };

  const handleAddEvent = (newEvent: any) => {
    setUserEvents(prev => [newEvent, ...prev]);
    setIsCreatingEvent(false);
    setIsEyeCatchingList(true);
  };

  const handleTabChange = (tab: 'activity' | 'joined' | 'self') => {
    setActiveTab(tab);
    setSelectedEvent(null); 
    setIsEyeCatchingList(false);
    setIsCreatingEvent(false);
  };

  const handleBack = () => {
    if (selectedEvent) {
      setSelectedEvent(null);
    } else if (isEyeCatchingList) {
      setIsEyeCatchingList(false);
    } else if (isCreatingEvent) {
      setIsCreatingEvent(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white font-sans selection:bg-blue-100 overflow-hidden">
      <Header 
        showBack={!!selectedEvent || isEyeCatchingList || isCreatingEvent} 
        onBack={handleBack} 
      />
      
      <main className="flex-1 overflow-y-auto relative no-scrollbar pt-20">
        <AnimatePresence mode="wait">
            {selectedEvent ? (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <EventDetailsPage 
                  event={selectedEvent} 
                  onBack={handleBack} 
                />
              </motion.div>
            ) : isCreatingEvent ? (
              <motion.div
                key="create"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
              >
                <CreateEventPage onSubmit={handleAddEvent} />
              </motion.div>
            ) : isEyeCatchingList ? (
              <motion.div
                key="eye-catching"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <EyeCatchingPage 
                  onEventClick={handleEventClick} 
                  customEvents={userEvents}
                />
              </motion.div>
            ) : activeTab === 'activity' ? (
              <motion.div
                key="activity"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <HomePage 
                  onEventClick={handleEventClick} 
                  onSeeMore={() => setIsEyeCatchingList(true)}
                  onSnapshotsClick={() => setActiveTab('self')}
                />
              </motion.div>
            ) : activeTab === 'joined' ? (
              <motion.div
                key="joined"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <JoinedEventsPage onEventClick={handleEventClick} />
              </motion.div>
            ) : (
              <motion.div
                key="self"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SelfPage />
              </motion.div>
            )}
          </AnimatePresence>
      </main>

      <BottomNav 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        onCreateEvent={() => setIsCreatingEvent(true)}
      />
    </div>
  );
}
