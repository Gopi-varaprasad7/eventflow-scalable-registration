export default function Stats() {
  return (
    <section className='bg-white py-20'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-10 text-center hover:scale-105 transition'>
          <div>
            <h2 className='text-4xl font-bold text-indigo-600'>10K+</h2>
            <p className='mt-2 text-gray-600'>Developers</p>
          </div>

          <div>
            <h2 className='text-4xl font-bold text-indigo-600'>500+</h2>
            <p className='mt-2 text-gray-600'>Events</p>
          </div>

          <div>
            <h2 className='text-4xl font-bold text-indigo-600'>50+</h2>
            <p className='mt-2 text-gray-600'>Cities</p>
          </div>

          <div>
            <h2 className='text-4xl font-bold text-indigo-600'>100+</h2>
            <p className='mt-2 text-gray-600'>Organizers</p>
          </div>
        </div>
      </div>
    </section>
  );
}
