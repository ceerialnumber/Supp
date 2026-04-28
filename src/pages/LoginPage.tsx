import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Logo from '../components/layout/Logo';
import { TYPOGRAPHY } from '../styles/typography';

interface LoginPageProps {
  onLogin: (data: { email: string }) => void;
  onBack: () => void;
  onSignUp: () => void;
  onForgotPassword: () => void;
}

export default function LoginPage({ onLogin, onBack, onSignUp, onForgotPassword }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    onLogin({ email });
  };

  return (
    <div className="fixed inset-0 z-[110] bg-white flex flex-col overflow-y-auto font-sans">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </button>
        <div className="w-10 h-10">
          <Logo clipId="login_header_logo" />
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="flex-1 px-8 pt-8 pb-12 w-full max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12 text-center"
        >
          <h1 className={TYPOGRAPHY.h1.replace('text-blue-600', 'text-gray-900') + " !text-3xl"}>Welcome Back!</h1>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className={TYPOGRAPHY.label + " ml-1"}>Email or Username</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-[#1371FF] transition-colors" />
                <input
                  required
                  type="text"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={"w-full bg-gray-50 border-none rounded-[32px] py-5 pl-14 pr-6 text-gray-900 placeholder:text-gray-300 focus:ring-2 focus:ring-[#1371FF]/20 transition-all outline-none shadow-sm normal-case " + TYPOGRAPHY.body.replace('text-gray-500', '')}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1 pr-1">
                <label className={TYPOGRAPHY.label}>Password</label>
                <button 
                  type="button" 
                  onClick={onForgotPassword}
                  className={TYPOGRAPHY.labelEmphasis + " hover:underline"}
                >
                  Forgot?
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-[#1371FF] transition-colors" />
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={"w-full bg-gray-50 border-none rounded-[32px] py-5 pl-14 pr-14 text-gray-900 placeholder:text-gray-300 focus:ring-2 focus:ring-[#1371FF]/20 transition-all outline-none shadow-sm normal-case " + TYPOGRAPHY.body.replace('text-gray-500', '')}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
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
            className="w-full bg-[#1371FF] text-white py-5 rounded-full font-bold text-lg flex items-center justify-center gap-3 shadow-2xl shadow-blue-200 mt-12 overflow-hidden relative group"
          >
            <span className="relative z-10 flex items-center gap-2">
              Log In
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </span>
            <motion.div 
              className="absolute inset-0 bg-blue-700 opacity-0 group-hover:opacity-100 transition-opacity" 
            />
          </motion.button>
        </form>

        <div className="mt-12 text-center">
          <p className={TYPOGRAPHY.label + " mb-4"}>Or continue with</p>
          <div className="flex justify-center gap-6">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onLogin({ email: "google.user@example.com" })}
              className="w-full max-w-[140px] h-14 rounded-2xl bg-gray-50 flex items-center justify-center gap-3 border border-gray-100 hover:bg-white hover:shadow-md transition-all group"
            >
              <div className="w-6 h-6 flex items-center justify-center bg-white rounded-full shadow-sm text-sm font-medium text-red-500">G</div>
              <span className={TYPOGRAPHY.h3 + " !text-gray-700 !text-sm"}>Google</span>
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onLogin({ email: "fb.user@example.com" })}
              className="w-full max-w-[140px] h-14 rounded-2xl bg-gray-50 flex items-center justify-center gap-3 border border-gray-100 hover:bg-white hover:shadow-md transition-all group"
            >
              <div className="w-6 h-6 flex items-center justify-center bg-blue-600 rounded-full shadow-sm text-sm font-medium text-white">f</div>
              <span className={TYPOGRAPHY.h3 + " !text-gray-700 !text-sm"}>Facebook</span>
            </motion.button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className={"mt-12 flex flex-col items-center gap-2 " + TYPOGRAPHY.body}
        >
          <div className="flex items-center gap-2">
            <span>New to memory making?</span>
            <button 
              onClick={onSignUp} 
              className={TYPOGRAPHY.labelEmphasis + " !font-black hover:underline underline-offset-4 text-xs"}
            >
              Join Us
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
