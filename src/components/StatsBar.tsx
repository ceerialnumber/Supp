import { Wine, Dumbbell, User } from 'lucide-react';

export default function StatsBar() {
  return (
    <section className="px-6 py-4">
      <div className="flex w-full h-10 bg-gray-100 rounded-full overflow-hidden p-1 gap-1">
        {/* Segment 1: Wine/Party */}
        <div 
          className="flex items-center justify-between px-3 bg-[#FF6B4A] rounded-full text-white transition-all duration-500"
          style={{ width: '40%' }}
        >
          <Wine className="w-4 h-4" />
          <span className="text-xs font-bold">4/10</span>
        </div>

        {/* Segment 2: Gym */}
        <div 
          className="flex items-center justify-between px-3 bg-[#007AFF] rounded-full text-white transition-all duration-500"
          style={{ width: '30%' }}
        >
          <Dumbbell className="w-4 h-4" />
          <span className="text-xs font-bold">3/10</span>
        </div>

        {/* Segment 3: Other/Self */}
        <div 
          className="flex items-center justify-between px-3 bg-[#A5D8FF] rounded-full text-white transition-all duration-500"
          style={{ width: '20%' }}
        >
          <User className="w-4 h-4" />
          <span className="text-xs font-bold">2/10</span>
        </div>
      </div>
    </section>
  );
}
