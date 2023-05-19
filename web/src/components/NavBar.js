import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RouteNames } from '../router/index.js';
import {
  AppBar,
  Container,
  IconButton,
  Toolbar,
  Button,
  Box,
  Paper,
  MenuList,
  MenuItem,
  Stack,
  Typography,
  MenuIcon,
  Avatar
} from '@mui/material';
import Misha from '../assets/gigant.jpg'

const NavBar = () => {
  const router = useNavigate();

  return (
      <AppBar component="nav" position='fixed' style={{zIndex: 999}}>
        <Toolbar>
          <Avatar alt="Cindy Baker" src={Misha} style={{marginRight: 30, width: 50, height: 50}}/>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            RenTON
          </Typography>

          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Button sx={{ color: '#fff' }} onClick={() => router(RouteNames.MAIN)}>
                About
            </Button>
            <Button sx={{ color: '#fff' }} onClick={() => router(RouteNames.MAP)}>
                Map
            </Button>
            <Button sx={{ color: '#fff' }} onClick={() => router(RouteNames.PROFILE)}>
                Profile
            </Button>
          </Box>

        </Toolbar>
      </AppBar>
      
  );
};

export default NavBar;
