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

const AddDiseaseDrawer = ({ open, onClose, selectedCategory = null, onDiseaseAdded = null }) => {
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

  // Select image from gallery with compression to keep localStorage lean
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const imageData = reader.result;

      // Compress image using canvas
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const maxDim = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.8);

          setImagePreview(compressed);
          setFormData((prev) => ({
            ...prev,
            image: compressed
          }));
        } catch {
          setImagePreview(imageData);
          setFormData((prev) => ({
            ...prev,
            image: imageData
          }));
        }
      };

      img.onerror = () => {
        setImagePreview(imageData);
        setFormData((prev) => ({
          ...prev,
          image: imageData
        }));
      };

      img.src = imageData;
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setFormData((prev) => ({
      ...prev,
      image: ''
    }));
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

      const diseaseId = Date.now();
      const trimmedName = formData.name.trim();
      const value = trimmedName.toLowerCase().replace(/\s+/g, '_');
      const defaultPlaceholder =
        'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80';

      const finalImage = formData.image || defaultPlaceholder;
      const categoryVal = selectedCategory ? selectedCategory.value : value;

      const newDisease = {
        id: diseaseId,
        disease_id: diseaseId,
        name: trimmedName,
        title: trimmedName,
        image: finalImage,
        imageUrl: finalImage,
        description: formData.description.trim(),
        value: value,
        category: categoryVal,
        category_id: categoryVal,
        category_title: selectedCategory ? selectedCategory.title : trimmedName,
        isCustom: true,
        items: [
          {
            type: 'surah',
            itemId: 1, // Surah Al-Fatiha (Al-Shifa)
            count: 7,
            ayat_from: 1,
            ayat_to: 7
          }
        ],
        recitation_count: 7,
        createdAt: new Date().toISOString()
      };

      const updatedData = [newDisease, ...existingData];
      localStorage.setItem('diseases', JSON.stringify(updatedData));

      alert('Disease added successfully!');

      setFormData({
        name: '',
        image: '',
        description: ''
      });
      setImagePreview('');

      if (onDiseaseAdded) {
        onDiseaseAdded(newDisease);
      }
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
          width: { xs: '100%', sm: 460 },
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
          {selectedCategory ? `Add Disease to ${selectedCategory.title}` : 'Add New Disease'}
        </Typography>

        <IconButton onClick={handleCancel}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>

          {/* 1. Disease Name */}
          <CustomInput
            label="Disease Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter disease name"
            required
            autoComplete="off"
          />

          {/* 2. Disease Image (Choose from gallery) */}
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight="medium"
              sx={{ mb: 1 }}
            >
              Disease Image
            </Typography>

            {imagePreview && (
              <Box sx={{ position: 'relative', mb: 2 }}>
                <Box
                  component="img"
                  src={imagePreview}
                  alt="Disease preview"
                  sx={{
                    width: '100%',
                    height: 180,
                    objectFit: 'cover',
                    borderRadius: 2,
                    border: '1px solid #ddd',
                    display: 'block'
                  }}
                />
                <IconButton
                  size="small"
                  onClick={handleRemoveImage}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    color: '#fff',
                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.8)' }
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            )}

            <Button
              component="label"
              variant="outlined"
              fullWidth
              startIcon={<AddPhotoAlternateIcon />}
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              {imagePreview ? 'Change Image from Gallery' : 'Choose Image from Gallery'}

              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </Button>
          </Box>

          {/* 3. Description */}
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight="medium"
              sx={{ mb: 1 }}
            >
              Description
            </Typography>
            <TextField
              fullWidth
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              placeholder="Enter disease description"
              variant="outlined"
            />
          </Box>

          {/* 4. Action Buttons (Cancel and Add Disease) */}
          <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleCancel}
              sx={{
                borderRadius: 2,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 'bold'
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
                textTransform: 'none',
                fontWeight: 'bold'
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
