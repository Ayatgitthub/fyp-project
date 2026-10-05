import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import API from '../axiosConfig';
import { SURAHS } from '../constants/surahs';

const DiseaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [disease, setDisease] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDisease = async () => {
      try {
        const response = await API.get(`/diseases/${id}`);
        setDisease(response.data);
      } catch (error) {
        // Fallback to localStorage if backend API isn't running
        const localDiseases = JSON.parse(localStorage.getItem("diseases")) || [];
        const found = localDiseases.find(d => String(d.disease_id) === String(id) || String(d.id) === String(id) || d.name?.toLowerCase() === id?.toLowerCase());
        if (found) {
          setDisease(found);
        } else {
          // Check if default mock matches
          setDisease({
            name: id ? id.charAt(0).toUpperCase() + id.slice(1).replace('_', ' ') : 'Condition',
            category: 'general',
            surah_id: 1,
            ayat_from: 1,
            ayat_to: 7,
            recitation_count: 7,
            description: "Spiritual healing treatment prescribed through authentic Quranic recitation and Sunnah supplications."
          });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDisease();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ p: 5, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!disease) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5">Disease not found</Typography>
        <Button onClick={() => navigate('/app/diseases')} sx={{ mt: 2 }} variant="contained">
          Back to Diseases
        </Button>
      </Box>
    );
  }

  // Find surah name
  const surah = SURAHS.find(s => s.surah_id === Number(disease.surah_id));
  const surahName = surah ? surah.EnglishName : `Surah ${disease.surah_id || 1}`;


  const handleStartSingleTreatment = (recitationTitle, count) => {
    const existing = JSON.parse(localStorage.getItem("treatments")) || [];
    const newId = existing.length + 1;

    const newTreatment = {
      treatment_id: newId,
      EnglishName: surahName,
      ayat_from: disease.ayat_from || 1,
      ayat_to: disease.ayat_to || 7,
      disease_name: `${disease.name} (${recitationTitle})`,
      recitation_count: count || disease.recitation_count || 7,
      completed_count: 0,
      status: 'in_progress',
      verses: [
        {
          ayah_id: `${surahName} ${disease.ayat_from || 1}-${disease.ayat_to || 7}`,
          arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ'
        }
      ]
    };

    localStorage.setItem("treatments", JSON.stringify([...existing, newTreatment]));
    navigate('/app/treatments');
  };

  const handleOpenInCounter = (title, count, arabic) => {
    const existing = JSON.parse(localStorage.getItem('custom_counters')) || [];
    const newCounter = {
      id: `counter-${Date.now()}`,
      title: `${disease.name}: ${title}`,
      arabic: arabic || '',
      target: count || 7,
      current: 0,
      cycles: 0
    };
    localStorage.setItem('custom_counters', JSON.stringify([newCounter, ...existing]));
    navigate('/app/counters');
  };

  return (
    <Box sx={{ p: 1 }}>
      {/* Header with Back Button */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
        <IconButton onClick={() => navigate('/app/diseases')} color="primary">
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
            {disease.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Category: {disease.category || 'General Health'}
          </Typography>
        </Box>
      </Box>

      {/* Description */}
      {disease.description && (
        <Alert severity="info" sx={{ mb: 4, borderRadius: 3 }}>
          {disease.description}
        </Alert>
      )}

      {/* Chain of Duas Fast Launcher Banner */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 3.5,
          background: 'linear-gradient(135deg, #0d472c 0%, #1c6643 100%)',
          color: '#ffffff',
          boxShadow: '0 6px 20px rgba(13, 71, 44, 0.25)'
        }}
      >
        <CardContent sx={{ p: 3.5 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Chip
                label="Recommended Spiritual Treatment"
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 'bold', mb: 1.5 }}
              />
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                Complete Chain of Duas for {disease.name}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Recite the structured sequence: Opening Durood ➔ Quranic Shifa Verses ➔ Prophetic Healing Supplication ➔ Closing Salawat.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<FormatListNumberedIcon />}
                onClick={() => navigate('/app/chain')}
                sx={{
                  bgcolor: '#FFB300',
                  color: '#0d472c',
                  fontWeight: 'bold',
                  borderRadius: 3,
                  px: 3,
                  py: 1.5,
                  '&:hover': { bgcolor: '#FFA000' }
                }}
              >
                Launch Chain Wazifa
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Multiple Duas Section Header */}
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
        Available Duas & Quranic Verses for this Condition
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        You can recite individual duas below, track them in digital counters, or launch full treatment sessions.
      </Typography>

      <Grid container spacing={3}>
        {/* Dua 1: Primary Quranic Verse */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e0e0e0', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ p: 3.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Chip label="Dua #1: Primary Quranic Verse" color="primary" size="small" sx={{ fontWeight: 'bold' }} />
                <Chip label={`${disease.recitation_count || 7}x Recitations`} size="small" variant="outlined" />
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                {surahName}, Ayat: {disease.ayat_from || 1} - {disease.ayat_to || 7}
              </Typography>

              <Box sx={{ p: 2.5, bgcolor: 'rgba(13, 71, 44, 0.03)', borderRadius: 2, my: 2, direction: 'rtl', textAlign: 'right' }}>
                <Typography variant="h5" sx={{ fontFamily: "'Amiri', serif", color: '#0d472c', lineHeight: 1.9 }}>
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', direction: 'ltr', textAlign: 'left', mt: 1 }}>
                  "And when I am ill, it is He who cures me." (Surah Ash-Shu'ara [26:80])
                </Typography>
              </Box>

              <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<PlayArrowIcon />}
                  onClick={() => handleStartSingleTreatment(`Quranic Ayat (${surahName})`, disease.recitation_count || 7)}
                  sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
                >
                  Start Treatment
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<TouchAppIcon />}
                  onClick={() => handleOpenInCounter(`Quranic Ayat (${surahName})`, disease.recitation_count || 7, 'وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ')}
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                  Count in Tasbeeh
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
};

export default DiseaseDetail;
