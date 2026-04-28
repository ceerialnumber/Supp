import { Plus, Compass, History, User } from 'lucide-react';
import { motion } from 'motion/react';
import { TYPOGRAPHY } from '../../styles/typography';

interface BottomNavProps {
  activeTab: 'activity' | 'joined' | 'self';
  onTabChange: (tab: 'activity' | 'joined' | 'self') => void;
  onCreateEvent: () => void;
}

export default function BottomNav({ activeTab, onTabChange, onCreateEvent }: BottomNavProps) {
  return (
    <div className="fixed bottom-8 inset-x-0 px-6 flex justify-center z-[100] pointer-events-none">
      <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-full shadow-2xl p-2 flex items-center gap-1 w-full max-w-md pointer-events-auto">
        <button 
          onClick={() => onTabChange('activity')}
          className={`flex-1 h-12 rounded-full font-bold transition-all duration-300 flex flex-col items-center justify-center ${
            activeTab === 'activity' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
              : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <Compass size={20} strokeWidth={activeTab === 'activity' ? 2.5 : 2} />
          {activeTab === 'activity' && (
            <motion.span 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={TYPOGRAPHY.nav + " leading-none mt-0.5 !text-white"}
            >
              Activity
            </motion.span>
          )}
        </button>
        <button 
          onClick={() => onTabChange('joined')}
          className={`flex-1 h-12 rounded-full font-bold transition-all duration-300 flex flex-col items-center justify-center ${
            activeTab === 'joined' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
              : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <History size={20} strokeWidth={activeTab === 'joined' ? 2.5 : 2} />
          {activeTab === 'joined' && (
            <motion.span 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={TYPOGRAPHY.nav + " leading-none mt-0.5 !text-white"}
            >
              History
            </motion.span>
          )}
        </button>
        <button 
          onClick={() => onTabChange('self')}
          className={`flex-1 h-12 rounded-full font-bold transition-all duration-300 flex flex-col items-center justify-center ${
            activeTab === 'self' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
              : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <User size={20} strokeWidth={activeTab === 'self' ? 2.5 : 2} />
          {activeTab === 'self' && (
            <motion.span 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={TYPOGRAPHY.nav + " leading-none mt-0.5 !text-white"}
            >
              Self
            </motion.span>
          )}
        </button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onCreateEvent}
          className="w-12 h-12 rounded-full border-2 border-blue-100 flex items-center justify-center text-blue-600 bg-white shadow-sm flex-shrink-0"
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      </div>
    </div>
  );
}
