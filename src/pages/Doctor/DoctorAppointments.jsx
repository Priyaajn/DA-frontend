import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext }  from '../../context/DoctorContextProvider'
import { AppContext }     from '../../context/AppContextProvider'
import PrescriptionForm  from '../../components/Doctor/PrescriptionForm'
import Invoices from '../Patient/Invoices'


const DoctorAppointments = () => {
  const { appointments, getAppointments, cancelAppointment } = useContext(DoctorContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)
  const [openRx, setOpenRx] = useState(null)

  useEffect(() => { getAppointments() }, [])

  return (
    <div style={page}>
      <h1 style={h1}>My Appointments</h1>
      <p style={sub}>{appointments.length} appointments found</p>

      <div style={tableWrap}>

        {/* Table header */}
        <div style={thead}>
          <span>#</span>
          <span>Patient</span>
          <span>Age</span>
          <span>Date & Time</span>
          <span>Fees</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {appointments.map((apt, i) => (
          <div key={apt._id}>

            {/* Main row */}
            <div style={trow}>

              <span style={{ color: '#9ca3af' }}>{i + 1}</span>

              {/* Patient */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img
                  src={apt.userData?.image}
                  alt=""
                  style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', background: '#e5e7eb' }}
                />
                <div>
                  <p style={nm}>{apt.userData?.name}</p>
                  <p style={sm}>{apt.userData?.gender || 'Not Selected'}</p>
                </div>
              </div>

              {/* Age */}
              <span style={{ fontSize: 13, color: '#374151' }}>
                {apt.userData?.dob && apt.userData.dob !== 'Not Selected'
                  ? calculateAge(apt.userData.dob) + ' yrs'
                  : '—'}
              </span>

              {/* Date & Time */}
              <div>
                <p style={nm}>{slotDateFormat(apt.slotDate)}</p>
                <p style={sm}>{apt.slotTime}</p>
              </div>

              {/* Fees */}
              <span style={{ fontWeight: 600, color: '#059669' }}>
                {currency}{apt.amount}
              </span>

              {/* Status badge */}
              {apt.cancelled
                ? <span style={badge('#fee2e2', '#dc2626')}>Cancelled</span>
                : apt.isCompleted
                ? <span style={badge('#dcfce7', '#16a34a')}>Completed</span>
                : <span style={badge('#dbeafe', '#2563EB')}>Upcoming</span>
              }

              {/* Actions */}
              {!apt.cancelled && !apt.isCompleted ? (
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => setOpenRx(openRx === apt._id ? null : apt._id)}
                    style={greenBtn}
                    title="Write prescription & complete"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => cancelAppointment(apt._id)}
                    style={redBtn}
                    title="Cancel appointment"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <span style={{ color: '#d1d5db' }}>—</span>
              )}

            </div>

            {/* Prescription form — expands below row when ✓ clicked */}
            {openRx === apt._id && (
  <div style={{ padding: '0 18px 16px' }}>
    <PrescriptionForm
      appointment={apt}
      onDone={() => {
        setOpenRx(null)
        getAppointments()
      }}
    />

    <Invoices appointment={apt} />
  </div>
)}
          </div>
        ))}

      </div>
    </div>
  )
}

const page      = { fontFamily: "'DM Sans',sans-serif" }
const h1        = { fontSize: 22, fontWeight: 700, color: '#111827', margin: '0 0 4px' }
const sub       = { fontSize: 13, color: '#9ca3af', margin: '0 0 18px' }
const tableWrap = { background: '#fff', borderRadius: 14, border: '1px solid #f3f4f6', overflow: 'hidden' }
const thead     = { display: 'grid', gridTemplateColumns: '40px 1.6fr 60px 1.2fr 80px 90px 80px', gap: 12, padding: '12px 18px', background: '#f9fafb', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #f3f4f6' }
const trow      = { display: 'grid', gridTemplateColumns: '40px 1.6fr 60px 1.2fr 80px 90px 80px', gap: 12, padding: '14px 18px', alignItems: 'center', borderBottom: '1px solid #f9fafb' }
const nm        = { margin: 0, fontSize: 13, fontWeight: 600, color: '#111827' }
const sm        = { margin: 0, fontSize: 11, color: '#9ca3af' }
const badge     = (bg, c) => ({ background: bg, color: c, fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 20 })
const greenBtn  = { background: '#dcfce7', color: '#16a34a', border: 'none', width: 30, height: 28, borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 14 }
const redBtn    = { background: '#fee2e2', color: '#dc2626', border: 'none', width: 30, height: 28, borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 14 }

export default DoctorAppointments