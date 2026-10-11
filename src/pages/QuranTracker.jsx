import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Divider,
  Paper,
  Chip,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import LoopIcon from '@mui/icons-material/Loop';
import { useDb } from '../context/DbContext';

// ─── Surah list ───────────────────────────────────────────────────────────────
const surahs = [
  { num: 1, name: 'Al-Fatihah', ayats: 7 },
  { num: 2, name: 'Al-Baqarah', ayats: 286 },
  { num: 3, name: 'Al-Imran', ayats: 200 },
  { num: 4, name: "An-Nisa", ayats: 176 },
  { num: 5, name: "Al-Ma'idah", ayats: 120 },
  { num: 6, name: "Al-An'am", ayats: 165 },
  { num: 7, name: "Al-A'raf", ayats: 206 },
  { num: 8, name: 'Al-Anfal', ayats: 75 },
  { num: 9, name: 'At-Tawbah', ayats: 129 },
  { num: 10, name: 'Yunus', ayats: 109 },
  { num: 11, name: 'Hud', ayats: 123 },
  { num: 12, name: 'Yusuf', ayats: 111 },
  { num: 13, name: "Ar-Ra'd", ayats: 43 },
  { num: 14, name: 'Ibrahim', ayats: 52 },
  { num: 15, name: 'Al-Hijr', ayats: 99 },
  { num: 16, name: 'An-Nahl', ayats: 128 },
  { num: 17, name: "Al-Isra", ayats: 111 },
  { num: 18, name: 'Al-Kahf', ayats: 110 },
  { num: 19, name: 'Maryam', ayats: 98 },
  { num: 20, name: 'Ta-Ha', ayats: 135 },
  { num: 21, name: 'Al-Anbiya', ayats: 112 },
  { num: 22, name: 'Al-Hajj', ayats: 78 },
  { num: 23, name: "Al-Mu'minun", ayats: 118 },
  { num: 24, name: 'An-Nur', ayats: 64 },
  { num: 25, name: 'Al-Furqan', ayats: 77 },
  { num: 26, name: "Ash-Shu'ara", ayats: 227 },
  { num: 27, name: 'An-Naml', ayats: 93 },
  { num: 28, name: 'Al-Qasas', ayats: 88 },
  { num: 29, name: 'Al-Ankabut', ayats: 69 },
  { num: 30, name: 'Ar-Rum', ayats: 60 },
  { num: 31, name: 'Luqman', ayats: 34 },
  { num: 32, name: 'As-Sajdah', ayats: 30 },
  { num: 33, name: 'Al-Ahzab', ayats: 73 },
  { num: 34, name: 'Saba', ayats: 54 },
  { num: 35, name: 'Fatir', ayats: 45 },
  { num: 36, name: 'Ya-Sin', ayats: 83 },
  { num: 37, name: 'As-Saffat', ayats: 182 },
  { num: 38, name: 'Sad', ayats: 88 },
  { num: 39, name: 'Az-Zumar', ayats: 75 },
  { num: 40, name: 'Ghafir', ayats: 85 },
  { num: 41, name: 'Fussilat', ayats: 54 },
  { num: 42, name: 'Ash-Shura', ayats: 53 },
  { num: 43, name: 'Az-Zukhruf', ayats: 89 },
  { num: 44, name: 'Ad-Dukhan', ayats: 59 },
  { num: 45, name: 'Al-Jathiyah', ayats: 37 },
  { num: 46, name: 'Al-Ahqaf', ayats: 35 },
  { num: 47, name: 'Muhammad', ayats: 38 },
  { num: 48, name: 'Al-Fath', ayats: 29 },
  { num: 49, name: 'Al-Hujurat', ayats: 18 },
  { num: 50, name: 'Qaf', ayats: 45 },
  { num: 51, name: 'Ad-Dhariyat', ayats: 60 },
  { num: 52, name: 'At-Tur', ayats: 49 },
  { num: 53, name: 'An-Najm', ayats: 62 },
  { num: 54, name: 'Al-Qamar', ayats: 55 },
  { num: 55, name: 'Ar-Rahman', ayats: 78 },
  { num: 56, name: "Al-Waqi'ah", ayats: 96 },
  { num: 57, name: 'Al-Hadid', ayats: 29 },
  { num: 58, name: 'Al-Mujadila', ayats: 22 },
  { num: 59, name: 'Al-Hashr', ayats: 24 },
  { num: 60, name: 'Al-Mumtahanah', ayats: 13 },
  { num: 61, name: 'As-Saff', ayats: 14 },
  { num: 62, name: "Al-Jumu'ah", ayats: 11 },
  { num: 63, name: 'Al-Munafiqun', ayats: 11 },
  { num: 64, name: 'At-Taghabun', ayats: 18 },
  { num: 65, name: 'At-Talaq', ayats: 12 },
  { num: 66, name: 'At-Tahrim', ayats: 12 },
  { num: 67, name: 'Al-Mulk', ayats: 30 },
  { num: 68, name: 'Al-Qalam', ayats: 52 },
  { num: 69, name: 'Al-Haqqah', ayats: 52 },
  { num: 70, name: "Al-Ma'arij", ayats: 44 },
  { num: 71, name: 'Nuh', ayats: 28 },
  { num: 72, name: 'Al-Jinn', ayats: 28 },
  { num: 73, name: 'Al-Muzzammil', ayats: 20 },
  { num: 74, name: 'Al-Muddaththir', ayats: 56 },
  { num: 75, name: 'Al-Qiyamah', ayats: 40 },
  { num: 76, name: 'Al-Insan', ayats: 31 },
  { num: 77, name: 'Al-Mursalat', ayats: 50 },
  { num: 78, name: "An-Naba", ayats: 40 },
  { num: 79, name: "An-Nazi'at", ayats: 46 },
  { num: 80, name: 'Abasa', ayats: 42 },
  { num: 81, name: 'At-Takwir', ayats: 29 },
  { num: 82, name: 'Al-Infitar', ayats: 19 },
  { num: 83, name: 'Al-Mutaffifin', ayats: 36 },
  { num: 84, name: 'Al-Inshiqaq', ayats: 25 },
  { num: 85, name: 'Al-Buruj', ayats: 22 },
  { num: 86, name: 'At-Tariq', ayats: 17 },
  { num: 87, name: "Al-A'la", ayats: 19 },
  { num: 88, name: 'Al-Ghashiyah', ayats: 26 },
  { num: 89, name: 'Al-Fajr', ayats: 30 },
  { num: 90, name: 'Al-Balad', ayats: 20 },
  { num: 91, name: 'Ash-Shams', ayats: 15 },
  { num: 92, name: 'Al-Layl', ayats: 21 },
  { num: 93, name: 'Ad-Duhaa', ayats: 11 },
  { num: 94, name: 'Ash-Sharh', ayats: 8 },
  { num: 95, name: 'At-Tin', ayats: 8 },
  { num: 96, name: 'Al-Alaq', ayats: 19 },
  { num: 97, name: 'Al-Qadr', ayats: 5 },
  { num: 98, name: 'Al-Bayyinah', ayats: 8 },
  { num: 99, name: 'Az-Zalzalah', ayats: 8 },
  { num: 100, name: 'Al-Adiyat', ayats: 11 },
  { num: 101, name: "Al-Qari'ah", ayats: 11 },
  { num: 102, name: 'At-Takathur', ayats: 8 },
  { num: 103, name: 'Al-Asr', ayats: 3 },
  { num: 104, name: 'Al-Humazah', ayats: 9 },
  { num: 105, name: 'Al-Fil', ayats: 5 },
  { num: 106, name: 'Quraysh', ayats: 4 },
  { num: 107, name: "Al-Ma'un", ayats: 7 },
  { num: 108, name: 'Al-Kawthar', ayats: 3 },
  { num: 109, name: 'Al-Kafirun', ayats: 6 },
  { num: 110, name: 'An-Nasr', ayats: 3 },
  { num: 111, name: 'Al-Masad', ayats: 5 },
  { num: 112, name: 'Al-Ikhlas', ayats: 4 },
  { num: 113, name: 'Al-Falaq', ayats: 5 },
  { num: 114, name: 'An-Nas', ayats: 6 },
];

