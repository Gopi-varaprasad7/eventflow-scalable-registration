import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import FeaturedEvents from '@/components/FeaturedEvents';
import HowItWorks from '@/components/HowItWorks';
import UpcomingEvents from '@/components/UpcomingEvents';

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Stats />
      <FeaturedEvents />
      <HowItWorks />
      <UpcomingEvents />
    </div>
  );
}
