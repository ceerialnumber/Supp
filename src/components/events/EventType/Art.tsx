import React from 'react';
import { Palette } from 'lucide-react';
import { CircleWrapper, EventTypeIconProps } from './BaseIcon';

export const ArtIcon: React.FC<EventTypeIconProps> = (props) => (
  <CircleWrapper {...props} bg="bg-pink-50" color="text-pink-500">
    <Palette size={props.size ? props.size * 0.6 : 24} strokeWidth={2.5} />
  </CircleWrapper>
);
