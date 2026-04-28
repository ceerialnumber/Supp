import React from 'react';
import { Palette } from 'lucide-react';
import { CircleWrapper, EventTypeIconProps } from './BaseIcon';

export const ArtIcon: React.FC<EventTypeIconProps> = ({ 
  className, 
  size = 24, 
  containerSize = 'md', 
  noBackground, 
  noShadow 
}) => (
  <CircleWrapper className={className} size={containerSize} noBackground={noBackground} noShadow={noShadow}>
    <Palette size={size} className="text-blue-600" />
  </CircleWrapper>
);
