'use client';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className='w-full bg-white border-b border-gray-200 sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-6 h-16 flex items-center justify-between'>
        <Link href='/' className='text-2xl font-bold text-indigo-600'>
          EventFlow
        </Link>
        <div className='hidden md:flex items-center gap-8 text-gray-700 font-medium'>
          <Link href='/events' className='hover:text-indigo-600'>
            Events
          </Link>
          <Link href='/how-it-works' className='hover:text-indigo-600'>
            How it Works
          </Link>
          <Link href='/pricing' className='hover:text-indigo-600'>
            Pricing
          </Link>
        </div>
        <div className='hidden md:flex items-center gap-4'>
          <Link
            href='/login'
            className='text-gray-700 hover:text-indigo-600 font-medium'
          >
            Login
          </Link>
          <Link
            href='/signup'
            className='bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition'
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
