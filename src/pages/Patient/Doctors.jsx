import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../../context/AppContextProvider'

const specialities = ['General physician','Gynecologist','Dermatologist','Pediatricians','Neurologist','Gastroenterologist']

const Doctors = () => {
  const { speciality } = useParams()
  const navigate = useNavigate()
  const { backendUrl, currency } = useContext(AppContext)
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(backendUrl + '/api/doctor/list')
      .then(({ data }) => { if (data.success) setDoctors(data.doctors) })
      .catch(e => toast.error(e.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = speciality ? doctors.filter(d => d.speciality === speciality) : doctors

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", paddingTop: '28px', paddingBottom: '60px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', margin: '0 0 4px' }}>Browse Doctors</h1>
      <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0 0 24px' }}>Find and book from {doctors.length} verified doctors</p>

      <div style={{ display: 'flex', gap: '28px' }}>

        {/* Sidebar */}
        <aside style={{ width: '200px', flexShrink: 0 }}>
          <p style={{ fontSize: '11px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>Speciality</p>
          <button onClick={() => navigate('/doctors')} style={filterBtn(!speciality)}>All Doctors</button>
          {specialities.map(s => (
            <button key={s} onClick={() => navigate(`/doctors/${s}`)} style={filterBtn(speciality === s)}>{s}</button>
          ))}
        </aside>

        {/* Grid */}
        <div style={{ flex: 1 }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '16px' }}>
              {[...Array(6)].map((_, i) => <div key={i} style={{ height: '260px', background: '#f3f4f6', borderRadius: '14px', animation: 'pulse 1.5s infinite' }} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px', color: '#9ca3af' }}>
              <p style={{ fontSize: '48px' }}>🔍</p>
              <p style={{ fontWeight: '600' }}>No doctors found for this speciality</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '16px' }}>
              {filtered.map(doc => (
                <div key={doc._id} onClick={() => navigate(`/appointment/${doc._id}`)}
                  style={{ background: '#fff', borderRadius: '14px', border: '1px solid #f3f4f6', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.15s', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                  onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(37,99,235,0.10)' }}
                  onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ background: '#eff6ff', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <img src={doc.image} alt={doc.name} style={{ height: '140px', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: doc.available ? '#22c55e' : '#d1d5db' }} />
                      <span style={{ fontSize: '11px', color: doc.available ? '#16a34a' : '#9ca3af', fontWeight: '500' }}>{doc.available ? 'Available' : 'Unavailable'}</span>
                    </div>
                    <p style={{ margin: '0 0 2px', fontWeight: '700', fontSize: '15px', color: '#111827' }}>{doc.name}</p>
                    <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#6b7280' }}>{doc.speciality}</p>
                    <p style={{ margin: 0, fontWeight: '700', color: '#2563EB', fontSize: '14px' }}>{currency}{doc.fees} <span style={{ fontSize: '11px', fontWeight: '400', color: '#9ca3af' }}>/ visit</span></p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const filterBtn = (active) => ({
  display: 'block', width: '100%', textAlign: 'left', padding: '9px 14px', marginBottom: '6px',
  border: `1.5px solid ${active ? '#2563EB' : '#e5e7eb'}`,
  background: active ? '#eff6ff' : '#fff',
  color: active ? '#2563EB' : '#6b7280',
  borderRadius: '9px', fontSize: '13px', fontWeight: active ? '600' : '400',
  cursor: 'pointer', fontFamily: 'inherit',
})

export default Doctors