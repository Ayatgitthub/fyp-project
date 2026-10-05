import React from 'react';
import { Box, Typography, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Divider } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BookmarkIcon from '@mui/icons-material/Bookmark';

import LogoutIcon from '@mui/icons-material/Logout';
import logo from '../assets/logo.png';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Dashboard', path: '/app/dashboard', icon: <DashboardIcon /> },
    { text: 'Diseases', path: '/app/diseases', icon: <CoronavirusIcon /> },
    { text: 'Active Treatments', path: '/app/treatments', icon: <LocalHospitalIcon /> },
    { text: 'Logs', path: '/app/logs', icon: <BookmarkIcon /> },
    { text: 'Quran Tracker', path: '/app/quran-tracker', icon: <BookmarkIcon /> },
  ];

  return (
    <Box sx={{
      width: 250,
      height: '100vh',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #e0e0e0',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Section - Logo & Title */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <img src={logo} alt="Quraan Cure" style={{ width: '40px' }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          The Quraan Cure
        </Typography>
      </Box>

      <Divider />

      {/* Navigation Items */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', mt: 1 }}>
        <List>
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 1, px: 2 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: isActive ? 'primary.main' : 'transparent',
                    color: isActive ? '#fff' : 'text.primary',
                    '&:hover': {
                      backgroundColor: isActive ? 'primary.main' : 'rgba(0, 0, 0, 0.04)',
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? '#fff' : 'inherit', minWidth: '40px' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} sx={{ fontWeight: isActive ? 'bold' : 'normal', fontSize: '14px' }} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Divider />

      {/* Logout Button */}
      <Box sx={{ p: 2 }}>
        <List disablePadding>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                localStorage.removeItem('token');
                navigate('/welcome');
              }}
              sx={{
                borderRadius: 2,
                color: 'error.main',
                '&:hover': { backgroundColor: 'error.light', color: '#fff' }
              }}
            >
              <ListItemIcon sx={{ minWidth: '40px', color: 'inherit' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" sx={{ fontWeight: 'bold', fontSize: '14px' }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar;
