import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  MenuItem,
  TextField,
  Stack,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CustomInput from './CustomInput';
import API from '../axiosConfig';
import { SURAHS } from '../constants/surahs';

const categories = [
  { title: "Cold", value: "cold" },
  { title: "Flu", value: "flu" },
  { title: "Fever", value: "fever" },
  { title: "Cough", value: "cough" },
  { title: "Headache", value: "headache" },
  { title: "Toothache", value: "toothache" },
  { title: "Ear Infection", value: "ear_infection" },
  { title: "Sore Throat", value: "sore_throat" },
  { title: "Diarrhea", value: "diarrhea" },
  { title: "Constipation", value: "constipation" },
  { title: "Vomiting", value: "vomiting" },
  { title: "Skin Rash", value: "skin_rash" },
  { title: "Allergy", value: "allergy" },
  { title: "Acne", value: "acne" },
  { title: "Pink Eye", value: "pink_eye" },

  { title: "Diabetes", value: "diabetes" },
  { title: "Asthma", value: "asthma" },
  { title: "Hypertension", value: "hypertension" },
  { title: "Migraine", value: "migraine" },
  { title: "Depression", value: "depression" },
  { title: "Anxiety Disorder", value: "anxiety_disorder" },
  { title: "Tuberculosis", value: "tuberculosis" },
  { title: "Malaria", value: "malaria" },
  { title: "Dengue Fever", value: "dengue_fever" },
  { title: "Hepatitis", value: "hepatitis" },
  { title: "Pneumonia", value: "pneumonia" },
  { title: "Bronchitis", value: "bronchitis" },
  { title: "Arthritis", value: "arthritis" },
  { title: "Osteoporosis", value: "osteoporosis" },
  { title: "Obesity", value: "obesity" },
  { title: "Insomnia", value: "insomnia" },
  { title: "Eczema", value: "eczema" },
  { title: "Psoriasis", value: "psoriasis" },
  { title: "Chickenpox", value: "chickenpox" },
  { title: "Measles", value: "measles" },
  { title: "Mumps", value: "mumps" },
  { title: "Typhoid", value: "typhoid" },
  { title: "Cholera", value: "cholera" },
  { title: "Appendicitis", value: "appendicitis" },
  { title: "Kidney Stones", value: "kidney_stones" }
];

const AddDiseaseDrawer = ({ open, onClose }) => {

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    surah_id: '',
    recitation_count: '',
    ayat_from: '',
    ayat_to: '',
    description: ''
  });

  const parsedSurahs = SURAHS;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

 const handleSubmit = (e) => {
  e.preventDefault();

  try {
    // 1. Get existing data from localStorage
    const existingData = JSON.parse(localStorage.getItem("diseases")) || [];
    const updatedData = [...existingData, formData];

    // 3. Save back to localStorage
    localStorage.setItem("diseases", JSON.stringify(updatedData));

    console.log("Saved Data:", updatedData);

    // 4. Optional: reset form
    setFormData({
      name: '',
      category: '',
      surah_id: '',
      recitation_count: '',
      ayat_from: '',
      ayat_to: '',
      description: ''
    });

    alert("Disease added successfully");

  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 450 },
          p: 4,
          boxSizing: 'border-box',
          overflowX: 'hidden'
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Add New Disease
        </Typography>
        <IconButton onClick={onClose} edge="end">
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 4, width: '100%' }} />

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          overflowX: 'hidden'
        }}
      >
        <Stack spacing={2} sx={{ width: '100%' }}>
          <CustomInput
            label="Disease Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter disease name"
            required
            autoComplete="off"
          />

          <TextField
            select
            fullWidth
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            variant="outlined"
            size="small"
            required
          >
            {categories.map((cat) => (
              <MenuItem key={cat.value} value={cat.value}>
                {cat.title}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="Select Surah"
            name="surah_id"
            value={formData.surah_id}
            onChange={handleChange}
            variant="outlined"
            size="small"
            required
          >
            {parsedSurahs.map((surah) => (
              <MenuItem key={surah?.surah_id} value={surah?.surah_id}>
                {surah?.EnglishName}
              </MenuItem>
            ))}
          </TextField>

          <CustomInput
            label="Total Recitation Count"
            name="recitation_count"
            type="number"
            value={formData.recitation_count}
            onChange={handleChange}
            placeholder="e.g. 11"
            required
          />

          <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
            <CustomInput
              label="Ayat From"
              name="ayat_from"
              type="number"
              value={formData.ayat_from}
              onChange={handleChange}
              placeholder="e.g. 1"
            />
            <CustomInput
              label="Ayat To"
              name="ayat_to"
              type="number"
              value={formData.ayat_to}
              onChange={handleChange}
              variant="outlined"
              size="small"
              placeholder="e.g. 10"
            />
          </Stack>

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            variant="outlined"
            placeholder="Enter treatment description"
          />

          <Box sx={{ pt: 2, display: 'flex', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={onClose}
              sx={{ borderRadius: 2, py: 1.5, textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ borderRadius: 2, py: 1.5, textTransform: 'none' }}
            >
              Add Disease
            </Button>
          </Box>
        </Stack>
      </Box>
    </Drawer>
  );
};

export default AddDiseaseDrawer;
