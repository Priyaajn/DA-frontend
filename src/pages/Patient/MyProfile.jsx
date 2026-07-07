import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../../context/AppContextProvider'

const MyProfile = () => {
  const { userData, setUserData, backendUrl, token, loadUserProfileData } = useContext(AppContext)
  const [editing, setEditing] = useState(false)
  const [saving,  setSaving]  = useState(false)
  const [form,    setForm]    = useState(null)

  useEffect(() => {
    if (userData) setForm({ name: userData.name || '', phone: userData.phone || '', gender: userData.gender || '', dob: userData.dob || '', line1: userData.address?.line1 || '', line2: userData.address?.line2 || '' })
  }, [userData])

  if (!userData || !form) return <div style={{ padding: '80px', textAlign: 'center', color: '#9ca3af' }}>⏳ Loading profile...</div>

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

  const save = async () => {
    setSaving(true)
    try {
      const { data } = await axios.post(backendUrl + '/api/user/update-profile',
        { name: form.name, phone: form.phone, gender: form.gender, dob: form.dob, address: { line1: form.line1, line2: form.line2 } },
        { headers: { token } })
      if (data.success) { toast.success('Profile updated!'); await loadUserProfileData(); setEditing(false) }
      else toast.error(data.message)
    } catch (e) { toast.error(e.message) }
    setSaving(false)
  }

  const Field = ({ label, value }) => (
    <div style={row}>
      <span style={lbl}>{label}</span>
      <span style={{ fontSize: '14px', color: '#374151', flex: 1 }}>{value || '—'}</span>
    </div>
  )

  const Input = ({ label, field, type = 'text', options }) => (
    <div style={row}>
      <span style={lbl}>{label}</span>
      {options
        ? <select value={form[field]} onChange={set(field)} style={inp}>{options.map(o => <option key={o}>{o}</option>)}</select>
        : <input type={type} value={form[field]} onChange={set(field)} style={inp} />
      }
    </div>
  )

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", paddingTop: '28px', paddingBottom: '60px', maxWidth: '640px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', margin: '0 0 20px' }}>My Profile</h1>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', borderRadius: '16px', padding: '28px', display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
        <img src={userData.image} alt="" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.5)' }} />
        <div>
          <h2 style={{ fontFamily: "'DM Serif Display',serif", color: '#fff', fontSize: '22px', margin: '0 0 4px' }}>{userData.name}</h2>
          <p style={{ color: '#bfdbfe', fontSize: '13px', margin: 0 }}>{userData.email}</p>
        </div>
      </div>

      {/* Details card */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f3f4f6', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#111827' }}>Personal Information</h3>
          {!editing
            ? <button onClick={() => setEditing(true)} style={editBtn}>✏️ Edit</button>
            : <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setEditing(false)} style={cancelBtn}>Cancel</button>
                <button onClick={save} disabled={saving} style={saveBtn}>{saving ? 'Saving...' : 'Save Changes'}</button>
              </div>
          }
        </div>

        {!editing ? (
          <>
            <Field label="Full Name" value={userData.name} />
            <Field label="Phone"     value={userData.phone === '000000000' ? null : userData.phone} />
            <Field label="Gender"    value={userData.gender === 'Not Selected' ? null : userData.gender} />
            <Field label="Birthday"  value={userData.dob   === 'Not Selected' ? null : userData.dob} />
            <Field label="Address"   value={[userData.address?.line1, userData.address?.line2].filter(Boolean).join(', ')} />
          </>
        ) : (
          <>
            <Input label="Full Name" field="name" />
            <Input label="Phone"     field="phone" />
            <Input label="Gender"    field="gender" options={['Not Selected','Male','Female','Other']} />
            <Input label="Birthday"  field="dob" type="date" />
            <Input label="Address 1" field="line1" />
            <Input label="Address 2" field="line2" />
          </>
        )}
      </div>
    </div>
  )
}

const row       = { display: 'flex', alignItems: 'center', gap: '16px', padding: '11px 0', borderBottom: '1px solid #f9fafb' }
const lbl       = { fontSize: '12px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', width: '110px', flexShrink: 0 }
const inp       = { flex: 1, padding: '8px 12px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }
const editBtn   = { background: '#eff6ff', color: '#2563EB', border: '1px solid #bfdbfe', padding: '7px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }
const cancelBtn = { background: '#f3f4f6', color: '#6b7280', border: 'none', padding: '7px 14px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }
const saveBtn   = { background: '#2563EB', color: '#fff', border: 'none', padding: '7px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }

export default MyProfile