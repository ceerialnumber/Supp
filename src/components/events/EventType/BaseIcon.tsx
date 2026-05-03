import React from 'react';

export interface EventTypeIconProps {
  size?: number;
  className?: string;
  color?: string;
}

interface CircleWrapperProps extends EventTypeIconProps {
  children: React.ReactNode;
  bg?: string;
}

export const CircleWrapper: React.FC<CircleWrapperProps> = ({ 
  children, 
  size = 40, 
  className = '', 
  bg = 'bg-blue-50',
  color = 'text-blue-600'
}) => {
  return (
    <div 
      className={`flex items-center justify-center rounded-full ${bg} ${color} ${className}`}
      style={{ width: size, height: size }}
    >
      {children}
    </div>
  );
};
