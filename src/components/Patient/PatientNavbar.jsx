import React, { useState, useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContextProvider'
import AIAssistant from '../AIAssistant'

const PatientNavbar = () => {
  const { token, setToken, userData } = useContext(AppContext)
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const logout = () => {
    localStorage.removeItem('token')
    setToken('')
    navigate('/login')
  }

  return (
    <>
      <nav style={{ background: '#fff', borderBottom: '1px solid #f3f4f6', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 8px rgba(0,0,0,0.04)', position: 'sticky', top: 0, zIndex: 100, fontFamily: "'DM Sans',sans-serif" }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/home')}>
          <span style={{ fontSize: '22px' }}>🏥</span>
          <span style={{ fontFamily: "'DM Serif Display',serif", fontSize: '20px', color: '#1e1b4b' }}>Prescripto</span>
        </div>

        <ul style={{ display: 'flex', gap: '28px', listStyle: 'none', margin: 0, padding: 0 }}>
          {[['/home', 'HOME'], ['/doctors', 'DOCTORS'], ['/about', 'ABOUT'], ['/contact', 'CONTACT']].map(([to, label]) => (
            <li key={to}>
              <NavLink to={to} style={({ isActive }) => ({ textDecoration: 'none', fontSize: '12px', fontWeight: '600', letterSpacing: '0.08em', color: isActive ? '#2563EB' : '#6b7280', borderBottom: isActive ? '2px solid #2563EB' : '2px solid transparent', paddingBottom: '2px' })}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div style={{ position: 'relative' }}>
          {token && userData ? (
            <div onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <img src={userData.image} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #bfdbfe' }} />
              <span style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>{userData.name?.split(' ')[0]}</span>
              <span style={{ fontSize: '10px', color: '#9ca3af' }}>▼</span>
              {open && (
                <div style={{ position: 'absolute', top: '48px', right: 0, background: '#fff', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '1px solid #f3f4f6', minWidth: '180px', padding: '8px', zIndex: 200 }}>
                  {[
                    ['My Profile',      () => { navigate('/my-profile');      setOpen(false) }],
                    ['My Appointments', () => { navigate('/my-appointments'); setOpen(false) }],
                    ['Logout',          () => { logout();                     setOpen(false) }],
                  ].map(([label, action]) => (
                    <div key={label} onClick={action}
                      style={{ padding: '10px 14px', fontSize: '13px', color: label === 'Logout' ? '#ef4444' : '#374151', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}
                      onMouseOver={e => e.currentTarget.style.background = '#f9fafb'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                      {label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => navigate('/login')} style={{ background: '#2563EB', color: '#fff', border: 'none', padding: '9px 22px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
              Login / Sign Up
            </button>
          )}
        </div>
      </nav>

      {/* AI Assistant floating widget — shown on all patient pages */}
      <AIAssistant />
    </>
  )
}

export default PatientNavbar