
import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  Stack,
  Divider
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CustomInput from './CustomInput';

const AddDiseaseDrawer = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    description: ''
  });

  const [imagePreview, setImagePreview] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Select image from gallery
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image.');
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const imageData = reader.result;

      setImagePreview(imageData);

      setFormData((prev) => ({
        ...prev,
        image: imageData
      }));
    };

    reader.readAsDataURL(file);
  };

  // Save disease
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Please enter disease name.');
      return;
    }

    try {
      const existingData =
        JSON.parse(localStorage.getItem('diseases')) || [];

      const newDisease = {
        id: Date.now(),
        name: formData.name.trim(),
        image: formData.image,
        description: formData.description.trim()
      };

      localStorage.setItem(
        'diseases',
        JSON.stringify([...existingData, newDisease])
      );

      alert('Disease added successfully!');

      setFormData({
        name: '',
        image: '',
        description: ''
      });

      setImagePreview('');
      onClose();

    } catch (error) {
      console.error('Error saving disease:', error);
      alert('Unable to save disease. Please try another image.');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      image: '',
      description: ''
    });

    setImagePreview('');
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleCancel}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 450 },
          p: 3,
          boxSizing: 'border-box',
          overflowY: 'auto'
        }
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Add New Disease
        </Typography>

        <IconButton onClick={handleCancel}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>

          {/* Disease Name */}
          <CustomInput
            label="Disease Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter disease name"
            required
            autoComplete="off"
          />

          {/* Gallery Image */}
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight="medium"
              sx={{ mb: 1 }}
            >
              Disease Image
            </Typography>

            {imagePreview && (
              <Box
                component="img"
                src={imagePreview}
                alt="Disease preview"
                sx={{
                  width: '100%',
                  height: 180,
                  objectFit: 'cover',
                  borderRadius: 2,
                  mb: 2,
                  border: '1px solid #ddd'
                }}
              />
            )}

            <Button
              component="label"
              variant="outlined"
              fullWidth
              startIcon={<AddPhotoAlternateIcon />}
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none'
              }}
            >
              {imagePreview ? 'Change Image' : 'Choose Image from Gallery'}

              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </Button>
          </Box>

          {/* Description */}
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            placeholder="Enter disease description"
          />

          {/* Buttons */}
          <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleCancel}
              sx={{
                borderRadius: 2,
                py: 1.5,
                textTransform: 'none'
              }}
            >
              Cancel
            </Button>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                borderRadius: 2,
                py: 1.5,
                textTransform: 'none'
              }}
            >
              Add Disease
            </Button>
          </Stack>

        </Stack>
      </Box>
    </Drawer>
  );
};

export default AddDiseaseDrawer;

