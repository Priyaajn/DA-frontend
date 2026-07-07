import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContextProvider'

const specialities = [
  { name: 'General physician',   icon: '🩺' },
  { name: 'Gynecologist',        icon: '👩‍⚕️' },
  { name: 'Dermatologist',       icon: '🧴' },
  { name: 'Pediatricians',       icon: '👶' },
  { name: 'Neurologist',         icon: '🧠' },
  { name: 'Gastroenterologist',  icon: '🫁' },
]

const Home = () => {
  const navigate = useNavigate()
  const { userData } = useContext(AppContext)

  return (
    <div style={{ paddingBottom: '60px', fontFamily: "'DM Sans',sans-serif" }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#1d4ed8,#2563EB,#3b82f6)', borderRadius: '20px', padding: '48px 40px', marginTop: '28px', display: 'flex', alignItems: 'center', gap: '32px' }}>
        <div style={{ flex: 1 }}>
          <p style={{ color: '#bfdbfe', fontSize: '13px', fontWeight: '600', letterSpacing: '0.08em', margin: '0 0 10px', textTransform: 'uppercase' }}>Healthcare Platform</p>
          <h1 style={{ fontFamily: "'DM Serif Display',serif", color: '#fff', fontSize: '38px', lineHeight: '1.2', margin: '0 0 14px' }}>Book Appointment<br/>With Trusted Doctors</h1>
          <p style={{ color: '#bfdbfe', fontSize: '14px', margin: '0 0 24px', lineHeight: '1.6', maxWidth: '380px' }}>
            Browse our network of verified healthcare professionals and schedule your visit in minutes.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => navigate('/doctors')} style={{ background: '#fff', color: '#2563EB', border: 'none', padding: '12px 28px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
              Book Appointment →
            </button>
            <button onClick={() => navigate('/my-appointments')} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
              My Appointments
            </button>
          </div>
        </div>
        <div style={{ fontSize: '120px', lineHeight: 1, flexShrink: 0, display: 'none' }}>🏥</div>
      </div>

      {/* Welcome strip */}
      {userData && (
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '14px', padding: '16px 20px', marginTop: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img src={userData.image} alt="" style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
          <p style={{ margin: 0, fontSize: '15px', color: '#1d4ed8', fontWeight: '600' }}>Welcome back, {userData.name} 👋</p>
          <button onClick={() => navigate('/my-profile')} style={{ marginLeft: 'auto', background: '#2563EB', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>My Profile</button>
        </div>
      )}

      {/* Specialities */}
      <div style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', margin: '0 0 4px' }}>Find by Speciality</h2>
        <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0 0 20px' }}>Browse doctors by their area of expertise</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '12px' }}>
          {specialities.map(s => (
            <div key={s.name} onClick={() => navigate(`/doctors/${s.name}`)}
              style={{ background: '#fff', borderRadius: '14px', padding: '20px 12px', textAlign: 'center', border: '1px solid #f3f4f6', cursor: 'pointer', transition: 'all 0.15s', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(37,99,235,0.12)' }}
              onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
              <p style={{ margin: 0, fontSize: '11px', fontWeight: '600', color: '#374151', lineHeight: '1.3' }}>{s.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why us */}
      <div style={{ marginTop: '48px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', margin: '0 0 4px', textAlign: 'center' }}>Why Choose Prescripto</h2>
        <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '13px', margin: '0 0 24px' }}>Built for modern healthcare needs</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
          {[
            { icon: '⚡', title: 'Instant Booking',    desc: 'Book appointments in under 2 minutes with real-time slot availability.' },
            { icon: '🛡️', title: 'Verified Doctors',   desc: 'Every doctor on our platform is verified, licensed, and experienced.' },
            { icon: '🔔', title: 'Smart Reminders',    desc: 'Get notified before your appointment so you never miss a visit.' },
          ].map(c => (
            <div key={c.title} style={{ background: '#fff', borderRadius: '14px', padding: '24px', border: '1px solid #f3f4f6', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>{c.icon}</div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#111827', margin: '0 0 6px' }}>{c.title}</h3>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, lineHeight: '1.6' }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ marginTop: '40px', background: 'linear-gradient(135deg,#7C3AED,#6d28d9)', borderRadius: '16px', padding: '40px', textAlign: 'center', color: '#fff' }}>
        <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: '26px', margin: '0 0 8px' }}>Ready to book your appointment?</h2>
        <p style={{ color: '#e9d5ff', fontSize: '14px', margin: '0 0 20px' }}>Join thousands of patients who trust Prescripto</p>
        <button onClick={() => navigate('/doctors')} style={{ background: '#fff', color: '#7C3AED', border: 'none', padding: '12px 32px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
          Browse All Doctors →
        </button>
      </div>

    </div>
  )
}

export default Home