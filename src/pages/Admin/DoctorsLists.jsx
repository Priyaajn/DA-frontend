import React, { useContext, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AdminContext } from '../../context/AdminContextProvider'
import { AppContext }   from '../../context/AppContextProvider'

const DoctorsLists = () => {
  const { doctors, getAllDoctors, aToken, backendUrl } = useContext(AdminContext)
  const { currency } = useContext(AppContext)

  useEffect(() => { if (aToken) getAllDoctors() }, [aToken])

  // Toggle doctor availability directly from admin panel
  const toggleAvailability = async (docId, current) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/change-availability`,
        { docId },
        { headers: { atoken: aToken } }
      )
      if (data.success) {
        toast.success('Availability updated')
        getAllDoctors()
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div style={page}>
      <h1 style={h1}>All Doctors</h1>
      <p style={sub}>{doctors.length} doctors registered on the platform</p>

      {doctors.length === 0 ? (
        <div style={empty}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>👨‍⚕️</div>
          <p style={{ color: '#9ca3af', fontSize: '15px', margin: 0 }}>No doctors found. Add one first.</p>
        </div>
      ) : (
        <div style={grid}>
          {doctors.map(doc => (
            <div key={doc._id} style={card}>
              <div style={imgWrap}>
                <img src={doc.image} alt={doc.name} style={imgStyle} />
                <span style={{ ...dot, background: doc.available ? '#22c55e' : '#d1d5db' }} title={doc.available ? 'Available' : 'Unavailable'} />
              </div>

              <div style={{ padding: '16px' }}>
                <p style={nameStyle}>{doc.name}</p>
                <p style={specStyle}>{doc.speciality}</p>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  <span style={chip('#eff6ff','#2563EB')}>{doc.degree}</span>
                  <span style={chip('#faf5ff','#7C3AED')}>{doc.experience}</span>
                  <span style={chip('#f0fdf4','#059669')}>{currency}{doc.fees}</span>
                </div>

                {/* Availability toggle */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#f9fafb', borderRadius: '10px' }}>
                  <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
                    {doc.available ? '🟢 Available' : '⚫ Unavailable'}
                  </span>
                  <label style={{ position: 'relative', display: 'inline-block', width: '38px', height: '20px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={doc.available}
                      onChange={() => toggleAvailability(doc._id, doc.available)}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                      background: doc.available ? '#22c55e' : '#d1d5db',
                      borderRadius: '20px', transition: 'background 0.2s'
                    }}>
                      <span style={{
                        position: 'absolute', top: '2px',
                        left: doc.available ? '20px' : '2px',
                        width: '16px', height: '16px',
                        background: '#fff', borderRadius: '50%',
                        transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                      }} />
                    </span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const chip = (bg, color) => ({
  background: bg, color, fontSize: '11px', fontWeight: '600',
  padding: '3px 9px', borderRadius: '20px'
})

const page      = { fontFamily: "'DM Sans',sans-serif" }
const h1        = { fontSize: '22px', fontWeight: '700', color: '#111827', margin: '0 0 4px' }
const sub       = { fontSize: '13px', color: '#9ca3af', margin: '0 0 22px' }
const grid      = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: '18px' }
const card      = { background: '#fff', borderRadius: '16px', border: '1px solid #f3f4f6', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden' }
const imgWrap   = { position: 'relative' }
const imgStyle  = { width: '100%', height: '200px', objectFit: 'cover', display: 'block' }
const dot       = { position: 'absolute', top: '10px', right: '10px', width: '12px', height: '12px', borderRadius: '50%', border: '2px solid #fff' }
const nameStyle = { margin: '0 0 2px', fontWeight: '700', fontSize: '15px', color: '#111827' }
const specStyle = { margin: '0 0 10px', fontSize: '13px', color: '#6b7280' }
const empty     = { textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '14px', border: '1px solid #f3f4f6' }

export default DoctorsLists