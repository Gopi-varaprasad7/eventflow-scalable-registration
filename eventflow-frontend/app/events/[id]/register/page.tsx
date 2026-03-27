'use client';

import { useState } from 'react';

export default function RegisterPage({ params }: { params: { id: string } }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    ticket: 'Standard',
  });

  // Mock event (later API)
  const event = {
    title: 'Hyderabad Marathon 2026',
    date: 'July 12, 2026',
    location: 'Hyderabad',
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log('Register Data:', form);
    alert('Registered Successfully 🚀');
  };

  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className='max-w-3xl mx-auto px-6 py-10'>
        {/* Event Summary */}
        <div className='bg-white p-6 rounded-xl shadow-md mb-8'>
          <h2 className='text-2xl font-bold text-gray-900'>{event.title}</h2>

          <p className='text-gray-600 mt-2'>
            📅 {event.date} • 📍 {event.location}
          </p>
        </div>

        {/* Form */}
        <div className='bg-white p-6 rounded-xl shadow-md'>
          <h3 className='text-xl font-semibold mb-6'>Participant Details</h3>

          {/* Name */}
          <input
            type='text'
            name='name'
            placeholder='Full Name'
            value={form.name}
            onChange={handleChange}
            className='w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
          />

          {/* Email */}
          <input
            type='email'
            name='email'
            placeholder='Email Address'
            value={form.email}
            onChange={handleChange}
            className='w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
          />

          {/* Phone */}
          <input
            type='text'
            name='phone'
            placeholder='Phone Number'
            value={form.phone}
            onChange={handleChange}
            className='w-full mb-6 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
          />

          {/* Ticket Type */}
          <div className='mb-6'>
            <p className='font-medium mb-2'>Select Ticket Type</p>

            <select
              name='ticket'
              value={form.ticket}
              onChange={handleChange}
              className='w-full p-3 border rounded-lg'
            >
              <option>Standard</option>
              <option>VIP</option>
            </select>
          </div>
          <div className='mb-6'>
            <p className='font-medium mb-2'>T-Shirt Size</p>

            <select
              name='size'
              value={form.size || 'M'}
              onChange={handleChange}
              className='w-full p-3 border rounded-lg'
            >
              <option>S</option>
              <option>M</option>
              <option>L</option>
              <option>XL</option>
            </select>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className='w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:opacity-90 transition'
          >
            Confirm Registration
          </button>
        </div>
      </div>
    </div>
  );
}
