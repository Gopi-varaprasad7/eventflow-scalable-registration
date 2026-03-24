import EventCard from './EventCard';

export default function FeaturedEvents() {
  return (
    <section className='bg-gray-50 py-24'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='text-center mb-14'>
          <h2 className='text-3xl font-bold text-gray-900'>Featured events</h2>
          <p className='text-gray-300 mt-3'>
            Discover the most ppular tech events happening soon.
          </p>
        </div>
        <div className='grid md:grid-cols-3 gap-8'>
          <EventCard
            title='Backend Scaling Conference'
            date='June 15, 2026'
            location='Bangalore'
            seats={12}
            image='https://images.unsplash.com/photo-1540575467063-178a50c2df87'
          />

          <EventCard
            title='AI & ML Summit'
            date='July 2, 2026'
            location='Hyderabad'
            seats={20}
            image='https://images.unsplash.com/photo-1551836022-d5d88e9218df'
          />

          <EventCard
            title='React Global Meetup'
            date='August 10, 2026'
            location='Mumbai'
            seats={5}
            image='https://images.unsplash.com/photo-1505373877841-8d25f7d46678'
          />
        </div>
        <div className='text-center mt-12'>
          <a
            href='/events'
            className='text-indigo-600 font-semibold hover:underline'
          >
            View All Events →
          </a>
        </div>
      </div>
    </section>
  );
}
