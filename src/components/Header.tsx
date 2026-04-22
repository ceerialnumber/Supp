import { ChevronLeft } from 'lucide-react';
import Logo from './Logo';

interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
}

export default function Header({ showBack, onBack }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/60 backdrop-blur-lg z-50 ">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          {showBack ? (
            <button 
              onClick={onBack}
              className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 rounded-full transition-colors"
            >
              <ChevronLeft className="w-8 h-8 text-blue-600 stroke-[2.5px]" />
            </button>
          ) : (
            <div className="w-12 h-12 flex items-center justify-center">
              <Logo clipId="clip0_header" />
            </div>
          )}
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-100">
          <img
            src="/images/User.jpg"
            alt="Profile"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </header>
  );
}
