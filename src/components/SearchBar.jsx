import React, { useState } from "react";
import { Box, IconButton, Collapse, TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

function SearchBar({ onSearch, searchQuery, setSearchQuery }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: "100px", // Below the header, same as LabelFilter
        left: "90px", // To the right of the LabelFilter button
        zIndex: 1000,
        textAlign: "center"
      }}
    >
      {/* Toggle Button */}
      <IconButton
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          background: searchQuery ? "var(--accent)" : "var(--surface)",
          color: searchQuery ? "white" : "var(--text)",
          border: "1px solid var(--border)",
          borderRadius: "50%",
          width: "48px",
          height: "48px",
          boxShadow: "0 2px 8px var(--shadow)",
          "&:hover": {
            background: searchQuery ? "var(--accent-600)" : "rgba(107,112,92,0.1)"
          }
        }}
        title={isOpen ? "Hide search" : "Show search"}
      >
        <SearchIcon />
      </IconButton>

      {/* Search Content */}
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
              width: "300px",
              position: "absolute",
              left: "0",
              top: "100%"
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontSize: "14px",
                  "& fieldset": {
                    borderColor: "var(--border)"
                  },
                  "&:hover fieldset": {
                    borderColor: "var(--accent)"
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "var(--accent)"
                  }
                }
              }}
            />
          </Box>
        </div>
      </Collapse>
    </Box>
  );
}

export default SearchBar;



