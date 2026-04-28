import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { User, Mail, ShieldCheck } from 'lucide-react';
import { useJoin } from '../context/JoinContext';
import { MOODS } from '../components/mood/MoodPicker';
import { ALL_EVENTS } from '../data/events';
import { TYPOGRAPHY } from '../styles/typography';

interface UserProfilePageProps {
  organizer: {
    name: string;
    image?: string;
    email: string;
    username?: string;
  };
  onEventClick: (event: any) => void;
}

export default function UserProfilePage({ organizer, onEventClick }: UserProfilePageProps) {
  const { getOrganizerMoodStats, userEvents } = useJoin();
  
  const stats = getOrganizerMoodStats(organizer.email);
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

  const username = organizer.username || organizer.email.split('@')[0];

  const organizerEvents = useMemo(() => {
    return [...ALL_EVENTS, ...userEvents].filter(e => e.organizer?.email === organizer.email);
  }, [organizer.email, userEvents]);

  return (
    <div className="h-full bg-white flex flex-col no-scrollbar">
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {/* Profile Card */}
        <div className="px-6 py-8">
          <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-xl shadow-blue-500/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50" />
            
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-32 h-32 rounded-[48px] bg-gray-100 mb-6 border-[6px] border-white shadow-xl overflow-hidden group">
                {organizer.image ? (
                  <img 
                    src={organizer.image} 
                    alt={organizer.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-500 underline-offset-4">
                    <User size={48} strokeWidth={1.5} />
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 mb-1">
                <h2 className={TYPOGRAPHY.h1.replace('text-blue-600', 'text-gray-900')}>
                  {organizer.name}
                </h2>
                <div className="bg-blue-600 p-1 rounded-full text-white shadow-sm">
                  <ShieldCheck size={14} strokeWidth={3} />
                </div>
              </div>
              <p className={TYPOGRAPHY.labelEmphasis + " mb-6"}>@{username}</p>
              
              <div className="flex flex-col gap-3 w-full">
                <div className="flex items-center justify-center gap-2 py-3 px-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <Mail size={16} className="text-gray-400" />
                  <span className={TYPOGRAPHY.body.replace('text-gray-500', 'text-gray-600')}>{organizer.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Public Reputation Section */}
        <div className="px-6 mb-8">
          <div 
            style={gradientStyle}
            className="rounded-[40px] p-8 relative overflow-hidden shadow-sm border border-gray-100 transition-all duration-500"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className={TYPOGRAPHY.h2}>Feedback</h3>
                </div>
                <div className="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-2xl border border-gray-100 text-center shadow-sm">
                  <div className={TYPOGRAPHY.display + " !text-xl"}>{total}</div>
                  <div className={TYPOGRAPHY.label}>Reviews</div>
                </div>
              </div>

              {total === 0 ? (
                <div className="py-8 text-center bg-white/40 rounded-3xl border border-gray-200">
                  <p className={TYPOGRAPHY.label}>No feedback yet</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-5 gap-2 mb-8">
                    {MOODS.map((mood, idx) => {
                      const count = stats[idx] || 0;
                      const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                      
                      return (
                        <div key={idx} className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white border border-gray-100 shadow-sm relative group">
                            <mood.icon className={`w-6 h-6 ${mood.color}`} />
                            {count > 0 && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center text-[10px] font-black text-white border-2 border-white">
                                {count}
                              </div>
                            )}
                          </div>
                          <div className="text-center">
                            <p className={TYPOGRAPHY.nav + " !text-[10px] !font-black text-gray-900 leading-none"}>{percentage}%</p>
                            <p className={TYPOGRAPHY.label + " !text-[8px] tracking-tighter mt-1"}>{mood.label}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="h-3 w-full bg-gray-200/50 rounded-full overflow-hidden flex shadow-inner">
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

        {/* Hosted Events Section */}
        <div className="px-6">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className={TYPOGRAPHY.h3}>Hosted Events ({organizerEvents.length})</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {organizerEvents.map((event) => (
              <motion.button
                key={event.id}
                whileHover={{ y: -4, shadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onEventClick(event)}
                className="bg-white rounded-3xl border border-gray-100 p-2 shadow-sm text-left group"
              >
                <div className="h-24 rounded-2xl overflow-hidden mb-2 relative">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
                <div className="px-2 pb-1">
                  <h4 className={TYPOGRAPHY.h3 + " group-hover:text-blue-600 transition-colors line-clamp-1 mt-1 !text-[10px]"}>{event.title}</h4>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-1 h-1 rounded-full bg-blue-600" />
                    <span className={TYPOGRAPHY.label + " !text-[8px]"}>{event.date}</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
