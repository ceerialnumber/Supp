import React from 'react';
import { BookOpen } from 'lucide-react';
import { CircleWrapper, EventTypeIconProps } from './BaseIcon';

export const LearningIcon: React.FC<EventTypeIconProps> = (props) => (
  <CircleWrapper {...props} bg="bg-purple-50" color="text-purple-600">
    <BookOpen size={props.size ? props.size * 0.6 : 24} strokeWidth={2.5} />
  </CircleWrapper>
);
