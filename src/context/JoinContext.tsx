import React, { createContext, useContext, useState, useEffect } from 'react';
import { ALL_EVENTS } from '../data/events';
import { isUpcoming } from '../lib/dateUtils';
import { db, auth } from '../lib/firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  query, 
  where,
  getDocs
} from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';

interface JoinContextType {
  joinedEventIds: Set<string | number>;
  joinEvent: (id: string | number) => void;
  unjoinEvent: (id: string | number) => void;
  isEventJoined: (id: string | number) => boolean;
  eventMoods: Record<string, number>;
  setMood: (eventId: string | number, moodIdx: number) => void;
  getEventMoodStats: (eventId: string | number) => number[];
  getEventParticipantCount: (eventId: string | number) => number;
  getOrganizerMoodStats: (organizerEmail: string) => number[];
  userEvents: any[];
  addUserEvent: (event: any) => void;
  updateUserEvent: (event: any) => void;
  removeUserEvent: (id: string | number) => void;
}

const JoinContext = createContext<JoinContextType | undefined>(undefined);

export function JoinProvider({ children }: { children: React.ReactNode }) {
  const [joinedEventIds, setJoinedEventIds] = useState<Set<string | number>>(new Set());
  const [eventMoods, setEventMoods] = useState<Record<string, number>>({});
  const [userEvents, setUserEvents] = useState<any[]>([]);
  const [dbEvents, setDbEvents] = useState<any[]>([]);

  // Load from Firestore on mount if authenticated
  useEffect(() => {
    let unsubscribeEvents: (() => void) | null = null;
    let unsubscribeRegs: (() => void) | null = null;

    const unsubscribeAuth = auth.onAuthStateChanged(user => {
      // 1. Clean up existing listeners immediately
      if (unsubscribeEvents) {
        unsubscribeEvents();
        unsubscribeEvents = null;
      }
      if (unsubscribeRegs) {
        unsubscribeRegs();
        unsubscribeRegs = null;
      }

      if (user) {
        // 2. Fetch ALL events from database to show in global lists
        const eventsRef = collection(db, 'events');
        unsubscribeEvents = onSnapshot(eventsRef, 
          (snapshot) => {
            const events = snapshot.docs.map(doc => ({
              ...doc.data(),
              id: doc.id
            }));
            setDbEvents(events);
          },
          (error) => {
            // Only handle error if we are still supposed to be logged in
            if (auth.currentUser) {
              handleFirestoreError(error, OperationType.GET, 'events');
            }
          }
        );

        // 3. Fetch user's registrations (joined events)
        const registrationsRef = collection(db, 'registrations');
        const q = query(registrationsRef, where('userId', '==', user.uid));
        unsubscribeRegs = onSnapshot(q,
          (snapshot) => {
            const joinedIds = new Set<string | number>();
            const moods: Record<string, number> = {};
            snapshot.docs.forEach(doc => {
              const data = doc.data();
              joinedIds.add(data.eventId);
              if (data.moodIdx !== undefined) {
                moods[data.eventId] = data.moodIdx;
              }
            });
            setJoinedEventIds(joinedIds);
            setEventMoods(moods);
          },
          (error) => {
            if (auth.currentUser) {
              handleFirestoreError(error, OperationType.GET, 'registrations');
            }
          }
        );
      } else {
        setDbEvents([]);
        setJoinedEventIds(new Set());
        setEventMoods({});
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeEvents) unsubscribeEvents();
      if (unsubscribeRegs) unsubscribeRegs();
    };
  }, []);

  // For display, combine hardcoded and DB events
  const combinedAllEvents = [...dbEvents, ...ALL_EVENTS];

  const joinEvent = async (id: string | number) => {
    if (!auth.currentUser) return;
    const userId = auth.currentUser.uid;
    const regId = `${userId}_${id}`;
    const regRef = doc(db, 'registrations', regId);
    
    try {
      await setDoc(regRef, {
        userId,
        eventId: id,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'registrations');
    }
  };

  const unjoinEvent = async (id: string | number) => {
    if (!auth.currentUser) return;
    const userId = auth.currentUser.uid;
    const regId = `${userId}_${id}`;
    const regRef = doc(db, 'registrations', regId);
    
    try {
      await deleteDoc(regRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'registrations');
    }
  };

  const isEventJoined = (id: string | number) => {
    const idStr = String(id);
    const isJoined = Array.from(joinedEventIds).some(jid => String(jid) === idStr);
    const event = combinedAllEvents.find(e => String(e.id) === idStr);
    
    // Check if current user is creator
    const currentUserId = auth.currentUser?.uid;
    const isCreator = event && event.creatorId === currentUserId;
    
    return !!(isJoined || isCreator);
  };

  const setMood = async (eventId: string | number, moodIdx: number) => {
    if (!auth.currentUser) return;
    const userId = auth.currentUser.uid;
    const regId = `${userId}_${eventId}`;
    const regRef = doc(db, 'registrations', regId);

    const currentMood = eventMoods[eventId.toString()];
    const newMood = currentMood === moodIdx ? -1 : moodIdx;

    try {
      await setDoc(regRef, {
        userId,
        eventId,
        moodIdx: newMood,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'registrations');
    }
  };

  const getEventParticipantCount = (eventId: string | number) => {
    const idStr = String(eventId);
    let hash = 0;
    for (let i = 0; i < idStr.length; i++) {
      hash = (hash << 5) - hash + idStr.charCodeAt(i);
    }
    const baseCount = 8 + (Math.abs(hash) % 45); // Range 8-53
    return baseCount + (isEventJoined(eventId) ? 1 : 0);
  };

  const getEventMoodStats = (eventId: string | number) => {
    const totalCount = getEventParticipantCount(eventId);
    
    // Deterministic distribution based on ID
    const idStr = String(eventId);
    let hash = 0;
    for (let i = 0; i < idStr.length; i++) {
      hash = (hash << 5) - hash + idStr.charCodeAt(i);
    }
    
    const h = Math.abs(hash);
    // Create a mock distribution
    // We want 5 values that sum up to (totalCount - 1) if user has mood, or totalCount otherwise
    const userMoodIdx = eventMoods[eventId.toString()];
    const hasUserMood = userMoodIdx !== undefined && userMoodIdx !== -1;
    const mockTotal = hasUserMood ? totalCount - 1 : totalCount;
    
    // Basic distribution logic
    const p1 = Math.floor(mockTotal * (0.2 + (h % 20) / 100)); // Happy
    const p2 = Math.floor(mockTotal * (0.15 + ((h >> 2) % 15) / 100)); // Active
    const p3 = Math.floor(mockTotal * (0.25 + ((h >> 4) % 25) / 100)); // Chill
    const p4 = Math.max(0, Math.floor(mockTotal * (0.05 + ((h >> 6) % 10) / 100))); // Tired
    const p5 = Math.max(0, mockTotal - p1 - p2 - p3 - p4); // Sad
    
    const stats = [p1, p2, p3, p4, p5];
    
    // Add user's mood
    if (hasUserMood) {
      stats[userMoodIdx] += 1;
    }
    
    return stats;
  };

  const getOrganizerMoodStats = (organizerEmail: string) => {
    const currentUserId = auth.currentUser?.uid;
    // Collect all events by this organizer that have already happened or are happening
    const organizerEvents = combinedAllEvents.filter(
      e => (e.organizer?.email === organizerEmail || (e.creatorId === currentUserId && currentUserId)) && !isUpcoming(e.date, e.time)
    );
    
    // Sum up the mood stats for all these events
    const aggregateStats = [0, 0, 0, 0, 0];
    
    organizerEvents.forEach(event => {
      const eventStats = getEventMoodStats(event.id);
      eventStats.forEach((count, i) => {
        aggregateStats[i] += count;
      });
    });
    
    return aggregateStats;
  };

  const sanitizeEvent = (event: any) => {
    const sanitized = { ...event };
    // Remove fields that can't be stored in Firestore (like React components)
    if (sanitized.Icon) delete sanitized.Icon;
    return sanitized;
  };

  const addUserEvent = async (event: any) => {
    if (!auth.currentUser) return;
    const eventRef = doc(collection(db, 'events'));
    const sanitizedEvent = sanitizeEvent(event);
    const eventWithCreator = {
      ...sanitizedEvent,
      id: eventRef.id,
      creatorId: auth.currentUser.uid,
      createdAt: new Date().toISOString()
    };
    
    try {
      await setDoc(eventRef, eventWithCreator);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'events');
    }
  };

  const updateUserEvent = async (updatedEvent: any) => {
    if (!auth.currentUser) return;
    const eventRef = doc(db, 'events', updatedEvent.id.toString());
    const sanitizedEvent = sanitizeEvent(updatedEvent);
    
    try {
      await setDoc(eventRef, sanitizedEvent, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'events');
    }
  };

  const removeUserEvent = async (id: string | number) => {
    if (!auth.currentUser) return;
    const eventRef = doc(db, 'events', id.toString());
    
    try {
      await deleteDoc(eventRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'events');
    }
  };

  return (
    <JoinContext.Provider value={{ 
      joinedEventIds, 
      joinEvent, 
      unjoinEvent, 
      isEventJoined,
      eventMoods,
      setMood,
      getEventMoodStats,
      getEventParticipantCount,
      getOrganizerMoodStats,
      userEvents: combinedAllEvents,
      addUserEvent,
      updateUserEvent,
      removeUserEvent
    }}>
      {children}
    </JoinContext.Provider>
  );
}

export function useJoin() {
  const context = useContext(JoinContext);
  if (context === undefined) {
    throw new Error('useJoin must be used within a JoinProvider');
  }
  return context;
}
