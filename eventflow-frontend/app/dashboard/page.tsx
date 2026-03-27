'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import EventCard from '@/components/EventCard';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const isAuth = localStorage.getItem('isAuth');

    if (!isAuth) {
      router.push('/login');
    }
  }, []);
  // Mock user data
  const user = {
    name: 'Gopi',
  };

  // Mock registered events
  const events = [
    {
      id: 1,
      title: 'Hyderabad Marathon',
      date: 'July 12, 2026',
      location: 'Hyderabad',
      seats: 0,
      image: '/events/marathon.jpg',
    },
    {
      id: 2,
      title: 'Vizag Beach Walkathon',
      date: 'August 2, 2026',
      location: 'Visakhapatnam',
      seats: 0,
      image: '/events/walkathon.jpg',
    },
  ];

  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className='max-w-7xl mx-auto px-6 py-10'>
        {/* Welcome */}
        <h1 className='text-3xl font-bold text-gray-900 mb-6'>
          Welcome Back, {user.name} 👋
        </h1>

        {/* Stats */}
        <div className='grid sm:grid-cols-3 gap-6 mb-10'>
          <div className='bg-white p-6 rounded-xl shadow-md'>
            <p className='text-gray-500'>Registered Events</p>
            <p className='text-2xl font-bold mt-2'>{events.length}</p>
          </div>

          <div className='bg-white p-6 rounded-xl shadow-md'>
            <p className='text-gray-500'>Upcoming</p>
            <p className='text-2xl font-bold mt-2'>{events.length}</p>
          </div>

          <div className='bg-white p-6 rounded-xl shadow-md'>
            <p className='text-gray-500'>Completed</p>
            <p className='text-2xl font-bold mt-2'>0</p>
          </div>
        </div>

        {/* My Events */}
        <h2 className='text-2xl font-semibold mb-6'>My Events</h2>

        <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {events.map((event) => (
            <EventCard
              key={event.id}
              title={event.title}
              date={event.date}
              location={event.location}
              seats={event.seats}
              image={event.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
