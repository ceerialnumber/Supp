import { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import HomePage from './pages/HomePage';
import EyeCatchingPage from './pages/EyeCatchingPage';
import JoinedEventsPage from './pages/JoinedEventsPage';
import CreateEventPage from './pages/CreateEventPage';
import EditEventPage from './pages/EditEventPage';
import EventDetailsPage from './pages/EventDetailsPage';
import SelfPage from './pages/SelfPage';
import MoodHistoryPage from './pages/MoodHistoryPage';
import LandingPage from './pages/LandingPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import EditProfilePage from './pages/EditProfilePage';
import UserProfilePage from './pages/UserProfilePage';
import SnapshotsGalleryPage from './pages/SnapshotsGalleryPage';
import { AnimatePresence, motion } from 'motion/react';

import { JoinProvider } from './context/JoinContext';

import { useJoin } from './context/JoinContext';

export default function App() {
  return (
    <JoinProvider>
      <AppContent />
    </JoinProvider>
  );
}

function AppContent() {
  const { userEvents, addUserEvent, updateUserEvent, removeUserEvent } = useJoin();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [userData, setUserData] = useState<{
    name: string;
    username: string;
    email: string;
    phone: string;
    profileImage?: string;
  } | null>(null);

  // Persistence of registered users
  const [registeredUsers, setRegisteredUsers] = useState<any[]>(() => {
    const saved = localStorage.getItem('app_registered_users');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('app_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedOrganizer, setSelectedOrganizer] = useState<any>(null);
  const [isEyeCatchingList, setIsEyeCatchingList] = useState(false);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isMoodHistory, setIsMoodHistory] = useState(false);
  const [isSnapshotsGallery, setIsSnapshotsGallery] = useState(false);
  const [activeTab, setActiveTab] = useState<'activity' | 'joined' | 'self'>('activity');

  const handleEventClick = (event: any, joined: boolean = false) => {
    setSelectedEvent(event);
    setIsCreatingEvent(false);
    setIsEditingEvent(false);
  };

  const handleAddEvent = (newEvent: any) => {
    addUserEvent(newEvent);
    setIsCreatingEvent(false);
    setIsEyeCatchingList(true);
  };

  const handleEditEvent = () => {
    setIsEditingEvent(true);
  };

  const handleUpdateEvent = (updatedEvent: any) => {
    updateUserEvent(updatedEvent);
    setSelectedEvent(updatedEvent);
    setIsEditingEvent(false);
  };

  const handleUpdateProfile = (newUserData: any) => {
    setUserData(newUserData);
    setIsEditingProfile(false);
    // Update in registeredUsers as well
    setRegisteredUsers(prev => prev.map(u => u.email === newUserData.email ? { ...u, ...newUserData } : u));
  };

  const handleDeleteEvent = (eventId: string | number) => {
    removeUserEvent(eventId);
    setSelectedEvent(null);
    setIsEditingEvent(false);
  };

  const handleTabChange = (tab: 'activity' | 'joined' | 'self') => {
    setActiveTab(tab);
    setSelectedEvent(null); 
    setSelectedOrganizer(null);
    setIsEyeCatchingList(false);
    setIsCreatingEvent(false);
    setIsEditingEvent(false);
    setIsEditingProfile(false);
    setIsMoodHistory(false);
    setIsSnapshotsGallery(false);
  };

  const handleBack = () => {
    if (selectedOrganizer) {
      setSelectedOrganizer(null);
    } else if (selectedEvent) {
      setSelectedEvent(null);
    } else if (isSnapshotsGallery) {
      setIsSnapshotsGallery(false);
    } else if (isEyeCatchingList) {
      setIsEyeCatchingList(false);
    } else if (isCreatingEvent) {
      setIsCreatingEvent(false);
    } else if (isEditingEvent) {
      setIsEditingEvent(false);
    } else if (isEditingProfile) {
      setIsEditingProfile(false);
    } else if (isMoodHistory) {
      setIsMoodHistory(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('activity');
    setUserData(null);
    // Reset other states
    setSelectedEvent(null);
    setIsEyeCatchingList(false);
    setIsCreatingEvent(false);
    setIsEditingEvent(false);
    setIsEditingProfile(false);
    setIsMoodHistory(false);
    setIsSnapshotsGallery(false);
  };

  return (
    <div className="h-screen flex flex-col bg-white font-sans selection:bg-blue-100 overflow-hidden">
      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          <motion.div 
            key="auth-flow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="h-full flex flex-col"
          >
            <AnimatePresence mode="wait">
              {!isSigningUp && !isLoggingIn && !isForgotPassword ? (
                <motion.div
                  key="landing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <LandingPage 
                    onLogin={() => setIsLoggingIn(true)} 
                    onSignUp={() => setIsSigningUp(true)}
                  />
                </motion.div>
              ) : isLoggingIn ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                >
                  <LoginPage 
                    onLogin={(data) => {
                      const user = registeredUsers.find(u => 
                        (u.email === data.email || u.username === data.email) && 
                        u.password === data.password
                      );

                      if (user) {
                        setUserData(user);
                        setIsLoggedIn(true);
                        setIsLoggingIn(false);
                      } else {
                        // Fallback/Simulate for demo if not found in registered
                        const input = data.email;
                        const derivedUsername = input.includes('@') ? input.split('@')[0] : input;
                        const formattedName = derivedUsername.charAt(0).toUpperCase() + derivedUsername.slice(1);
                        
                        setUserData({
                          name: formattedName,
                          username: derivedUsername.toLowerCase(),
                          email: input.includes('@') ? input : `${derivedUsername}@example.com`,
                          phone: "081-234-5678",
                        });
                        setIsLoggedIn(true);
                        setIsLoggingIn(false);
                      }
                    }} 
                    onBack={() => setIsLoggingIn(false)}
                    onSignUp={() => {
                      setIsLoggingIn(false);
                      setIsSigningUp(true);
                    }}
                    onForgotPassword={() => {
                      setIsLoggingIn(false);
                      setIsForgotPassword(true);
                    }}
                  />
                </motion.div>
              ) : isForgotPassword ? (
                <motion.div
                  key="forgot"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                >
                  <ForgotPasswordPage 
                    onBack={() => {
                      setIsForgotPassword(false);
                      setIsLoggingIn(true);
                    }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                >
                  <SignUpPage 
                    onSignUp={(data) => {
                      setRegisteredUsers(prev => [...prev, data]);
                      setUserData(data);
                      setIsLoggedIn(true);
                      setIsSigningUp(false);
                    }} 
                    onBack={() => setIsSigningUp(false)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div 
            key="app-flow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full flex flex-col relative"
          >
            <Header 
              showBack={!!selectedEvent || !!selectedOrganizer || isEyeCatchingList || isCreatingEvent || isEditingEvent || isEditingProfile || isMoodHistory} 
              onBack={handleBack} 
              onProfileClick={() => handleTabChange('self')}
              showLogout={activeTab === 'self' && !selectedEvent && !isMoodHistory}
              onLogout={handleLogout}
              userData={userData}
            />
            
            <main className="flex-1 overflow-y-auto relative no-scrollbar pt-20">
              <AnimatePresence mode="wait">
                {selectedOrganizer ? (
                  <motion.div
                    key="organizer-profile"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <UserProfilePage 
                      organizer={selectedOrganizer}
                      onEventClick={(event) => {
                        setSelectedEvent(event);
                        setSelectedOrganizer(null);
                      }}
                    />
                  </motion.div>
                ) : isEditingEvent && selectedEvent ? (
                  <motion.div
                    key="edit"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <EditEventPage 
                      event={selectedEvent}
                      onSubmit={handleUpdateEvent}
                      onDelete={handleDeleteEvent}
                      onBack={() => setIsEditingEvent(false)}
                      userData={userData}
                    />
                  </motion.div>
                ) : selectedEvent ? (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <EventDetailsPage 
                      event={selectedEvent} 
                      onBack={handleBack} 
                      userData={userData}
                      isUserEvent={userEvents.some(e => e.id === selectedEvent.id)}
                      onOrganizerClick={(organizer) => {
                        if (userEvents.some(e => e.id === selectedEvent.id)) {
                          handleTabChange('self');
                        } else {
                          setSelectedOrganizer(organizer);
                          setSelectedEvent(null);
                        }
                      }}
                      onEdit={handleEditEvent}
                    />
                  </motion.div>
                ) : isCreatingEvent ? (
                  <motion.div
                    key="create"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <CreateEventPage 
                      onSubmit={handleAddEvent} 
                      userData={userData}
                    />
                  </motion.div>
                ) : isEyeCatchingList ? (
                  <motion.div
                    key="eye-catching"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <EyeCatchingPage 
                      onEventClick={handleEventClick} 
                      customEvents={userEvents}
                    />
                  </motion.div>
                ) : isSnapshotsGallery ? (
                  <motion.div
                    key="snapshots-gallery"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <SnapshotsGalleryPage 
                      onBack={() => setIsSnapshotsGallery(false)}
                      onSnapshotClick={(event) => {
                        setIsSnapshotsGallery(false);
                        handleEventClick(event);
                      }}
                      onDiscoverMore={() => {
                        setIsSnapshotsGallery(false);
                        setIsEyeCatchingList(true);
                      }}
                    />
                  </motion.div>
                ) : isMoodHistory ? (
                  <motion.div
                    key="mood-history"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <MoodHistoryPage 
                      onBack={() => setIsMoodHistory(false)}
                      onEventClick={(event) => handleEventClick(event, true)}
                    />
                  </motion.div>
                ) : activeTab === 'activity' ? (
                  <motion.div
                    key="activity"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4 }}
                  >
                    <HomePage 
                      onEventClick={handleEventClick} 
                      onDiscoverMore={() => setIsEyeCatchingList(true)}
                      onHistoryClick={() => handleTabChange('joined')}
                      onSnapshotsClick={() => setIsSnapshotsGallery(true)}
                    />
                  </motion.div>
                ) : activeTab === 'joined' ? (
                  <motion.div
                    key="joined"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4 }}
                  >
                    <JoinedEventsPage 
                      onEventClick={handleEventClick} 
                      customEvents={userEvents}
                      userData={userData}
                    />
                  </motion.div>
                ) : isEditingProfile ? (
                  <motion.div
                    key="edit-profile"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <EditProfilePage 
                      userData={userData}
                      onSave={handleUpdateProfile}
                      onBack={() => setIsEditingProfile(false)}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="self"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4 }}
                  >
                    <SelfPage 
                      onEventClick={handleEventClick} 
                      userData={userData}
                      onMoodHistoryClick={() => setIsMoodHistory(true)}
                      onSnapshotsClick={() => setIsSnapshotsGallery(true)}
                      onEdit={() => setIsEditingProfile(true)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </main>

            {!isCreatingEvent && !isEditingProfile && (
              <BottomNav 
                activeTab={activeTab} 
                onTabChange={handleTabChange} 
                onCreateEvent={() => setIsCreatingEvent(true)}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
