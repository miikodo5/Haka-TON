import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/AppRouter';
import NavBar from './components/NavBar';
import { Box } from '@mui/material';
import MapPage from './pages/MapPage';
import Map from './components/Map/Map';

const defaultCenter = {
  lat: -3.745,
  lng: -38.523
};

const App = () => {
  return (
    <BrowserRouter>
      <Box sx={{ display: 'flex' }}>
        <NavBar />
        <AppRouter />
      </Box>
    </BrowserRouter>
  );
};

export default App;
