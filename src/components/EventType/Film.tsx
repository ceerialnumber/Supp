import React from 'react';
import { Film } from 'lucide-react';
import { CircleWrapper, EventTypeIconProps } from './BaseIcon';

export const FilmIcon: React.FC<EventTypeIconProps> = ({ 
  className, 
  size = 24, 
  containerSize = 'md', 
  noBackground, 
  noShadow 
}) => (
  <CircleWrapper className={className} size={containerSize} noBackground={noBackground} noShadow={noShadow}>
    <Film size={size} className="text-blue-600" />
  </CircleWrapper>
);
