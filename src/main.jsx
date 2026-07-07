import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'

import AppContextProvider from './context/AppContextProvider'
import AdminContextProvider from './context/AdminContextProvider'
import DoctorContextProvider from './context/DoctorContextProvider'

import 'react-toastify/dist/ReactToastify.css'

ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>

    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >

      <AppContextProvider>

        <AdminContextProvider>

          <DoctorContextProvider>

            <App />

          </DoctorContextProvider>

        </AdminContextProvider>

      </AppContextProvider>

    </BrowserRouter>

  </React.StrictMode>

)