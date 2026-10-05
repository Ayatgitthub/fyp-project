import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Avatar,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, CircularProgress
} from '@mui/material';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import API from '../axiosConfig';
import CancelIcon from '@mui/icons-material/Cancel';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { useNavigate } from 'react-router-dom';
import { useDb } from '../context/DbContext';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.name || 'User';
  const { db } = useDb();
  useEffect(() => {
    fetchDashboardData();
    // console.log('Database instance in Dashboard:', db);
  }, [db]);

  const fetchDashboardData = async () => {
    try {
      const existingData = JSON.parse(localStorage.getItem("treatments")) || [];
      setData(existingData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatCount = (status) => {
    if (!data) return 0;
    return data.filter(treatment => treatment.status === status).length;
  }


  const totalTreatments = data?.length || 0;

  const stats = [
    {
      title: 'Total Treatments',
      count: totalTreatments,
      icon: <MedicalServicesIcon sx={{ fontSize: 24 }} />,
      color: 'primary.main',
      bgColor: 'rgba(13, 71, 44, 0.1)',
    },
    {
      title: 'In Progress',
      count: getStatCount('in_progress'),
      icon: <PendingActionsIcon sx={{ fontSize: 24 }} />,
      color: '#f57c00',
      bgColor: 'rgba(245, 124, 0, 0.1)',
    },
    {
      title: 'Completed',
      count: getStatCount('completed'),
      icon: <CheckCircleIcon sx={{ fontSize: 24 }} />,
      color: '#2e7d32',
      bgColor: 'rgba(46, 125, 50, 0.1)',
    },
    {
      title: 'Cancelled',
      count: getStatCount('cancelled'),
      icon: <CancelIcon sx={{ fontSize: 24 }} />,
      color: 'red',
      bgColor: 'rgba(255, 0, 0, 0.1)',
    },
  ];

  if (loading) {
    return (
      <Box sx={{ p: 5, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h3" sx={{ mb: 4, fontWeight: 'bold' }}>
        Dashboard Overview
      </Typography>

      {/* Welcome Card */}
      <Card sx={{
        mb: 3,
        p: 2,
        borderRadius: 3,
        background: 'linear-gradient(135deg, #0d472c 0%, #1a7a4a 100%)',
        color: 'white',
        boxShadow: '0 4px 20px rgba(13, 71, 44, 0.2)'
      }}>
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Welcome back Dear, {userName}!
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            It's good to see you again. Here's what's happening with your treatments today.
          </Typography>
        </CardContent>
      </Card>

      <Box sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          md: "1fr 1fr 1fr"
        },
        gap: 2
      }}>
        {stats.map((stat, index) => (
          <Card
            key={index}
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 6px 25px rgba(0,0,0,0.1)',
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ mb: 3 }}>
                <Avatar
                  sx={{
                    bgcolor: stat.bgColor,
                    color: stat.color,
                    width: 40,
                    height: 40,
                  }}
                >
                  {stat.icon}
                </Avatar>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {stat.title}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {stat.count}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Quick Access to FYP Core Modules */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" sx={{ mb: 2.5, fontWeight: 'bold' }}>
          Explore Healing Tools & Supplications
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              onClick={() => navigate('/app/chain')}
              sx={{
                borderRadius: 3,
                p: 1,
                cursor: 'pointer',
                bgcolor: 'rgba(13, 71, 44, 0.04)',
                border: '1px solid rgba(13, 71, 44, 0.15)',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: 'rgba(13, 71, 44, 0.08)',
                  transform: 'translateY(-3px)'
                }
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', color: '#fff', mb: 1.5, width: 42, height: 42 }}>
                  <FormatListNumberedIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5, fontSize: '1rem' }}>
                  Chain of Duas
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem' }}>
                  Sequential 5-step Wazifa chains from Durood to Shifa.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              onClick={() => navigate('/app/hadith-duas')}
              sx={{
                borderRadius: 3,
                p: 1,
                cursor: 'pointer',
                bgcolor: 'rgba(245, 124, 0, 0.04)',
                border: '1px solid rgba(245, 124, 0, 0.15)',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: 'rgba(245, 124, 0, 0.08)',
                  transform: 'translateY(-3px)'
                }
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Avatar sx={{ bgcolor: '#f57c00', color: '#fff', mb: 1.5, width: 42, height: 42 }}>
                  <MenuBookIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5, fontSize: '1rem' }}>
                  Hadith & Duas
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem' }}>
                  Authentic Sunnah healing supplications from Sahih Bukhari & Muslim.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              onClick={() => navigate('/app/counters')}
              sx={{
                borderRadius: 3,
                p: 1,
                cursor: 'pointer',
                bgcolor: 'rgba(26, 122, 74, 0.04)',
                border: '1px solid rgba(26, 122, 74, 0.15)',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: 'rgba(26, 122, 74, 0.08)',
                  transform: 'translateY(-3px)'
                }
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Avatar sx={{ bgcolor: '#1a7a4a', color: '#fff', mb: 1.5, width: 42, height: 42 }}>
                  <TouchAppIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5, fontSize: '1rem' }}>
                  Multiple Counters
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem' }}>
                  Simultaneous digital tasbeeh with custom targets & cycles.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              onClick={() => navigate('/app/resources')}
              sx={{
                borderRadius: 3,
                p: 1,
                cursor: 'pointer',
                bgcolor: 'rgba(2, 136, 209, 0.04)',
                border: '1px solid rgba(2, 136, 209, 0.15)',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: 'rgba(2, 136, 209, 0.08)',
                  transform: 'translateY(-3px)'
                }
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Avatar sx={{ bgcolor: '#0288d1', color: '#fff', mb: 1.5, width: 42, height: 42 }}>
                  <LibraryBooksIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5, fontSize: '1rem' }}>
                  Multiple Resources
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem' }}>
                  Quranic audio player, classical books & Ruqyah guides.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Recent Treatments Table */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          Recent Treatments
        </Typography>
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ bgcolor: 'rgba(13, 71, 44, 0.05)' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Disease Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Progress</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 3 }}>No treatments yet.</TableCell>
                  </TableRow>
                ) : (
                  data?.slice(-5)?.map((row) => (
                    <TableRow key={row.treatment_id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell sx={{ fontWeight: 500 }}>{row.disease_name}</TableCell>
                      <TableCell>{row.completed_count} / {row.recitation_count}</TableCell>
                      <TableCell>
                        <Chip
                          label={row.status.replace('_', ' ')}
                          size="small"
                          sx={{
                            textTransform: 'capitalize',
                            fontWeight: 'bold',
                            bgcolor:
                              row.status === 'completed' ? 'rgba(46, 125, 50, 0.1)' :
                                row.status === 'in_progress' ? 'rgba(245, 124, 0, 0.1)' :
                                  'rgba(211, 47, 47, 0.1)',
                            color:
                              row.status === 'completed' ? '#2e7d32' :
                                row.status === 'in_progress' ? '#f57c00' :
                                  '#d32f2f',
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Box>
    </Box >
  );
};

export default Dashboard;