// ─── Colour tokens ────────────────────────────────────────────────────────────
const C = {
  green: '#1b5e20',
  greenDark: '#114015',
  greenLight: '#e8f5e9',
  greenMid: '#2e7d32',
  yellow: '#e3c260',
  bg: '#f4f7f4',
  white: '#ffffff',
  border: '#dde8dd',
  textDark: '#1a1a1a',
  textMid: '#4a5e4a',
  textGrey: '#7a8b83',
  hadithBlue: '#1565c0',
  hadithBg: '#e3f2fd',
  daroodPurple: '#6a1b9a',
  daroodBg: '#f3e5f5',
};

// ─── Reusable style helpers ───────────────────────────────────────────────────
const labelSx = {
  fontSize: '0.72rem',
  fontWeight: 700,
  color: C.textMid,
  textTransform: 'uppercase',
  letterSpacing: '0.6px',
  mb: 0.5,
};

const inputSx = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: C.white,
    borderRadius: '10px',
    '& fieldset': { borderColor: C.border },
    '&:hover fieldset': { borderColor: C.green },
    '&.Mui-focused fieldset': { borderColor: C.green },
  },
  '& .MuiInputBase-input': { padding: '11px 14px', color: C.textDark, fontSize: '0.9rem' },
};

const selectSx = {
  backgroundColor: C.white,
  borderRadius: '10px',
  '.MuiOutlinedInput-notchedOutline': { borderColor: C.border },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: C.green },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: C.green },
  '.MuiSelect-select': { padding: '11px 14px', fontSize: '0.9rem', color: C.textDark },
};

