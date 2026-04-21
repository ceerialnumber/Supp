import { useState, useRef, PointerEvent, MouseEvent, useEffect } from 'react';
import { Check } from 'lucide-react';
import { motion, useAnimation } from 'motion/react';
import Logo from './Logo';
import { useJoin } from '../context/JoinContext';

interface JoinButtonProps {
  id: string | number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'circle' | 'full';
  className?: string;
  onStateChange?: (isJoined: boolean) => void;
}

export default function JoinButton({ 
  id, 
  size = 'md', 
  variant = 'circle',
  className = '',
  onStateChange
}: JoinButtonProps) {
  const { isEventJoined, joinEvent, unjoinEvent } = useJoin();
  const isJoinedInContext = isEventJoined(id);
  
  const [isJoined, setIsJoined] = useState(isJoinedInContext);
  const [isPressing, setIsPressing] = useState(false);
  const justJoinedRef = useRef(false); // Flag to prevent immediate unjoin on release
  const controls = useAnimation();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync internal state with context when context changes (e.g. from another button)
  useEffect(() => {
    setIsJoined(isJoinedInContext);
  }, [isJoinedInContext]);

  // Initialize controls based on isJoined
  useEffect(() => {
    if (isJoined) {
      if (variant === 'circle') {
        controls.set({ scale: 2 });
      } else {
        controls.set({ width: '100%' });
      }
    } else {
      if (variant === 'circle') {
        controls.set({ scale: 0 });
      } else {
        controls.set({ width: '0%' });
      }
    }
  }, [controls, isJoined, variant]);

  const PRESS_DURATION = 600; 

  const startPress = (e: PointerEvent) => {
    e.stopPropagation();
    if (isJoined) return; 
    
    setIsPressing(true);
    justJoinedRef.current = false;
    
    if (variant === 'circle') {
      controls.start({
        scale: 2,
        transition: { duration: PRESS_DURATION / 1000, ease: "linear" }
      });
    } else {
      controls.start({
        width: '100%',
        transition: { duration: PRESS_DURATION / 1000, ease: "linear" }
      });
    }
    
    timerRef.current = setTimeout(() => {
      joinEvent(id);
      setIsJoined(true);
      onStateChange?.(true);
      setIsPressing(false);
      justJoinedRef.current = true; 
      if (variant === 'circle') {
        controls.set({ scale: 2 });
      } else {
        controls.set({ width: '100%' });
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
          controls.start({ scale: 0, transition: { duration: 0.3 } });
        } else {
          controls.start({ width: '0%', transition: { duration: 0.3 } });
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
      if (variant === 'circle') {
        controls.set({ scale: 0 });
      } else {
        controls.set({ width: '0%' });
      }
    }
  };

  if (variant === 'full') {
    return (
      <button 
        onPointerDown={startPress}
        onPointerUp={endPress}
        onPointerLeave={endPress}
        onClick={handleClick}
        className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 transform active:scale-[0.98] select-none shadow-s relative overflow-hidden
          ${isJoined ? 'bg-[#1D72FE] text-white shadow-blue-300' : 'bg-white text-[#1D72FE] shadow-gray-100'} 
          ${className}`}
      >
        {/* Progress Fill Background */}
        <motion.div
          initial={{ width: '0%' }}
          animate={controls}
          className="absolute left-0 bottom-0 top-0 bg-[#1D72FE] origin-left pointer-events-none"
        />

        <div className="relative z-10 flex items-center justify-center gap-2 px-6">
          {isJoined ? (
            <>
              <Check className="w-6 h-6 text-white" strokeWidth={3} />
              <span className="text-lg">เข้าร่วมแล้ว</span>
            </>
          ) : (
            <>
              <div className="w-6 h-6 flex items-center justify-center transition-all duration-300">
                <Logo 
                  strokeColor={isPressing ? '#FFFFFF' : '#1D72FE'} 
                  clipId={`clip0_join_full_${id}`} 
                />
              </div>
              <span className={`text-lg transition-colors duration-300 ${isPressing ? 'text-white' : 'text-[#1D72FE]'}`}>เข้าร่วม</span>
            </>
          )}
        </div>
      </button>
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

  // Logo turns white as the blue background fills up during press
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
        className="absolute w-full h-full bg-[#1371FF] rounded-full origin-center pointer-events-none"
      />

      {/* Static Background when joined */}
      {isJoined && (
        <div className="absolute inset-0 bg-[#1371FF]" />
      )}

      <div className={`relative z-10 pointer-events-none ${paddingClasses[size]}`}>
        {isJoined ? (
          <Check className={`${iconSizeClasses[size]} text-white`} />
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
