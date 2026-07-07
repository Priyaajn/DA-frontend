import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AppContext }    from './context/AppContextProvider'
import { AdminContext }  from './context/AdminContextProvider'
import { DoctorContext } from './context/DoctorContextProvider'
import ProtectedRoutes    from './components/ProtectedRoute'

import Logins from './pages/Logins'

// Admin
import AdminNavbar      from './components/Admin/AdminNavbar'
import AdminSidebar     from './components/Admin/AdminSidebar'
import Daashboards   from './pages/Admin/Daashboards'
import Allappointments  from './pages/Admin/Allappointments'
import AddDoctors       from './pages/Admin/AddDoctors'
import DoctorsLists      from './pages/Admin/DoctorsLists'
import AdminPatients    from './pages/Admin/AdminPatients'

// Doctor
import DoctorNavbar       from './components/Doctor/DoctorNavbar'
import DoctorSidebar      from './components/Doctor/DoctorSidebar'
import DoctorDashboard    from './pages/Doctor/DoctorDashboard'
import DoctorAppointments from './pages/Doctor/DoctorAppointments'
import DoctorPatients     from './pages/Doctor/DoctorPatients'
import DoctorProfile      from './pages/Doctor/DoctorProfile'

// Patient
import PatientNavbar   from './components/Patient/PatientNavbar'
import Home            from './pages/Patient/Home'
import Doctors         from './pages/Patient/Doctors'
import Appointment     from './pages/Patient/Appointment'
import MyAppointments  from './pages/Patient/MyAppointments'
import MyProfile       from './pages/Patient/MyProfile'
import About           from './pages/Patient/About'
import Contact         from './pages/Patient/Contact'

// Layouts
const AdminLayout = ({ children }) => (
  <div style={{ minHeight: '100vh', background: '#F8F9FD', fontFamily: "'DM Sans',sans-serif" }}>
    <AdminNavbar />
    <div style={{ display: 'flex' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '28px', maxWidth: '1100px' }}>{children}</main>
    </div>
  </div>
)

const DoctorLayout = ({ children }) => (
  <div style={{ minHeight: '100vh', background: '#F8F9FD', fontFamily: "'DM Sans',sans-serif" }}>
    <DoctorNavbar />
    <div style={{ display: 'flex' }}>
      <DoctorSidebar />
      <main style={{ flex: 1, padding: '28px', maxWidth: '1100px' }}>{children}</main>
    </div>
  </div>
)

const PatientLayout = ({ children }) => (
  <div style={{ minHeight: '100vh', fontFamily: "'DM Sans',sans-serif" }}>
    <PatientNavbar />
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 40px' }}>{children}</main>
  </div>
)

// Smart root redirect based on who's logged in
const RootRedirect = () => {
  const { token }  = useContext(AppContext)
  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)
  if (aToken) return <Navigate to="/admin-dashboard"   replace />
  if (dToken) return <Navigate to="/doctor-dashboard"  replace />
  if (token)  return <Navigate to="/home"              replace />
  return            <Navigate to="/login"              replace />
}

const wrap = (role, Layout, Page) => (
  <ProtectedRoutes role={role}><Layout><Page /></Layout></ProtectedRoutes>
)

export default function App() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Serif+Display&display=swap" rel="stylesheet"/>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/"      element={<RootRedirect />} />
        <Route path="/login" element={<Logins />} />

        {/* ADMIN */}
        <Route path="/admin-dashboard"  element={wrap('admin', AdminLayout, Daashboards)} />
        <Route path="/all-appointments" element={wrap('admin', AdminLayout, Allappointments)} />
        <Route path="/add-doctor"       element={wrap('admin', AdminLayout, AddDoctors)} />
        <Route path="/doctor-list"      element={wrap('admin', AdminLayout, DoctorsLists)} />
        <Route path="/admin-patients"   element={wrap('admin', AdminLayout, AdminPatients)} />

        {/* DOCTOR */}
        <Route path="/doctor-dashboard"    element={wrap('doctor', DoctorLayout, DoctorDashboard)} />
        <Route path="/doctor-appointments" element={wrap('doctor', DoctorLayout, DoctorAppointments)} />
        <Route path="/doctor-patients"     element={wrap('doctor', DoctorLayout, DoctorPatients)} />
        <Route path="/doctor-profile"      element={wrap('doctor', DoctorLayout, DoctorProfile)} />

        {/* PATIENT */}
        <Route path="/home"             element={wrap('patient', PatientLayout, Home)} />
        <Route path="/doctors"          element={wrap('patient', PatientLayout, Doctors)} />
        <Route path="/doctors/:speciality" element={wrap('patient', PatientLayout, Doctors)} />
        <Route path="/appointment/:docId"  element={wrap('patient', PatientLayout, Appointment)} />
        <Route path="/my-appointments"  element={wrap('patient', PatientLayout, MyAppointments)} />
        <Route path="/my-profile"       element={wrap('patient', PatientLayout, MyProfile)} />
        <Route path="/about"            element={wrap('patient', PatientLayout, About)} />
        <Route path="/contact"          element={wrap('patient', PatientLayout, Contact)} />

        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </>
  )
}