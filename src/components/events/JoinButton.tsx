import { useState, useRef, PointerEvent, MouseEvent, useEffect } from 'react';
import { Check } from 'lucide-react';
import { motion, useAnimation } from 'motion/react';
import Logo from '../layout/Logo';
import { useJoin } from '../../context/JoinContext';
import MoodPicker, { MOODS } from '../mood/MoodPicker';
import Countdown from './Countdown';
import { isUpcoming, getEventDate } from '../../lib/dateUtils';

interface JoinButtonProps {
  id: string | number;
  date?: string;
  time?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'circle' | 'full';
  className?: string;
  onStateChange?: (isJoined: boolean) => void;
}

export default function JoinButton({ 
  id, 
  date,
  time,
  size = 'md', 
  variant = 'circle',
  className = '',
  onStateChange
}: JoinButtonProps) {
  const { isEventJoined, joinEvent, unjoinEvent, eventMoods } = useJoin();
  const isJoinedInContext = isEventJoined(id);
  const selectedMoodIdx = eventMoods[id.toString()];
  const hasSelectedMood = selectedMoodIdx !== undefined && selectedMoodIdx !== -1;
  const currentMood = hasSelectedMood ? MOODS[selectedMoodIdx] : null;
  const upcoming = date && time ? isUpcoming(date, time) : false;
  
  const [isJoined, setIsJoined] = useState(isJoinedInContext);
  const [isPressing, setIsPressing] = useState(false);
  const justJoinedRef = useRef(false); // Flag to prevent immediate unjoin on release
  const isMounted = useRef(true);
  const controls = useAnimation();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Sync internal state with context when context changes (e.g. from another button)
  useEffect(() => {
    setIsJoined(isJoinedInContext);
  }, [isJoinedInContext]);

  // Handle background color based on mood
  const activeBgColor = currentMood ? currentMood.hex : '#1D72FE';
  const circleActiveBgColor = currentMood ? currentMood.hex : '#1371FF';

  // Initialize controls based on isJoined
  useEffect(() => {
    if (!isMounted.current) return;
    // Only set controls if the motion element is actually rendered in the current variant path
    const shouldRenderMotionDiv = variant === 'circle' || (variant === 'full' && !isJoined);
    if (!shouldRenderMotionDiv) return;

    if (isJoined) {
      if (variant === 'circle') {
        controls.set({ scale: 2, backgroundColor: circleActiveBgColor });
      } else {
        controls.set({ width: '100%', backgroundColor: activeBgColor });
      }
    } else {
      if (variant === 'circle') {
        controls.set({ scale: 0, backgroundColor: '#1371FF' });
      } else {
        controls.set({ width: '0%', backgroundColor: '#1D72FE' });
      }
    }
  }, [controls, isJoined, variant, circleActiveBgColor, activeBgColor]);

  // Update background color when mood changes
  useEffect(() => {
    if (!isMounted.current) return;
    if (isJoined) {
      if (variant === 'circle') {
        controls.start({ backgroundColor: circleActiveBgColor, transition: { duration: 0.3 } }).catch(() => {});
      } else {
        controls.start({ backgroundColor: activeBgColor, transition: { duration: 0.3 } }).catch(() => {});
      }
    }
  }, [circleActiveBgColor, activeBgColor, isJoined, variant, controls]);
  const PRESS_DURATION = 600; 

  const startPress = (e: PointerEvent) => {
    e.stopPropagation();
    if (isJoined) return; 
    
    setIsPressing(true);
    justJoinedRef.current = false;
    
    if (variant === 'circle') {
      controls.start({
        scale: 2,
        backgroundColor: circleActiveBgColor,
        transition: { duration: PRESS_DURATION / 1000, ease: "linear" }
      }).catch(() => {});
    } else {
      controls.start({
        width: '100%',
        backgroundColor: activeBgColor,
        transition: { duration: PRESS_DURATION / 1000, ease: "linear" }
      }).catch(() => {});
    }
    
    timerRef.current = setTimeout(() => {
      if (!isMounted.current) return;
      joinEvent(id);
      setIsJoined(true);
      onStateChange?.(true);
      setIsPressing(false);
      justJoinedRef.current = true; 
      if (variant === 'circle') {
        controls.set({ scale: 2, backgroundColor: circleActiveBgColor });
      } else {
        controls.set({ width: '100%', backgroundColor: activeBgColor });
      }
    }, PRESS_DURATION);
  };

  const endPress = (e: PointerEvent) => {
    e.stopPropagation();
    setIsPressing(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      
      if (!isJoined) {
        if (variant === 'circle') {
          controls.start({ scale: 0, transition: { duration: 0.3 } }).catch(() => {});
        } else {
          controls.start({ width: '0%', transition: { duration: 0.3 } }).catch(() => {});
        }
      }
    }
  };

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    
    if (isJoined) {
      if (justJoinedRef.current) {
        justJoinedRef.current = false;
        return;
      }
      unjoinEvent(id);
      setIsJoined(false);
      onStateChange?.(false);
      
      if (isMounted.current) {
        if (variant === 'circle') {
          controls.set({ scale: 0 });
        } else {
          controls.set({ width: '0%' });
        }
      }
    } else {
      // JOIN on click too for accessibility/intuitiveness
      joinEvent(id);
      setIsJoined(true);
      onStateChange?.(true);
      
      if (isMounted.current) {
        if (variant === 'circle') {
          controls.start({ scale: 2, backgroundColor: circleActiveBgColor }).catch(() => {});
        } else {
          controls.start({ width: '100%', backgroundColor: activeBgColor }).catch(() => {});
        }
      }
    }
  };

  if (variant === 'full') {
    return (
      <div className={`w-full relative ${className}`}>
        {isJoined ? (
          upcoming ? (
            <div className="space-y-4 pt-4 border-t border-gray-50 mt-4 animate-in slide-in-from-top-4 duration-500">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-600 rounded-full p-1 shadow-sm">
                    <Check size={14} className="text-white" />
                  </div>
                  <span className="text-sm font-bold text-blue-600">You're in!</span>
                </div>
                <button 
                  onClick={handleClick}
                  className="text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-wider"
                >
                  Cancel
                </button>
              </div>
              <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100/50 flex flex-col items-center">
                <p className="text-[10px] font-bold text-blue-400 mb-2 uppercase tracking-widest font-mono">Event starts in</p>
                <div className="scale-90">
                  <Countdown targetDate={getEventDate(date!, time!)} />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pt-4 border-t border-gray-50 mt-4 animate-in slide-in-from-top-4 duration-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-600 rounded-full p-1 shadow-sm">
                    <Check size={14} className="text-white" />
                  </div>
                  <span className="text-sm font-bold text-blue-600">You're in!</span>
                </div>
                <button 
                  onClick={handleClick}
                  className="text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-wider"
                >
                  Cancel
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-[11px] font-bold text-gray-400 mb-3 uppercase tracking-wider">How's your vibe?</p>
                <MoodPicker eventId={id} />
              </div>
            </div>
          )
        ) : (
          <button 
            onPointerDown={startPress}
            onPointerUp={endPress}
            onPointerLeave={endPress}
            onClick={handleClick}
            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 transform active:scale-[0.98] select-none shadow-s relative overflow-hidden bg-white text-[#1D72FE] shadow-gray-100`}
          >
            {/* Progress Fill Background */}
            <motion.div
              initial={{ width: '0%' }}
              animate={controls}
              className="absolute left-0 bottom-0 top-0 origin-left pointer-events-none"
              style={{ backgroundColor: activeBgColor }}
            />

            <div className="relative z-10 flex items-center justify-center gap-2 px-6">
              <div className="w-6 h-6 flex items-center justify-center transition-all duration-300">
                <Logo 
                  strokeColor={isPressing ? '#FFFFFF' : '#1D72FE'} 
                  clipId={`clip0_join_full_${id}`} 
                />
              </div>
              <span className={`text-lg transition-colors duration-300 ${isPressing ? 'text-white' : 'text-[#1D72FE]'}`}>Join</span>
            </div>
          </button>
        )}
      </div>
    );
  }

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-[65px] h-[65px]',
    lg: 'w-20 h-20'
  };

  const iconSizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-10 h-10'
  };

  const paddingClasses = {
    sm: 'p-0',
    md: 'p-3',
    lg: 'p-4'
  };

  // Logo turns white as the background fills up during press
  const logoColor = isPressing || isJoined ? '#FFFFFF' : '#1371FF';

  return (
    <button 
      onPointerDown={startPress}
      onPointerUp={endPress}
      onPointerLeave={endPress}
      onClick={handleClick}
      className={`${sizeClasses[size]} relative rounded-full flex items-center justify-center shadow-lg overflow-hidden bg-white transition-all duration-300 transform active:scale-95 select-none ${className}`}
    >
      {/* Progress Fill Circle */}
      <motion.div
        initial={{ scale: 0 }}
        animate={controls}
        className="absolute w-full h-full rounded-full origin-center pointer-events-none"
        style={{ backgroundColor: circleActiveBgColor }}
      />

      {/* Static Background when joined */}
      {isJoined && (
        <div className="absolute inset-0 transition-colors duration-300" style={{ backgroundColor: circleActiveBgColor }} />
      )}

      <div className={`relative z-10 pointer-events-none ${paddingClasses[size]}`}>
        {isJoined ? (
          currentMood ? (
            <currentMood.icon className={`${iconSizeClasses[size]} text-white`} />
          ) : (
            <Check className={`${iconSizeClasses[size]} text-white`} />
          )
        ) : (
          <Logo 
            strokeColor={logoColor} 
            clipId={`clip0_join_${id}`} 
          />
        )}
      </div>
    </button>
  );
}
