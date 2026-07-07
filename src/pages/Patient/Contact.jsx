import React from 'react'
import { useNavigate } from 'react-router-dom'

const Contact = () => {
  const navigate = useNavigate()

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", paddingTop: '28px', paddingBottom: '60px', maxWidth: '740px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontFamily: "'DM Serif Display',serif", color: '#1e1b4b', margin: '0 0 4px', textAlign: 'center' }}>Contact Us</h1>
      <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '14px', margin: '0 0 40px' }}>We're here to help</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
        {[
          { icon: '📧', title: 'Email', value: 'support@prescripto.com' },
          { icon: '📞', title: 'Phone', value: '+91 98765 43210' },
          { icon: '📍', title: 'Address', value: 'Healthcare Street, Bangalore, India' },
          { icon: '⏰', title: 'Hours',   value: 'Mon–Sat, 9 AM – 6 PM' },
        ].map(c => (
          <div key={c.title} style={{ background: '#fff', borderRadius: '14px', padding: '22px', border: '1px solid #f3f4f6', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '24px' }}>{c.icon}</span>
            <div>
              <p style={{ margin: '0 0 4px', fontWeight: '700', fontSize: '14px', color: '#111827' }}>{c.title}</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', border: '1px solid #f3f4f6' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: '0 0 20px' }}>Send us a message</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <input placeholder="Your name" style={inp} />
          <input placeholder="Your email" type="email" style={inp} />
          <textarea placeholder="Your message..." rows={4} style={{ ...inp, resize: 'vertical' }} />
          <button style={{ background: '#2563EB', color: '#fff', border: 'none', padding: '13px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
            Send Message →
          </button>
        </div>
      </div>
    </div>
  )
}

const inp = { padding: '11px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' }

export default Contact