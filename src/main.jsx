import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'


import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from './Components/Root/Root';
import Error from './Components/Error/Error';
import Home from './Components/Header/home/Home';
import MillRate from './section/millRate/MillRate';
import PresentMill from './section/PresentMill/PresentMill';
import BigMarket from './section/BigMarket/BigMarket';
import DailyMarket from './section/DailyMarket/DailyMarket';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import ForgotPassword from './Components/Forgot/Forgot';
import ProtectedRoute from './Components/PrivateRoute/PrivateRoute';
import PublicRoute from './Components/Publick/PublicRout';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    errorElement: <Error></Error>,
    children: [

      // protected route


      {
        element: <ProtectedRoute></ProtectedRoute>,
        children: [
          {
            index: true,
            element: <Home></Home>
          },
          {
            path: "/mill-rate",
            element: <MillRate></MillRate>
          },
          {
            path: "/present-mill",
            element: <PresentMill></PresentMill>
          },
          {
            path: "/big-market",
            element: <BigMarket></BigMarket>
          },
          {
            path: "/daily-market",
            element: <DailyMarket></DailyMarket>
          },
        ]
      },



      // public route


      {
        element: <PublicRoute></PublicRoute>,
        children: [
          {
            path: "/login",
            element: <Login></Login>
          },
          {
            path: "/register",
            element: <Register></Register>
          },
          {
            path: "/forgot-password",
            element: <ForgotPassword></ForgotPassword>
          },
        ]
      }

      //   {
      //     index: true,
      //     element: <Home></Home>,
      //   },
      //   {
      //     path: "/mill-rate",
      //     element: <MillRate></MillRate>,
      //   },
      //   {
      //     path: "/present-mill",
      //     element: <PresentMill></PresentMill>,
      //   },
      //   {
      //     path: "/big-market",
      //     element: <BigMarket></BigMarket>,
      //   },
      //   {
      //     path: "/daily-market",
      //     element: <DailyMarket></DailyMarket>,
      //   },
      //   {
      //     path: "/login",
      //     element: <Login></Login>,
      //   },
      //   {
      //     path: "/register",
      //     element: <Register></Register>,
      //   },
      //   {
      //     path: "/forgot-password",
      //     element: <ForgotPassword></ForgotPassword>,
      //   },
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
