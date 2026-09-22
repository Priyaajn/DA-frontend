import { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export const AppContext = createContext()

const AppContextProvider = (props) => {

  const currency   = '₹'
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://da-backend-1.onrender.com'

  const [token,    setToken]    = useState(localStorage.getItem('token') || '')
  const [userData, setUserData] = useState(null)
  const [doctors,  setDoctors]  = useState([])

  // ── Load user profile whenever token changes ──────────
  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + '/api/user/get-profile',
        { headers: { token } }
      )
      if (data.success) {
        setUserData(data.userData)
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  // ── Load all available doctors ────────────────────────
  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/doctor/list')
      if (data.success) setDoctors(data.doctors)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getDoctorsData()
  }, [])

  useEffect(() => {
    if (token) {
      loadUserProfileData()
    } else {
      setUserData(null)
    }
  }, [token])

  // ── Helpers ───────────────────────────────────────────
  const calculateAge = (dob) => {
    const today     = new Date()
    const birthDate = new Date(dob)
    return today.getFullYear() - birthDate.getFullYear()
  }

  // slotDate: "5_6_2025" → "5 Jun 2025"
  const slotDateFormat = (slotDate) => {
    if (!slotDate) return ''
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const [day, month, year] = slotDate.split('_')
    return `${day} ${months[Number(month) - 1]} ${year}`
  }

  const value = {
    currency,
    backendUrl,
    token,
    setToken,
    userData,
    setUserData,
    loadUserProfileData,
    doctors,
    getDoctorsData,
    calculateAge,
    slotDateFormat,
  }

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppContextProvider