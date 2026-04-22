import EventCard from '@/components/EventCard';

interface Props {
  params: {
    id: string;
  };
}

export default function EventDetails({ params }: Props) {
  const event = {
    id: 1,
    title: 'Hyderabad Marathon 2026',
    date: 'July 12, 2026',
    location: 'Hyderabad',
    seats: 120,
    image: '/events/marathon.jpg',
    description:
      'Join one of the biggest marathons in India. Experience an energetic crowd, scenic routes, and a professionally organized race.',
  };

  const similarEvents = [
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
  ];

  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className='max-w-7xl mx-auto px-6 py-10'>
        {/* Image */}
        <img
          src={event.image}
          alt={event.title}
          className='w-full h-100 object-cover rounded-xl'
        />

        {/* Main Info */}
        <div className='mt-8 grid md:grid-cols-3 gap-8'>
          {/* Left */}
          <div className='md:col-span-2'>
            <h1 className='text-3xl font-bold text-gray-900'>{event.title}</h1>

            <p className='text-gray-600 mt-2'>
              📅 {event.date} • 📍 {event.location}
            </p>

            {/* Description */}
            <div className='mt-6'>
              <h2 className='text-xl font-semibold mb-2'>About Event</h2>

              <p className='text-gray-700'>{event.description}</p>
            </div>
          </div>

          {/* Right (Sticky Card) */}
          <div className='bg-white p-6 rounded-xl shadow-md h-fit sticky top-24'>
            <p className='text-lg font-semibold text-gray-900'>
              {event.seats} seats left
            </p>

            <button className='mt-4 w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:opacity-90 transition'>
              Register Now
            </button>
          </div>
        </div>

        {/* Details Section */}
        <div className='mt-12'>
          <h2 className='text-2xl font-bold mb-4'>Event Details</h2>

          <div className='grid md:grid-cols-3 gap-6'>
            <div className='bg-white p-4 rounded-lg shadow'>
              <p className='text-gray-500'>Date</p>
              <p className='font-semibold'>{event.date}</p>
            </div>

            <div className='bg-white p-4 rounded-lg shadow'>
              <p className='text-gray-500'>Location</p>
              <p className='font-semibold'>{event.location}</p>
            </div>

            <div className='bg-white p-4 rounded-lg shadow'>
              <p className='text-gray-500'>Seats Available</p>
              <p className='font-semibold'>{event.seats}</p>
            </div>
          </div>
        </div>

        {/* Similar Events */}
        <div className='mt-16'>
          <h2 className='text-2xl font-bold mb-6'>Similar Events</h2>

          <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-6'>
            {similarEvents.map((event) => (
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
    </div>
  );
}
