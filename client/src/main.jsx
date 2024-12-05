import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import  { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './components/ui/theme-provider';
const router=createBrowserRouter(createRoutesFromElements(
  <>
    <Route path='/' element={<App/>}>

    </Route>
  </>
))

createRoot(document.getElementById('root')).render(
  <StrictMode> 
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme" >
    <RouterProvider router={router}/>
    </ThemeProvider>
  
  </StrictMode>,
)
