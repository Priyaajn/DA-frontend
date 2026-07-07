// ── SAVE THIS FILE AS: src/pages/Patient/About.jsx ────────────

import React from 'react'
import { useNavigate } from 'react-router-dom'

const About = () => {
  const navigate = useNavigate()
  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", paddingTop: '28px', paddingBottom: '60px', maxWidth: '740px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontFamily: "'DM Serif Display',serif", color: '#1e1b4b', margin: '0 0 4px', textAlign: 'center' }}>About Prescripto</h1>
      <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '14px', margin: '0 0 40px' }}>A smarter way to access healthcare</p>

      <div style={{ display: 'flex', gap: '32px', alignItems: 'center', marginBottom: '48px' }}>
        <div style={{ fontSize: '80px', flexShrink: 0 }}>🏥</div>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', margin: '0 0 10px' }}>Our Mission</h2>
          <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
            Prescripto connects patients with trusted, verified doctors across all major medical specialities. We believe healthcare should be accessible, fast, and stress-free. Our platform lets you book appointments in minutes — no waiting rooms, no phone calls.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '40px' }}>
        {[
          { icon: '💡', title: 'Innovation',     desc: 'We use modern technology to streamline every step of the healthcare journey.' },
          { icon: '🛡️', title: 'Trust',           desc: 'Every doctor is verified, licensed, and reviewed by our medical team.' },
          { icon: '❤️', title: 'Patient First',   desc: 'Everything we build starts and ends with the needs of our patients.' },
        ].map(v => (
          <div key={v.title} style={{ background: '#fff', borderRadius: '14px', padding: '22px', border: '1px solid #f3f4f6', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>{v.icon}</div>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#111827', margin: '0 0 6px' }}>{v.title}</h3>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: 0, lineHeight: '1.6' }}>{v.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '40px' }}>
        {[['100+', 'Verified Doctors'], ['10,000+', 'Appointments Booked'], ['98%', 'Patient Satisfaction']].map(([val, label]) => (
          <div key={label} style={{ background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', borderRadius: '14px', padding: '24px', textAlign: 'center', color: '#fff' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>{val}</div>
            <div style={{ fontSize: '12px', color: '#bfdbfe' }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#7C3AED', borderRadius: '16px', padding: '36px', textAlign: 'center', color: '#fff' }}>
        <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: '22px', margin: '0 0 8px' }}>Ready to get started?</h3>
        <p style={{ color: '#e9d5ff', fontSize: '13px', margin: '0 0 20px' }}>Find the right doctor for you today.</p>
        <button onClick={() => navigate('/doctors')} style={{ background: '#fff', color: '#7C3AED', border: 'none', padding: '11px 28px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>Browse Doctors →</button>
      </div>
    </div>
  )
}

export default About