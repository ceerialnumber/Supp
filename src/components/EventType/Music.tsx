import React from 'react';
import { Music } from 'lucide-react';
import { CircleWrapper, EventTypeIconProps } from './BaseIcon';

export const MusicIcon: React.FC<EventTypeIconProps> = ({ 
  className, 
  size = 24, 
  containerSize = 'md', 
  noBackground, 
  noShadow 
}) => (
  <CircleWrapper className={className} size={containerSize} noBackground={noBackground} noShadow={noShadow}>
    <Music size={size} className="text-blue-600" />
  </CircleWrapper>
);
