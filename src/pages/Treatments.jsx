import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, Card, CardContent, Grid, Divider, CircularProgress, Stack } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CancelIcon from '@mui/icons-material/Cancel';
import API from '../axiosConfig';

const Treatments = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userTreatments, setUserTreatments] = useState([]);
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [count, setCount] = useState(0);


  useEffect(() => {
    fetchUserTreatments();
    // if (location.state?.treatmentId) {
    //   handleSelectTreatment(location.state.treatmentId);
    // }
  }, []);

  const fetchUserTreatments = async () => {

    setLoading(true);
    try {
      const existingData = JSON.parse(localStorage.getItem("treatments")) || [];
      setUserTreatments(existingData);
      console.log('Fetched treatments from localStorage:', existingData);
    } catch (error) {
      console.error('Error fetching user treatments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTreatment = async (treatmentId) => {
    setDetailsLoading(true);
    try {
    const curTreatment = userTreatments.find(t => t.treatment_id === treatmentId)
      setSelectedTreatment(curTreatment);
      
      setCount(curTreatment?.completed_count || 0);
    } catch (error) {
      console.error('Error fetching treatment detail:', error);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleUpdateProgress = async (newCount, newStatus) => {
    setIsUpdating(true);
    try {
      const updatedTreatment = {
        ...selectedTreatment,
        completed_count: newCount,
        status: newCount >= selectedTreatment.recitation_count ? 'completed' : (newStatus || selectedTreatment.status)
      };
      
      // Update in local state
      setSelectedTreatment(updatedTreatment);
      setUserTreatments(prev => prev.map(t => t.treatment_id === updatedTreatment.treatment_id ? updatedTreatment : t));
      // Update in localStorage
      const existingData = JSON.parse(localStorage.getItem("treatments")) || [];
      const updatedData = existingData.map(t => t.treatment_id === updatedTreatment.treatment_id ? updatedTreatment : t);
      localStorage.setItem("treatments", JSON.stringify(updatedData));
        // setSelectedTreatment(null);
      if(newStatus === 'cancelled') {
        alert('Treatment cancelled successfully');
        setSelectedTreatment(null);
      }
        fetchUserTreatments();
      
  
    } catch (error) {
      console.error('Error updating progress:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    handleUpdateProgress(newCount);
  };

  const handleReset = () => {
    setCount(0);
    handleUpdateProgress(0);
  };

  const handleCancelTreatment = () => {
    if (window.confirm('Are you sure you want to cancel this treatment?')) {
      handleUpdateProgress(count, 'cancelled');
    }
  };

  if (loading || detailsLoading) {
    return (
      <Box sx={{ p: 5, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  // List View
  if (!selectedTreatment) {
    return (
      <Box sx={{ p: 1 }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 4 }}>
          In-Progress Treatments
        </Typography>

        {userTreatments.filter(t => t.status === 'in_progress').length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h5" color="text.secondary">No treatments in progress.</Typography>
            <Button onClick={() => navigate('/app/diseases')} sx={{ mt: 3 }} variant="contained">
              Browse Diseases
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {userTreatments.filter(t => t.status === 'in_progress').map((t) => (
              <Grid item xs={12} sm={6} md={4} key={t.treatment_id}>
                <Card
                  onClick={() => handleSelectTreatment(t.treatment_id)}
                  sx={{
                    cursor: 'pointer',
                    borderRadius: 4,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <CardContent sx={{ pb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {t.disease_name}
                    </Typography>
                    <Typography variant="subtitle2" color="primary" sx={{ mb: 2 }}>
                      {t.EnglishName}, Ayat: {t.ayat_from}-{t.ayat_to}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                      Progress: {t.completed_count} / {t.recitation_count}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    );
  }

  // Active View
  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => setSelectedTreatment(null)} color="primary" sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
            Active Treatment
          </Typography>
        </Box>
        <Button
          variant="outlined"
          color="error"
          startIcon={<CancelIcon />}
          onClick={handleCancelTreatment}
          sx={{ borderRadius: 2 }}
          disabled={isUpdating || count >= selectedTreatment.recitation_count}
        >
          Cancel Treatment
        </Button>
      </Box>

      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 15px rgba(0,0,0,0.05)', mb: 4, textAlign: 'center' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
            {selectedTreatment.EnglishName}, Ayat: {selectedTreatment.ayat_from}-{selectedTreatment.ayat_to}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
            For {selectedTreatment.disease_name}
          </Typography>

          <Box sx={{ mb: 4, direction: 'rtl' }}>
            {selectedTreatment.verses?.map((v, index) => (
              <Typography
                key={index}
                variant="h4"
                sx={{
                  fontFamily: 'Amiri, serif',
                  lineHeight: 1.8,
                  color: '#0d472c',
                  mb: 2
                }}
              >
                {v.arabic} ({v.ayah_id})
              </Typography>
            ))}
          </Box>

          <Typography variant="h6" sx={{ mb: 2 }}>
            Completed Recitations
          </Typography>

          <Button
            variant="contained"
            color={count >= selectedTreatment.recitation_count ? "success" : "primary"}
            onClick={handleIncrement}
            disabled={isUpdating || count >= selectedTreatment.recitation_count}
            sx={{
              width: 150,
              height: 150,
              borderRadius: '50%',
              fontSize: '3rem',
              fontWeight: 'bold',
              boxShadow: '0 8px 25px rgba(13, 71, 44, 0.3)',
              mb: 3
            }}
          >
            {isUpdating ? <CircularProgress color="inherit" /> : count}
          </Button>

          {count >= selectedTreatment.recitation_count && (
            <Typography variant="h6" color="success.main" sx={{ fontWeight: 'bold', display: 'block', mb: 2, mt: 2 }}>
              Alhamdulillah, you have completed the treatment!
            </Typography>
          )}

          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
            <Button variant="outlined" onClick={handleReset} disabled={isUpdating || count >= selectedTreatment.recitation_count}>
              Reset Counter
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Treatments;
