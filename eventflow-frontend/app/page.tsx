import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import FeaturedEvents from '@/components/FeaturedEvents';

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Stats />
      <FeaturedEvents />
    </div>
  );
}
