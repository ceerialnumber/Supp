import React from 'react';
import { Dumbbell } from 'lucide-react';
import { CircleWrapper, EventTypeIconProps } from './BaseIcon';

export const WorkoutIcon: React.FC<EventTypeIconProps> = ({ 
  className, 
  size = 24, 
  containerSize = 'md', 
  noBackground, 
  noShadow 
}) => (
  <CircleWrapper className={className} size={containerSize} noBackground={noBackground} noShadow={noShadow}>
    <Dumbbell size={size} className="text-blue-600" />
  </CircleWrapper>
);
