import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

const SNAPSHOTS = [
  { id: 1, image: '/images/snap1.jpg', rotate: -5 },
  { id: 2, image: '/images/snap2.jpg', rotate: 3 },
  { id: 3, image: '/images/snap3.jpg', rotate: -2 },
  { id: 4, image: '/images/snap4.jpg', rotate: 4 },
];

interface SnapshotsProps {
  showHeader?: boolean;
  onHeaderClick?: () => void;
}

export default function Snapshots({ showHeader = true, onHeaderClick }: SnapshotsProps) {
  return (
    <section className="px-6 py-4 overflow-hidden">
      {showHeader && (
        <div 
          className="flex items-center justify-between mb-4 cursor-pointer group active:scale-[0.98] transition-transform"
          onClick={onHeaderClick}
        >
          <h2 className="text-2xl font-bold text-blue-600">Snapshots</h2>
          <ArrowRight className="text-blue-600 w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </div>
      )}

      <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar snap-x px-2">
        {SNAPSHOTS.map((snap) => (
          <motion.div
            key={snap.id}
            whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
            style={{ rotate: snap.rotate }}
            className="flex-shrink-0 w-48 h-64 rounded-[28px] overflow-hidden shadow-md snap-center bg-white p-2 border border-gray-100"
          >
            <div className="w-full h-full rounded-[20px] overflow-hidden">
              <img
                src={snap.image}
                alt={`Snapshot ${snap.id}`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
