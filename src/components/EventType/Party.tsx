import React from 'react';
import { Wine } from 'lucide-react';
import { CircleWrapper, EventTypeIconProps } from './BaseIcon';

export const PartyIcon: React.FC<EventTypeIconProps> = ({ 
  className, 
  size = 24, 
  containerSize = 'md', 
  noBackground, 
  noShadow 
}) => (
  <CircleWrapper className={className} size={containerSize} noBackground={noBackground} noShadow={noShadow}>
    <Wine size={size} className="text-blue-600" />
  </CircleWrapper>
);
