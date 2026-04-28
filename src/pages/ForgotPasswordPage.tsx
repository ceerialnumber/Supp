import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import Logo from '../components/layout/Logo';
import { TYPOGRAPHY } from '../styles/typography';

interface ForgotPasswordPageProps {
  onBack: () => void;
}

export default function ForgotPasswordPage({ onBack }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-white flex flex-col overflow-y-auto font-sans">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </button>
        <div className="w-10 h-10">
          <Logo clipId="forgot_header_logo" />
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="flex-1 px-8 pt-12 pb-12 w-full max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="mb-12 text-center">
                <h1 className={TYPOGRAPHY.h1.replace('text-blue-600', 'text-gray-900') + " !text-3xl"}>Reset Password</h1>
                <p className={TYPOGRAPHY.body.replace('uppercase', 'normal-case')}>Enter your email and we'll send you a link to get back into your account.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-1.5">
                  <label className={TYPOGRAPHY.label + " ml-1"}>Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-[#1371FF] transition-colors" />
                    <input
                      required
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={"w-full bg-gray-50 border-none rounded-[32px] py-5 pl-14 pr-6 text-gray-900 placeholder:text-gray-300 focus:ring-2 focus:ring-[#1371FF]/20 transition-all outline-none shadow-sm normal-case " + TYPOGRAPHY.body.replace('text-gray-500', '')}
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className={"w-full bg-[#1371FF] text-white py-5 rounded-full flex items-center justify-center gap-3 shadow-2xl shadow-blue-200 overflow-hidden relative group " + TYPOGRAPHY.h3}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Send Link
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <motion.div 
                    className="absolute inset-0 bg-blue-700 opacity-0 group-hover:opacity-100 transition-opacity" 
                  />
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="w-24 h-24 bg-blue-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 text-blue-600">
                <CheckCircle2 size={48} strokeWidth={2.5} />
              </div>
              <h2 className={TYPOGRAPHY.h1.replace('text-blue-600', 'text-gray-900')}>Check your mail!</h2>
              <p className={TYPOGRAPHY.body + " mb-12 italic leading-relaxed px-4"}>
                We've sent a password recovery link to:<br/>
                <span className={TYPOGRAPHY.h3 + " !text-[#1371FF] not-italic"}>{email}</span>
              </p>
              
              <button 
                onClick={onBack}
                className={TYPOGRAPHY.nav + " hover:underline underline-offset-8"}
              >
                Back to Login
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-auto pt-12 text-center">
          <p className={"text-gray-400 " + TYPOGRAPHY.body.replace('uppercase', 'normal-case')}>
            Still having trouble? <button className={TYPOGRAPHY.labelEmphasis + " hover:underline underline-offset-4"}>Contact Support</button>
          </p>
        </div>
      </div>
    </div>
  );
}
