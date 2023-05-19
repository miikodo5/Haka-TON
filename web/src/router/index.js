import React from 'react';
import MainPage from '../pages/MainPage';
import MapPage from '../pages/MapPage';
import ProfilePage from '../pages/ProfilePage';

export const RouteNames = {
    MAIN: '/',
    MAP: '/map',
    PROFILE: '/profile'
};

export const routes = [
    { path: RouteNames.MAIN, element: MainPage},
    { path: RouteNames.MAP, element: MapPage },
    { path: RouteNames.PROFILE, element: ProfilePage }
];
