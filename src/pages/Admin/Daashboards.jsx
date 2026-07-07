import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// ✅ FIX: was importing from DoctorContext — this is the ADMIN dashboard
import { AdminContext } from '../../context/AdminContextProvider'
import { AppContext }   from '../../context/AppContextProvider'

const Daashboards = () => {
  // ✅ FIX: cancelAppointment must come from AdminContext (was DoctorContext — wrong!)
  const { dashData, getDashData, cancelAppointment } = useContext(AdminContext)
  const { slotDateFormat, currency }                 = useContext(AppContext)
  const navigate = useNavigate()

  useEffect(() => { getDashData() }, [])

  if (!dashData) return (
    <div style={{ padding: '60px', textAlign: 'center' }}>
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
      <p style={{ color: '#9ca3af', fontSize: '14px' }}>Loading dashboard...</p>
      <p style={{ color: '#d1d5db', fontSize: '12px', marginTop: '8px' }}>
        If this persists, check your backend connection and admin token.
      </p>
    </div>
  )

  const stats = [
    { label: 'Total Doctors',      value: dashData.doctors,      icon: '👨‍⚕️', color: '#2563EB', bg: '#eff6ff' },
    { label: 'Total Patients',     value: dashData.patients,     icon: '🏥',   color: '#059669', bg: '#f0fdf4' },
    { label: 'Total Appointments', value: dashData.appointments, icon: '📅',   color: '#7C3AED', bg: '#faf5ff' },
  ]

  return (
    <div style={page}>
      <h1 style={h1}>Admin Dashboard</h1>
      <p style={sub}>Overview of your healthcare platform</p>

      {/* ── Stats ─────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px', marginBottom: '32px' }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: '14px', padding: '22px', border: '1px solid #f3f4f6', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: s.color }}>{s.value ?? '0'}</div>
              <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Latest Appointments ────────────────────────────── */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: 0 }}>Latest Appointments</h2>
          <button onClick={() => navigate('/all-appointments')} style={linkBtn}>View All →</button>
        </div>

        {!dashData.latestAppointments || dashData.latestAppointments.length === 0 ? (
          <p style={{ color: '#9ca3af', fontSize: '14px', textAlign: 'center', padding: '24px' }}>No appointments yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {dashData.latestAppointments.slice(0, 5).map(apt => (
              <div key={apt._id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px', background: '#f9fafb', borderRadius: '10px' }}>
                <img src={apt.docData?.image} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  {/* Patient → Doctor */}
                  <p style={{ margin: 0, fontWeight: '600', fontSize: '14px', color: '#111827' }}>
                    {apt.userData?.name} → Dr. {apt.docData?.name}
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
                    {slotDateFormat(apt.slotDate)} — {apt.slotTime}
                  </p>
                </div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>{currency}{apt.amount}</div>
                {apt.cancelled
                  ? <span style={badge('#fee2e2','#dc2626')}>Cancelled</span>
                  : apt.isCompleted
                  ? <span style={badge('#dcfce7','#16a34a')}>Done</span>
                  : <span style={badge('#dbeafe','#2563EB')}>Upcoming</span>
                }
                {!apt.cancelled && !apt.isCompleted && (
                  <button
                    onClick={() => cancelAppointment(apt._id)}
                    style={{ background: 'none', border: '1px solid #fca5a5', color: '#ef4444', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const badge   = (bg, color) => ({ background: bg, color, fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '20px' })
const page    = { fontFamily: "'DM Sans',sans-serif" }
const h1      = { fontSize: '22px', fontWeight: '700', color: '#111827', margin: '0 0 4px' }
const sub     = { fontSize: '13px', color: '#9ca3af', margin: '0 0 24px' }
const card    = { background: '#fff', borderRadius: '14px', padding: '22px', border: '1px solid #f3f4f6', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }
const linkBtn = { background: 'none', border: 'none', color: '#7C3AED', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }

export default Daashboards