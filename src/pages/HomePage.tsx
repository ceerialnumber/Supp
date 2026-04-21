import FeaturedStack from '../components/FeaturedStack';
import Snapshots from '../components/Snapshots';
import StatsBar from '../components/StatsBar';
import { motion } from 'motion/react';

interface HomePageProps {
  onEventClick: (event: any, joined?: boolean) => void;
  onSeeMore: () => void;
  onSnapshotsClick: () => void;
}

export default function HomePage({ onEventClick, onSeeMore, onSnapshotsClick }: HomePageProps) {
  return (
    <div className="max-w-6xl mx-auto pb-24">
      <FeaturedStack onEventClick={onEventClick} onSeeMore={onSeeMore} />
      <Snapshots onHeaderClick={onSnapshotsClick} />
      <StatsBar />
    </div>
  );
}
