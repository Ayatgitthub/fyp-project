import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import API from '../axiosConfig';
import hero from '../assets/hero.png'; // Using hero.png as a placeholder for the circular image
import logo from '../assets/logo.png'; // Fallback just in case

const Splash = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleStart = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('token', 'dummy-token');
      setLoading(false);
      navigate('/app/dashboard');
    }, 500);
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#0B5E4C', // Dark green background matching the photo
      p: 2,
      boxSizing: 'border-box'
    }}>
      
      {/* Circular Image Container */}
      <Box sx={{
        width: 180,
        height: 180,
        borderRadius: '50%',
        overflow: 'hidden',
        border: '4px solid white',
        mb: 4,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        boxShadow: '0px 4px 15px rgba(0,0,0,0.3)'
      }}>
        {/* We use hero image, fallback to logo if it doesn't look right, or objectFit cover */}
        <img 
          src={hero || logo}
          alt="Quranic Cure" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          onError={(e) => { e.target.src =logo ; }}
        />
      </Box>

      {/* Title */}
      <Typography variant="h4" sx={{ 
        color: '#ffffff', 
        fontWeight: 'bold', 
        mb: 1,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}>
        Quranic Cure
      </Typography>

      {/* Subtitle */}
      <Typography variant="body1" sx={{ 
        color: '#e0e0e0', 
        mb: 8,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}>
        Healing through Recitation
      </Typography>

      {/* Start Button */}
      <Button 
        onClick={handleStart}
        disabled={loading}
        sx={{
          backgroundColor: '#FFB300', // Yellow/Orange button
          color: '#0B5E4C', // Dark text
          fontWeight: 'bold',
          fontSize: '1.1rem',
          padding: '12px 48px',
          borderRadius: '30px',
          textTransform: 'none',
          boxShadow: '0px 4px 10px rgba(0,0,0,0.2)',
          '&:hover': {
            backgroundColor: '#FFA000',
          }
        }}
      >
        {loading ? 'STARTING...' : 'START'}
      </Button>

    </Box>
  );
};

export default Splash;
