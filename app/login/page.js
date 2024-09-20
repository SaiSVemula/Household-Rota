'use client';

import { useState } from 'react';
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

export default function Login() {
  const [error, setError] = useState('');
  const router = useRouter();
  const currentWeekStart = getPreviousSaturday();

  const handleLogin = (name) => {
    localStorage.setItem('user', name); // Save the user's name to localStorage
    router.push('/dashboard'); // Redirect to the dashboard
  };

  return (
    <div style={styles.container}>
      {/* <h1 style={styles.title}>Rota for this week {currentWeekStart}</h1> */}
      <h1 style={styles.title}>Select</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message if necessary */}
      <div style={styles.buttonContainer}>
        <button
          style={styles.button}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = styles.buttonHover.backgroundColor;
            e.target.style.color = styles.buttonHover.color;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = styles.button.backgroundColor;
            e.target.style.color = styles.button.color;
          }}
          onClick={() => handleLogin('Alfie')}
        >
          Alfie
        </button>
        <button
          style={styles.button}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = styles.buttonHover.backgroundColor;
            e.target.style.color = styles.buttonHover.color;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = styles.button.backgroundColor;
            e.target.style.color = styles.button.color;
          }}
          onClick={() => handleLogin('Kishan')}
        >
          Kishan
        </button>
        <button
          style={styles.button}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = styles.buttonHover.backgroundColor;
            e.target.style.color = styles.buttonHover.color;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = styles.button.backgroundColor;
            e.target.style.color = styles.button.color;
          }}
          onClick={() => handleLogin('Sandeep')}
        >
          Sandeep
        </button>
      </div>
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
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '20px',
    color: '#333', // Dark font color for visibility
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    borderBottom: '2px solid #333',
    paddingBottom: '10px',
  },
  buttonContainer: {
    display: 'flex',
    gap: '20px',
    marginTop: '20px',
  },
  button: {
    padding: '10px 30px',
    fontSize: '18px',
    cursor: 'pointer',
    border: '2px solid #333',
    borderRadius: '10px',
    backgroundColor: '#f0f0f0', // Light background by default
    color: '#333', // Dark text color by default
    transition: 'background-color 0.3s, color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#333', // Dark background on hover
    color: '#fff', // White text color on hover
  },
};