// ─── Source badge colours ─────────────────────────────────────────────────────
const sourceColor = {
  Surah: { bg: C.greenLight, text: C.green },
  Hadith: { bg: C.hadithBg, text: C.hadithBlue },
  Darood: { bg: C.daroodBg, text: C.daroodPurple },
};

// ─── Main component ───────────────────────────────────────────────────────────
const QuranTracker = () => {
  const { db, saveTreatment, loadTreatments, deleteTreatment } = useDb();

  // ── form state ──
  const [diseaseName, setDiseaseName] = useState('');
  const [source, setSource] = useState('');

  // surah form
  const [selectedSurah, setSelectedSurah] = useState('');
  const [ayatFrom, setAyatFrom] = useState('');
  const [ayatTo, setAyatTo] = useState('');
  const [surahCount, setSurahCount] = useState('');
  const [pendingSurahs, setPendingSurahs] = useState([]); // surahs queued before save

  // hadith form
  const [hadithBook, setHadithBook] = useState('');
  const [hadithNumber, setHadithNumber] = useState('');

  // darood form
  const [daroodName, setDaroodName] = useState('');
  const [daroodNumber, setDaroodNumber] = useState('');

  // saved cards (each card = one full treatment entry)
  const [savedCards, setSavedCards] = useState([]);

  // Load treatments from database on component mount
  useEffect(() => {
    if (db) {
      const treatments = loadTreatments();
      setSavedCards(treatments);
    }
  }, [db, loadTreatments]);

  // ── add a Surah to the pending list ──
  const handleAddSurah = () => {
    if (!selectedSurah) { alert('Please select a Surah.'); return; }
    if (!ayatFrom || !ayatTo) { alert('Please fill Ayat From and Ayat To.'); return; }
    if (parseInt(ayatFrom) > parseInt(ayatTo)) { alert('Ayat From cannot exceed Ayat To.'); return; }
    if (!surahCount || parseInt(surahCount) <= 0) { alert('Please enter a valid Count.'); return; }

    const surahObj = surahs.find(s => s.num === parseInt(selectedSurah));
    setPendingSurahs(prev => [
      ...prev,
      { id: Date.now(), surahNum: surahObj.num, surahName: surahObj.name, ayatFrom: parseInt(ayatFrom), ayatTo: parseInt(ayatTo), count: parseInt(surahCount) },
    ]);
    // reset surah fields
    setSelectedSurah('');
    setAyatFrom('');
    setAyatTo('');
    setSurahCount('');
  };

  const handleRemovePendingSurah = (id) =>
    setPendingSurahs(prev => prev.filter(s => s.id !== id));

  // ── save the whole treatment card ──
  const handleSave = () => {
    if (!diseaseName.trim()) { alert('Please enter a Title / Disease Name.'); return; }
    if (!source) { alert('Please select a Source.'); return; }

    if (source === 'Surah' && pendingSurahs.length === 0) {
      alert('Please add at least one Surah using the + button.'); return;
    }
    if (source === 'Hadith' && (!hadithBook.trim() || !hadithNumber.trim())) {
      alert('Please fill in Hadith Book Name and Hadith Number.'); return;
    }
    if (source === 'Darood' && (!daroodName.trim() || !daroodNumber.trim())) {
      alert('Please fill in Darood Name and Darood Number.'); return;
    }

    const newCard = {
      diseaseName: diseaseName.trim(),
      source,
      surahs: source === 'Surah' ? [...pendingSurahs] : [],
      hadithBook: source === 'Hadith' ? hadithBook.trim() : '',
      hadithNumber: source === 'Hadith' ? hadithNumber.trim() : '',
      daroodName: source === 'Darood' ? daroodName.trim() : '',
      daroodNumber: source === 'Darood' ? daroodNumber.trim() : '',
    };

    // Save to database
    saveTreatment(newCard);

    // Reload from database to get the new ID
    const updatedCards = loadTreatments();
    setSavedCards(updatedCards);

    // reset all
    setDiseaseName('');
    setSource('');
    setPendingSurahs([]);
    setHadithBook('');
    setHadithNumber('');
    setDaroodName('');
    setDaroodNumber('');

    alert(`Treatment for "${newCard.diseaseName}" saved successfully!`);
  };

  const handleRemoveCard = (id) => {
    deleteTreatment(id);
    setSavedCards(prev => prev.filter(c => c.id !== id));
  };

  // ── section header ──
  const SectionHeader = ({ children }) => (
    <Typography sx={{
      fontWeight: 800, fontSize: '0.75rem', letterSpacing: '1.2px',
      color: C.textMid, textTransform: 'uppercase',
      borderLeft: `3px solid ${C.yellow}`, pl: 1.5, mb: 2, mt: 2,
    }}>
      {children}
    </Typography>
  );

  // ── label ──
  const Label = ({ children }) => <Typography sx={labelSx}>{children}</Typography>;

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif", overflow: 'hidden', backgroundColor: C.bg }}>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <Box sx={{
        background: `linear-gradient(135deg, ${C.greenDark} 0%, ${C.green} 100%)`,
        py: 2.5, px: 4,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0, boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'white' }}>
          <MenuBookIcon sx={{ fontSize: 34 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'white', lineHeight: 1.1 }}>Quran Tracker</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.8rem' }}>Islamic Treatment Prescription Builder</Typography>
          </Box>
        </Box>
        <Typography sx={{ fontFamily: "'Amiri', serif", color: 'white', opacity: 0.88, fontSize: '1.15rem' }}>
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </Typography>
      </Box>

      {/* ── Scrollable body ────────────────────────────────────────── */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: { xs: 2, md: 3.5 } }}>
        <Grid container spacing={3}>

          {/* ══ LEFT — Form ══════════════════════════════════════════ */}
          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{
              borderRadius: '20px', p: 3,
              backgroundColor: C.white, border: `1px solid ${C.border}`,
              boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
            }}>

              <SectionHeader>Add New Entry</SectionHeader>

              {/* Title / Disease Name */}
              <Box sx={{ mb: 2 }}>
                <Label>Title / Disease Name</Label>
                <TextField fullWidth placeholder="e.g. Fever, Headache…"
                  value={diseaseName} onChange={e => setDiseaseName(e.target.value)} sx={inputSx} />
              </Box>

              {/* Source Dropdown */}
              <Box sx={{ mb: 2 }}>
                <Label>Source</Label>
                <Select fullWidth displayEmpty value={source}
                  onChange={e => { setSource(e.target.value); setPendingSurahs([]); }} sx={selectSx}>
                  <MenuItem value="" disabled>Select Source</MenuItem>
                  <MenuItem value="Surah">📖 Surah</MenuItem>
                  <MenuItem value="Hadith">📚 Hadith</MenuItem>
                  <MenuItem value="Darood">✨ Darood</MenuItem>
                </Select>
              </Box>

              {/* ── SURAH fields ── */}
              {source === 'Surah' && (
                <Box sx={{
                  border: `1px solid ${C.border}`, borderRadius: '14px',
                  p: 2, mb: 2, background: C.greenLight,
                }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: C.green, mb: 1.5 }}>
                    📖 Surah Selection
                  </Typography>

                  {/* Surah dropdown */}
                  <Box sx={{ mb: 1.5 }}>
                    <Label>Surah</Label>
                    <Select fullWidth displayEmpty value={selectedSurah}
                      onChange={e => setSelectedSurah(e.target.value)} sx={selectSx}>
                      <MenuItem value="" disabled>Select Surah</MenuItem>
                      {surahs.map(s => (
                        <MenuItem key={s.num} value={s.num}>
                          {s.num}. {s.name} ({s.ayats} ayats)
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>

                  {/* Ayat From / To */}
                  <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
                    <Grid item xs={6}>
                      <Label>Ayat From</Label>
                      <TextField fullWidth type="number" placeholder="1"
                        value={ayatFrom} onChange={e => setAyatFrom(e.target.value)} sx={inputSx} />
                    </Grid>
                    <Grid item xs={6}>
                      <Label>Ayat To</Label>
                      <TextField fullWidth type="number" placeholder="7"
                        value={ayatTo} onChange={e => setAyatTo(e.target.value)} sx={inputSx} />
                    </Grid>
                  </Grid>

                  {/* Count + Add button */}
                  <Box>
                    <Label>Count (Times to Recite)</Label>
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                      <TextField fullWidth type="number" placeholder="e.g. 3"
                        value={surahCount} onChange={e => setSurahCount(e.target.value)} sx={inputSx} />
                      <Tooltip title="Add this Surah">
                        <IconButton onClick={handleAddSurah} sx={{
                          backgroundColor: C.green, color: 'white',
                          width: 46, height: 46, flexShrink: 0, borderRadius: '12px',
                          '&:hover': { backgroundColor: C.greenDark },
                          boxShadow: '0 2px 8px rgba(27,94,32,0.4)',
                        }}>
                          <AddIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  {/* Pending surahs (queued for this treatment) */}
                  {pendingSurahs.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: C.textMid, mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Added Surahs ({pendingSurahs.length})
                      </Typography>
                      {pendingSurahs.map(ps => (
                        <Box key={ps.id} sx={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          backgroundColor: C.white, border: `1px solid ${C.border}`,
                          borderRadius: '10px', px: 1.5, py: 0.8, mb: 0.8,
                        }}>
                          <Box>
                            <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: C.textDark }}>
                              {ps.surahNum}. {ps.surahName}
                            </Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: C.textGrey }}>
                              Ayat {ps.ayatFrom}–{ps.ayatTo} &nbsp;·&nbsp; 🔁 {ps.count}×
                            </Typography>
                          </Box>
                          <IconButton size="small" onClick={() => handleRemovePendingSurah(ps.id)}
                            sx={{ color: '#e53935', '&:hover': { backgroundColor: '#ffebee' } }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              )}

              {/* ── HADITH fields ── */}
              {source === 'Hadith' && (
                <Box sx={{
                  border: `1px solid #90caf9`, borderRadius: '14px',
                  p: 2, mb: 2, background: C.hadithBg,
                }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: C.hadithBlue, mb: 1.5 }}>
                    📚 Hadith Details
                  </Typography>
                  <Box sx={{ mb: 1.5 }}>
                    <Label>Hadith Book Name</Label>
                    <TextField fullWidth placeholder="e.g. Sahih Bukhari"
                      value={hadithBook} onChange={e => setHadithBook(e.target.value)} sx={inputSx} />
                  </Box>
                  <Box>
                    <Label>Hadith Number</Label>
                    <TextField fullWidth placeholder="e.g. 1234"
                      value={hadithNumber} onChange={e => setHadithNumber(e.target.value)} sx={inputSx} />
                  </Box>
                </Box>
              )}

              {/* ── DAROOD fields ── */}
              {source === 'Darood' && (
                <Box sx={{
                  border: `1px solid #ce93d8`, borderRadius: '14px',
                  p: 2, mb: 2, background: C.daroodBg,
                }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: C.daroodPurple, mb: 1.5 }}>
                    ✨ Darood Details
                  </Typography>
                  <Box sx={{ mb: 1.5 }}>
                    <Label>Darood Name</Label>
                    <TextField fullWidth placeholder="e.g. Darood Ibrahimi"
                      value={daroodName} onChange={e => setDaroodName(e.target.value)} sx={inputSx} />
                  </Box>
                  <Box>
                    <Label>Darood Number (Count)</Label>
                    <TextField fullWidth placeholder="e.g. 100"
                      value={daroodNumber} onChange={e => setDaroodNumber(e.target.value)} sx={inputSx} />
                  </Box>
                </Box>
              )}

              {/* Save button */}
              <Button fullWidth variant="contained" startIcon={<SaveIcon />}
                onClick={handleSave}
                sx={{
                  mt: 1, py: 1.4, borderRadius: '12px',
                  background: `linear-gradient(135deg, ${C.greenDark}, ${C.greenMid})`,
                  fontWeight: 700, fontSize: '0.88rem', textTransform: 'uppercase',
                  letterSpacing: '1px', boxShadow: '0 3px 12px rgba(27,94,32,0.4)',
                  '&:hover': { background: `linear-gradient(135deg, #0a2e0d, ${C.green})` },
                }}>
                Save Treatment
              </Button>
            </Paper>
          </Grid>

          {/* ══ RIGHT — Recite Cards ══════════════════════════════════ */}
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography sx={{
                fontWeight: 800, fontSize: '0.75rem', letterSpacing: '1.2px',
                color: C.textMid, textTransform: 'uppercase',
                borderLeft: `3px solid ${C.yellow}`, pl: 1.5,
              }}>
                Recite Cards
              </Typography>
              <Box sx={{
                backgroundColor: C.green, color: 'white',
                px: 1.5, py: 0.3, borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700,
              }}>
                {savedCards.length} {savedCards.length === 1 ? 'entry' : 'entries'}
              </Box>
            </Box>

            {savedCards.length === 0 ? (
              <Paper elevation={0} sx={{
                backgroundColor: C.white, borderRadius: '20px', p: 6,
                textAlign: 'center', border: `1px dashed ${C.border}`,
              }}>
                <Typography sx={{ fontSize: '52px', mb: 1.5 }}>📜</Typography>
                <Typography variant="body1" sx={{ color: C.textGrey, fontWeight: 600 }}>
                  No treatments saved yet.
                </Typography>
                <Typography variant="body2" sx={{ color: C.textGrey, mt: 0.5, fontSize: '0.82rem' }}>
                  Fill the form and press Save Treatment to create a card.
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={2}>
                {savedCards.map(card => {
                  const sc = sourceColor[card.source] || sourceColor.Surah;
                  return (
                    <Grid item xs={12} key={card.id}>
                      <Paper elevation={0} sx={{
                        borderRadius: '16px', backgroundColor: C.white,
                        border: `1px solid ${C.border}`,
                        overflow: 'hidden',
                        transition: 'box-shadow 0.2s',
                        '&:hover': { boxShadow: '0 6px 24px rgba(0,0,0,0.09)' },
                      }}>
                        {/* Card header bar */}
                        <Box sx={{
                          background: `linear-gradient(135deg, ${C.greenDark} 0%, ${C.greenMid} 100%)`,
                          px: 2.5, py: 1.5,
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <AutoStoriesIcon sx={{ color: 'white', fontSize: 20 }} />
                            <Typography sx={{ fontWeight: 700, color: 'white', fontSize: '1rem' }}>
                              {card.diseaseName}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip label={card.source} size="small"
                              sx={{ backgroundColor: sc.bg, color: sc.text, fontWeight: 700, fontSize: '0.7rem' }} />
                            <IconButton size="small" onClick={() => handleRemoveCard(card.id)}
                              sx={{ color: 'rgba(255,255,255,0.75)', '&:hover': { color: '#ff7070', backgroundColor: 'rgba(255,255,255,0.1)' } }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>

                        {/* Card body */}
                        <Box sx={{ p: 2.5 }}>

                          {/* ── Surah card body ── */}
                          {card.source === 'Surah' && (
                            <>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <LoopIcon sx={{ color: C.green, fontSize: 18 }} />
                                <Typography sx={{ fontSize: '0.8rem', color: C.textMid, fontWeight: 600 }}>
                                  Recite all surahs below
                                </Typography>
                              </Box>

                              <Grid container spacing={1.5}>
                                {card.surahs.map((s, idx) => (
                                  <Grid item xs={12} sm={6} key={s.id}>
                                    <Box sx={{
                                      border: `1px solid ${C.border}`, borderRadius: '12px',
                                      p: 1.5, backgroundColor: C.greenLight,
                                      display: 'flex', alignItems: 'flex-start', gap: 1.2,
                                    }}>
                                      {/* Index badge */}
                                      <Box sx={{
                                        minWidth: 28, height: 28, borderRadius: '8px',
                                        backgroundColor: C.green, display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        color: 'white', fontWeight: 800, fontSize: '0.72rem',
                                      }}>{idx + 1}</Box>

                                      <Box>
                                        <Typography sx={{ fontWeight: 700, fontSize: '0.87rem', color: C.textDark, lineHeight: 1.2 }}>
                                          {s.surahNum}. {s.surahName}
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.75rem', color: C.textGrey, mt: 0.3 }}>
                                          Ayat {s.ayatFrom} → {s.ayatTo}
                                        </Typography>
                                        <Box sx={{
                                          display: 'inline-flex', alignItems: 'center',
                                          mt: 0.5, px: 1, py: 0.2, borderRadius: '20px',
                                          backgroundColor: `${C.green}1a`, color: C.green,
                                          fontSize: '0.72rem', fontWeight: 700,
                                        }}>
                                          🔁 {s.count}×
                                        </Box>
                                      </Box>
                                    </Box>
                                  </Grid>
                                ))}
                              </Grid>
                            </>
                          )}

                          {/* ── Hadith card body ── */}
                          {card.source === 'Hadith' && (
                            <Box sx={{
                              display: 'flex', gap: 2, flexWrap: 'wrap',
                              backgroundColor: C.hadithBg, borderRadius: '12px', p: 2,
                            }}>
                              <Box>
                                <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: C.hadithBlue, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Book</Typography>
                                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: C.textDark }}>{card.hadithBook}</Typography>
                              </Box>
                              <Divider orientation="vertical" flexItem />
                              <Box>
                                <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: C.hadithBlue, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Hadith #</Typography>
                                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: C.textDark }}>{card.hadithNumber}</Typography>
                              </Box>
                            </Box>
                          )}

                          {/* ── Darood card body ── */}
                          {card.source === 'Darood' && (
                            <Box sx={{
                              display: 'flex', gap: 2, flexWrap: 'wrap',
                              backgroundColor: C.daroodBg, borderRadius: '12px', p: 2,
                            }}>
                              <Box>
                                <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: C.daroodPurple, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Darood</Typography>
                                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: C.textDark }}>{card.daroodName}</Typography>
                              </Box>
                              <Divider orientation="vertical" flexItem />
                              <Box>
                                <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: C.daroodPurple, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Count</Typography>
                                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: C.textDark }}>🔁 {card.daroodNumber}×</Typography>
                              </Box>
                            </Box>
                          )}
                        </Box>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Grid>

        </Grid>
      </Box>
    </Box>
  );
};

export default QuranTracker;
