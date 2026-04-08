import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

const SNAPSHOTS = [
  { id: 1, image: 'https://picsum.photos/seed/snap1/600/800', rotate: -5 },
  { id: 2, image: 'https://picsum.photos/seed/snap2/600/800', rotate: 3 },
  { id: 3, image: 'https://picsum.photos/seed/snap3/600/800', rotate: -2 },
  { id: 4, image: 'https://picsum.photos/seed/snap4/600/800', rotate: 4 },
];

export default function Snapshots() {
  return (
    <section className="px-6 py-4 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-blue-600">Snapshots</h2>
        <ArrowRight className="text-blue-600 w-6 h-6" />
      </div>

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
