export * from './BaseIcon';
export * from './Party';
export * from './Workout';
export * from './Art';
export * from './Outdoor';
export * from './Film';
export * from './Music';
export * from './Learning';

// Maintain backward compatibility for the map object if needed
import { PartyIcon } from './Party';
import { WorkoutIcon } from './Workout';
import { ArtIcon } from './Art';
import { OutdoorIcon } from './Outdoor';
import { FilmIcon } from './Film';
import { MusicIcon } from './Music';
import { LearningIcon } from './Learning';

export const eventTypeIcons = {
  party: PartyIcon,
  workout: WorkoutIcon,
  art: ArtIcon,
  outdoor: OutdoorIcon,
  film: FilmIcon,
  music: MusicIcon,
  learning: LearningIcon
};
