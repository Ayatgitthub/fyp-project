import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, CircularProgress
} from '@mui/material';
import API from '../axiosConfig';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    
    setLoading(true);
    try {
       const existingData = JSON.parse(localStorage.getItem("treatments")) || [];
      setLogs(existingData);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'completed':
        return <Chip label="Complete" color="success" size="small" sx={{ fontWeight: 'bold' }} />;
      case 'cancelled':
        return <Chip label="Cancelled" color="error" size="small" sx={{ fontWeight: 'bold' }} />;
      case 'in_progress':
        return <Chip label="In Progress" color="primary" size="small" sx={{ fontWeight: 'bold' }} />;
      default:
        return <Chip label={status} color="default" size="small" sx={{ fontWeight: 'bold' }} />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 5, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 4 }}>
        Treatment Logs
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <Table sx={{ minWidth: 650 }} aria-label="treatment logs table">
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Disease Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Surah & Ayat</TableCell>
              {/* <TableCell align="center" sx={{ fontWeight: 'bold' }}>Category</TableCell> */}
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Progress</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                  No treatment logs found.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow
                  key={log.treatment_id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                    {log.disease_name}
                  </TableCell>
                  <TableCell>
                    {log.EnglishName}, Ayat: {log.ayat_from}-{log.ayat_to}
                  </TableCell>
                  {/* <TableCell align="center">
                    <Chip label={log.category} size="small" variant="outlined" />
                  </TableCell> */}
                  <TableCell align="center">
                    {log.completed_count} / {log.recitation_count}
                  </TableCell>
                  <TableCell align="center">
                    {getStatusChip(log.status)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Logs;
