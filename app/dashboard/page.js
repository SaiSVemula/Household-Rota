'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [chores, setChores] = useState([]);
  const [user, setUser] = useState(null); // State to hold the user's name
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        router.push('/login'); // Redirect to login if not logged in
      } else {
        setUser(storedUser);
        const currentWeek = '2024-09-21'; // Example week; you can automate this
        fetch(`/api/chores?user=${storedUser}&week=${currentWeek}`)
          .then(res => res.json())
          .then(data => setChores(data.tasks || []));
      }
    }
  }, []);

  if (!user) {
    return <div>Loading...</div>; // Show a loading message until the user is set
  }

  return (
    <div>
      <h1>{user}'s Chores for This Week</h1>
      <ul>
        {chores.map((chore, index) => (
          <li key={index}>
            <input type="checkbox" /> {chore}
          </li>
        ))}
      </ul>
    </div>
  );
}
