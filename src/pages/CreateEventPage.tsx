import { useState, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, ChevronLeft, ChevronRight, X, Loader2, MapPin } from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval 
} from 'date-fns';
import { 
  PartyIcon, 
  WorkoutIcon, 
  ArtIcon, 
  OutdoorIcon, 
  FilmIcon, 
  MusicIcon,
  LearningIcon
} from '../components/EventType';
import LocationPickerMap from '../components/events/LocationPickerMap';

import { TYPOGRAPHY } from '../styles/typography';

const TYPES = [
  { id: 'party', label: 'Party', Icon: PartyIcon },
  { id: 'workout', label: 'Workout', Icon: WorkoutIcon },
  { id: 'art', label: 'Art', Icon: ArtIcon },
  { id: 'outdoor', label: 'Outdoor', Icon: OutdoorIcon },
  { id: 'film', label: 'Film', Icon: FilmIcon },
  { id: 'music', label: 'Music', Icon: MusicIcon },
  { id: 'learning', label: 'Learning', Icon: LearningIcon },
];

interface CreateEventPageProps {
  onSubmit?: (event: any) => void;
  userData?: {
    name: string;
    username: string;
    email: string;
    phone: string;
    profileImage?: string;
  } | null;
}

export default function CreateEventPage({ onSubmit, userData }: CreateEventPageProps) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [selectedType, setSelectedType] = useState('party');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(0);

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // For production (Vercel), convert to base64 instead of using API
    const isProduction = import.meta.env.PROD;

    if (isProduction) {
      // Convert to base64 for Vercel deployment
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
        setIsUploading(false);
      };
      reader.onerror = () => {
        alert('Failed to upload image. Please try again.');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } else {
      // For development, use the API
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Upload failed');

        const data = await response.json();
        setUploadedImage(data.url);
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image. Please try again.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !location.trim()) {
      alert("Please fill in all fields!");
      return;
    }

    const typeData = TYPES.find(t => t.id === selectedType);
    const newEvent = {
      id: Date.now().toString(),
      title,
      location: `@${location}`,
      date: format(selectedDate, "d MMMM yyyy"),
      time: `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`,
      type: selectedType,
      typeLabel: typeData?.label,
      Icon: typeData?.Icon,
      image: uploadedImage || '/images/party.jpg',
      description: description.trim() || `A ${selectedType} event newly created! Excited to see everyone there.`,
      organizer: {
        name: userData?.name || "Personal Organizer",
        image: userData?.profileImage || "/images/User.jpg",
        email: userData?.email || "",
        username: userData?.username || ""
      }
    };

    if (onSubmit) {
      onSubmit(newEvent);
    }
  };

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const HOURS = Array.from({ length: 24 }, (_, i) => i);
  const MINUTES = Array.from({ length: 60 }, (_, i) => i);

  const renderTimePicker = () => {
    return (
      <div className="p-6 pt-4 h-[260px] flex flex-col">
        <div className="flex items-center justify-center mb-2">
          <h3 className="text-base font-bold text-gray-900 tracking-tight">Set Time</h3>
        </div>

        <div className="flex-1 relative flex items-center justify-center overflow-hidden">
          {/* Highlight Center Line */}
          <div className="absolute left-0 right-0 h-10 border-y border-gray-100 pointer-events-none" />
          
          <div className="flex w-full justify-center gap-8 h-full relative z-10">
            {/* Hours */}
            <div className="flex-1 h-full overflow-y-auto no-scrollbar snap-y snap-mandatory py-20 text-center">
              {HOURS.map((h) => (
                <div 
                  key={h}
                  onClick={() => setSelectedHour(h)}
                  className={`h-10 flex items-center justify-center snap-center cursor-pointer transition-all duration-300 ${
                    selectedHour === h ? 'text-xl font-bold text-black scale-110' : 'text-base text-gray-300'
                  }`}
                >
                  {h.toString().padStart(2, '0')}
                </div>
              ))}
            </div>

            {/* Minutes */}
            <div className="flex-1 h-full overflow-y-auto no-scrollbar snap-y snap-mandatory py-20 text-center">
              {MINUTES.map((m) => (
                <div 
                  key={m}
                  onClick={() => setSelectedMinute(m)}
                  className={`h-10 flex items-center justify-center snap-center cursor-pointer transition-all duration-300 ${
                    selectedMinute === m ? 'text-xl font-bold text-black scale-110' : 'text-base text-gray-300'
                  }`}
                >
                  {m.toString().padStart(2, '0')}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-2 pb-1">
          <button 
            onClick={() => setShowTimePicker(false)}
            className="w-full py-3 text-blue-600 font-bold text-sm hover:bg-blue-50 rounded-2xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    );
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "MMMM yyyy";
    let daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="p-6 pt-16">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-gray-900">{format(currentMonth, dateFormat)}</h3>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
            <button 
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-y-2 mb-4">
          {days.map((day, i) => (
            <div key={i} className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
              {day}
            </div>
          ))}
          {daysInMonth.map((day, i) => {
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isSelected = isSameDay(day, selectedDate);
            
            return (
              <button
                key={i}
                onClick={() => {
                  setSelectedDate(day);
                  setShowCalendar(false);
                }}
                className={`h-12 flex items-center justify-center rounded-2xl text-sm font-semibold transition-all ${
                  !isCurrentMonth ? 'text-gray-200' : 
                  isSelected ? 'bg-[#1D72FE] text-white shadow-lg shadow-blue-200' :
                  'text-gray-700 hover:bg-blue-50'
                }`}
              >
                {format(day, "d")}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto pb-32 px-6">
      <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
        <div className="flex mb-8 mt-4">
          <h1 className={TYPOGRAPHY.sectionTitle}>Create Event</h1>
        </div>

        {/* Image Upload Area */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          accept="image/*" 
          className="hidden" 
        />
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="relative w-full aspect-[4/3] bg-gray-100 rounded-[40px] flex flex-col items-center justify-center border-2 border-gray-50 shadow-xl mb-10 group cursor-pointer active:scale-[0.99] transition-all overflow-hidden"
        >
          {uploadedImage ? (
            <img 
              src={uploadedImage} 
              alt="Uploaded" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <span className={TYPOGRAPHY.h3}>Uploading...</span>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-4 text-[#1D72FE]">
                <Plus className="w-8 h-8" />
              </div>
              <span className={TYPOGRAPHY.h3}>add pic</span>
            </>
          )}

          {uploadedImage && !isUploading && (
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className={"bg-white/90 backdrop-blur px-4 py-2 rounded-full text-blue-600 font-bold " + TYPOGRAPHY.body.replace('text-gray-500', '')}>
                Change Picture
              </div>
            </div>
          )}
        </div>

        {/* Name Input */}
        <div className="mb-8">
          <label className={TYPOGRAPHY.formLabel}>Name</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Name this event..."
            className={"w-full bg-white rounded-full py-5 px-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-300 normal-case " + TYPOGRAPHY.body.replace('text-gray-500', '')}
          />
        </div>

        {/* When Section */}
        <div className="mb-8">
          <label className={TYPOGRAPHY.formLabel}>When?</label>
          <div className="space-y-4">
            <div className="relative">
              <button 
                onClick={() => setShowCalendar(true)}
                className="w-full bg-white rounded-full py-5 px-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-gray-100 text-left font-medium transition-all hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <span className={TYPOGRAPHY.body.replace('text-gray-500', 'text-gray-900')}>{selectedDate ? format(selectedDate, "dd/MM/yyyy") : "dd/mm/yyyy"}</span>
                  <span className={TYPOGRAPHY.labelEmphasis}>Date</span>
                </div>
              </button>
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowTimePicker(true)}
                className="w-full bg-white rounded-full py-5 px-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-gray-100 text-left font-medium transition-all hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <span className={TYPOGRAPHY.body.replace('text-gray-500', 'text-gray-900')}>
                    {selectedHour.toString().padStart(2, '0')}:{selectedMinute.toString().padStart(2, '0')}
                  </span>
                  <span className={TYPOGRAPHY.labelEmphasis}>Time</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Modal */}
        <AnimatePresence>
          {showCalendar && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCalendar(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000]"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed inset-x-6 top-1/2 -translate-y-1/2 bg-white rounded-[40px] shadow-2xl z-[2010] overflow-hidden max-w-sm mx-auto"
              >
                {renderCalendar()}
                <button 
                  onClick={() => setShowCalendar(false)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 bg-gray-100/50 rounded-full transition-colors z-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Time Picker Bottom Sheet */}
        <AnimatePresence>
          {showTimePicker && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowTimePicker(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000]"
              />
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-x-0 bottom-0 bg-white rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-[2010] overflow-hidden max-w-lg mx-auto w-full"
              >
                <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mt-4 mb-2" />
                {renderTimePicker()}
                <button 
                  onClick={() => setShowTimePicker(false)}
                  className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 bg-gray-100/50 rounded-full transition-colors z-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Where Section */}
        <div className="mb-8">
          <label className={TYPOGRAPHY.formLabel}>Where?</label>
          <div className="mb-4">
            <LocationPickerMap onLocationSelect={(address) => setLocation(address)} />
          </div>
          <div className="relative">
            <input 
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Place"
              className={"w-full bg-white rounded-full py-5 px-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-300 pr-14 normal-case " + TYPOGRAPHY.body.replace('text-gray-500', '')}
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[#1D72FE]">
              <MapPin size={24} />
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-10">
          <label className={TYPOGRAPHY.formLabel}>Description</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this event about?"
            rows={4}
            className={"w-full bg-white rounded-[32px] py-5 px-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-300 resize-none normal-case " + TYPOGRAPHY.body.replace('text-gray-500', '')}
          />
        </div>

        {/* Type Section */}
        <div className="mb-12">
          <label className={TYPOGRAPHY.formLabel}>Type</label>
          <div className="flex justify-between items-center overflow-x-auto no-scrollbar py-4 px-2 gap-6">
            {TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className="flex flex-col items-center gap-2 flex-shrink-0 group"
              >
                <div className={`transition-all duration-300 ${selectedType === type.id ? 'scale-110' : 'opacity-60 grayscale hover:opacity-100 hover:grayscale-0'}`}>
                  <type.Icon size={32} className="!w-16 !h-16" />
                </div>
                <span className={`${TYPOGRAPHY.label} transition-colors ${selectedType === type.id ? 'text-blue-600' : 'text-gray-500'}`}>
                  {type.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className="w-full max-w-md bg-[#1D72FE] text-white rounded-full py-6 flex items-center justify-center gap-3 shadow-xl shadow-blue-200"
          >
            <Plus className="w-6 h-6 stroke-[3px]" />
            <span className="text-xl font-semibold">Create Event</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
