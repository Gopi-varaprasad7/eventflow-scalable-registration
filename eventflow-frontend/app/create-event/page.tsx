'use client';

import { useState, useEffect } from 'react';
import { createEvent } from '@/src/services/eventService';
import { useRouter } from 'next/navigation';

export default function CreateEventPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    seats: '',
    image: '',
    category: 'Marathon',
  });

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.date || !form.location) {
      alert('Please fill all fields');
      return;
    }

    const res = await createEvent(form);

    if (res.success) {
      alert('Event Created 🚀');
      router.push('/events');
    } else {
      alert(res.message || 'Something went wrong');
    }
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className='max-w-3xl mx-auto px-6 py-10'>
        <h1 className='text-3xl font-bold mb-8'>Create New Event</h1>

        <div className='bg-white p-6 rounded-xl shadow-md'>
          <input
            name='title'
            placeholder='Event Title'
            onChange={handleChange}
            className='w-full mb-4 p-3 border rounded-lg'
          />

          <textarea
            name='description'
            placeholder='Event Description'
            onChange={handleChange}
            className='w-full mb-4 p-3 border rounded-lg'
          />

          <input
            type='date'
            name='date'
            onChange={handleChange}
            className='w-full mb-4 p-3 border rounded-lg'
          />

          <input
            name='location'
            placeholder='Location'
            onChange={handleChange}
            className='w-full mb-4 p-3 border rounded-lg'
          />

          <input
            type='number'
            name='seats'
            placeholder='Available Seats'
            onChange={handleChange}
            className='w-full mb-4 p-3 border rounded-lg'
          />

          <input
            name='image'
            placeholder='Image URL'
            onChange={handleChange}
            className='w-full mb-4 p-3 border rounded-lg'
          />

          <select
            name='category'
            onChange={handleChange}
            className='w-full mb-6 p-3 border rounded-lg'
          >
            <option>Marathon</option>
            <option>Walkathon</option>
            <option>Cycling</option>
          </select>

          <button
            onClick={handleSubmit}
            className='w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700'
          >
            Create Event
          </button>
        </div>
      </div>
    </div>
  );
}
