'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to the login page
    router.push('/login');
  }, []);

  return null; // Render nothing since it's a redirect
}
