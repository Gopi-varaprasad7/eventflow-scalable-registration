/* eslint-disable @next/next/no-img-element */
'use client';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className='bg-linear-to-r from-indigo-600 to-purple-600 text-white'>
      <div className='absolute top-0 left-0 w-96 h-96 bg-purple-500 opacity-20 blur-3xl rounded-full'></div>
      <div className='max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-10 items-center'>
        <div>
          <div className='inline-block bg-white/20 text-sm px-4 py-1 rounded-full mb-6'>
            🚀 Trusted by 10K+ developers
          </div>
          <h1 className='text-4xl md:text-6xl font-bold leading-tight'>
            Discover and Register <br /> for the Best Tech Events
          </h1>
          <p className='mt-6 text-lg text-indigo-100'>
            {' '}
            EventFlow helps developers discover conferences, meetups, and
            workshops while making event registration seamless and scalable.
          </p>
          <div className='mt-8 flex gap-4'>
            <Link
              href='/events'
              className='bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:text-white hover:bg-gray-700 transition'
            >
              Explore Events
            </Link>
            <Link
              href='/create-event'
              className='border border-white px-6 py-3  rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition'
            >
              Create Event
            </Link>
          </div>
          <p className='mt-6 text-indigo-200 text-sm'>
            Join thousands of developers attending tech events worldwide.
          </p>
        </div>
        <div>
          <img
            src='/speaker.svg'
            alt='Event illustration'
            className='w-full max-w-md animate-float'
          />
        </div>
      </div>
    </section>
  );
}
