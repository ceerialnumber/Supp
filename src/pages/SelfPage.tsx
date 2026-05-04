import React, { useMemo } from 'react';
import { Pencil, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import Snapshots from '../components/events/Snapshots';
import MoodTracker from '../components/mood/MoodTracker';
import { useJoin } from '../context/JoinContext';
import { MOODS } from '../components/mood/MoodPicker';
import { TYPOGRAPHY } from '../styles/typography';
import { getProfileImage } from '../lib/localStorage';

interface SelfPageProps {
  onEventClick: (event: any) => void;
  userData?: {
    name: string;
    username: string;
    email: string;
    phone: string;
    profileImage?: string;
  } | null;
  onMoodHistoryClick?: () => void;
  onSnapshotsClick?: () => void;
  onEdit?: () => void;
}

export default function SelfPage({ onEventClick, userData, onMoodHistoryClick, onSnapshotsClick, onEdit }: SelfPageProps) {
  const { getOrganizerMoodStats } = useJoin();
  
  // Get profile image from localStorage first, then fall back to userData or default
  const profileImageUrl = userData?.name 
    ? (getProfileImage(userData.name) || userData?.profileImage || "/images/User.jpg")
    : "/images/User.jpg";
  
  const stats = getOrganizerMoodStats(userData?.email || '');
  const total = stats.reduce((a, b) => a + b, 0);

  const gradientStyle = useMemo(() => {
    const pickedMoods = MOODS.filter((_, idx) => stats[idx] > 0);
    if (pickedMoods.length === 0) return { background: '#f9fafb' };
    
    const colors = pickedMoods.map(m => `${m.hex}20`); 
    
    if (colors.length === 1) {
      return { background: `linear-gradient(135deg, ${colors[0]}, #ffffff)` };
    }
    
    return { background: `linear-gradient(135deg, ${colors.join(', ')})` };
  }, [stats]);

  return (
    <div className="max-w-6xl mx-auto pb-24">
      <div className="bg-white">
      <div className="px-6 py-4">
        {/* Profile Section */}
        <div className="flex flex-col items-center mb-10 mt-4">
          <div className="relative group">
            <div className="w-60 h-60 rounded-[60px] overflow-hidden shadow-l mb-4 bg-gray-100 border-4 border-white">
              <img
                src={profileImageUrl}
                alt="Profile"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <button 
              onClick={onEdit}
              className="absolute bottom-6 right-2 w-12 h-12 bg-[#1D72FE] text-white rounded-3xl flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors border-2 border-white"
            >
              <Pencil size={20} />
            </button>
          </div>
          <h2 className={TYPOGRAPHY.h1.replace('text-blue-600', 'text-[#1D72FE]') + " !text-4xl"}>{userData?.name || "Natpakal"}</h2>
          {userData?.username && (
            <p className={TYPOGRAPHY.label + " mt-1"}>@{userData.username}</p>
          )}
        </div>

        {/* Content Section: Feedback & Snapshots */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          {/* Feedback Column */}
          <div className="lg:col-span-5 flex flex-col">
            <div 
              style={gradientStyle}
              className="rounded-[40px] p-6 h-full relative overflow-hidden shadow-sm border border-gray-100 transition-all duration-500"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className={TYPOGRAPHY.h2}>Your Feedback</h3>
                    <p className={TYPOGRAPHY.label + " opacity-60"}>from your previous events</p>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-gray-100 text-center shadow-sm">
                    <div className={TYPOGRAPHY.display + " !text-lg"}>{total}</div>
                    <div className={TYPOGRAPHY.label}>Reviews</div>
                  </div>
                </div>

                {total === 0 ? (
                  <div className="py-8 text-center bg-white/40 rounded-3xl border border-gray-200">
                    <p className={TYPOGRAPHY.label}>No feedback yet</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-5 gap-1 mb-6">
                      {MOODS.map((mood, idx) => {
                        const count = stats[idx] || 0;
                        const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                        
                        return (
                          <div key={idx} className="flex flex-col items-center gap-1.5">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-gray-100 shadow-sm relative group">
                              <mood.icon className={`w-5 h-5 ${mood.color}`} />
                              {count > 0 && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-900 rounded-full flex items-center justify-center text-[8px] font-black text-white border-2 border-white">
                                  {count}
                                </div>
                              )}
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] font-black text-gray-900 leading-none">{percentage}%</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="h-2 w-full bg-gray-200/50 rounded-full overflow-hidden flex shadow-inner">
                      {MOODS.map((mood, idx) => {
                        const count = stats[idx] || 0;
                        if (count === 0) return null;
                        const percentage = (count / total) * 100;
                        
                        return (
                          <motion.div
                            key={idx}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, delay: idx * 0.1, ease: [0.23, 1, 0.32, 1] }}
                            className={`h-full ${mood.bgColor} opacity-80`}
                          />
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Snapshots Column */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div 
              className="mb-2 flex items-center justify-between cursor-pointer group"
              onClick={onSnapshotsClick}
            >
              <div className="flex items-center gap-2">
                <h1 className={TYPOGRAPHY.sectionTitle}>Snapshots!</h1>
                <div className="bg-blue-100 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded-full">
                  All
                </div>
              </div>
              <ArrowRight className="text-blue-600 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="-mx-6">
              <Snapshots 
                showHeader={false} 
                onSnapshotClick={onEventClick}
                onHeaderClick={onSnapshotsClick}
              />
            </div>
          </div>
        </div>

        {/* Mood Tracking Section */}
        <MoodTracker 
          onSeeHistory={onMoodHistoryClick} 
          onEventClick={onEventClick}
        />
      </div>
      </div>
    </div>
  );
}
