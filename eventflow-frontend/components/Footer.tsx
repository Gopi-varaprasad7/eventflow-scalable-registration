export default function Footer() {
  return (
    <footer className='bg-gray-900 text-gray-300 py-14'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='grid md:grid-cols-4 gap-10'>
          {/* Brand */}
          <div>
            <h2 className='text-2xl font-bold text-white mb-4'>EventFlow</h2>

            <p className='text-sm text-gray-400'>
              Discover and join amazing fitness events like marathons,
              walkathons, and cycling experiences near you.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='text-white font-semibold mb-4'>Quick Links</h3>

            <ul className='space-y-2'>
              <li className='hover:text-white cursor-pointer'>Home</li>
              <li className='hover:text-white cursor-pointer'>Events</li>
              <li className='hover:text-white cursor-pointer'>Create Event</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className='text-white font-semibold mb-4'>Support</h3>

            <ul className='space-y-2'>
              <li className='hover:text-white cursor-pointer'>Help Center</li>
              <li className='hover:text-white cursor-pointer'>Contact</li>
              <li className='hover:text-white cursor-pointer'>
                Privacy Policy
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className='text-white font-semibold mb-4'>Stay Updated</h3>

            <p className='text-sm text-gray-400 mb-4'>
              Get latest events and updates directly in your inbox.
            </p>

            <div className='flex'>
              <input
                type='email'
                placeholder='Your email'
                className='w-full px-3 py-2 rounded-l-lg bg-gray-800 text-white outline-none'
              />

              <button className='bg-indigo-600 px-4 py-2 rounded-r-lg hover:bg-indigo-700 transition'>
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className='border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500'>
          © {new Date().getFullYear()} EventFlow. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
