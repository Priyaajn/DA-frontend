import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AppContext }    from '../context/AppContextProvider'
import { AdminContext }  from '../context/AdminContextProvider'
import { DoctorContext } from '../context/DoctorContextProvider'

const ProtectedRoute = ({ role, children }) => {
  const { token }  = useContext(AppContext)
  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)

  if (!token && !aToken && !dToken) return <Navigate to="/login" replace />

  if (role === 'admin'   && !aToken) return dToken ? <Navigate to="/doctor-dashboard" replace /> : <Navigate to="/home" replace />
  if (role === 'doctor'  && !dToken) return aToken ? <Navigate to="/admin-dashboard"  replace /> : <Navigate to="/home" replace />
  if (role === 'patient' && !token)  return aToken ? <Navigate to="/admin-dashboard"  replace /> : <Navigate to="/doctor-dashboard" replace />

  return children
}

export default ProtectedRoute