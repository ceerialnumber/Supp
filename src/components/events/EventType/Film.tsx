import React from 'react';
import { Film } from 'lucide-react';
import { CircleWrapper, EventTypeIconProps } from './BaseIcon';

export const FilmIcon: React.FC<EventTypeIconProps> = (props) => (
  <CircleWrapper {...props} bg="bg-red-50" color="text-red-500">
    <Film size={props.size ? props.size * 0.6 : 24} strokeWidth={2.5} />
  </CircleWrapper>
);
