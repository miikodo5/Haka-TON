import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, Popup, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.module.css';
import { Button, Grid, Box, Item, Card } from '@mui/material';
import L, { bind, svg } from 'leaflet';
import Scooter from '../../assets/scooterIcon.png';
import Bike from '../../assets/bikeIcon.png';
import AccessibleIcon from '@mui/icons-material/Accessible';

const Map = ({rentals, setSelectedRental }) => {
  
  useEffect(() => {
    // console.log(rentals);
  })

  const getInfo = (scooter) => {
    console.log(scooter);
  };

  const ScooterIcon = new L.Icon({
    iconUrl: Scooter,
    iconSize: [40, 40],
  });

  const BikeIcon = new L.Icon({
    iconUrl: Bike,
    iconSize: [40, 40],
  });

  const whichIcon = (rental) => {
    if (rental.type === 'scooter') {
      return ScooterIcon;
    }
    return BikeIcon;
  }

  return (
    <Card style={{ height: '100%', width: '100%'}}>
    <MapContainer
            center={[50.450001, 30.523333]}
            zoom={15}
            scrollWheelZoom={true}
            style={{ width: '100%', height: '85vh' }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {rentals.map((rental) => (
                <Marker
                  icon={whichIcon(rental)}
                  position={rental.location} 
                  key={rental._id} 
                  eventHandlers={{
                    click: () => { 
                      getInfo(rental)
                      setSelectedRental(rental)
                    },
                  }}
                >
                  
                </Marker>
            ))}
        </MapContainer>
        </Card>
  );
};

export default Map;
