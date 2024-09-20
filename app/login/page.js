'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    localStorage.setItem('user', name); // Save the user's name to localStorage
    router.push('/dashboard'); // Redirect to the dashboard
  };

  return (
    <div>
      <h1>Login</h1>
      <select onChange={(e) => setName(e.target.value)}>
        <option value="">Select Your Name</option>
        <option value="Alfie">Alfie</option>
        <option value="Kishan">Kishan</option>
        <option value="Sandeep">Sandeep</option>
      </select>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
