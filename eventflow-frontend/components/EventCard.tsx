type EventCardProps = {
  title: string;
  date: string;
  location: string;
  seats: number;
  image: string;
};

export default function EventCard({
  title,
  date,
  location,
  seats,
  image,
}: EventCardProps) {
  return (
    <div className='bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition'>
      <img src={image} alt={title} className='w-full h-48 object-cover' />

      <div className='p-5'>
        <h3 className='text-xl font-semibold text-gray-900'>{title}</h3>

        <p className='text-gray-600 mt-2'>📅 {date}</p>

        <p className='text-gray-600'>📍 {location}</p>

        <p className='text-sm text-green-600 mt-2'>{seats} seats left</p>

        <button className='mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition'>
          Register
        </button>
      </div>
    </div>
  );
}
