import React from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/admin-dashboard',  icon: '📊', label: 'Dashboard'    },
  { to: '/all-appointments', icon: '📅', label: 'Appointments' },
  { to: '/admin-patients',   icon: '🏥', label: 'All Patients' },
  { to: '/doctor-list',      icon: '👨‍⚕️', label: 'All Doctors' },
  { to: '/add-doctor',       icon: '➕', label: 'Add Doctor'   },
]

const AdminSidebar = () => (
  <aside style={{ width: '220px', minHeight: 'calc(100vh - 64px)', background: '#fff', borderRight: '1px solid #f3f4f6', paddingTop: '12px', flexShrink: 0, fontFamily: "'DM Sans',sans-serif" }}>
    {links.map(l => (
      <NavLink key={l.to} to={l.to} style={({ isActive }) => ({
        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px',
        textDecoration: 'none', fontSize: '14px', fontWeight: isActive ? '600' : '400',
        color: isActive ? '#7C3AED' : '#6b7280',
        background: isActive ? '#faf5ff' : 'transparent',
        borderRight: `3px solid ${isActive ? '#7C3AED' : 'transparent'}`,
        transition: 'all 0.15s',
      })}>
        <span style={{ fontSize: '17px' }}>{l.icon}</span>{l.label}
      </NavLink>
    ))}
  </aside>
)

export default AdminSidebar