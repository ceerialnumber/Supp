import { motion } from 'motion/react';
import Logo from '../components/layout/Logo';
import { ArrowRight } from 'lucide-react';
import { TYPOGRAPHY } from '../styles/typography';

interface LandingPageProps {
  onLogin: () => void;
  onSignUp: () => void;
}

export default function LandingPage({ onLogin, onSignUp }: LandingPageProps) {
  const characters = [
    { char: 'S', x: -80, y: -10, rotate: -10 },
    { char: 'U', x: -35, y: 20, rotate: -5 },
    { char: 'P', x: 10, y: 30, rotate: 0 },
    { char: 'P', x: 55, y: 15, rotate: 5 },
    { char: '!', x: 95, y: -10, rotate: 10 },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-[#1371FF] flex flex-col items-center justify-center overflow-hidden">
      {/* Central Content Container */}
      <div className="relative flex flex-col items-center select-none">
        
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-36 h-36 mb-4 mt-32"
        >
          <Logo strokeColor="white" clipId="landing_logo" />
        </motion.div>

        {/* Curved Text Section */}
        <div className="relative h-12 w-full flex items-center justify-center mb-32">
          {characters.map((item, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ 
                opacity: 1, 
                x: item.x, 
                y: item.y, 
                rotate: item.rotate 
              }}
              transition={{ 
                delay: 0.3 + index * 0.1, 
                duration: 0.6, 
                type: "spring",
                stiffness: 100 
              }}
              className="absolute text-5xl font-bold text-white tracking-tighter"
              style={{ transformOrigin: 'center' }}
            >
              {item.char}
            </motion.span>
          ))}
        </div>

        {/* Login Button Section */}
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          onClick={onLogin}
          className={"mt-8 bg-white px-8 py-3.5 rounded-full flex items-center gap-2.5 shadow-xl hover:scale-105 active:scale-95 transition-transform " + TYPOGRAPHY.h3.replace('text-gray-900', 'text-[#1371FF]') }
        >
          Log In
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        {/* Sign Up Link Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className={"mt-6 flex items-center gap-2 text-white/80 " + TYPOGRAPHY.body}
        >
          <span>Don't have an account?</span>
          <button 
            onClick={onSignUp} 
            className={"text-white underline-offset-4 hover:underline " + TYPOGRAPHY.h3.replace('text-gray-900', '')}
          >
            Sign Up
          </button>
        </motion.div>
      </div>

      {/* Decorative background elements if any, but the image is clean blue */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        {/* Subtle noise or pattern could go here but let's keep it clean as requested */}
      </div>
    </div>
  );
}
