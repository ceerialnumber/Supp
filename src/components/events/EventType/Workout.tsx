import React from 'react';
import { Dumbbell } from 'lucide-react';
import { CircleWrapper, EventTypeIconProps } from './BaseIcon';

export const WorkoutIcon: React.FC<EventTypeIconProps> = (props) => (
  <CircleWrapper {...props} bg="bg-green-50" color="text-green-600">
    <Dumbbell size={props.size ? props.size * 0.6 : 24} strokeWidth={2.5} />
  </CircleWrapper>
);
