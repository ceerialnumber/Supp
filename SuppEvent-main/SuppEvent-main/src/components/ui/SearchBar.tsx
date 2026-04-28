import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Search events...", className = "" }: SearchBarProps) {
  return (
    <div className={`relative w-full ${className}`}>
      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500">
        <Search size={20} strokeWidth={2.5} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white rounded-full py-4 pl-14 pr-12 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-300 font-medium text-sm text-gray-900 normal-case"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-gray-500 transition-colors"
        >
          <X size={16} strokeWidth={3} />
        </button>
      )}
    </div>
  );
}
