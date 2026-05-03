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

import { auth, db, googleProvider } from './lib/firebase';
import { onAuthStateChanged, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, query, where, collection, getDocs, limit } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from './lib/firestoreUtils';

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
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthInProgress, setIsAuthInProgress] = useState(false);
  const [prefilledEmail, setPrefilledEmail] = useState('');
  const [userData, setUserData] = useState<{
    name: string;
    username: string;
    email: string;
    phone: string;
    profileImage?: string;
  } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? `User: ${user.email}, UID: ${user.uid}` : 'No user');
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            console.log('User document found:', data);
            setUserData({
              name: data.name,
              username: data.username,
              email: data.email,
              phone: data.phone || '',
              profileImage: data.profileImage || user.photoURL || '',
            });
            setIsLoggedIn(true);
            setIsSigningUp(false);
            setIsLoggingIn(false);
          } else {
            console.log('User authenticated but no Firestore document found');
            // If authenticated but no record in Firestore, user needs to complete signup
            setPrefilledEmail(user.email || '');
            setIsLoggedIn(false);
            setIsSigningUp(true);
            setIsLoggingIn(false);
          }
        } catch (error) {
          console.error('Error fetching user document:', error);
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        }
      } else {
        setUserData(null);
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

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

  const handleUpdateProfile = async (newUserData: any) => {
    if (!auth.currentUser) return;
    
      try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await setDoc(userRef, { ...newUserData, updatedAt: new Date().toISOString() }, { merge: true });
        setUserData(newUserData);
        setIsEditingProfile(false);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, 'users');
      }
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

  const getAuthErrorMessage = (code: string) => {
    switch (code) {
      case 'auth/invalid-email':
        return 'Invalid email address. Please enter a valid email format (e.g., name@example.com).';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/user-not-found':
        return 'No account found with this email. Please sign up instead.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again or reset your password.';
      case 'auth/email-already-in-use':
        return 'Already exist account';
      case 'auth/weak-password':
        return 'Password is too weak. It must be at least 6 characters long.';
      case 'auth/popup-blocked':
        return 'Login popup was blocked by your browser. Please allow popups for this site to continue.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection and try again.';
      case 'auth/cancelled-popup-request':
      case 'auth/popup-closed-by-user':
        return null;
      case 'auth/operation-not-allowed':
        return "This sign-in method is not enabled. Please ensure 'Email/Password' and 'Google' are enabled in your Firebase Console (Authentication > Sign-in method).";
      case 'auth/internal-error':
        return 'An internal service error occurred. Please refresh the page and try again.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Access to this account has been temporarily disabled. Please try again later.';
      default:
        return 'An unexpected error occurred. Please check your details and try again.';
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
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
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
                    onLogin={async (data) => {
                      if (isAuthInProgress) return;
                      setIsAuthInProgress(true);
                      console.log('Starting login process for:', data.email);
                      try {
                        let loginEmail = data.email;
                        
                        // Check if it's a username (doesn't contain @)
                        if (!loginEmail.includes('@')) {
                          try {
                            const usersRef = collection(db, 'users');
                            const q = query(usersRef, where('username', '==', loginEmail.toLowerCase()), limit(1));
                            const querySnapshot = await getDocs(q);
                            
                            if (!querySnapshot.empty) {
                              loginEmail = querySnapshot.docs[0].data().email;
                            } else {
                              // If no user found by username, let Firebase throw its own error
                              // but we can also manually suggest sign up
                              alert("No account found with this username.");
                              setIsAuthInProgress(false);
                              return;
                            }
                          } catch (error) {
                            handleFirestoreError(error, OperationType.GET, 'users');
                          }
                        }

                        await signInWithEmailAndPassword(auth, loginEmail, data.password || '');
                      } catch (error: any) {
                        console.error("Login error:", error);
                        const msg = getAuthErrorMessage(error.code);
                        if (msg) {
                          alert(`Login failed: ${msg}`);
                        } else {
                          alert(`Login failed: ${error.message || 'Unknown error'}`);
                        }
                      } finally {
                        setIsAuthInProgress(false);
                      }
                    }} 
                    onSocialLogin={async (provider) => {
                      if (isAuthInProgress) return;
                      setIsAuthInProgress(true);
                      try {
                        const p = googleProvider;
                        await signInWithPopup(auth, p);
                      } catch (error: any) {
                        if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
                          console.error("Social login error:", error);
                          const msg = getAuthErrorMessage(error.code);
                          if (msg) {
                            alert(`Google login failed: ${msg}`);
                          } else {
                            alert(`Google login failed: ${error.message || 'Unknown error'}`);
                          }
                        }
                      } finally {
                        setIsAuthInProgress(false);
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
                    onSignUp={async (data) => {
                      if (isAuthInProgress) return;
                      setIsAuthInProgress(true);
                      console.log('Starting signup process for:', data.email);
                      try {
                        // 1. Check if email already exists in Firestore users collection
                        // (Optional but good for explicit checking alongside Auth)
                        console.log('Checking for existing email...');
                        const emailQuery = query(collection(db, 'users'), where('email', '==', data.email.toLowerCase()), limit(1));
                        const emailSnap = await getDocs(emailQuery);
                        if (!emailSnap.empty) {
                          throw new Error("Already exist account");
                        }

                        // 2. Check if username already exists
                        console.log('Checking for existing username...');
                        const usernameQuery = query(collection(db, 'users'), where('username', '==', data.username.toLowerCase()), limit(1));
                        const usernameSnap = await getDocs(usernameQuery);
                        if (!usernameSnap.empty) {
                          throw new Error("Already exist account");
                        }

                        let uid = auth.currentUser?.uid;
                        console.log('Current user UID:', uid);
                        
                        if (!uid && data.password) {
                          // Manual signup
                          console.log('Creating new auth user...');
                          const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
                          uid = userCredential.user.uid;
                          console.log('Auth user created:', uid);
                        }

                        if (!uid) {
                          alert("Session expired. Please try again.");
                          setIsAuthInProgress(false);
                          return;
                        }

                        console.log('Creating Firestore document...');
                        const userRef = doc(db, 'users', uid);
                        const cleanData = { 
                          ...data, 
                          email: data.email.toLowerCase(), 
                          username: data.username.toLowerCase() 
                        };
                        delete (cleanData as any).password; 
                        delete (cleanData as any).confirmPassword;

                        await setDoc(userRef, {
                          ...cleanData,
                          uid: uid,
                          registeredAt: new Date().toISOString()
                        });
                        
                        console.log('Signup completed successfully');
                        
                        setUserData(cleanData);
                        setPrefilledEmail('');
                        setIsLoggedIn(true);
                        setIsSigningUp(false);
                      } catch (error: any) {
                        console.error("Signup error:", error);
                        const authMsg = getAuthErrorMessage(error.code);
                        const msg = (error.message === 'Already exist account') ? error.message : authMsg;
                        if (msg) {
                          alert(`Signup failed: ${msg}`);
                        } else {
                          alert(`Signup failed: ${error.message || 'Unknown error'}`);
                        }
                      } finally {
                        setIsAuthInProgress(false);
                      }
                    }} 
                    prefilledEmail={prefilledEmail}
                    onBack={() => {
                      setIsSigningUp(false);
                      setPrefilledEmail('');
                    }}
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
                      isUserEvent={selectedEvent && selectedEvent.creatorId === auth.currentUser?.uid}
                      onOrganizerClick={(organizer) => {
                        if (selectedEvent && selectedEvent.creatorId === auth.currentUser?.uid) {
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
