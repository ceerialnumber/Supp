import { User } from 'lucide-react';
import Logo from './Logo';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-12 h-12 flex items-center justify-center">
          <Logo clipId="clip0_header" />
        </div>
      </div>
      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-100">
        <img
          src="https://picsum.photos/seed/user/100/100"
          alt="Profile"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
    </header>
  );
}
