'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
  const [completedChores, setCompletedChores] = useState([]); // Track completed chores
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

  // Toggle chore completion
  const toggleChore = (index) => {
    setCompletedChores((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  if (!user || !currentWeek) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;  // Display error message if there's an error
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{user}&#39;s Chores for the Week of {currentWeek}</h1>
      <ul style={styles.list}>
        {chores.length > 0 ? (
          chores.map((chore, index) => (
            <li
              key={index}
              style={{
                ...styles.listItem,
                backgroundColor: completedChores.includes(index)
                  ? styles.listItemHover.backgroundColor
                  : styles.listItem.backgroundColor,
                color: completedChores.includes(index)
                  ? styles.listItemHover.color
                  : styles.listItem.color,
                textDecoration: completedChores.includes(index)
                  ? 'line-through'
                  : 'none',
              }}
              onClick={() => toggleChore(index)} // Mark chore as complete
              onMouseEnter={(e) => {
                if (!completedChores.includes(index)) {
                  e.currentTarget.style.backgroundColor =
                    styles.listItemHover.backgroundColor;
                  e.currentTarget.style.color = styles.listItemHover.color;
                }
              }}
              onMouseLeave={(e) => {
                if (!completedChores.includes(index)) {
                  e.currentTarget.style.backgroundColor =
                    styles.listItem.backgroundColor;
                  e.currentTarget.style.color = styles.listItem.color;
                }
              }}
            >
              <span style={styles.chore}>{chore}</span>
            </li>
          ))
        ) : (
          <li style={styles.noChores}>No chores assigned for this week.</li>
        )}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f7f7f7', // Light background for contrast
    padding: '20px',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#333', // Dark font color for visibility
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    borderBottom: '2px solid #333',
    paddingBottom: '10px',
  },
  list: {
    listStyle: 'none', // Remove bullets
    padding: 0,
    margin: 0,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center', // Center the chores
    gap: '20px', // Add spacing between the bubbles
    width: '100%',
  },
  listItem: {
    backgroundColor: '#e0e0e0', // Light grey for the bubble
    padding: '15px 20px',
    borderRadius: '50px', // Make it a bubble shape
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Soft shadow for the bubble
    fontSize: '16px',
    transition: 'background-color 0.3s, color 0.3s, text-decoration 0.3s',
    cursor: 'pointer',
    textAlign: 'center',
    width: 'fit-content',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#333', // Default text color
  },
  chore: {
    fontWeight: 'bold',
    color: '#333', // Dark text color by default
  },
  noChores: {
    padding: '10px',
    fontSize: '18px',
    color: '#999', // Lighter color for no chores message
  },
  listItemHover: {
    backgroundColor: '#fff', // Dark background on hover
    color: '#fff', // White text on hover
  },
};
