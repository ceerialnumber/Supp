import React from 'react';
import { BookOpen } from 'lucide-react';
import { CircleWrapper, EventTypeIconProps } from './BaseIcon';

export const LearningIcon: React.FC<EventTypeIconProps> = ({ 
  className, 
  size = 24, 
  containerSize = 'md', 
  noBackground, 
  noShadow 
}) => (
  <CircleWrapper className={className} size={containerSize} noBackground={noBackground} noShadow={noShadow}>
    <BookOpen size={size} className="text-blue-600" />
  </CircleWrapper>
);
