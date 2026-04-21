import React from 'react';

export interface EventTypeIconProps {
  className?: string;
  size?: number;
  containerSize?: 'sm' | 'md' | 'lg';
  noBackground?: boolean;
  noShadow?: boolean;
}

export const CircleWrapper: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  noBackground?: boolean;
  noShadow?: boolean;
}> = ({ children, className, size = 'md', noBackground, noShadow }) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  return (
    <div className={`${sizeClasses[size]} flex items-center justify-center rounded-full transition-all
      ${!noBackground ? 'bg-white' : ''} 
      ${!noShadow ? 'shadow-lg' : ''} 
      ${className}`}
    >
      {children}
    </div>
  );
};
