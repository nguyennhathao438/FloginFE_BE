import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './app/App';
import { RouterProvider } from "react-router";
import router from './app/router';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}>
        <App />
      </RouterProvider>
  </StrictMode>,
)
