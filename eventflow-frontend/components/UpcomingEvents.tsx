'use client';

import { useRef } from 'react';
import EventCard from './EventCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function UpcomingEvents() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: string) => {
    if (!scrollRef.current) return;

    const scrollAmount = 350;

    if (direction === 'left') {
      scrollRef.current.scrollLeft -= scrollAmount;
    } else {
      scrollRef.current.scrollLeft += scrollAmount;
    }
  };

  const events = [
    {
      id: 1,
      title: 'Hyderabad Marathon',
      date: 'July 12, 2026',
      location: 'Hyderabad',
      seats: 120,
      image: '/events/marathon.jpg',
    },
    {
      id: 2,
      title: 'Vizag Beach Walkathon',
      date: 'August 2, 2026',
      location: 'Visakhapatnam',
      seats: 80,
      image: '/events/walkathon.jpg',
    },
    {
      id: 3,
      title: 'Bangalore Cycling Fest',
      date: 'September 10, 2026',
      location: 'Bangalore',
      seats: 60,
      image: '/events/cycling.jpg',
    },
    {
      id: 4,
      title: 'Chennai Night Run',
      date: 'October 5, 2026',
      location: 'Chennai',
      seats: 100,
      image: '/events/run.jpg',
    },
  ];

  return (
    <section className='py-20 bg-white'>
      <div className='max-w-7xl mx-auto px-6'>
        {/* Header */}
        <div className='flex justify-between items-center mb-10'>
          <div>
            <h2 className='text-4xl font-bold text-gray-900'>
              Upcoming Events
            </h2>

            <p className='text-gray-600 mt-2'>
              Discover exciting events happening soon
            </p>
          </div>

          <div className='flex gap-3'>
            <button
              onClick={() => scroll('left')}
              className='p-2 rounded-full border hover:bg-gray-100'
            >
              <ChevronLeft size={22} />
            </button>

            <button
              onClick={() => scroll('right')}
              className='p-2 rounded-full border hover:bg-gray-100'
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>

        {/* Carousel */}

        <div
          ref={scrollRef}
          className='flex gap-6 overflow-x-auto scroll-smooth no-scrollbar'
        >
          {events.map((event) => (
            <div key={event.id} className='min-w-75'>
              <EventCard
                title={event.title}
                date={event.date}
                location={event.location}
                seats={event.seats}
                image={event.image}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
