import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, overflowY: 'auto', backgroundColor: '#f1f4f9' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
