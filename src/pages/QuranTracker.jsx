import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Divider,
  Paper,
  InputAdornment
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const surahs = [
  "1. Al-Fatihah (7 ayats)",
  "2. Al-Baqarah (286 ayats)",
  "3. Al-Imran (200 ayats)",
  "4. An-Nisa (176 ayats)",
  "5. Al-Ma'idah (120 ayats)",
  "6. Al-An'am (165 ayats)",
  "7. Al-A'raf (206 ayats)",
  "8. Al-Anfal (75 ayats)",
  "9. At-Tawbah (129 ayats)",
  "10. Yunus (109 ayats)",
  "11. Hud (123 ayats)",
  "12. Yusuf (111 ayats)",
  "13. Ar-Ra'd (43 ayats)",
  "14. Ibrahim (52 ayats)",
  "15. Al-Hijr (99 ayats)",
  "16. An-Nahl (128 ayats)",
  "17. Al-Isra (111 ayats)",
  "18. Al-Kahf (110 ayats)",
  "19. Maryam (98 ayats)",
  "20. Ta-Ha (135 ayats)",
  "21. Al-Anbiya (112 ayats)",
  "22. Al-Hajj (78 ayats)",
  "23. Al-Mu'minun (118 ayats)",
  "24. An-Nur (64 ayats)",
  "25. Al-Furqan (77 ayats)",
  "26. Ash-Shu'ara (227 ayats)",
  "27. An-Naml (93 ayats)",
  "28. Al-Qasas (88 ayats)",
  "29. Al-Ankabut (69 ayats)",
  "30. Ar-Rum (60 ayats)",
  "31. Luqman (34 ayats)",
  "32. As-Sajdah (30 ayats)",
  "33. Al-Ahzab (73 ayats)",
  "34. Saba (54 ayats)",
  "35. Fatir (45 ayats)",
  "36. Ya-Sin (83 ayats)",
  "37. As-Saffat (182 ayats)",
  "38. Sad (88 ayats)",
  "39. Az-Zumar (75 ayats)",
  "40. Ghafir (85 ayats)",
  "41. Fussilat (54 ayats)",
  "42. Ash-Shura (53 ayats)",
  "43. Az-Zukhruf (89 ayats)",
  "44. Ad-Dukhan (59 ayats)",
  "45. Al-Jathiyah (37 ayats)",
  "46. Al-Ahqaf (35 ayats)",
  "47. Muhammad (38 ayats)",
  "48. Al-Fath (29 ayats)",
  "49. Al-Hujurat (18 ayats)",
  "50. Qaf (45 ayats)",
  "51. Ad-Dhariyat (60 ayats)",
  "52. At-Tur (49 ayats)",
  "53. An-Najm (62 ayats)",
  "54. Al-Qamar (55 ayats)",
  "55. Ar-Rahman (78 ayats)",
  "56. Al-Waqi'ah (96 ayats)",
  "57. Al-Hadid (29 ayats)",
  "58. Al-Mujadila (22 ayats)",
  "59. Al-Hashr (24 ayats)",
  "60. Al-Mumtahanah (13 ayats)",
  "61. As-Saff (14 ayats)",
  "62. Al-Jumu'ah (11 ayats)",
  "63. Al-Munafiqun (11 ayats)",
  "64. At-Taghabun (18 ayats)",
  "65. At-Talaq (12 ayats)",
  "66. At-Tahrim (12 ayats)",
  "67. Al-Mulk (30 ayats)",
  "68. Al-Qalam (52 ayats)",
  "69. Al-Haqqah (52 ayats)",
  "70. Al-Ma'arij (44 ayats)",
  "71. Nuh (28 ayats)",
  "72. Al-Jinn (28 ayats)",
  "73. Al-Muzzammil (20 ayats)",
  "74. Al-Muddaththir (56 ayats)",
  "75. Al-Qiyamah (40 ayats)",
  "76. Al-Insan (31 ayats)",
  "77. Al-Mursalat (50 ayats)",
  "78. An-Naba (40 ayats)",
  "79. An-Nazi'at (46 ayats)",
  "80. Abasa (42 ayats)",
  "81. At-Takwir (29 ayats)",
  "82. Al-Infitar (19 ayats)",
  "83. Al-Mutaffifin (36 ayats)",
  "84. Al-Inshiqaq (25 ayats)",
  "85. Al-Buruj (22 ayats)",
  "86. At-Tariq (17 ayats)",
  "87. Al-A'la (19 ayats)",
  "88. Al-Ghashiyah (26 ayats)",
  "89. Al-Fajr (30 ayats)",
  "90. Al-Balad (20 ayats)",
  "91. Ash-Shams (15 ayats)",
  "92. Al-Layl (21 ayats)",
  "93. Ad-Duhaa (11 ayats)",
  "94. Ash-Sharh (8 ayats)",
  "95. At-Tin (8 ayats)",
  "96. Al-Alaq (19 ayats)",
  "97. Al-Qadr (5 ayats)",
  "98. Al-Bayyinah (8 ayats)",
  "99. Az-Zalzalah (8 ayats)",
  "100. Al-Adiyat (11 ayats)",
  "101. Al-Qari'ah (11 ayats)",
  "102. At-Takathur (8 ayats)",
  "103. Al-Asr (3 ayats)",
  "104. Al-Humazah (9 ayats)",
  "105. Al-Fil (5 ayats)",
  "106. Quraysh (4 ayats)",
  "107. Al-Ma'un (7 ayats)",
  "108. Al-Kawthar (3 ayats)",
  "109. Al-Kafirun (6 ayats)",
  "110. An-Nasr (3 ayats)",
  "111. Al-Masad (5 ayats)",
  "112. Al-Ikhlas (4 ayats)",
  "113. Al-Falaq (5 ayats)",
  "114. An-Nas (6 ayats)"
];

