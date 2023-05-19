import React from 'react';
import L from 'leaflet';
import Scooter from '../assets/selectedScooterIcon.png';
import Bike from '../assets/selectedBikeIcon.png';
import { Button, Grid, Box, Item, Card } from '@mui/material';
import { MapContainer, TileLayer, useMap, Popup, Marker } from 'react-leaflet';

const SelectedMap = ({ selectedMap }) => {

    const ScooterIcon = new L.Icon({
        iconUrl: Scooter,
        iconSize: [50, 50],
    });

    const BikeIcon = new L.Icon({
        iconUrl: Bike,
        iconSize: [50, 50],
    });

    const whichIcon = (rental) => {
        console.log('RENTAL TYPE', rental)
        if (rental === 'scooter') {
          return ScooterIcon;
        }
        return BikeIcon;
    }

    return (
        <Card style={{ height: '100%', width: '100%'}}>
        <MapContainer
                center={selectedMap.center}
                zoom={selectedMap.zoom}
                scrollWheelZoom={true}
                style={{ width: '100%', height: '85vh' }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <Marker
                    icon={whichIcon(selectedMap.type)}
                    position={selectedMap.center}
                >

                </Marker>
            </MapContainer>
            </Card>
      );
};

export default SelectedMap;
