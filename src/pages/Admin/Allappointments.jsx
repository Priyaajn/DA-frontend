import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContextProvider'
import { AppContext } from '../../context/AppContextProvider'

const Allappointments = () => {

  // ADMIN CONTEXT
  const {
    appointments,
    getAllAppointments,
    cancelAppointment
  } = useContext(AdminContext)

  // APP CONTEXaT
  const {
    slotDateFormat,
    currency
  } = useContext(AppContext)

  useEffect(() => {
    getAllAppointments()
  }, [])

  return (
    <div style={page}>
      <h1 style={h1}>All Appointments</h1>

      <p style={sub}>
        {appointments.length} total appointments on the platform
      </p>

      <div style={card}>

        {/* TABLE HEADER */}
        <div style={theader}>
          <span>#</span>
          <span>Patient</span>
          <span>Date & Time</span>
          <span>Doctor</span>
          <span>Fees</span>
          <span>Payment</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {appointments.length === 0 && (
          <p
            style={{
              textAlign: 'center',
              padding: '40px',
              color: '#9ca3af'
            }}
          >
            No appointments found.
          </p>
        )}

        {appointments.map((apt, i) => (
          <div key={apt._id} style={trow}>

            <span
              style={{
                color: '#9ca3af',
                fontSize: '13px'
              }}
            >
              {i + 1}
            </span>

            {/* PATIENT */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <img
                src={apt.userData?.image}
                alt=""
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />

              <div>
                <p style={name}>{apt.userData?.name}</p>
                <p style={small}>{apt.userData?.gender}</p>
              </div>
            </div>

            {/* DATE */}
            <div>
              <p style={name}>
                {slotDateFormat(apt.slotDate)}
              </p>

              <p style={small}>{apt.slotTime}</p>
            </div>

            {/* DOCTOR */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <img
                src={apt.docData?.image}
                alt=""
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />

              <p style={name}>{apt.docData?.name}</p>
            </div>

            {/* FEES */}
            <span
              style={{
                fontWeight: '600',
                color: '#374151'
              }}
            >
              {currency}{apt.amount}
            </span>

            {/* PAYMENT */}
            {apt.payment ? (
              <span style={badge('#dcfce7', '#16a34a')}>
                Paid
              </span>
            ) : (
              <span style={badge('#fef9c3', '#b45309')}>
                Pending
              </span>
            )}

            {/* STATUS */}
            {apt.cancelled ? (
              <span style={badge('#fee2e2', '#dc2626')}>
                Cancelled
              </span>
            ) : apt.isCompleted ? (
              <span style={badge('#dcfce7', '#16a34a')}>
                Completed
              </span>
            ) : (
              <span style={badge('#dbeafe', '#2563EB')}>
                Upcoming
              </span>
            )}

            {/* ACTION */}
            {!apt.cancelled && !apt.isCompleted ? (
              <button
                onClick={() => cancelAppointment(apt._id)}
                style={{
                  background: '#fee2e2',
                  color: '#dc2626',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '5px 12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            ) : (
              <span
                style={{
                  color: '#d1d5db',
                  fontSize: '12px'
                }}
              >
                —
              </span>
            )}

          </div>
        ))}
      </div>
    </div>
  )
}

// STYLES
const page = {
  fontFamily: "'DM Sans',sans-serif"
}

const h1 = {
  fontSize: '22px',
  fontWeight: '700',
  color: '#111827',
  margin: '0 0 4px'
}

const sub = {
  fontSize: '13px',
  color: '#9ca3af',
  margin: '0 0 20px'
}

const card = {
  background: '#fff',
  borderRadius: '14px',
  border: '1px solid #f3f4f6',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  overflow: 'hidden'
}

const theader = {
  display: 'grid',
  gridTemplateColumns: '40px 1.5fr 1.1fr 1.2fr 70px 70px 90px 80px',
  gap: '10px',
  padding: '12px 20px',
  background: '#f9fafb',
  fontSize: '11px',
  fontWeight: '700',
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  borderBottom: '1px solid #f3f4f6'
}

const trow = {
  display: 'grid',
  gridTemplateColumns: '40px 1.5fr 1.1fr 1.2fr 70px 70px 90px 80px',
  gap: '10px',
  padding: '14px 20px',
  alignItems: 'center',
  borderBottom: '1px solid #f9fafb'
}

const name = {
  margin: 0,
  fontSize: '13px',
  fontWeight: '600',
  color: '#111827'
}

const small = {
  margin: 0,
  fontSize: '11px',
  color: '#9ca3af'
}

const badge = (bg, color) => ({
  background: bg,
  color,
  fontSize: '11px',
  fontWeight: '600',
  padding: '3px 8px',
  borderRadius: '20px',
  width: 'fit-content'
})

export default Allappointments