const QuranTracker = () => {
  const [diseaseName, setDiseaseName] = useState('');
  const [selectedSurah, setSelectedSurah] = useState('');
  const [ayatFrom, setAyatFrom] = useState('');
  const [ayatTo, setAyatTo] = useState('');
  const [count, setCount] = useState('');
  const [cards, setCards] = useState([]);

  const handleAddCard = () => {
    if (!selectedSurah || !ayatFrom || !ayatTo || !count || parseInt(count) <= 0) {
      alert("Please fill all recitation details correctly.");
      return;
    }

    if (parseInt(ayatFrom) > parseInt(ayatTo)) {
      alert("Ayat From cannot be greater than Ayat To.");
      return;
    }

    const newCard = {
      id: Date.now(),
      surah: selectedSurah,
      ayatFrom: parseInt(ayatFrom),
      ayatTo: parseInt(ayatTo),
      count: parseInt(count),
    };

    setCards([...cards, newCard]);
    setSelectedSurah('');
    setAyatFrom('');
    setAyatTo('');
    setCount('');
  };

  const handleRemoveCard = (id) => {
    setCards(cards.filter(card => card.id !== id));
  };

  const handleSave = () => {
    if (!diseaseName) {
      alert("Please enter a title.");
      return;
    }
    if (cards.length === 0) {
      alert("Please add at least one recitation.");
      return;
    }
    
    console.log("Saving Tracker Entry:", {
      diseaseName,
      recitations: cards
    });
    
    alert("Quran Tracker entry saved successfully!");
    setDiseaseName('');
    setCards([]);
  };


  // Custom styling classes
  const colors = {
    primaryGreen: '#1b5e20',
    lightBg: '#f6f9f6',
    yellowAccent: '#e3c260',
    textGrey: '#7a8b83',
    inputBg: '#ffffff',
    borderLight: '#e0e6e2'
  };

  const sectionHeaderStyle = {
    fontWeight: 'bold', 
    color: 'black', 
    fontSize: '0.85rem', 
    letterSpacing: '1px',
    borderLeft: `3px solid ${colors.yellowAccent}`,
    paddingLeft: '10px',
    mb: 2,
    mt: 3,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const inputLabelStyle = {
    fontSize: '0.75rem',
    fontWeight: 'bold',
    color: 'black',
    mb: 0.5,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: colors.inputBg,
      borderRadius: '12px',
      '& fieldset': {
        borderColor: colors.borderLight,
      },
      '&:hover fieldset': {
        borderColor: colors.primaryGreen,
      },
      '&.Mui-focused fieldset': {
        borderColor: colors.primaryGreen,
      }
    },
    '& .MuiInputBase-input': {
      padding: '12px 16px',
      color: 'black'
    }
  };

  return (
    <Box sx={{ 
      height: '100%',
      display: 'flex', 
      flexDirection: 'column',
      fontFamily: "'Inter', sans-serif",
      overflow: 'hidden',
    }}>
      
      {/* Header Banner */}
      <Box sx={{ 
        backgroundColor: colors.primaryGreen,
        py: 3,
        px: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'white' }}>
          <MenuBookIcon sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', lineHeight: 1.2 }}>
              Quran Tracker
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem' }}>
              Daily Recitation Log
            </Typography>
          </Box>
        </Box>

        {/* Bismillah */}
        <Typography variant="h6" sx={{ fontFamily: "'Amiri', serif", color: 'white', opacity: 0.9 }}>
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </Typography>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ 
        backgroundColor: colors.lightBg, 
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>

        {/* Scrollable Content + Save button at bottom */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 4, pb: 2 }}>

          {/* Two-column layout */}
          <Grid container spacing={3} sx={{ height: '100%' }}>
            
            {/* Left Column - Form */}
            <Grid item xs={12} md={5}>
              <Paper elevation={0} sx={{
                borderRadius: '20px',
                p: 3,
                backgroundColor: 'white',
                border: `1px solid ${colors.borderLight}`,
                height: '100%',
              }}>
                <Typography sx={sectionHeaderStyle}>
                  ADD NEW ENTRY
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                  <Box>
                    <Typography sx={inputLabelStyle}>Disease Name</Typography>
                    <TextField
                      fullWidth
                      placeholder="e.g. Fever"
                      value={diseaseName}
                      onChange={(e) => setDiseaseName(e.target.value)}
                      sx={textFieldSx}
                    />
                  </Box>

                  <Box>
                    <Typography sx={inputLabelStyle}>Surah</Typography>
                    <Select
                      fullWidth
                      displayEmpty
                      value={selectedSurah}
                      onChange={(e) => setSelectedSurah(e.target.value)}
                      sx={{
                        backgroundColor: colors.inputBg,
                        borderRadius: '12px',
                        '.MuiOutlinedInput-notchedOutline': { borderColor: colors.borderLight },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: colors.primaryGreen },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: colors.primaryGreen },
                        '.MuiSelect-select': { padding: '12px 16px' }
                      }}
                    >
                      <MenuItem value="" disabled>Select Surah</MenuItem>
                      {surahs.map((surah, idx) => (
                        <MenuItem key={idx} value={surah}>{surah}</MenuItem>
                      ))}
                    </Select>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography sx={inputLabelStyle}>Ayat From</Typography>
                      <TextField
                        fullWidth
                        type="number"
                        placeholder="1"
                        value={ayatFrom}
                        onChange={(e) => setAyatFrom(e.target.value)}
                        sx={textFieldSx}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography sx={inputLabelStyle}>Ayat To</Typography>
                      <TextField
                        fullWidth
                        type="number"
                        placeholder="1"
                        value={ayatTo}
                        onChange={(e) => setAyatTo(e.target.value)}
                        sx={textFieldSx}
                      />
                    </Grid>
                  </Grid>

                  <Box>
                    <Typography sx={inputLabelStyle}>Count (Times to Recite)</Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <TextField
                        fullWidth
                        type="number"
                        placeholder="e.g. 3"
                        value={count}
                        onChange={(e) => setCount(e.target.value)}
                        sx={textFieldSx}
                      />
                      <IconButton 
                        onClick={handleAddCard}
                        sx={{ 
                          backgroundColor: colors.primaryGreen, 
                          color: 'white',
                          width: '50px',
                          height: '50px',
                          flexShrink: 0,
                          '&:hover': { backgroundColor: '#114015' }
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Button 
                    variant="contained" 
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    fullWidth
                    sx={{ 
                      backgroundColor: '#114015', 
                      color: 'white',
                      fontWeight: 'bold',
                      borderRadius: '12px',
                      textTransform: 'uppercase',
                      py: 1.5,
                      mt: 1,
                      '&:hover': { backgroundColor: colors.primaryGreen }
                    }}
                  >
                    Save Entry
                  </Button>
                </Box>
              </Paper>
            </Grid>

            {/* Right Column - Cards */}
            <Grid item xs={12} md={7}>
              <Box>
                <Typography sx={{ ...sectionHeaderStyle, mt: 0 }}>
                  <span>RECITATION CARDS</span>
                  <Box sx={{ 
                    backgroundColor: colors.primaryGreen, 
                    color: 'white', 
                    px: 1.5, 
                    py: 0.3, 
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>
                    {cards.length} {cards.length === 1 ? 'entry' : 'entries'}
                  </Box>
                </Typography>

                {cards.length === 0 ? (
                  <Paper elevation={0} sx={{ 
                    backgroundColor: 'white', 
                    borderRadius: '20px', 
                    p: 6, 
                    textAlign: 'center',
                    border: `1px solid ${colors.borderLight}`
                  }}>
                    <Typography sx={{ fontSize: '52px', mb: 2 }}>📜</Typography>
                    <Typography variant="body1" sx={{ color: colors.textGrey, fontWeight: 500 }}>
                      No recitations added yet.
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.textGrey, mt: 0.5 }}>
                      Fill the form on the left and press + to add a card.
                    </Typography>
                  </Paper>
                ) : (
                  <Grid container spacing={2}>
                    {cards.map((card) => (
                      <Grid item xs={12} sm={6} key={card.id}>
                        <Paper elevation={0} sx={{ 
                          p: 2.5, 
                          borderRadius: '16px', 
                          backgroundColor: 'white',
                          border: `1px solid ${colors.borderLight}`,
                          position: 'relative',
                          transition: 'box-shadow 0.2s ease',
                          '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }
                        }}>
                          <Box sx={{ 
                            width: 6, height: '100%', 
                            backgroundColor: colors.primaryGreen,
                            position: 'absolute', left: 0, top: 0,
                            borderTopLeftRadius: '16px',
                            borderBottomLeftRadius: '16px',
                          }} />
                          <Box sx={{ pl: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'black', fontSize: '0.9rem' }}>
                              {card.surah}
                            </Typography>
                            <Typography variant="body2" sx={{ color: colors.textGrey, mt: 0.5 }}>
                              Ayat {card.ayatFrom} → {card.ayatTo}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                              <Box sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                backgroundColor: `${colors.primaryGreen}18`,
                                color: colors.primaryGreen,
                                px: 1.5, py: 0.3,
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                fontWeight: 'bold'
                              }}>
                                🔁 {card.count}x
                              </Box>
                              <IconButton 
                                onClick={() => handleRemoveCard(card.id)}
                                size="small"
                                sx={{ color: '#ff5252', '&:hover': { backgroundColor: '#ff52521a' } }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            </Grid>

          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default QuranTracker;
