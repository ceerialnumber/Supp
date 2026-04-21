import { Plus } from 'lucide-react';
import { motion } from 'motion/react';

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
          className={`flex-1 py-3 px-2 rounded-full font-bold text-xs transition-all duration-300 ${
            activeTab === 'activity' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
              : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          Activity
        </button>
        <button 
          onClick={() => onTabChange('joined')}
          className={`flex-1 py-3 px-2 rounded-full font-bold text-xs transition-all duration-300 ${
            activeTab === 'joined' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
              : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          Joined
        </button>
        <button 
          onClick={() => onTabChange('self')}
          className={`flex-1 py-3 px-2 rounded-full font-bold text-xs transition-all duration-300 ${
            activeTab === 'self' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
              : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          Self
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
