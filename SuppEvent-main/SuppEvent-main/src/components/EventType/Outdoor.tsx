import React from 'react';
import { Sun } from 'lucide-react';
import { CircleWrapper, EventTypeIconProps } from './BaseIcon';

export const OutdoorIcon: React.FC<EventTypeIconProps> = ({ 
  className, 
  size = 24, 
  containerSize = 'md', 
  noBackground, 
  noShadow 
}) => (
  <CircleWrapper className={className} size={containerSize} noBackground={noBackground} noShadow={noShadow}>
    <Sun size={size} className="text-blue-600" />
  </CircleWrapper>
);
