import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Card,
  CardContent,
  Grid,
  Divider,
  CircularProgress,
  Stack,
  LinearProgress,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

/**
 * Normalises a treatment record so it always has an `itemCounters` array.
 * Legacy treatments (single surah_id / recitation_count) are wrapped into
 * a one-element array so the same UI can render them.
 */
const normaliseTreatment = (t) => {
  if (t.itemCounters && t.itemCounters.length > 0) return t;

  const label = t.EnglishName
    ? t.ayat_from != null
      ? `${t.EnglishName} (Ayat ${t.ayat_from}–${t.ayat_to})`
      : t.EnglishName
    : "Recitation";

  return {
    ...t,
    itemCounters: [
      {
        label,
        type: "surah",
        target: t.recitation_count || 7,
        completed: t.completed_count || 0,
        verses: t.verses || [],
      },
    ],
  };
};

const Treatments = () => {
  const navigate = useNavigate();
  const [userTreatments, setUserTreatments] = useState([]);
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchUserTreatments();
  }, []);

  const fetchUserTreatments = () => {
    setLoading(true);
    try {
      const raw = JSON.parse(localStorage.getItem("treatments")) || [];
      setUserTreatments(raw.map(normaliseTreatment));
    } catch (e) {
      console.error("Error loading treatments:", e);
    } finally {
      setLoading(false);
    }
  };

  const persist = (treatments) => {
    localStorage.setItem("treatments", JSON.stringify(treatments));
  };

  const handleSelectTreatment = (treatmentId) => {
    const t = userTreatments.find((x) => x.treatment_id === treatmentId);
    if (t) {
      setSelectedTreatment(t);
      setActiveItemIndex(0);
    }
  };

  const updateItemCounter = (delta) => {
    if (!selectedTreatment || isUpdating) return;
    setIsUpdating(true);

    const updatedCounters = selectedTreatment.itemCounters.map((item, idx) => {
      if (idx !== activeItemIndex) return item;
      const newCompleted = Math.max(
        0,
        Math.min((item.completed || 0) + delta, item.target),
      );
      return { ...item, completed: newCompleted };
    });

    const allDone = updatedCounters.every(
      (item) => item.completed >= item.target,
    );
    const overallCompleted = updatedCounters.reduce(
      (s, i) => s + (i.completed || 0),
      0,
    );
    const overallTarget = updatedCounters.reduce((s, i) => s + i.target, 0);

    const updated = {
      ...selectedTreatment,
      itemCounters: updatedCounters,
      completed_count: overallCompleted,
      recitation_count: overallTarget,
      status: allDone ? "completed" : "in_progress",
    };

    setSelectedTreatment(updated);
    const newList = userTreatments.map((t) =>
      t.treatment_id === updated.treatment_id ? updated : t,
    );
    setUserTreatments(newList);
    persist(newList);
    setIsUpdating(false);
  };

  const handleIncrement = () => updateItemCounter(1);
  const handleDecrement = () => updateItemCounter(-1);

  const handleResetItem = () => {
    if (!selectedTreatment) return;
    const updatedCounters = selectedTreatment.itemCounters.map((item, idx) =>
      idx === activeItemIndex ? { ...item, completed: 0 } : item,
    );
    const overallCompleted = updatedCounters.reduce(
      (s, i) => s + (i.completed || 0),
      0,
    );
    const overallTarget = updatedCounters.reduce((s, i) => s + i.target, 0);
    const updated = {
      ...selectedTreatment,
      itemCounters: updatedCounters,
      completed_count: overallCompleted,
      recitation_count: overallTarget,
      status: "in_progress",
    };
    setSelectedTreatment(updated);
    const newList = userTreatments.map((t) =>
      t.treatment_id === updated.treatment_id ? updated : t,
    );
    setUserTreatments(newList);
    persist(newList);
  };

  const handleCancelTreatment = () => {
    if (!window.confirm("Cancel this treatment?")) return;
    const updated = { ...selectedTreatment, status: "cancelled" };
    const newList = userTreatments.map((t) =>
      t.treatment_id === updated.treatment_id ? updated : t,
    );
    setUserTreatments(newList);
    persist(newList);
    setSelectedTreatment(null);
    alert("Treatment cancelled.");
  };

  // Loading
  if (loading) {
    return (
      <Box sx={{ p: 5, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  // Treatment List
  if (!selectedTreatment) {
    const inProgress = userTreatments.filter((t) => t.status === "in_progress");
    return (
      <Box sx={{ p: 1 }}>
        <Typography variant="h3" sx={{ fontWeight: "bold", mb: 4 }}>
          In-Progress Treatments
        </Typography>

        {inProgress.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h5" color="text.secondary">
              No treatments in progress.
            </Typography>
            <Button
              onClick={() => navigate("/app/diseases")}
              sx={{ mt: 3 }}
              variant="contained"
            >
              Browse Diseases
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {inProgress.map((t) => {
              const overallDone =
                t.itemCounters?.reduce((s, i) => s + (i.completed || 0), 0) ??
                0;
              const overallTarget =
                t.itemCounters?.reduce((s, i) => s + i.target, 0) ?? 1;
              const pct = Math.min(
                100,
                Math.round((overallDone / overallTarget) * 100),
              );
              return (
                <Grid item xs={12} sm={6} md={4} key={t.treatment_id}>
                  <Card
                    onClick={() => handleSelectTreatment(t.treatment_id)}
                    sx={{
                      cursor: "pointer",
                      borderRadius: 4,
                      boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <CardContent sx={{ pb: 2 }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", mb: 0.5 }}
                      >
                        {t.disease_name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1.5 }}
                      >
                        {t.itemCounters?.length ?? 1} item(s) · {overallDone}/
                        {overallTarget} recitations
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={pct}
                        sx={{ borderRadius: 4, height: 8, mb: 1 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {pct}% complete
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    );
  }

  // Active Treatment View
  const items = selectedTreatment.itemCounters || [];
  const activeItem = items[activeItemIndex] || {};
  const isItemDone = (activeItem.completed || 0) >= activeItem.target;
  const allDone = items.every((i) => (i.completed || 0) >= i.target);
  const itemPct = Math.min(
    100,
    Math.round(((activeItem.completed || 0) / (activeItem.target || 1)) * 100),
  );

  return (
    <Box sx={{ p: 1 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={() => setSelectedTreatment(null)}
            color="primary"
            sx={{ mr: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: "bold" }}>
              Active Treatment
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedTreatment.disease_name}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="outlined"
          color="error"
          startIcon={<CancelIcon />}
          onClick={handleCancelTreatment}
          sx={{ borderRadius: 2 }}
          disabled={isUpdating || allDone}
        >
          Cancel
        </Button>
      </Box>

      {/* Item tabs */}
      {items.length > 1 && (
        <Stack
          direction="row"
          spacing={1}
          sx={{ mb: 3, flexWrap: "wrap", gap: 1 }}
        >
          {items.map((item, idx) => (
            <Chip
              key={idx}
              label={`${idx + 1}. ${item.label}`}
              onClick={() => setActiveItemIndex(idx)}
              icon={
                (item.completed || 0) >= item.target ? (
                  <CheckCircleIcon />
                ) : undefined
              }
              color={
                idx === activeItemIndex
                  ? "primary"
                  : (item.completed || 0) >= item.target
                    ? "success"
                    : "default"
              }
              variant={idx === activeItemIndex ? "filled" : "outlined"}
              sx={{
                cursor: "pointer",
                fontWeight: idx === activeItemIndex ? "bold" : "normal",
              }}
            />
          ))}
        </Stack>
      )}

      {/* Counter card */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          mb: 3,
          textAlign: "center",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Chip
            label={activeItem.type?.toUpperCase() || "SURAH"}
            color="primary"
            size="small"
            sx={{ mb: 2, fontWeight: "bold" }}
          />
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 0.5 }}>
            {activeItem.label}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Target: {activeItem.target} recitations
          </Typography>

          {/* Arabic verses */}
          {activeItem.verses && activeItem.verses.length > 0 && (
            <Box
              sx={{
                p: 2.5,
                bgcolor: "rgba(13, 71, 44, 0.03)",
                borderRadius: 2,
                mb: 3,
                direction: "rtl",
                textAlign: "right",
              }}
            >
              {activeItem.verses.map((v, i) => (
                <Typography
                  key={i}
                  variant="h5"
                  sx={{
                    fontFamily: "'Amiri', serif",
                    color: "#0d472c",
                    lineHeight: 1.9,
                    mb: 1,
                  }}
                >
                  {v.arabic}
                </Typography>
              ))}
            </Box>
          )}

          {/* Progress bar */}
          <Box sx={{ mb: 3 }}>
            <LinearProgress
              variant="determinate"
              value={itemPct}
              color={isItemDone ? "success" : "primary"}
              sx={{ height: 10, borderRadius: 5, mb: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              {activeItem.completed ?? 0} / {activeItem.target} — {itemPct}%
            </Typography>
          </Box>

          {/* Big counter button */}
          <Button
            variant="contained"
            color={isItemDone ? "success" : "primary"}
            onClick={handleIncrement}
            disabled={isUpdating || isItemDone}
            sx={{
              width: 150,
              height: 150,
              borderRadius: "50%",
              fontSize: "3rem",
              fontWeight: "bold",
              boxShadow: "0 8px 25px rgba(13, 71, 44, 0.3)",
              mb: 3,
            }}
          >
            {isUpdating ? (
              <CircularProgress color="inherit" size={40} />
            ) : (
              (activeItem.completed ?? 0)
            )}
          </Button>

          {isItemDone && (
            <Typography
              variant="h6"
              color="success.main"
              sx={{ fontWeight: "bold", display: "block", mb: 2 }}
            >
              ✓ Alhamdulillah, this item is complete!
            </Typography>
          )}

          {/* Controls */}
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mt: 2 }}
          >
            <Button
              variant="outlined"
              onClick={handleDecrement}
              disabled={isUpdating || (activeItem.completed ?? 0) === 0}
            >
              − Undo
            </Button>
            <Button
              variant="outlined"
              onClick={handleResetItem}
              disabled={isUpdating || (activeItem.completed ?? 0) === 0}
            >
              Reset
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Prev / Next navigation */}
      {items.length > 1 && (
        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          sx={{ mb: 3 }}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBackIosNewIcon />}
            onClick={() => setActiveItemIndex((i) => Math.max(0, i - 1))}
            disabled={activeItemIndex === 0}
          >
            Previous
          </Button>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ alignSelf: "center" }}
          >
            {activeItemIndex + 1} of {items.length}
          </Typography>
          <Button
            variant="outlined"
            endIcon={<ArrowForwardIosIcon />}
            onClick={() =>
              setActiveItemIndex((i) => Math.min(items.length - 1, i + 1))
            }
            disabled={activeItemIndex === items.length - 1}
          >
            Next
          </Button>
        </Stack>
      )}

      {/* All done banner */}
      {allDone && (
        <Card
          sx={{
            borderRadius: 3,
            background: "linear-gradient(135deg, #0d472c 0%, #1c6643 100%)",
            color: "#fff",
            textAlign: "center",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <CheckCircleIcon sx={{ fontSize: 60, mb: 2, color: "#FFB300" }} />
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
              Treatment Complete!
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mb: 3 }}>
              Alhamdulillah — you have completed all recitations for{" "}
              {selectedTreatment.disease_name}.
            </Typography>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#FFB300",
                color: "#0d472c",
                fontWeight: "bold",
                "&:hover": { bgcolor: "#FFA000" },
              }}
              onClick={() => setSelectedTreatment(null)}
            >
              Back to Treatments
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Treatments;
