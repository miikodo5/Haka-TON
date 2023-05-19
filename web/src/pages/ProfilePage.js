import React, { useEffect, useState } from 'react';
import { Card, Container, Typography, AppBar, CardHeader, Avatar, IconButton, MoreVertIcon, CardContent } from '@mui/material';
import { getPreviousRides } from '../http/profileAPI';
import manIcon from '../assets/manIcon.png';

const ProfilePage = () => {
    const [ previousRides, setPreviousRides ] = useState([]);

    useEffect(() => {
        getPreviousRides().then(data => {
            setPreviousRides(data);
            console.log(data);
        })
    }, [])

    return (
        // <Container style={{marginTop: 50}} component="main" sx={{ p: 3 }} >
        //     <Typography>
        //         Profile
        //     </Typography>
        // </Container>
        <AppBar component="main" position='fixed' style={{marginTop: 10, height: '100%', zIndex: -1, background: '#EDEDED'}}> 
            <Card style={{height: '75%', width: '75%', background: 'red', padding: 30, marginLeft: 'calc(19% / 2)', marginTop: 'calc(10% / 2)', background: 'white'}}>
                <CardHeader
                    avatar={ <Avatar src={manIcon} /> }
                    title="Pavel"
                    subheader="Registered since 03.07.2022"
                />

                <CardContent style={{marginLeft: 60}} >
                    <Typography variant="h6" style={{marginTop: 10, marginBottom: 10}}>
                        Previous rides:
                    </Typography>
                    
                    {previousRides.map((prevRide) =>
                        <div style={{marginTop: 10}} key={prevRide._id}>
                            <Typography>
                                Date: {prevRide.startDate} | Type: {prevRide.type} | Price: {prevRide.totalAmount} TON | Id: {prevRide._id} 
                            </Typography>
                        </div>
                    )}

                </CardContent>
            </Card>
        </AppBar>
    );
};

export default ProfilePage;
