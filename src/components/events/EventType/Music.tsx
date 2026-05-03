import React from 'react';
import { Music } from 'lucide-react';
import { CircleWrapper, EventTypeIconProps } from './BaseIcon';

export const MusicIcon: React.FC<EventTypeIconProps> = (props) => (
  <CircleWrapper {...props} bg="bg-blue-50" color="text-blue-600">
    <Music size={props.size ? props.size * 0.6 : 24} strokeWidth={2.5} />
  </CircleWrapper>
);
