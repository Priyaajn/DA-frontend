import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContextProvider'
import { AppContext }    from '../../context/AppContextProvider'

const DoctorPatients = () => {
  const { appointments, getAppointments } = useContext(DoctorContext)
  const { calculateAge } = useContext(AppContext)
  const [search, setSearch] = useState('')

  useEffect(() => { getAppointments() }, [])

  // Deduplicate patients by userId
  const seen = new Set()
  const uniquePatients = appointments
    .filter(a => !a.cancelled)
    .filter(a => { if (seen.has(a.userId)) return false; seen.add(a.userId); return true })
    .map(a => ({ ...a.userData, userId: a.userId, lastVisit: a.slotDate, lastTime: a.slotTime }))

  const filtered = uniquePatients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={page}>
      <h1 style={h1}>My Patients</h1>
      <p style={sub}>{uniquePatients.length} patients have booked with you</p>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search patients..." style={searchBox} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))', gap: '16px' }}>
        {filtered.map((p, i) => (
          <div key={i} style={card}>
            <img src={p.image} alt="" style={{ width: '54px', height: '54px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #bbf7d0' }} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 2px', fontWeight: '700', fontSize: '15px', color: '#111827' }}>{p.name}</p>
              <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#9ca3af' }}>{p.email}</p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {p.gender && <span style={chip}>{p.gender}</span>}
                {p.dob && p.dob !== 'Not Selected' && <span style={chip}>Age {calculateAge(p.dob)}</span>}
                {p.phone && p.phone !== '000000000' && <span style={chip}>📞 {p.phone}</span>}
              </div>
              {p.lastVisit && <p style={{ margin: '8px 0 0', fontSize: '11px', color: '#9ca3af' }}>Last visit: {p.lastVisit.replace(/_/g, ' ')} at {p.lastTime}</p>}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
            <p style={{ fontSize: '40px', marginBottom: '8px' }}>👥</p>
            <p>No patients found.</p>
          </div>
        )}
      </div>
    </div>
  )
}

const page      = { fontFamily: "'DM Sans',sans-serif" }
const h1        = { fontSize: '22px', fontWeight: '700', color: '#111827', margin: '0 0 4px' }
const sub       = { fontSize: '13px', color: '#9ca3af', margin: '0 0 16px' }
const searchBox = { width: '100%', maxWidth: '340px', padding: '10px 16px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', outline: 'none', marginBottom: '20px', fontFamily: 'inherit', boxSizing: 'border-box' }
const card      = { background: '#fff', borderRadius: '14px', padding: '18px', border: '1px solid #f3f4f6', display: 'flex', gap: '14px', alignItems: 'flex-start' }
const chip      = { background: '#f0fdf4', color: '#059669', fontSize: '11px', fontWeight: '500', padding: '3px 8px', borderRadius: '20px' }

export default DoctorPatients