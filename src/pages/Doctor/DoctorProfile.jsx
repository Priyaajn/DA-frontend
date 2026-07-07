import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DoctorContext } from '../../context/DoctorContextProvider'
import { AppContext }    from '../../context/AppContextProvider'

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData } = useContext(DoctorContext)
  const { backendUrl, currency } = useContext(AppContext)
  const [editing, setEditing] = useState(false)
  const [fees,    setFees]    = useState('')
  const [addr1,   setAddr1]   = useState('')
  const [addr2,   setAddr2]   = useState('')
  const [avail,   setAvail]   = useState(true)
  const [saving,  setSaving]  = useState(false)

  useEffect(() => { getProfileData() }, [])

  useEffect(() => {
    if (profileData) {
      setFees(profileData.fees)
      setAddr1(profileData.address?.line1 || '')
      setAddr2(profileData.address?.line2 || '')
      setAvail(profileData.available)
    }
  }, [profileData])

  const save = async () => {
    setSaving(true)
    try {
      // ✅ FIX: header must be { dtoken: dToken } lowercase — matches backend authDoctor
      const { data } = await axios.post(
        backendUrl + '/api/doctor/update-profile',
        { fees, address: { line1: addr1, line2: addr2 }, available: avail },
        { headers: { dtoken: dToken } }
      )
      if (data.success) {
        toast.success('Profile updated!')
        getProfileData()
        setEditing(false)
      } else {
        toast.error(data.message)
      }
    } catch (e) {
      toast.error(e.message)
    }
    setSaving(false)
  }

  if (!profileData) return (
    <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>⏳ Loading...</div>
  )

  return (
    <div style={page}>
      <h1 style={h1}>My Profile</h1>
      <p style={sub}>Manage your profile information</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', maxWidth: '820px' }}>

        {/* Left — photo + badge */}
        <div style={{ background: '#fff', borderRadius: '14px', padding: '24px', border: '1px solid #f3f4f6', textAlign: 'center' }}>
          <img src={profileData.image} alt="" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #bbf7d0', marginBottom: '12px' }} />
          <p style={{ margin: '0 0 4px', fontWeight: '700', fontSize: '17px', color: '#111827' }}>{profileData.name}</p>
          <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#6b7280' }}>{profileData.degree} · {profileData.speciality}</p>
          <span style={{ background: '#f0fdf4', color: '#059669', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>{profileData.experience} Exp.</span>

          <div style={{ marginTop: '16px', padding: '14px', background: '#f9fafb', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '13px', color: '#374151', fontWeight: '500' }}>Available</span>
              {editing
                ? <input type="checkbox" checked={avail} onChange={e => setAvail(e.target.checked)} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                : <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: profileData.available ? '#22c55e' : '#d1d5db', display: 'inline-block' }} />
              }
            </div>
            <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af' }}>
              {profileData.available ? 'Accepting appointments' : 'Not available'}
            </p>
          </div>
        </div>

        {/* Right — details */}
        <div style={{ background: '#fff', borderRadius: '14px', padding: '24px', border: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#111827' }}>Details</h2>
            {!editing
              ? <button onClick={() => setEditing(true)} style={editBtn}>Edit Profile</button>
              : <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setEditing(false)} style={cancelBtn}>Cancel</button>
                  <button onClick={save} disabled={saving} style={saveBtn}>{saving ? 'Saving...' : 'Save'}</button>
                </div>
            }
          </div>

          {[
            { label: 'Email',      value: profileData.email },
            { label: 'Speciality', value: profileData.speciality },
            { label: 'Experience', value: profileData.experience },
          ].map(f => (
            <div key={f.label} style={row}>
              <span style={rowLabel}>{f.label}</span>
              <span style={rowVal}>{f.value}</span>
            </div>
          ))}

          <div style={row}>
            <span style={rowLabel}>Consultation Fee</span>
            {editing
              ? <input type="number" value={fees} onChange={e => setFees(e.target.value)} style={inp} />
              : <span style={{ ...rowVal, color: '#059669', fontWeight: '700' }}>{currency}{profileData.fees}</span>
            }
          </div>

          <div style={row}>
            <span style={rowLabel}>Address</span>
            {editing
              ? <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <input value={addr1} onChange={e => setAddr1(e.target.value)} placeholder="Line 1" style={inp} />
                  <input value={addr2} onChange={e => setAddr2(e.target.value)} placeholder="Line 2" style={inp} />
                </div>
              : <span style={rowVal}>
                  {profileData.address?.line1}
                  {profileData.address?.line2 ? ', ' + profileData.address.line2 : ''}
                </span>
            }
          </div>

          <div style={{ ...row, alignItems: 'flex-start' }}>
            <span style={rowLabel}>About</span>
            <span style={{ ...rowVal, lineHeight: '1.6' }}>{profileData.about}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const page      = { fontFamily: "'DM Sans',sans-serif" }
const h1        = { fontSize: '22px', fontWeight: '700', color: '#111827', margin: '0 0 4px' }
const sub       = { fontSize: '13px', color: '#9ca3af', margin: '0 0 20px' }
const row       = { display: 'flex', alignItems: 'center', gap: '16px', padding: '10px 0', borderBottom: '1px solid #f9fafb' }
const rowLabel  = { fontSize: '12px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', width: '110px', flexShrink: 0 }
const rowVal    = { fontSize: '14px', color: '#374151', flex: 1 }
const inp       = { flex: 1, padding: '8px 12px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' }
const editBtn   = { background: '#f0fdf4', color: '#059669', border: '1px solid #bbf7d0', padding: '7px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }
const cancelBtn = { background: '#f3f4f6', color: '#6b7280', border: 'none', padding: '7px 14px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }
const saveBtn   = { background: '#059669', color: '#fff', border: 'none', padding: '7px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }

export default DoctorProfile