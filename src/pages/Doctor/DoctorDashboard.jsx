import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContextProvider'
import { AppContext }    from '../../context/AppContextProvider'

const DoctorDashboard = () => {
  const { dashData, getDashData, cancelAppointment, completeAppointment, profileData, getProfileData } = useContext(DoctorContext)
  const { slotDateFormat, currency } = useContext(AppContext)

  useEffect(() => { getDashData(); getProfileData() }, [])

  if (!dashData) return <Loader />

  const stats = [
    { label: 'Total Earnings',     value: `${currency}${dashData.earnings}`, icon: '💰', color: '#059669', bg: '#f0fdf4' },
    { label: 'Total Appointments', value: dashData.appointments,             icon: '📅', color: '#2563EB', bg: '#eff6ff' },
    { label: 'Total Patients',     value: dashData.patients,                 icon: '👥', color: '#7C3AED', bg: '#faf5ff' },
  ]

  return (
    <div style={page}>
      {/* Welcome */}
      {profileData && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px', background: '#fff', padding: '20px', borderRadius: '14px', border: '1px solid #f3f4f6' }}>
          <img src={profileData.image} alt="" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #bbf7d0' }} />
          <div>
            <p style={{ margin: '0 0 2px', fontSize: '18px', fontWeight: '700', color: '#111827' }}>Welcome back, Dr. {profileData.name} 👋</p>
            <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>{profileData.speciality} · {profileData.experience} Experience</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: profileData.available ? '#22c55e' : '#d1d5db' }} />
            <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>{profileData.available ? 'Available Today' : 'Not Available'}</span>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '28px' }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Latest appointments */}
      <div style={card}>
        <h2 style={cardTitle}>Latest Appointments</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {dashData.latestAppointments?.slice(0, 5).map(apt => (
            <div key={apt._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f9fafb', borderRadius: '10px' }}>
              <img src={apt.userData?.image} alt="" style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: '600', fontSize: '14px', color: '#111827' }}>{apt.userData?.name}</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>{slotDateFormat(apt.slotDate)} — {apt.slotTime}</p>
              </div>
              {apt.cancelled
                ? <span style={badge('#fee2e2','#dc2626')}>Cancelled</span>
                : apt.isCompleted
                ? <span style={badge('#dcfce7','#16a34a')}>Completed</span>
                : (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => completeAppointment(apt._id)} style={{ background: '#dcfce7', color: '#16a34a', border: 'none', borderRadius: '6px', padding: '5px 10px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>✓ Done</button>
                    <button onClick={() => cancelAppointment(apt._id)}   style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', padding: '5px 10px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>✕ Cancel</button>
                  </div>
                )
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const Loader    = () => <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>⏳ Loading...</div>
const badge     = (bg, c) => ({ background: bg, color: c, fontSize: '11px', fontWeight: '600', padding: '3px 9px', borderRadius: '20px' })
const page      = { fontFamily: "'DM Sans',sans-serif" }
const card      = { background: '#fff', borderRadius: '14px', padding: '20px', border: '1px solid #f3f4f6' }
const cardTitle = { fontSize: '16px', fontWeight: '700', color: '#111827', margin: '0 0 14px' }

export default DoctorDashboard