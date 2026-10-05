import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const CustomInput = ({ label, type = 'text', ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const currentType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', mb: 2 }}>
      {label && (
        <Typography variant="body2" sx={{ mb: '10px' }}>
          {label}
        </Typography>
      )}
      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <Box
          component="input"
          type={currentType}
          sx={{
            width: '100%',
            borderRadius: '8px',
            padding: '14px 16px',
            fontSize: '16px',
            border: '1px solid #ccc',
            outline: 'none',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
            '&:focus': {
              borderColor: 'primary.main',
              borderWidth: '2px',
              padding: '13px 15px', // Adjust padding to balance 2px border visually
            },
            ...(isPassword && { paddingRight: '48px' }),
          }}
          {...props}
        />
        {isPassword && (
          <IconButton
            onClick={() => setShowPassword(!showPassword)}
            edge="end"
            sx={{ position: 'absolute', right: '12px' }}
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default CustomInput;
