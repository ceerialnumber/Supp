import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X, Loader2, Save, Trash2, MapPin } from 'lucide-react';
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
  eachDayOfInterval,
  parse
} from 'date-fns';
import { 
  PartyIcon, 
  WorkoutIcon, 
  ArtIcon, 
  OutdoorIcon, 
  FilmIcon, 
  MusicIcon,
  LearningIcon
} from '../components/events/EventType';
import LocationPickerMap from '../components/events/LocationPickerMap';
import { compressImage } from '../lib/imageUtils';

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

interface EditEventPageProps {
  event: any;
  onSubmit: (updatedEvent: any) => void;
  onDelete: (eventId: string | number) => void;
  onBack: () => void;
  userData?: {
    name: string;
    username: string;
    email: string;
    phone: string;
    profileImage?: string;
  } | null;
}

export default function EditEventPage({ event, onSubmit, onDelete, onBack, userData }: EditEventPageProps) {
  const [title, setTitle] = useState(event.title || '');
  const [location, setLocation] = useState((event.location || '').replace('@', ''));
  const [debouncedLocation, setDebouncedLocation] = useState('');
  const [description, setDescription] = useState(event.description || '');
  const [selectedType, setSelectedType] = useState(event.type || 'party');
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Debounce location input for map search
  useEffect(() => {
    if (!location.trim()) {
      setDebouncedLocation('');
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedLocation(location);
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, [location]);

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Parse date string back to Date object if possible
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    try {
      if (event.date) {
        return parse(event.date, "d MMMM yyyy", new Date());
      }
    } catch (e) {
      console.error("Date parsing failed", e);
    }
    return new Date();
  });

  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  // Parse time string (HH:mm)
  const [selectedHour, setSelectedHour] = useState(() => {
    if (event.time && event.time.includes(':')) {
      return parseInt(event.time.split(':')[0]);
    }
    return 9;
  });
  const [selectedMinute, setSelectedMinute] = useState(() => {
    if (event.time && event.time.includes(':')) {
      return parseInt(event.time.split(':')[1]);
    }
    return 0;
  });

  const [uploadedImage, setUploadedImage] = useState<string | null>(event.image || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // 1. Read file as base64
      const base64: string = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      // 2. Compress image
      const compressed = await compressImage(base64, 1024, 1024, 0.7);

      // 3. Convert back to blob
      const fetchRes = await fetch(compressed);
      const blob = await fetchRes.blob();

      const formData = new FormData();
      formData.append('image', blob, 'event-image.jpg');

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
  };

  const handleSave = () => {
    if (!title.trim() || !location.trim()) {
      alert("Please fill in all fields!");
      return;
    }

    const typeData = TYPES.find(t => t.id === selectedType);
    const updatedEvent = {
      ...event,
      title,
      location: `@${location}`,
      date: format(selectedDate, "d MMMM yyyy"),
      time: `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`,
      type: selectedType,
      typeLabel: typeData?.label,
      Icon: typeData?.Icon,
      image: uploadedImage || event.image,
      description: description.trim(),
      organizer: {
        name: userData?.name || event.organizer?.name || "Personal Organizer",
        image: userData?.profileImage || event.organizer?.image || "/images/User.jpg",
        email: userData?.email || event.organizer?.email || "",
        username: userData?.username || event.organizer?.username || ""
      }
    };

    onSubmit(updatedEvent);
  };

  const handleDelete = () => {
    if (!isDeleting) {
      setIsDeleting(true);
      // Auto-cancel after 3 seconds if not confirmed
      setTimeout(() => setIsDeleting(false), 3000);
      return;
    }
    onDelete(event.id);
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
          <div className="absolute left-0 right-0 h-10 border-y border-gray-100 pointer-events-none" />
          
          <div className="flex w-full justify-center gap-8 h-full relative z-10">
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

        <div className="mt-2 pb-1 text-center">
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
                  isSelected ? 'bg-blue-600 text-white shadow-lg' :
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
    <div className="max-w-6xl mx-auto pb-32 px-6">
      <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
        <div className="flex mb-8 mt-4">
          <h1 className={TYPOGRAPHY.sectionTitle}>Edit Event</h1>
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
              <span className={TYPOGRAPHY.labelEmphasis}>Uploading...</span>
            </div>
          ) : (
            <span className={TYPOGRAPHY.label}>No Image</span>
          )}

          {!isUploading && (
            <div className={`absolute inset-0 bg-black/20 ${uploadedImage ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'} transition-opacity flex items-center justify-center`}>
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
            className={"w-full bg-white rounded-full py-5 px-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all normal-case " + TYPOGRAPHY.body.replace('text-gray-500', '')}
          />
        </div>

        {/* When Section */}
        <div className="mb-8">
          <label className={TYPOGRAPHY.formLabel}>When?</label>
          <div className="space-y-4">
            <button 
              onClick={() => setShowCalendar(true)}
              className="w-full bg-white rounded-full py-5 px-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-gray-100 text-left font-medium transition-all hover:bg-gray-50 flex items-center justify-between"
            >
              <span className={TYPOGRAPHY.body.replace('text-gray-500', 'text-gray-900')}>{format(selectedDate, "dd/MM/yyyy")}</span>
              <span className={TYPOGRAPHY.labelEmphasis}>Date</span>
            </button>
            <button 
              onClick={() => setShowTimePicker(true)}
              className="w-full bg-white rounded-full py-5 px-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-gray-100 text-left font-medium transition-all hover:bg-gray-50 flex items-center justify-between"
            >
              <span className={TYPOGRAPHY.body.replace('text-gray-500', 'text-gray-900')}>
                {selectedHour.toString().padStart(2, '0')}:{selectedMinute.toString().padStart(2, '0')}
              </span>
              <span className={TYPOGRAPHY.labelEmphasis}>Time</span>
            </button>
          </div>
        </div>

        {/* Modal Components (Calendar/Time) remain the same */}
        <AnimatePresence>
          {showCalendar && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowCalendar(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000]"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed inset-x-6 top-1/2 -translate-y-1/2 bg-white rounded-[40px] shadow-2xl z-[2010] overflow-hidden max-w-sm mx-auto"
              >
                {renderCalendar()}
                <button onClick={() => setShowCalendar(false)} className="absolute top-4 right-4 p-2 text-gray-400 bg-gray-100/50 rounded-full"><X className="w-5 h-5" /></button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showTimePicker && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowTimePicker(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000]"
              />
              <motion.div 
                initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-x-0 bottom-0 bg-white rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-[2010] overflow-hidden max-w-lg mx-auto w-full"
              >
                <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mt-4 mb-2" />
                {renderTimePicker()}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Where Section */}
        <div className="mb-8">
          <label className={TYPOGRAPHY.formLabel}>Where?</label>
          <div className="mb-4">
            <LocationPickerMap 
              searchQuery={debouncedLocation}
              onLocationSelect={(address) => setLocation(address)} 
            />
          </div>
          <div className="relative">
            <input 
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Place"
              className={"w-full bg-white rounded-full py-5 px-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all pr-14 normal-case " + TYPOGRAPHY.body.replace('text-gray-500', '')}
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-blue-600">
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
            rows={4}
            className={"w-full bg-white rounded-[32px] py-5 px-8 shadow-[0_10px_30_rgba(0,0,0,0.05)] border border-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none normal-case " + TYPOGRAPHY.body.replace('text-gray-500', '')}
          />
        </div>

        {/* Type Selection */}
        <div className="mb-12">
          <label className={TYPOGRAPHY.formLabel}>Type</label>
          <div className="flex justify-between items-center overflow-x-auto no-scrollbar py-4 px-2 gap-6">
            {TYPES.map((type) => (
              <button key={type.id} onClick={() => setSelectedType(type.id)} className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className={`transition-all duration-300 ${selectedType === type.id ? 'scale-110' : 'opacity-60 grayscale hover:opacity-100 hover:grayscale-0'}`}>
                  <type.Icon size={32} className="!w-16 !h-16" />
                </div>
                <span className={`${TYPOGRAPHY.label} ${selectedType === type.id ? 'text-blue-600' : 'text-gray-500'}`}>{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={isUploading}
            className="flex-[4] bg-blue-600 text-white rounded-full py-6 flex items-center justify-center gap-3 shadow-xl shadow-blue-200 disabled:opacity-50"
          >
            <Save className="w-6 h-6" />
            <span className="text-xl font-bold">Done</span>
          </motion.button>
          <button
            onClick={handleDelete}
            className={`flex-1 rounded-full py-6 flex items-center justify-center transition-all duration-300 ${
              isDeleting 
                ? 'bg-red-600 text-white flex-[3]' 
                : 'bg-red-50 text-red-500 flex-1 hover:bg-red-100'
            }`}
          >
            {isDeleting ? (
              <span className="font-bold whitespace-nowrap px-4 animate-pulse text-sm">Confirm?</span>
            ) : (
              <Trash2 className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
