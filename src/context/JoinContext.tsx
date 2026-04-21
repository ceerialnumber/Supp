import React, { createContext, useContext, useState, useEffect } from 'react';

interface JoinContextType {
  joinedEventIds: Set<string | number>;
  joinEvent: (id: string | number) => void;
  unjoinEvent: (id: string | number) => void;
  isEventJoined: (id: string | number) => boolean;
}

const JoinContext = createContext<JoinContextType | undefined>(undefined);

export function JoinProvider({ children }: { children: React.ReactNode }) {
  const [joinedEventIds, setJoinedEventIds] = useState<Set<string | number>>(new Set());

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('joinedEvents');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setJoinedEventIds(new Set(parsed));
      } catch (e) {
        console.error('Failed to parse joined events', e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('joinedEvents', JSON.stringify(Array.from(joinedEventIds)));
  }, [joinedEventIds]);

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
  };

  const isEventJoined = (id: string | number) => {
    return joinedEventIds.has(id);
  };

  return (
    <JoinContext.Provider value={{ joinedEventIds, joinEvent, unjoinEvent, isEventJoined }}>
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
