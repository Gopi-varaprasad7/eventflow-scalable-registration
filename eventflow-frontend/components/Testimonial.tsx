'use client';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Rahul Sharma',
      location: 'Hyderabad',
      text: 'EventFlow made it super easy to find and register for marathons. Amazing experience!',
    },
    {
      name: 'Priya Reddy',
      location: 'Bangalore',
      text: 'I loved how smooth the registration process was. Highly recommended!',
    },
    {
      name: 'Arjun Mehta',
      location: 'Chennai',
      text: 'Best platform for fitness events. Clean UI and great events!',
    },
  ];
  return (
    <section className='py-20 bg-gray-50'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='text-center mb-14'>
          <h2 className='text-4xl text-gray-900 font-bold'>
            Loved by Thousands of Participants
          </h2>
          <p className='text-gray-600 mt-4'>
            See what people are saying about EventFlow
          </p>
        </div>
        <div className='grid md:grid-cols-3 gap-8'>
          {testimonials.map((t, index) => (
            <div
              key={index}
              className='bg-white/70 backdrop-blur-lg p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-2 transition duration-300 border border-gray-100'
            >
              <div className='text-yellow-400 mb-3 text-lg'>⭐️⭐️⭐️⭐️⭐️</div>
              <p className='text-gray-700 mb-4'>{t.text}</p>
              <div className='font-semibold text-gray-900'>{t.name}</div>
              <div className='text-sm text-gray-500'>{t.location}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
