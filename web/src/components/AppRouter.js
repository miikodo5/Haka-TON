import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { RouteNames, routes } from '../router';
import { AppBar } from '@mui/material';

const AppRouter = () => {
    return (

        <Routes>
            {routes.map((route) =>
                <Route element={<route.element />} path={route.path} key={route.path} />
            )}
            <Route path='/*' element={<Navigate to={RouteNames.MAIN} replace />} />
        </Routes>

    );
};

export default AppRouter;