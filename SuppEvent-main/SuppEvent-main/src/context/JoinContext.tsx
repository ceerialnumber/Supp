import React, { createContext, useContext, useState, useEffect } from 'react';
import { ALL_EVENTS } from '../data/events';
import { isUpcoming } from '../lib/dateUtils';

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

  // Load from localStorage on mount
  useEffect(() => {
    const savedJoined = localStorage.getItem('joinedEvents');
    if (savedJoined) {
      try {
        const parsed = JSON.parse(savedJoined);
        setJoinedEventIds(new Set(parsed));
      } catch (e) {
        console.error('Failed to parse joined events', e);
      }
    } else {
      // Pre-seed some joined events for demo
      setJoinedEventIds(new Set([1, 2, 'e1', 'e2', 'e5', 'e7', 'e9']));
    }

    const savedMoods = localStorage.getItem('eventMoods');
    if (savedMoods) {
      try {
        setEventMoods(JSON.parse(savedMoods));
      } catch (e) {
        console.error('Failed to parse event moods', e);
      }
    } else {
      // Pre-seed some moods
      setEventMoods({
        '1': 0, // Excited
        '2': 2, // Calm
        'e1': 1, // Happy
        'e2': 3, // Tired
        'e5': 1,
        'e7': 2,
        'e9': 0
      });
    }

    const savedUserEvents = localStorage.getItem('user_created_events');
    if (savedUserEvents) {
      try {
        setUserEvents(JSON.parse(savedUserEvents));
      } catch (e) {
        console.error('Failed to parse user events', e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('joinedEvents', JSON.stringify(Array.from(joinedEventIds)));
  }, [joinedEventIds]);

  useEffect(() => {
    localStorage.setItem('eventMoods', JSON.stringify(eventMoods));
  }, [eventMoods]);

  useEffect(() => {
    localStorage.setItem('user_created_events', JSON.stringify(userEvents));
  }, [userEvents]);

  const joinEvent = (id: string | number) => {
    setJoinedEventIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const unjoinEvent = (id: string | number) => {
    setJoinedEventIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    // Also clear the mood when unjoining
    setEventMoods((prev) => {
      const next = { ...prev };
      delete next[id.toString()];
      return next;
    });
  };

  const isEventJoined = (id: string | number) => {
    return joinedEventIds.has(id);
  };

  const setMood = (eventId: string | number, moodIdx: number) => {
    setEventMoods((prev) => ({
      ...prev,
      [eventId.toString()]: prev[eventId.toString()] === moodIdx ? -1 : moodIdx
    }));
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
    // Collect all events by this organizer that have already happened or are happening
    const organizerEvents = [...ALL_EVENTS, ...userEvents].filter(
      e => e.organizer?.email === organizerEmail && !isUpcoming(e.date, e.time)
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

  const addUserEvent = (event: any) => {
    setUserEvents(prev => [event, ...prev]);
  };

  const updateUserEvent = (updatedEvent: any) => {
    setUserEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };

  const removeUserEvent = (id: string | number) => {
    setUserEvents(prev => prev.filter(e => e.id !== id));
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
      userEvents,
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
