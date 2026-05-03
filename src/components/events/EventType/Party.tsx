import React from 'react';
import { Wine } from 'lucide-react';
import { CircleWrapper, EventTypeIconProps } from './BaseIcon';

export const PartyIcon: React.FC<EventTypeIconProps> = (props) => (
  <CircleWrapper {...props} bg="bg-yellow-50" color="text-yellow-600">
    <Wine size={props.size ? props.size * 0.6 : 24} strokeWidth={2.5} />
  </CircleWrapper>
);
