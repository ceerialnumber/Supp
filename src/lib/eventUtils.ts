import { 
  PartyIcon, 
  WorkoutIcon, 
  ArtIcon, 
  OutdoorIcon, 
  FilmIcon, 
  MusicIcon,
  LearningIcon
} from '../components/events/EventType';

export const getEventIcon = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'party': return PartyIcon;
    case 'workout': return WorkoutIcon;
    case 'art': return ArtIcon;
    case 'outdoor': return OutdoorIcon;
    case 'film': return FilmIcon;
    case 'music': return MusicIcon;
    case 'learning': return LearningIcon;
    default: return PartyIcon;
  }
};
