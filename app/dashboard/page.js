'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SpeedInsights } from "@vercel/speed-insights/next"

// Function to get the previous Saturday's date in DD/MM/YYYY format
function getPreviousSaturday() {
  const today = new Date();
  const dayOfWeek = today.getDay();  // 0 is Sunday, 1 is Monday, etc.
  const diff = today.getDate() - dayOfWeek - 1;  // Calculate the difference to get the previous Saturday
  const saturday = new Date(today.setDate(diff));
  const day = String(saturday.getDate()).padStart(2, '0');
  const month = String(saturday.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = saturday.getFullYear();
  return `${day}/${month}/${year}`; // Return in DD/MM/YYYY format
}

export default function Dashboard() {
  const [chores, setChores] = useState([]);
  const [currentWeek, setCurrentWeek] = useState('');  // Store the calculated current week
  const [user, setUser] = useState(null);  // State to hold the user's name
  const [error, setError] = useState(null);  // State to track any error
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        router.push('/login');  // Redirect to login if not logged in
      } else {
        const currentWeekStart = getPreviousSaturday();  // Automatically calculate the current week starting date
        setCurrentWeek(currentWeekStart);  // Store the calculated week
        setUser(storedUser);
        console.log('User:', storedUser);
        console.log('Current week:', currentWeekStart);

        // debug static values
        // const suser = 'Sandeep'; 
        // const sweek = '21/09/2024';
        fetch(`/api/chores?user=${storedUser}&week=${currentWeekStart}`)
          .then(res => {
            if (!res.ok) {
              throw new Error(`Failed to fetch chores. Status: ${res.status}`);
            }
            return res.json();
          })
          .then(data => {
            console.log('Chores fetched:', data);
            setChores(data.tasks || []);
          })
          .catch(err => {
            console.error('Error fetching chores:', err);
            setError(err.message);  // Store the error message
          });
      }
    }
  }, [router]);

  if (!user || !currentWeek) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;  // Display error message if there's an error
  }

  return (
    <div>
      <h1>{user}&#39;s Chores for the Week of {currentWeek}</h1>
      <ul>
        {chores.length > 0 ? (
          chores.map((chore, index) => (
            <li key={index}>
              <input type="checkbox" /> {chore}
            </li>
          ))
        ) : (
          <li>No chores assigned for this week.</li>
        )}
      </ul>
    </div>
  );
}
