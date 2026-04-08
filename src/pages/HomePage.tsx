import FeaturedStack from '../components/FeaturedStack';
import Snapshots from '../components/Snapshots';
import StatsBar from '../components/StatsBar';
import { motion } from 'motion/react';

interface HomePageProps {
  onEventClick: (event: any, joined?: boolean) => void;
}

export default function HomePage({ onEventClick }: HomePageProps) {
  return (
    <>
      <FeaturedStack onEventClick={onEventClick} />
      <Snapshots />
      <StatsBar />
    </>
  );
}
