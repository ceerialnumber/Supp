import React from 'react';
import { Sun } from 'lucide-react';
import { CircleWrapper, EventTypeIconProps } from './BaseIcon';

export const OutdoorIcon: React.FC<EventTypeIconProps> = (props) => (
  <CircleWrapper {...props} bg="bg-orange-50" color="text-orange-500">
    <Sun size={props.size ? props.size * 0.6 : 24} strokeWidth={2.5} />
  </CircleWrapper>
);
