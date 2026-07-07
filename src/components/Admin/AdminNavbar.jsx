import React, { useContext } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { AdminContext } from '../../context/AdminContextProvider'

const AdminNavbar = () => {
  const { setAToken } = useContext(AdminContext)
  const navigate = useNavigate()
  const logout = () => { localStorage.removeItem('aToken'); setAToken(''); navigate('/login') }

  return (
    <nav style={{ background: '#fff', borderBottom: '1px solid #f3f4f6', padding: '0 28px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 8px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100, fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '22px' }}>🏥</span>
        <span style={{ fontFamily: "'DM Serif Display',serif", fontSize: '20px', color: '#1e1b4b' }}>Prescripto</span>
        <span style={{ background: '#7C3AED', color: '#fff', fontSize: '10px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', letterSpacing: '0.08em' }}>ADMIN</span>
      </div>
      <button onClick={logout} style={{ background: '#7C3AED', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
        Logout
      </button>
    </nav>
  )
}

export default AdminNavbar