import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeaturedEvents from '@/components/FeaturedEvents';

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <FeaturedEvents />
    </div>
  );
}
