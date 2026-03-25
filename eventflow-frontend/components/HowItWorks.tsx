import { Search, Ticket, CalendarCheck } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icons: <Search size={28} />,
      title: 'Discover Events',
      disc: 'Find marathons,walkathons and cycling events near you.',
    },
    {
      icons: <Ticket size={28} />,
      title: 'Register Instantly',
      disc: 'Reserve your spot with quick and secure registration.',
    },
    {
      icons: <CalendarCheck size={28} />,
      title: 'Attend & Enjoy',
      disc: 'Receive reminders, QR tickets, and enjoy the event experience.',
    },
  ];
  return (
    <section className='py-20 bg-gray-50'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='text-center mb-14'>
          <h2 className='text-4xl font-bold text-gray-900'>
            How EventFlow Works
          </h2>
          <p className='text-gray-600 mt-4'>
            Join events in just 3 simple steps
          </p>
        </div>
        <div className='grid md:grid-cols-3 gap-8'>
          {steps.map((step, index) => (
            <div
              key={index}
              className='bg-white rounded-xl shadow-md  p-8 text-center hover:shadow-xl transition'
            >
              <div className='w-14 h-14 mx-auto flex items-center justify-center rounded bg-indigo-100 text-indigo-600 MB-6'>
                {step.icons}
              </div>
              <h3 className='text-xl font-semibold mb-3'>{step.title}</h3>
              <p className='text-gray-600 text-sm'>{step.disc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
