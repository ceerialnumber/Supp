import React from 'react';
import { Clock } from 'lucide-react';
import Countdown from './Countdown';
import { TYPOGRAPHY } from '../../styles/typography';

interface EventCountdownCardProps {
  targetDate: Date;
}

export default function EventCountdownCard({ targetDate }: EventCountdownCardProps) {
  return (
    <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl shadow-blue-500/5 text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50" />
      <div className="relative z-10">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <Clock size={16} strokeWidth={2.5} />
          </div>
          <h2 className={TYPOGRAPHY.h2.replace('text-blue-600', 'text-gray-900')}>Starts In</h2>
        </div>
        <Countdown targetDate={targetDate} />
      </div>
    </div>
  );
}
