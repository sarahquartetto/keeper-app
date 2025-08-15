import React, { useState, useEffect } from "react";
import { Chip, Box, TextField, Button, IconButton, Collapse } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LabelIcon from '@mui/icons-material/Label';

function LabelFilter({ notes, selectedLabels, onLabelSelect, onLabelDeselect, onClearAll, getLabelColor, getCustomLabelColor }) {
  const [customLabel, setCustomLabel] = useState("");
  const [allLabels, setAllLabels] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Extract all unique labels from notes
  useEffect(() => {
    const labels = new Set();
    notes.forEach(note => {
      if (note.labels && Array.isArray(note.labels)) {
        note.labels.forEach(label => labels.add(label));
      }
    });
    setAllLabels(Array.from(labels).sort());
  }, [notes]);

  const handleAddCustomLabel = () => {
    if (customLabel.trim() && !allLabels.includes(customLabel.trim())) {
      setCustomLabel("");
      // The custom label will be available when creating notes
    }
  };

  const handleLabelClick = (label) => {
    if (selectedLabels.includes(label)) {
      onLabelDeselect(label);
    } else {
      onLabelSelect(label);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomLabel();
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: "100px", // Below the header
        left: "30px", // Slightly to the right of the previous 20px
        zIndex: 1000,
        textAlign: "center"
      }}
    >
      {/* Toggle Button */}
      <IconButton
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          background: selectedLabels.length > 0 ? "var(--accent)" : "var(--surface)",
          color: selectedLabels.length > 0 ? "white" : "var(--text)",
          border: "1px solid var(--border)",
          borderRadius: "50%",
          width: "48px",
          height: "48px",
          boxShadow: "0 2px 8px var(--shadow)",
          "&:hover": {
            background: selectedLabels.length > 0 ? "var(--accent-600)" : "rgba(107,112,92,0.1)"
          }
        }}
        title={isOpen ? "Hide label filter" : "Show label filter"}
      >
        <LabelIcon />
      </IconButton>

            {/* Filter Content */}
      <Collapse in={isOpen}>
        <div style={{ position: "relative" }}>
          <Box
            sx={{
              marginTop: "16px",
              padding: "16px",
              background: "var(--surface)",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              boxShadow: "0 2px 8px var(--shadow)",
              width: "fit-content",
              position: "absolute",
              left: "0",
              top: "100%",
              minWidth: "300px" // Ensure the filter has a good width
            }}
          >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: 2, flexWrap: "wrap" }}>
            <span style={{ 
              color: "var(--text)", 
              fontWeight: 500, 
              marginRight: "8px",
              fontSize: "14px"
            }}>
              Filter by labels:
            </span>
        
        {/* Predefined labels */}
        {["work", "personal", "important", "ideas", "todo"].map((label) => (
          <Chip
            key={label}
            label={label}
            onClick={() => handleLabelClick(label)}
            variant={selectedLabels.includes(label) ? "filled" : "outlined"}
            color={selectedLabels.includes(label) ? "primary" : "default"}
            sx={{
              backgroundColor: selectedLabels.includes(label) ? getLabelColor(label) : "transparent",
              color: selectedLabels.includes(label) ? "white" : "var(--text)",
              borderColor: selectedLabels.includes(label) ? getLabelColor(label) : "var(--border)",
              "&:hover": {
                backgroundColor: selectedLabels.includes(label) ? getLabelColor(label) : "rgba(107,112,92,0.1)"
              }
            }}
          />
        ))}

        {/* Dynamic labels from existing notes */}
        {allLabels
          .filter(label => !["work", "personal", "important", "ideas", "todo"].includes(label))
          .map((label, index) => (
            <Chip
              key={label}
              label={label}
              onClick={() => handleLabelClick(label)}
              variant={selectedLabels.includes(label) ? "filled" : "outlined"}
              color={selectedLabels.includes(label) ? "primary" : "default"}
              sx={{
                backgroundColor: selectedLabels.includes(label) ? getCustomLabelColor(label, index) : "transparent",
                color: selectedLabels.includes(label) ? "white" : "var(--text)",
                borderColor: selectedLabels.includes(label) ? getCustomLabelColor(label, index) : "var(--border)",
                "&:hover": {
                  backgroundColor: selectedLabels.includes(label) ? getCustomLabelColor(label, index) : "rgba(107,112,92,0.1)"
                }
              }}
            />
          ))}

        {/* Clear all button */}
        {selectedLabels.length > 0 && (
          <Button
            size="small"
            onClick={onClearAll}
            sx={{
              color: "var(--muted-text)",
              textTransform: "none",
              fontSize: "12px",
              "&:hover": {
                backgroundColor: "rgba(107,112,92,0.1)"
              }
            }}
          >
            Clear all
          </Button>
        )}
      </Box>

      {/* Custom label input */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <TextField
          size="small"
          placeholder="Add custom label..."
          value={customLabel}
          onChange={(e) => setCustomLabel(e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "14px",
              "& fieldset": {
                borderColor: "var(--border)"
              },
              "&:hover fieldset": {
                borderColor: "var(--accent)"
              }
            }
          }}
        />
        <Button
          size="small"
          variant="outlined"
          onClick={handleAddCustomLabel}
          disabled={!customLabel.trim()}
          startIcon={<AddIcon />}
          sx={{
            borderColor: "var(--accent)",
            color: "var(--accent)",
            "&:hover": {
              backgroundColor: "var(--accent)",
              color: "white"
            },
            "&:disabled": {
              borderColor: "var(--border)",
              color: "var(--muted-text)"
            }
          }}
        >
          Add
        </Button>
      </Box>
            </Box>
          </div>
        </Collapse>
      </Box>
    );
  }

export default LabelFilter;
