import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

import './scss/index.scss';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Index from './pages/page_index';
import Auth from './pages/auth/auth';
import Protected from './pages/protected';
import Home from './pages/home/home';
import AddGroup from './pages/add/add_group';
import AddPost from './pages/add/add_post';
import SingleGroup from './pages/single/single_group';
import Groups from './pages/groups';
import SinglePost from './pages/single/single_post';

const router = createBrowserRouter([
  {path: '/', element: <Index/>}, {path: '/auth', element: <Auth/>},
  {path: '/protected', element: <Protected/>}, {path:'/home', element: <Home/>},
  {path: '/add_group', element: <AddGroup/>}, {path:'add_post', element: <AddPost/>},
  {path: '/groups', element: <Groups/>},
  {path: '/group/:id', element: <SingleGroup/>}, {path:'/post/:id', element: <SinglePost/>}
])

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();