import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { DoctorContext } from '../../context/DoctorContextProvider'

const DoctorNavbar = () => {
  const { setDToken, profileData } = useContext(DoctorContext)
  const navigate = useNavigate()
  const logout = () => { localStorage.removeItem('dToken'); setDToken(''); navigate('/login') }

  return (
    <nav style={{ background: '#fff', borderBottom: '1px solid #f3f4f6', padding: '0 28px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 8px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100, fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '22px' }}>🏥</span>
        <span style={{ fontFamily: "'DM Serif Display',serif", fontSize: '20px', color: '#1e1b4b' }}>Prescripto</span>
        <span style={{ background: '#059669', color: '#fff', fontSize: '10px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', letterSpacing: '0.08em' }}>DOCTOR</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {profileData && <span style={{ fontSize: '13px', color: '#6b7280' }}>Dr. {profileData.name}</span>}
        <button onClick={logout} style={{ background: '#059669', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
          Logout
        </button>
      </div>
    </nav>
  )
}

export default DoctorNavbar