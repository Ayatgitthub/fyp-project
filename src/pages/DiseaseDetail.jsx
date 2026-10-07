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
import { useDb } from '../context/DbContext';
// import { fetchedSurahs } from '../constants/surahs';

const DiseaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { db, dbError } = useDb();

  const [disease, setDisease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchedSurahs, setFetchedSurahs] = useState([]);
  const [fetchedHadiths, setFetchedHadiths] = useState([]);
  const [fetchedDuroods, setFetchedDuroods] = useState([]);

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
            items: [
              { type: 'surah', itemId: 1, ayat_from: 1, ayat_to: 7, count: 7 }
            ],
            description: "Spiritual healing treatment prescribed through authentic Quranic recitation and Sunnah supplications."
          });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDisease();
  }, [id]);

  useEffect(() => {
    if (db) {
      try {
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
        } catch (e) {}

        try {
          const duroodResult = db.exec("SELECT Id, Name FROM duroods");
          if (duroodResult.length > 0 && duroodResult[0].values.length > 0) {
            setFetchedDuroods(duroodResult[0].values.map((row) => ({ id: row[0], title: row[1] })));
          }
        } catch (e) {}

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  }, [db]);

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

  const items = disease.items || [];
  if (items.length === 0 && disease.surah_id) {
    // Backward compatibility for old disease structure
    items.push({
      type: 'surah',
      itemId: disease.surah_id,
      count: disease.recitation_count || 7,
      ayat_from: disease.ayat_from || 1,
      ayat_to: disease.ayat_to || 7
    });
  }

  const handleStartSingleTreatment = (item, itemName) => {
    const existing = JSON.parse(localStorage.getItem("treatments")) || [];
    const newId = existing.length + 1;

    let verses = [];
    if (item.type === 'surah') {
      try {
        const versesResult = db.exec(
          `SELECT VerseId, AyahText FROM Quran WHERE SuraId = ? AND VerseId >= ? AND VerseId <= ?`,
          [item.itemId, item.ayat_from || 1, item.ayat_to || 7]
        );
        if (versesResult.length > 0 && versesResult[0].values.length > 0) {
          verses = versesResult[0].values.map((row) => ({
            ayah_id: row[0],
            arabic: row[1],
          }));
        } else {
          // fallback verse
          verses = [{
            ayah_id: `${itemName} ${item.ayat_from || 1}-${item.ayat_to || 7}`,
            arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ'
          }];
        }
      } catch (e) {
        verses = [{
          ayah_id: `${itemName} ${item.ayat_from || 1}-${item.ayat_to || 7}`,
          arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ'
        }];
      }
    } else {
      // For hadith and durood, provide a generic text or fetch from DB if text exists
      verses = [{
        ayah_id: `${itemName}`,
        arabic: 'Text for ' + itemName
      }];
    }

    const newTreatment = {
      treatment_id: newId,
      EnglishName: itemName,
      ayat_from: item.ayat_from,
      ayat_to: item.ayat_to,
      disease_name: `${disease.name} (${itemName})`,
      recitation_count: item.count || 7,
      completed_count: 0,
      status: 'in_progress',
      verses: verses
    };

    localStorage.setItem("treatments", JSON.stringify([...existing, newTreatment]));
    navigate('/app/treatments');
  };

  const handleOpenInCounter = (item, itemName) => {
    const existing = JSON.parse(localStorage.getItem('custom_counters')) || [];
    const newCounter = {
      id: `counter-${Date.now()}`,
      title: `${disease.name}: ${itemName}`,
      arabic: '',
      target: item.count || 7,
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

      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
        Available Duas & Quranic Verses for this Condition
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        You can recite individual duas below, track them in digital counters, or launch full treatment sessions.
      </Typography>

      <Grid container spacing={3}>
        {items.map((item, index) => {
          let itemName = "";
          if (item.type === 'surah') {
            const s = fetchedSurahs.find(s => String(s.surah_id) === String(item.itemId));
            itemName = s ? s.EnglishName : `Surah ${item.itemId}`;
          } else if (item.type === 'hadith') {
            const h = fetchedHadiths.find(h => String(h.id) === String(item.itemId));
            itemName = h ? h.title : `Hadith ${item.itemId}`;
          } else if (item.type === 'durood') {
            const d = fetchedDuroods.find(d => String(d.id) === String(item.itemId));
            itemName = d ? d.title : `Durood ${item.itemId}`;
          }

          let subText = "";
          if (item.type === 'surah') {
            subText = `Ayat: ${item.ayat_from || 1} - ${item.ayat_to || 7}`;
          }

          return (
            <Grid item xs={12} key={index}>
              <Card sx={{ borderRadius: 3, border: '1px solid #e0e0e0', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <CardContent sx={{ p: 3.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Chip label={`Dua #${index + 1}: ${item.type.charAt(0).toUpperCase() + item.type.slice(1)}`} color="primary" size="small" sx={{ fontWeight: 'bold' }} />
                    <Chip label={`${item.count || 7}x Recitations`} size="small" variant="outlined" />
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    {itemName} {subText ? `, ${subText}` : ""}
                  </Typography>

                  <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<PlayArrowIcon />}
                      onClick={() => handleStartSingleTreatment(item, itemName)}
                      sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
                    >
                      Start Treatment
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<TouchAppIcon />}
                      onClick={() => handleOpenInCounter(item, itemName)}
                      sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                      Count in Tasbeeh
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default DiseaseDetail;
