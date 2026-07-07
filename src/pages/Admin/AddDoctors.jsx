import React, { useState, useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AdminContext } from '../../context/AdminContextProvider'
import { AppContext }   from '../../context/AppContextProvider'

const specialities = ['General physician','Gynecologist','Dermatologist','Pediatricians','Neurologist','Gastroenterologist']
const experiences  = ['1 Year','2 Years','3 Years','5 Years','7 Years','10+ Years']

const AddDoctors = () => {
  const { aToken }     = useContext(AdminContext)
  const { backendUrl } = useContext(AppContext)

  const [img,     setImg]     = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [form,    setForm]    = useState({
    name: '', email: '', password: '', speciality: 'General physician',
    degree: '', experience: '1 Year', about: '', fees: '', address1: '', address2: ''
  })

  const handleImg = (e) => {
    const file = e.target.files[0]
    if (file) { setImg(file); setPreview(URL.createObjectURL(file)) }
  }

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!img) { toast.warn('Please upload a doctor image'); return }
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('image', img)
      fd.append('name', form.name)
      fd.append('email', form.email)
      fd.append('password', form.password)
      fd.append('speciality', form.speciality)
      fd.append('degree', form.degree)
      fd.append('experience', form.experience)
      fd.append('about', form.about)
      fd.append('fees', form.fees)
      fd.append('address', JSON.stringify({ line1: form.address1, line2: form.address2 }))

      // ✅ FIX: was { Authorization: dtoken } — must be { atoken: aToken } lowercase
      const { data } = await axios.post(
        backendUrl + '/api/admin/add-doctor',
        fd,
        { headers: { atoken: aToken } }
      )

      if (data.success) {
        toast.success('Doctor added successfully!')
        setForm({
          name: '', email: '', password: '', speciality: 'General physician',
          degree: '', experience: '1 Year', about: '', fees: '', address1: '', address2: ''
        })
        setImg(null)
        setPreview(null)
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error(err.message)
    }
    setLoading(false)
  }

  return (
    <div style={page}>
      <h1 style={h1}>Add New Doctor</h1>
      <p style={sub}>Fill in the details to register a new doctor on the platform</p>

      <form onSubmit={onSubmit} style={formBox}>

        {/* Image Upload */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
          <label htmlFor="docImg" style={{ cursor: 'pointer' }}>
            <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: preview ? 'transparent' : '#eff6ff', border: '2px dashed #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {preview
                ? <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: '28px' }}>👨‍⚕️</span>
              }
            </div>
            <input id="docImg" type="file" accept="image/*" onChange={handleImg} style={{ display: 'none' }} />
          </label>
          <div>
            <p style={{ margin: '0 0 4px', fontWeight: '600', fontSize: '14px', color: '#374151' }}>Doctor Photo</p>
            <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>Click to upload. JPG/PNG, max 2MB</p>
          </div>
        </div>

        <div style={grid2}>
          <Field label="Full Name">
            <input value={form.name} onChange={set('name')} required placeholder="Dr. John Smith" style={inp} />
          </Field>
          <Field label="Email">
            <input value={form.email} onChange={set('email')} required placeholder="doctor@example.com" type="email" style={inp} />
          </Field>
          <Field label="Password">
            <input value={form.password} onChange={set('password')} required placeholder="Min 8 characters" type="password" style={inp} />
          </Field>
          <Field label="Degree">
            <input value={form.degree} onChange={set('degree')} required placeholder="MBBS, MD..." style={inp} />
          </Field>
          <Field label="Consultation Fees (₹)">
            <input value={form.fees} onChange={set('fees')} required placeholder="500" type="number" style={inp} />
          </Field>
          <Field label="Speciality">
            <select value={form.speciality} onChange={set('speciality')} style={inp}>
              {specialities.map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Experience">
            <select value={form.experience} onChange={set('experience')} style={inp}>
              {experiences.map(e => <option key={e}>{e}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Address Line 1">
          <input value={form.address1} onChange={set('address1')} required placeholder="Street address" style={inp} />
        </Field>
        <Field label="Address Line 2">
          <input value={form.address2} onChange={set('address2')} placeholder="City, State" style={inp} />
        </Field>
        <Field label="About Doctor">
          <textarea value={form.about} onChange={set('about')} required placeholder="Brief bio about the doctor, expertise, achievements..." style={{ ...inp, height: '100px', resize: 'vertical' }} />
        </Field>

        <button
          type="submit"
          disabled={loading}
          style={{ background: loading ? '#d1d5db' : '#7C3AED', color: '#fff', border: 'none', padding: '13px 32px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', marginTop: '8px' }}
        >
          {loading ? '⏳ Adding Doctor...' : '➕ Add Doctor'}
        </button>

      </form>
    </div>
  )
}

const Field = ({ label, children }) => (
  <div style={{ marginBottom: '14px' }}>
    <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
    {children}
  </div>
)

const page    = { fontFamily: "'DM Sans',sans-serif" }
const h1      = { fontSize: '22px', fontWeight: '700', color: '#111827', margin: '0 0 4px' }
const sub     = { fontSize: '13px', color: '#9ca3af', margin: '0 0 24px' }
const formBox = { background: '#fff', borderRadius: '14px', padding: '28px', border: '1px solid #f3f4f6', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', maxWidth: '680px' }
const grid2   = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }
const inp     = { width: '100%', padding: '10px 13px', border: '1.5px solid #e5e7eb', borderRadius: '9px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }

export default AddDoctors