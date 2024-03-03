import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

import './index.scss';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Index from './pages/page_index';
import Auth from './pages/auth/auth';
import Protected from './pages/protected';

const router = createBrowserRouter([
  {path: '/', element: <Index/>}, {path: '/auth', element: <Auth/>},
  {path: '/protected', element: <Protected/>}
])

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();