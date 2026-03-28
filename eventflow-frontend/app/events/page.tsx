'use client';

import { useState, useEffect } from 'react';
import EventCard from '@/components/EventCard';
import { getEvents } from '@/src/services/eventService';

export default function EventsPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getEvents().then((data) => setEvents(data));
    console.log(events);
  }, []);

  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className='max-w-7xl mx-auto px-6 py-10'>
        {/* Heading */}
        <h1 className='text-3xl font-bold text-gray-900 mb-6'>
          Explore Events
        </h1>

        {/* Search */}
        <div className='mb-6'>
          <input
            type='text'
            placeholder='Search events...'
            className='w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500'
          />
        </div>

        {/* Filters */}
        <div className='flex flex-wrap gap-4 mb-8'>
          <select className='p-2 border rounded-lg'>
            <option>Category</option>
            <option>Marathon</option>
            <option>Walkathon</option>
            <option>Cycling</option>
          </select>

          <select className='p-2 border rounded-lg'>
            <option>Location</option>
            <option>Hyderabad</option>
            <option>Bangalore</option>
            <option>Chennai</option>
          </select>

          <select className='p-2 border rounded-lg'>
            <option>Date</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
        </div>

        {/* Events Grid */}
        <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {/* {events.map((event) => (
            <EventCard
              key={event.id}
              title={event.title}
              date={event.date}
              location={event.location}
              seats={event.seats}
              image={event.image}
            />
          ))} */}
        </div>
      </div>
    </div>
  );
}
