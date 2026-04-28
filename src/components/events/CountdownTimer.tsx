import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: Date;
  onFinish?: () => void;
}

export default function CountdownTimer({ targetDate, onFinish }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference <= 0) {
        if (onFinish) onFinish();
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [targetDate, onFinish]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="flex gap-2">
      {timeLeft.days > 0 && (
        <div className="flex flex-col items-center">
          <div className="text-xl font-black text-blue-600 leading-none">{timeLeft.days}</div>
          <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Days</div>
        </div>
      )}
      {timeLeft.days > 0 && <div className="text-xl font-black text-gray-200">:</div>}
      
      <div className="flex flex-col items-center">
        <div className="text-xl font-black text-blue-600 leading-none">{formatNumber(timeLeft.hours)}</div>
        <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Hrs</div>
      </div>
      <div className="text-xl font-black text-gray-200">:</div>
      
      <div className="flex flex-col items-center">
        <div className="text-xl font-black text-blue-600 leading-none">{formatNumber(timeLeft.minutes)}</div>
        <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Min</div>
      </div>
      <div className="text-xl font-black text-gray-200 text-transparent animate-pulse select-none" aria-hidden="true">:</div>
      
      <div className="flex flex-col items-center">
        <div className="text-xl font-black text-blue-600 leading-none">{formatNumber(timeLeft.seconds)}</div>
        <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Sec</div>
      </div>
    </div>
  );
}
