'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signup } from '@/src/services/authService';

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password) {
      alert('Fill all fields');
      return;
    }
    const res = await signup(form.name, form.email, form.password);
    localStorage.setItem('user', JSON.stringify(form));

    if (res.success) {
      alert('Signup successful');
      router.push('/login');
    } else {
      alert(res.message);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='bg-white p-8 rounded-xl shadow-md w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-6 text-center'>Create Account</h2>

        <input
          name='name'
          placeholder='Full Name'
          onChange={handleChange}
          className='w-full mb-4 p-3 border rounded-lg'
        />

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
          onClick={handleSignup}
          className='w-full bg-indigo-600 text-white py-3 rounded-lg'
        >
          Sign Up
        </button>

        <p className='text-sm text-center mt-4'>
          Already have an account?{' '}
          <span
            onClick={() => router.push('/login')}
            className='text-indigo-600 cursor-pointer'
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
