import React from "react";
import HighlightIcon from "@mui/icons-material/Highlight";
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';
import IcecreamIcon from '@mui/icons-material/Icecream';
import FestivalIcon from '@mui/icons-material/Festival';
import LogoutIcon from '@mui/icons-material/Logout';
import { Button } from "@mui/material";

function Header({ onLogout, user }) {
  return (
    <header>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>
          <TipsAndUpdatesIcon fontSize="medium" /> Keeper Notes
        </h1>
        <Button 
          variant="outlined" 
          onClick={onLogout}
          className="header-logout-btn"
        >
          <LogoutIcon /> {user?.username}
        </Button>
      </div>
    </header>
  );
}

export default Header;
