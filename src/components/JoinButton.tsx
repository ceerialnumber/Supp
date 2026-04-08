import { useState, useRef, PointerEvent, MouseEvent } from 'react';
import { Check } from 'lucide-react';
import { motion, useAnimation } from 'motion/react';
import Logo from './Logo';

interface JoinButtonProps {
  id: string | number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  initialJoined?: boolean;
  onStateChange?: (isJoined: boolean) => void;
}

export default function JoinButton({ 
  id, 
  size = 'md', 
  className = '',
  initialJoined = false,
  onStateChange
}: JoinButtonProps) {
  const [isJoined, setIsJoined] = useState(initialJoined);
  const [isPressing, setIsPressing] = useState(false);
  const justJoinedRef = useRef(false); // Flag to prevent immediate unjoin on release
  const controls = useAnimation();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize controls based on initialJoined
  useState(() => {
    if (initialJoined) {
      controls.set({ scale: 2 });
    }
  });

  const PRESS_DURATION = 800; // 0.8 seconds

  const startPress = (e: PointerEvent) => {
    e.stopPropagation();
    if (isJoined) return; // Only hold to join
    
    setIsPressing(true);
    justJoinedRef.current = false;
    
    controls.start({
      scale: 2,
      transition: { duration: PRESS_DURATION / 1000, ease: "linear" }
    });
    
    timerRef.current = setTimeout(() => {
      setIsJoined(true);
      onStateChange?.(true);
      setIsPressing(false);
      justJoinedRef.current = true; // Mark that we just joined via hold
      controls.set({ scale: 2 });
    }, PRESS_DURATION);
  };

  const endPress = (e: PointerEvent) => {
    e.stopPropagation();
    setIsPressing(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      
      // Revert if released early and not joined
      if (!isJoined) {
        controls.start({ scale: 0, transition: { duration: 0.3 } });
      }
    }
  };

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    if (isJoined) {
      if (justJoinedRef.current) {
        // Ignore the click that happens immediately after a hold-to-join release
        justJoinedRef.current = false;
        return;
      }
      // Click to Unjoin
      setIsJoined(false);
      onStateChange?.(false);
      controls.set({ scale: 0 });
    }
  };

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-20 h-20'
  };

  const iconSizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-10 h-10'
  };

  const paddingClasses = {
    sm: 'p-1',
    md: 'p-1.5',
    lg: 'p-3'
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
