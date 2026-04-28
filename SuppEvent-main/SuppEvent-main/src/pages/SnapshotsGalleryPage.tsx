import React, { useMemo, useRef, useState } from 'react';
import { motion, useAnimation } from 'motion/react';
import { Camera, ArrowRight, X, Maximize, Plus, Minus } from 'lucide-react';
import { useJoin } from '../context/JoinContext';
import { ALL_EVENTS } from '../data/events';
import { MOODS } from '../components/mood/MoodPicker';
import { TYPOGRAPHY } from '../styles/typography';

interface SnapshotsGalleryPageProps {
  onBack: () => void;
  onDiscoverMore: () => void;
  onSnapshotClick: (event: any) => void;
}

export default function SnapshotsGalleryPage({ onBack, onDiscoverMore, onSnapshotClick }: SnapshotsGalleryPageProps) {
  const { joinedEventIds, userEvents, eventMoods } = useJoin();
  const controls = useAnimation();
  const [zoom, setZoom] = useState(1);

  const handleRecenter = () => {
    setZoom(1);
    controls.start({
      x: 0,
      y: 0,
      scale: 1,
      transition: { type: 'spring', damping: 25, stiffness: 120 }
    });
  };

  const handleZoom = (delta: number) => {
    setZoom(prev => {
      const next = Math.max(0.2, Math.min(2, prev + delta));
      controls.start({
        scale: next,
        transition: { type: 'spring', damping: 25, stiffness: 120 }
      });
      return next;
    });
  };

  const snapshots = useMemo(() => {
    const joined = ALL_EVENTS.filter(e => joinedEventIds.has(e.id as number) && e.image);
    const user = userEvents.filter(e => e.image);
    
    // Combine and deduplicate just in case
    const combined = [...joined];
    user.forEach(ue => {
      if (!combined.some(c => c.id === ue.id)) {
        combined.push(ue);
      }
    });

    return combined;
  }, [joinedEventIds, userEvents]);

  // Generate random positions for the scrapbook feel
  const scatteredPhotos = useMemo(() => {
    return snapshots.map((event, i) => {
      // Create a grid-like distribution but with randomness
      const angle = (i / snapshots.length) * Math.PI * 2;
      const radius = 300 + Math.random() * 400; // Distance from center
      
      const moodIdx = eventMoods[event.id.toString()];
      const hasMood = moodIdx !== undefined && moodIdx !== -1;

      return {
        ...event,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        rotate: (Math.random() - 0.5) * 20, // -10 to 10 degrees
        scale: 0.8 + Math.random() * 0.4,
        zIndex: Math.floor(Math.random() * 10),
        mood: hasMood ? MOODS[moodIdx] : null
      };
    });
  }, [snapshots, eventMoods]);

  if (snapshots.length === 0) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-8 text-center">
        <button 
          onClick={onBack}
          className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-8">
          <Camera size={40} className="text-blue-600 opacity-20" />
        </div>
        
        <h2 className="text-3xl font-bold text-[#1371FF]  mb-4 ">
          No snapshots yet...
        </h2>
        <p className="text-gray-500 mb-8 max-w-xs leading-relaxed font-medium">
          "Let's make memory together"
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onDiscoverMore}
          className="flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-blue-200"
        >
          Discover Events
          <ArrowRight size={18} />
        </motion.button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#FAFAFA] z-50 overflow-hidden cursor-grab active:cursor-grabbing">
      {/* Dynamic Background Auras */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        {scatteredPhotos.map((photo, i) => {
          if (!photo.mood) return null;
          // Extract color from background class (e.g., "bg-blue-600" -> "blue")
          const colorMatch = photo.mood.bgColor.match(/bg-([a-z]+)/);
          const color = colorMatch ? colorMatch[1] : 'blue';
          
          return (
            <motion.div
              key={`aura-${photo.id}`}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 0.15,
                x: photo.x / 2, // Parallax effect
                y: photo.y / 2
              }}
              className={`absolute left-1/2 top-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px] bg-${color}-500/30`}
            />
          );
        })}
      </div>

      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.06] z-0" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Control Buttons */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-[100] pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <motion.button 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            className="p-3 bg-white border border-gray-100 rounded-full shadow-lg text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <X size={20} />
          </motion.button>
        </div>
      </div>

      {/* Bottom Control Bar */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 p-1.5 bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-full shadow-2xl">
        <button 
          onClick={() => handleZoom(-0.2)}
          className="p-2.5 hover:bg-gray-100 rounded-full text-gray-900 transition-colors"
          title="Zoom Out"
        >
          <Minus size={18} />
        </button>
        
        <div className="w-px h-4 bg-gray-200 mx-1" />

        <button 
          onClick={handleRecenter}
          className="flex items-center gap-2 px-4 py-2 hover:bg-blue-600 hover:text-white rounded-full text-gray-900 font-bold text-xs transition-all"
        >
          <Maximize size={14} />
          Recenter
        </button>

        <div className="w-px h-4 bg-gray-200 mx-1" />

        <button 
          onClick={() => handleZoom(0.2)}
          className="p-2.5 hover:bg-gray-100 rounded-full text-gray-900 transition-colors"
          title="Zoom In"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* The Infinite Canvas */}
      <motion.div 
        drag
        animate={controls}
        dragConstraints={{ left: -1500, right: 1500, top: -1500, bottom: 1500 }}
        className="absolute left-1/2 top-1/2 w-[3000px] h-[3000px] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
      >
        {/* Center Title */}
        <div className="relative z-0 flex flex-col items-center">
          <div className="absolute -inset-20 bg-blue-600/10 blur-[100px] rounded-full" />
          <h1 className="text-6xl md:text-6xl font-bold text-[#1371FF]  select-none relative">
            Snapshot!
          </h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-gray-400 mt-4 select-none">
            DRAG TO EXPLORE YOUR JOURNEY
          </p>
        </div>

        {/* Scattered Photos */}
        {scatteredPhotos.map((photo, i) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: 1, 
              scale: photo.scale,
              x: photo.x,
              y: photo.y,
              rotate: photo.rotate
            }}
            transition={{ delay: i * 0.1, type: 'spring' }}
            whileHover={{ scale: photo.scale * 1.1, zIndex: 50, rotate: 0 }}
            onClick={() => onSnapshotClick(photo)}
            className="absolute p-3 bg-white shadow-2xl rounded-sm border border-gray-100 group cursor-pointer"
            style={{ width: 240, zIndex: photo.zIndex }}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-xs mb-3">
              <img 
                src={photo.image} 
                alt={photo.title}
                className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Mood Icon Overlay */}
              {photo.mood && (
                <div className="absolute bottom-2 right-2">
                  <div className={`${photo.mood.bgColor} rounded-full p-2 shadow-lg border border-white/20`}>
                    <photo.mood.icon size={16} className="text-white" strokeWidth={2.5} />
                  </div>
                </div>
              )}
            </div>
            <div>
              <p className="text-xs font-black text-gray-900 leading-tight mb-1">{photo.title}</p>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{photo.date}</p>
              </div>
            </div>
            
            {/* Polaroid aesthetic pin */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-2 bg-gray-900/10 rounded-full blur-sm" />
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-1 bg-white/40 rounded-full shadow-inner" />
          </motion.div>
        ))}
      </motion.div>

      {/* Navigation Hint */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none">
        <motion.div 
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
          <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Memories are made of this</span>
        </motion.div>
      </div>
    </div>
  );
}
