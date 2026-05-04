import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { User, Phone, Mail, Camera, ArrowLeft, Check, Loader2 } from 'lucide-react';
import { TYPOGRAPHY } from '../styles/typography';
import { compressImage } from '../lib/imageUtils';

interface EditProfilePageProps {
  userData: {
    name: string;
    username: string;
    email: string;
    phone: string;
    profileImage?: string;
  } | null;
  onSave: (data: any) => void;
  onBack: () => void;
}

export default function EditProfilePage({ userData, onSave, onBack }: EditProfilePageProps) {
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    username: userData?.username || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
  });
  const [profileImage, setProfileImage] = useState<string | null>(userData?.profileImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const reader = new FileReader();
        const base64: string = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        // Compress image before upload
        const compressed = await compressImage(base64, 400, 400, 0.7);
        
        // Convert base64 to Blob
        const fetchRes = await fetch(compressed);
        const blob = await fetchRes.blob();
        
        // Upload to Firebase Storage
        const { uploadImageToStorage } = await import('../lib/firestoreUtils');
        const userId = userData?.name || 'unknown';
        const path = `profile-images/${userId}_${Date.now()}_${file.name}`;
        const downloadURL = await uploadImageToStorage(blob, path);
        
        setProfileImage(downloadURL);
      } catch (err: any) {
        console.error("Upload error:", err);
        alert("Failed to upload image. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      profileImage: profileImage || undefined,
    });
  };

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      <div className="flex-1 px-6 pt-4 pb-12 w-full max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center gap-4 mt-8">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative w-64 h-64 rounded-[40px] bg-gray-50 flex items-center justify-center cursor-pointer overflow-hidden shadow-xl"
            >
              <img 
                src={profileImage || "/images/User.jpg"} 
                alt="Profile" 
                className={`w-full h-full object-cover ${isUploading ? 'opacity-30' : 'opacity-100'}`} 
                referrerPolicy="no-referrer"
              />
              {isUploading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                </div>
              ) : (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              accept="image/*" 
              className="hidden" 
            />
        
          </div>

          <div className="space-y-6">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className={TYPOGRAPHY.label + " ml-1"}>Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={"w-full bg-gray-50 border-none rounded-[28px] py-4 pl-12 pr-6 text-gray-900 focus:ring-2 focus:ring-[#1371FF]/20 outline-none normal-case " + TYPOGRAPHY.body.replace('text-gray-500', '')}
                />
              </div>
            </div>

            {/* Username */}
            <div className="space-y-1.5">
              <label className={TYPOGRAPHY.label + " ml-1"}>Username</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 font-bold ml-0.5">@</div>
                <input
                  required
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className={"w-full bg-gray-50 border-none rounded-[28px] py-4 pl-12 pr-6 text-gray-900 focus:ring-2 focus:ring-[#1371FF]/20 outline-none normal-case " + TYPOGRAPHY.body.replace('text-gray-500', '')}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className={TYPOGRAPHY.label + " ml-1"}>Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={"w-full bg-gray-50 border-none rounded-[28px] py-4 pl-12 pr-6 text-gray-900 focus:ring-2 focus:ring-[#1371FF]/20 outline-none normal-case " + TYPOGRAPHY.body.replace('text-gray-500', '')}
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className={TYPOGRAPHY.label + " ml-1"}>Phone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                <input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={"w-full bg-gray-50 border-none rounded-[28px] py-4 pl-12 pr-6 text-gray-900 focus:ring-2 focus:ring-[#1371FF]/20 outline-none normal-case " + TYPOGRAPHY.body.replace('text-gray-500', '')}
                />
              </div>
            </div>
          </div>

          <div className="pt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-[#1371FF] text-white py-5 rounded-full font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-blue-100"
            >
              Save Changes
              <Check className="w-6 h-6" />
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}
