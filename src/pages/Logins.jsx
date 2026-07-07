import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { AppContext }    from '../context/AppContextProvider'
import { AdminContext }  from '../context/AdminContextProvider'
import { DoctorContext } from '../context/DoctorContextProvider'

const Logins = () => {
  const [role,     setRole]     = useState('patient')
  const [mode,     setMode]     = useState('login')
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [showPass, setShowPass] = useState(false)

  const navigate = useNavigate()
  const { backendUrl, token, setToken }   = useContext(AppContext)
  const { aToken, setAToken }             = useContext(AdminContext)
  const { dToken, setDToken }             = useContext(DoctorContext)

  // ✅ Redirect if already logged in
  useEffect(() => {
    if (token)  navigate('/home')
    if (dToken) navigate('/doctor-dashboard')
    if (aToken) navigate('/admin-dashboard')
  }, [token, dToken, aToken])

  const switchRole = (r) => {
    setRole(r)
    setMode('login')
    setName('')
    setEmail('')
    setPassword('')
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (role === 'patient') {
        const url     = mode === 'signup' ? '/api/user/register' : '/api/user/login'
        const payload = mode === 'signup' ? { name, email, password } : { email, password }
        const { data } = await axios.post(backendUrl + url, payload)
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success(mode === 'signup' ? 'Welcome! Account created.' : 'Welcome back!')
        } else {
          toast.error(data.message)
        }
      }

      if (role === 'doctor') {
        const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password })
        if (data.success) {
          // ✅ FIX: key must be 'dToken' (capital T) to match localStorage.getItem('dToken') in DoctorContext
          localStorage.setItem('dToken', data.token)
          setDToken(data.token)
          toast.success('Welcome, Doctor!')
        } else {
          toast.error(data.message)
        }
      }

      if (role === 'admin') {
        const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
        if (data.success) {
          // ✅ FIX: key must be 'aToken' (capital T) to match localStorage.getItem('aToken') in AdminContext
          localStorage.setItem('aToken', data.token)
          setAToken(data.token)
          toast.success('Welcome, Admin!')
        } else {
          toast.error(data.message)
        }
      }
    } catch (err) {
      toast.error(err.message)
    }
    setLoading(false)
  }

  const roles = [
    { key: 'patient', label: 'Patient', emoji: '🧑‍⚕️', desc: 'Book & manage appointments',  accent: '#2563EB', light: '#eff6ff', border: '#bfdbfe' },
    { key: 'doctor',  label: 'Doctor',  emoji: '👨‍⚕️', desc: 'Access your patient schedule', accent: '#059669', light: '#f0fdf4', border: '#bbf7d0' },
    { key: 'admin',   label: 'Admin',   emoji: '🔐',   desc: 'Manage the entire platform',   accent: '#7C3AED', light: '#faf5ff', border: '#e9d5ff' },
  ]
  const cur = roles.find(r => r.key === role)

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#eff6ff 0%,#fefefe 50%,#f0fdf4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: "'DM Sans',sans-serif" }}>

      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '56px', height: '56px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', margin: '0 auto 10px' }}>🏥</div>
          <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: '26px', color: '#1e1b4b', margin: '0 0 4px' }}>Prescripto</h1>
          <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>Healthcare appointment platform</p>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.08)', overflow: 'hidden', border: '1px solid #f3f4f6' }}>

          {/* Role tabs */}
          <div style={{ display: 'flex', background: '#f9fafb', borderBottom: '1px solid #f3f4f6' }}>
            {roles.map(r => (
              <button key={r.key} onClick={() => switchRole(r.key)}
                style={{ flex: 1, padding: '13px 6px', border: 'none', cursor: 'pointer', background: role === r.key ? '#fff' : 'transparent', borderBottom: `2.5px solid ${role === r.key ? r.accent : 'transparent'}`, transition: 'all 0.2s', fontFamily: 'inherit' }}>
                <div style={{ fontSize: '18px', marginBottom: '2px' }}>{r.emoji}</div>
                <div style={{ fontSize: '12px', fontWeight: role === r.key ? '600' : '400', color: role === r.key ? r.accent : '#9ca3af' }}>{r.label}</div>
              </button>
            ))}
          </div>

          <div style={{ padding: '28px 28px 32px' }}>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: '0 0 4px' }}>
                {mode === 'signup' ? 'Create Account' : `${cur.label} Sign In`}
              </h2>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>{cur.desc}</p>
            </div>

            {/* Security badge for admin/doctor */}
            {role !== 'patient' && (
              <div style={{ background: cur.light, border: `1px solid ${cur.border}`, borderRadius: '10px', padding: '9px 13px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🔒</span>
                <span style={{ fontSize: '12px', color: cur.accent, fontWeight: '500' }}>
                  {role === 'admin' ? 'Restricted — Admin credentials only' : 'Verified healthcare professionals only'}
                </span>
              </div>
            )}

            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {role === 'patient' && mode === 'signup' && (
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="John Doe"
                    style={inputStyle} onFocus={e => e.target.style.borderColor = cur.accent} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                </div>
              )}
              <div>
                <label style={labelStyle}>Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                  style={inputStyle} onFocus={e => e.target.style.borderColor = cur.accent} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                    style={{ ...inputStyle, paddingRight: '42px' }} onFocus={e => e.target.style.borderColor = cur.accent} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px' }}>
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                style={{ width: '100%', padding: '13px', background: loading ? '#d1d5db' : cur.accent, color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', marginTop: '4px' }}>
                {loading ? '⏳ Please wait...' : mode === 'signup' ? 'Create Account' : `Sign In as ${cur.label}`}
              </button>
            </form>

            {role === 'patient' && (
              <p style={{ textAlign: 'center', fontSize: '13px', color: '#9ca3af', marginTop: '18px', marginBottom: 0 }}>
                {mode === 'login'
                  ? <>New here? <span onClick={() => setMode('signup')} style={{ color: cur.accent, fontWeight: '600', cursor: 'pointer' }}>Create account</span></>
                  : <>Have account? <span onClick={() => setMode('login')} style={{ color: cur.accent, fontWeight: '600', cursor: 'pointer' }}>Sign in</span></>
                }
              </p>
            )}
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '11px', color: '#d1d5db', marginTop: '14px' }}>🔐 All data encrypted &amp; secure</p>
      </div>
    </div>
  )
}

const labelStyle = { fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }
const inputStyle = { width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s' }

export default Logins