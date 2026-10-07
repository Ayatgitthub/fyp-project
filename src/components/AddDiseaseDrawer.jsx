import React, { useEffect, useState } from 'react';
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
import { useDb } from '../context/DbContext';

// const categories = [
//   { title: "Cold", value: "cold" },
//   { title: "Flu", value: "flu" },
//   { title: "Fever", value: "fever" },
//   { title: "Cough", value: "cough" },
//   { title: "Headache", value: "headache" },
//   { title: "Toothache", value: "toothache" },
//   { title: "Ear Infection", value: "ear_infection" },
//   { title: "Sore Throat", value: "sore_throat" },
//   { title: "Diarrhea", value: "diarrhea" },
//   { title: "Constipation", value: "constipation" },
//   { title: "Vomiting", value: "vomiting" },
//   { title: "Skin Rash", value: "skin_rash" },
//   { title: "Allergy", value: "allergy" },
//   { title: "Acne", value: "acne" },
//   { title: "Pink Eye", value: "pink_eye" },

//   { title: "Diabetes", value: "diabetes" },
//   { title: "Asthma", value: "asthma" },
//   { title: "Hypertension", value: "hypertension" },
//   { title: "Migraine", value: "migraine" },
//   { title: "Depression", value: "depression" },
//   { title: "Anxiety Disorder", value: "anxiety_disorder" },
//   { title: "Tuberculosis", value: "tuberculosis" },
//   { title: "Malaria", value: "malaria" },
//   { title: "Dengue Fever", value: "dengue_fever" },
//   { title: "Hepatitis", value: "hepatitis" },
//   { title: "Pneumonia", value: "pneumonia" },
//   { title: "Bronchitis", value: "bronchitis" },
//   { title: "Arthritis", value: "arthritis" },
//   { title: "Osteoporosis", value: "osteoporosis" },
//   { title: "Obesity", value: "obesity" },
//   { title: "Insomnia", value: "insomnia" },
//   { title: "Eczema", value: "eczema" },
//   { title: "Psoriasis", value: "psoriasis" },
//   { title: "Chickenpox", value: "chickenpox" },
//   { title: "Measles", value: "measles" },
//   { title: "Mumps", value: "mumps" },
//   { title: "Typhoid", value: "typhoid" },
//   { title: "Cholera", value: "cholera" },
//   { title: "Appendicitis", value: "appendicitis" },
//   { title: "Kidney Stones", value: "kidney_stones" }
// ];

const AddDiseaseDrawer = ({ open, onClose }) => {
  const { db, dbError } = useDb();
  
  const [fetchedSurahs, setFetchedSurahs] = useState([]);
  const [fetchedHadiths, setFetchedHadiths] = useState([]);
  const [fetchedDuroods, setFetchedDuroods] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    description: '',
    items: []
  });

  useEffect(() => {
    if (db) {
      try {
        const result = db.exec("SELECT Id, Name, ImagePath FROM Category");
        if (result.length > 0 && result[0].values.length > 0) {
          const fetchedCategories = result[0].values.map((row) => ({
            id: row[0],
            title: row[1],
            value: row[1] ? row[1].toLowerCase().replace(/\s+/g, "_") : "",
            imageUrl: row[2],
          }));
          setCategories(fetchedCategories);
        }

        const surahResult = db.exec("SELECT Id, surah_names FROM surahs");
        if (surahResult.length > 0 && surahResult[0].values.length > 0) {
          const surahsData = surahResult[0].values.map((row) => ({
            surah_id: row[0],
            EnglishName: row[1]
          }));
          setFetchedSurahs(surahsData);
        }

        try {
          const hadithResult = db.exec("SELECT Id, Name FROM hadiths");
          if (hadithResult.length > 0 && hadithResult[0].values.length > 0) {
            setFetchedHadiths(hadithResult[0].values.map((row) => ({ id: row[0], title: row[1] })));
          }
        } catch (e) {
          console.warn("hadiths table might not exist yet");
        }

        try {
          const duroodResult = db.exec("SELECT Id, Name FROM duroods");
          if (duroodResult.length > 0 && duroodResult[0].values.length > 0) {
            setFetchedDuroods(duroodResult[0].values.map((row) => ({ id: row[0], title: row[1] })));
          }
        } catch (e) {
          console.warn("duroods table might not exist yet");
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  }, [db]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddItem = (type) => {
    setFormData({
      ...formData,
      items: [
        ...formData.items, 
        { type, itemId: '', count: '', ayat_from: '', ayat_to: '' }
      ]
    });
  };

  const handleRemoveItem = (index) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData({ ...formData, items: newItems });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.items.length === 0) {
      alert("Please add at least one surah, hadith, or durood.");
      return;
    }

    try {
      const existingData = JSON.parse(localStorage.getItem("diseases")) || [];
      const updatedData = [...existingData, formData];

      localStorage.setItem("diseases", JSON.stringify(updatedData));
      console.log("Saved Data:", updatedData);

      setFormData({
        name: '',
        category_id: '',
        description: '',
        items: []
      });

      alert("Disease added successfully");
      onClose();

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
            name="category_id"
            value={formData.category_id}
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

          <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>Treatment Items</Typography>
          
          {formData.items.map((item, index) => (
            <Box key={index} sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2, position: 'relative' }}>
              <IconButton 
                size="small" 
                onClick={() => handleRemoveItem(index)} 
                sx={{ position: 'absolute', top: 5, right: 5 }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
              
              <Typography variant="subtitle2" sx={{ mb: 2, textTransform: 'capitalize' }}>
                {item.type}
              </Typography>

              <Stack spacing={2}>
                <TextField
                  select
                  fullWidth
                  label={`Select ${item.type}`}
                  value={item.itemId}
                  onChange={(e) => handleItemChange(index, 'itemId', e.target.value)}
                  variant="outlined"
                  size="small"
                  required
                >
                  {item.type === 'surah' && fetchedSurahs.map((s) => (
                    <MenuItem key={s.surah_id} value={s.surah_id}>{s.EnglishName}</MenuItem>
                  ))}
                  {item.type === 'hadith' && fetchedHadiths.map((h) => (
                    <MenuItem key={h.id} value={h.id}>{h.title}</MenuItem>
                  ))}
                  {item.type === 'durood' && fetchedDuroods.map((d) => (
                    <MenuItem key={d.id} value={d.id}>{d.title}</MenuItem>
                  ))}
                </TextField>

                <CustomInput
                  label="Recitation Count"
                  type="number"
                  value={item.count}
                  onChange={(e) => handleItemChange(index, 'count', e.target.value)}
                  placeholder="e.g. 11"
                  required
                />

                {item.type === 'surah' && (
                  <Stack direction="row" spacing={2}>
                    <CustomInput
                      label="Ayat From"
                      type="number"
                      value={item.ayat_from}
                      onChange={(e) => handleItemChange(index, 'ayat_from', e.target.value)}
                      placeholder="e.g. 1"
                    />
                    <CustomInput
                      label="Ayat To"
                      type="number"
                      value={item.ayat_to}
                      onChange={(e) => handleItemChange(index, 'ayat_to', e.target.value)}
                      placeholder="e.g. 10"
                    />
                  </Stack>
                )}
              </Stack>
            </Box>
          ))}

          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Button variant="outlined" size="small" onClick={() => handleAddItem('surah')}>+ Surah</Button>
            <Button variant="outlined" size="small" onClick={() => handleAddItem('hadith')}>+ Hadith</Button>
            <Button variant="outlined" size="small" onClick={() => handleAddItem('durood')}>+ Durood</Button>
          </Stack>

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
