'use client';
import { useRouter } from 'next/navigation';

export default function CTA() {
  const router = useRouter();
  return (
    <section className='py-20'>
      <div className='max-w-6xl mx-auto px-6'>
        <div className='bg-linear-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-center text-white shadow-[0_20px_60px_rgba(79,70,229,0.5)]'>
          <h2 className='text-4xl font-bold mb-4'>
            Ready to Join Your Next Event?
          </h2>
          <p className=' text-lg text-indigo-100 mb-8 max-w-2xl mx-auto'>
            {' '}
            Discover exciting marathons, walkathons, and cycling events
            happening near you.
          </p>
          <div className='flex flex-col sm:flex-row justify-center gap-4'>
            <button
              onClick={() => router.push('/events')}
              className='px-6 py-3 bg-white text-indigo-600 hover:scale-105  duration-300 font-semibold rounded-lg hover:bg-gray-100 transition'
            >
              Expore Events
            </button>
            <button
              onClick={() => router.push('/create-event')}
              className='px-6 py-3 border border-white hover:scale-105 duration-300 hover:text-gray-600 font-semibold rounded-lg hover:bg-gray-100 transition'
            >
              Create Event
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
