import { createContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export const AdminContext = createContext()

const AdminContextProvider = (props) => {

  // ✅ FIX: use env var like DoctorContext does (was hardcoded 'https://da-backend-1.onrender.com')
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://da-backend-1.onrender.com'

  const [aToken, setAToken] = useState(localStorage.getItem('aToken') || '')

  const [doctors,      setDoctors]      = useState([])
  const [appointments, setAppointments] = useState([])   // ✅ FIX: was missing — used in Allappointments
  const [dashData,     setDashData]     = useState(false)

  // ─── ALL DOCTORS ──────────────────────────────────────────
  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/all-doctors`,
        { headers: { atoken: aToken } }
      )
      if (data.success) setDoctors(data.doctors)
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  // ─── ALL APPOINTMENTS ─────────────────────────────────────
  // ✅ FIX: was missing entirely — Allappointments.jsx calls this
  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/appointments`,
        { headers: { atoken: aToken } }
      )
      if (data.success) setAppointments(data.appointments.reverse())
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  // ─── CANCEL APPOINTMENT (admin) ───────────────────────────
  // ✅ FIX: was missing — used in Allappointments and Daashboards
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/cancel-appointment`,
        { appointmentId },
        { headers: { atoken: aToken } }
      )
      if (data.success) {
        toast.success('Appointment cancelled')
        getAllAppointments()
        getDashData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // ─── DASHBOARD ────────────────────────────────────────────
  const getDashData = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/dashboard`,
        { headers: { atoken: aToken } }
      )
      if (data.success) setDashData(data.dashData)
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const value = {
    aToken,
    setAToken,
    backendUrl,
    // doctors
    doctors,
    setDoctors,
    getAllDoctors,
    // appointments
    appointments,
    getAllAppointments,
    cancelAppointment,
    // dashboard
    dashData,
    setDashData,
    getDashData,
  }

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  )
}

export default AdminContextProvider