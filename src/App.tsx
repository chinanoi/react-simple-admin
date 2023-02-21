import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import About from './pages/About';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import LayOut from './pages/LayOut';
import './App.scss';

const router = createBrowserRouter([
    {
        path: "/",
        element: <LayOut />,
        children: [
            {
                path: "",
                element: <Welcome />
            },
            {
                path: 'welcome',
                element: <Welcome />
            },
            {
                path: 'system',
                element: <About />
            },
            {
                path: 'system/user',
                element: <About />
            }
        ]
    },
    {
        path: "login",
        element: <Login />
    }
]);

function App() {
    return (
        <RouterProvider router={router} />
    );
}

export default App;