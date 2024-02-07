import React from 'react';
import {Navigate, Outlet, Route, Routes, useLocation} from "react-router-dom";
import {routes} from "../router/index.js";
import {AnimatePresence} from "framer-motion";

const AppRouter = () => {
    const location = useLocation()

    return (
        <AnimatePresence exit={{ opacity: 0 }}>
            <Routes location={location} key={location.pathname}>
                {routes.map((route,index)=> (
                    <Route
                        path={route.path}
                        key={index}
                        element={<route.component/>}
                    >
                        {route.children && route.children.map((routeChild, routeChildIndex) => (
                            <Route
                                path={routeChild.path}
                                key={routeChildIndex}
                                element={<routeChild.component/>}
                            />
                        ))}
                    </Route>
                ))}
                <Route path="*" element={<Navigate to="/not-found" replace />}/>
            </Routes>
        </AnimatePresence>
    );
};

export default AppRouter;