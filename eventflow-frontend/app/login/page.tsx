'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

    if (
      form.email === storedUser.email &&
      form.password === storedUser.password
    ) {
      localStorage.setItem('isAuth', 'true');
      router.push('/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='bg-white p-8 rounded-xl shadow-md w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-6 text-center'>Login</h2>

        <input
          name='email'
          placeholder='Email'
          onChange={handleChange}
          className='w-full mb-4 p-3 border rounded-lg'
        />

        <input
          name='password'
          type='password'
          placeholder='Password'
          onChange={handleChange}
          className='w-full mb-6 p-3 border rounded-lg'
        />

        <button
          onClick={handleLogin}
          className='w-full bg-indigo-600 text-white py-3 rounded-lg'
        >
          Login
        </button>

        <p className='text-sm text-center mt-4'>
          Don’t have an account?{' '}
          <span
            onClick={() => router.push('/signup')}
            className='text-indigo-600 cursor-pointer'
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
