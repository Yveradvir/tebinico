import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

import './index.scss';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Index from './pages/index';

const router = createBrowserRouter([
  {path: '/', element: <Index/>}
])

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();