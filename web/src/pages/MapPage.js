import React, { useEffect, useState } from 'react';
import Map from '../components/Map/Map';
import { useJsApiLoader } from '@react-google-maps/api';
import { Box, Typography, Grid, AppBar } from '@mui/material'
import OrderForm from '../components/OrderForm';
import { getRentals } from '../http/rentalAPI.js';
import SelectedMap from '../components/SelectedMap';

const MapPage = () => {
    const [ isSelectedMap, setIsSelectedMap ] = useState(false);
    const [ selectedMap, setSelectedMap ] = useState({
        center: [50.450001, 30.523333],
        zoom: 15,
        type: 'none'
    })
    const [ rentals, setRentals ] = useState([]);
    const [ selectedRental, setSelectedRental ] = useState({
        _id: '00',
        type: 'none',
        tariff: 0,
        barrery: 0,
        inUse: false,
        location: {
            lat: 0, lng: 0
        }
    });

    useEffect(() => {
        getRentals().then(data => {
            setRentals(data); 
            // console.log(data)
        })
    }, [])

    return (
        <AppBar component="main" position='fixed' style={{marginTop: 10, height: '100%', zIndex: -1, background: '#EDEDED'}}> 

            <Box sx={{ flexGrow: 1 }} style={{marginTop: 70, marginLeft: 10, marginRight: 10}}>
                <Grid container spacing={2}>
                    <Grid item xs={6} md={8}>
                        {!isSelectedMap ?
                            <Map rentals={rentals} selectedMap={selectedMap} setSelectedRental={setSelectedRental} />
                            :
                            <SelectedMap selectedMap={selectedMap} />
                        }
                    </Grid>
                    <Grid item xs={6} md={4}>
                        <OrderForm selectedRental={selectedRental} setSelectedRental={setSelectedRental} setIsSelectedMap={setIsSelectedMap} setSelectedMap={setSelectedMap}/>
                    </Grid>
                </Grid>
            </Box>
       </AppBar>
    );
};

export default MapPage;
