import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { User, Phone, Mail, Camera, ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { TYPOGRAPHY } from '../styles/typography';

interface SignUpPageProps {
  onSignUp: (userData: { name: string; username: string; email: string; phone: string; profileImage?: string; password?: string }) => void;
  onBack: () => void;
}

export default function SignUpPage({ onSignUp, onBack }: SignUpPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignUp({
      ...formData,
      profileImage: profileImage || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-[110] bg-white flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="px-6 py-4 flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </button>
        <h1 className={TYPOGRAPHY.h2.replace('text-blue-600', 'text-gray-900')}>Create Account</h1>
      </div>

      <div className="flex-1 px-6 pt-4 pb-12 w-full max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center gap-4">
            <div 
              onClick={handleImageClick}
              className="relative w-32 h-32 rounded-[40px] bg-gray-50 border-2 border-gray-200 flex items-center justify-center cursor-pointer group hover:border-[#1371FF] transition-colors overflow-hidden"
            >
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-gray-300 group-hover:text-[#1371FF]">
                  <Camera className="w-10 h-10 mb-1" />
                  <span className={TYPOGRAPHY.label}>Add Photo</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
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
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={"w-full bg-gray-50 border-none rounded-3xl py-4 pl-12 pr-6 text-gray-900 placeholder:text-gray-300 focus:ring-2 focus:ring-[#1371FF] transition-shadow outline-none normal-case " + TYPOGRAPHY.body.replace('text-gray-500', '')}
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
                  placeholder="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className={"w-full bg-gray-50 border-none rounded-3xl py-4 pl-12 pr-6 text-gray-900 placeholder:text-gray-300 focus:ring-2 focus:ring-[#1371FF] transition-shadow outline-none normal-case " + TYPOGRAPHY.body.replace('text-gray-500', '')}
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
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={"w-full bg-gray-50 border-none rounded-3xl py-4 pl-12 pr-6 text-gray-900 placeholder:text-gray-300 focus:ring-2 focus:ring-[#1371FF] transition-shadow outline-none normal-case " + TYPOGRAPHY.body.replace('text-gray-500', '')}
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className={TYPOGRAPHY.label + " ml-1"}>Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                <input
                  required
                  type="tel"
                  placeholder="08X-XXX-XXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={"w-full bg-gray-50 border-none rounded-3xl py-4 pl-12 pr-6 text-gray-900 placeholder:text-gray-300 focus:ring-2 focus:ring-[#1371FF] transition-shadow outline-none normal-case " + TYPOGRAPHY.body.replace('text-gray-500', '')}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className={TYPOGRAPHY.label + " ml-1"}>Password</label>
              <div className="relative group">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={"w-full bg-gray-50 border-none rounded-3xl py-4 pl-6 pr-14 text-gray-900 placeholder:text-gray-300 focus:ring-2 focus:ring-[#1371FF] transition-shadow outline-none normal-case " + TYPOGRAPHY.body.replace('text-gray-500', '')}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-gray-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-[#1371FF] text-white py-5 rounded-full font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-blue-100 mt-12 mb-8"
          >
            Create My Profile
            <ArrowRight className="w-6 h-6" />
          </motion.button>
        </form>
      </div>
    </div>
  );
}
