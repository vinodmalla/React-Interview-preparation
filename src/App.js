import React from 'react';
import Jscsshtml from './Jscsshtml';
import ReactInterviewQuestions from './ReactInterviewQuestions';
import Backend from './Backend';
import { createBrowserRouter, Outlet, NavLink } from 'react-router-dom';

export default function App() {
  const styles = {
    container: {
      textAlign: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#0c0c1e"',
      minHeight: '100vh',
    },
    heading: {
      marginBottom: '20px',
      color: '#333',
    },
    nav: {
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
      marginBottom: '30px',
      background: '#0c0c1e"',
      padding: '15px',
      borderRadius: '12px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
    },
    link: {
      textDecoration: 'none',
      color: '#fff',
      backgroundColor: '#4f46e5',
      padding: '10px 18px',
      borderRadius: '8px',
      fontWeight: '500',
      transition: '0.3s',
    },
    activeLink: {
      backgroundColor: '#1e1b4b',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Interview Questions and Answers</h1>

      <nav style={styles.nav}>
        <NavLink
          to="/react"
          style={({ isActive }) =>
            isActive
              ? { ...styles.link, ...styles.activeLink }
              : styles.link
          }
        >
          React
        </NavLink>

        <NavLink
          to="/jscsshtml"
          style={({ isActive }) =>
            isActive
              ? { ...styles.link, ...styles.activeLink }
              : styles.link
          }
        >
          JS, CSS, HTML
        </NavLink>
        <NavLink
          to="/backend"
          style={({ isActive }) =>
            isActive
              ? { ...styles.link, ...styles.activeLink }
              : styles.link
          }
        >
          Backend
        </NavLink>

      </nav>

      <Outlet />
    </div>
  );
}

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'react',
        element: <ReactInterviewQuestions />,
      },
      {
        path: 'jscsshtml',
        element: <Jscsshtml />,
      },
      {
        path: 'backend',
        element: <Backend />,
      }
    ],
  },
]);