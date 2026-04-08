import { Plus } from 'lucide-react';
import { motion } from 'motion/react';

export default function BottomNav() {
  return (
    <div className="fixed bottom-8 left-0 right-0 px-6 flex justify-center z-50">
      <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-full shadow-2xl p-2 flex items-center gap-2 w-full max-w-sm">
        <button className="flex-1 py-3 px-6 rounded-full bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-200">
          Activity
        </button>
        <button className="flex-1 py-3 px-6 rounded-full text-gray-500 font-bold text-sm hover:bg-gray-50 transition-colors">
          Self
        </button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 rounded-full border-2 border-blue-100 flex items-center justify-center text-blue-600 bg-white shadow-sm"
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      </div>
    </div>
  );
}
