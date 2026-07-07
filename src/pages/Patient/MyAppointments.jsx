import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../../context/AppContextProvider'

const MyAppointments = () => {

  const {
    token,
    backendUrl,
    slotDateFormat,
    currency
  } = useContext(AppContext)

  const [appointments, setAppointments] = useState([])
  const [prescriptions, setPrescriptions] = useState({})
  const [loading, setLoading] = useState(true)

  // =========================
  // GET APPOINTMENTS
  // =========================

  const getAppointments = async () => {

    try {

      setLoading(true)

      const { data } = await axios.get(
        backendUrl + '/api/user/appointments',
        {
          headers: { token }
        }
      )

      if (data.success) {

        setAppointments(data.appointments.reverse())

      } else {

        toast.error(data.message)

      }

    } catch (err) {

      toast.error(err.message)

    } finally {

      setLoading(false)

    }

  }

  // =========================
  // GET PRESCRIPTIONS
  // =========================

  const fetchPrescriptions = async () => {

    try {

      const { data } = await axios.get(
        backendUrl + '/api/user/prescriptions',
        {
          headers: { token }
        }
      )

      if (data.success) {

        const map = {}

        data.prescriptions.forEach((p) => {
          map[p.appointmentId] = p
        })

        setPrescriptions(map)

      }

    } catch (err) {

      console.log(err)

    }

  }

  useEffect(() => {

    if (token) {

      getAppointments()
      fetchPrescriptions()

    }

  }, [token])

  // =========================
  // CANCEL APPOINTMENT
  // =========================

  const cancelAppointment = async (id) => {

    try {

      const { data } = await axios.post(
        backendUrl + '/api/user/cancel-appointment',
        {
          appointmentId: id
        },
        {
          headers: { token }
        }
      )

      if (data.success) {

        toast.success('Appointment cancelled')

        getAppointments()

      } else {

        toast.error(data.message)

      }

    } catch (err) {

      toast.error(err.message)

    }

  }

  // =========================
  // RAZORPAY PAYMENT
  // =========================

  const initPay = async (appointmentId, amount) => {

    try {

      const { data } = await axios.post(
        backendUrl + '/api/payment/razorpay',
        {
          appointmentId,
          amount
        },
        {
          headers: { token }
        }
      )

      if (!data.success) {

        return toast.error(data.message)

      }

      const order = data.order

      const options = {

        key: data.key,

        amount: order.amount,

        currency: order.currency,

        name: 'Prescripto',

        description: 'Appointment Payment',

        order_id: order.id,

        handler: async function (response) {

          try {

            const { data: verifyData } = await axios.post(
              backendUrl + '/api/payment/verify',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                appointmentId
              },
              {
                headers: { token }
              }
            )

            if (verifyData.success) {

              toast.success('Payment Successful ✅')

              getAppointments()

            } else {

              toast.error(verifyData.message)

            }

          } catch (err) {

            toast.error(err.message)

          }

        },

        prefill: {
          name: '',
          email: '',
          contact: ''
        },

        theme: {
          color: '#2563EB'
        }

      }

      const rzp = new window.Razorpay(options)

      rzp.open()

    } catch (err) {

      toast.error(err.message)

    }

  }

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <div
        style={{
          textAlign: 'center',
          padding: '60px',
          color: '#9ca3af',
          fontFamily: "'DM Sans',sans-serif"
        }}
      >
        ⏳ Loading appointments...
      </div>
    )

  }

  // =========================
  // UI
  // =========================

  return (

    <div style={page}>

      <h1 style={h1}>
        My Appointments
      </h1>

      <p style={sub}>
        {appointments.length} appointments
      </p>

      {appointments.length === 0 ? (

        <div style={empty}>

          <p
            style={{
              fontSize: '40px',
              margin: '0 0 10px'
            }}
          >
            📅
          </p>

          <p
            style={{
              color: '#9ca3af',
              margin: 0
            }}
          >
            No appointments yet. Book one!
          </p>

        </div>

      ) : (

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}
        >

          {appointments.map((apt) => (

            <div key={apt._id} style={card}>

              {/* Doctor Image */}
              <img
                src={apt.docData?.image}
                alt=""
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '12px',
                  objectFit: 'cover',
                  flexShrink: 0
                }}
              />

              {/* Doctor Info */}
              <div style={{ flex: 1 }}>

                <p
                  style={{
                    margin: '0 0 2px',
                    fontWeight: '700',
                    fontSize: '16px',
                    color: '#111827'
                  }}
                >
                  {apt.docData?.name}
                </p>

                <p
                  style={{
                    margin: '0 0 2px',
                    fontSize: '13px',
                    color: '#6b7280'
                  }}
                >
                  {apt.docData?.speciality}
                </p>

                <p
                  style={{
                    margin: '0 0 8px',
                    fontSize: '13px',
                    color: '#374151'
                  }}
                >
                  📅 {slotDateFormat(apt.slotDate)}
                  &nbsp; · &nbsp;
                  🕐 {apt.slotTime}
                </p>

                <p
                  style={{
                    margin: 0,
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#059669'
                  }}
                >
                  {currency}{apt.amount}
                </p>

              </div>

              {/* Status + Actions */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '8px'
                }}
              >

                {apt.cancelled ? (

                  <span style={badge('#fee2e2', '#dc2626')}>
                    Cancelled
                  </span>

                ) : apt.isCompleted ? (

                  <span style={badge('#dcfce7', '#16a34a')}>
                    Completed
                  </span>

                ) : apt.payment ? (

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      alignItems: 'flex-end'
                    }}
                  >

                    <span style={badge('#dcfce7', '#16a34a')}>
                      Paid ✓
                    </span>

                    <a
                      href={`${backendUrl}/api/payment/invoice/${apt._id}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: '#2563EB',
                        color: '#fff',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        width: '170px',
                        textAlign: 'center',
                        boxShadow: '0 2px 6px rgba(37,99,235,0.25)'
                      }}
                    >
                      📄 Download Invoice
                    </a>

                  </div>

                ) : (

                  <span style={badge('#fef9c3', '#b45309')}>
                    Payment Pending
                  </span>

                )}

                {!apt.cancelled &&
                  !apt.isCompleted &&
                  !apt.payment && (

                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                        flexWrap: 'wrap',
                        justifyContent: 'flex-end'
                      }}
                    >

                      <button
                        onClick={() =>
                          initPay(apt._id, apt.amount)
                        }
                        style={payBtn}
                      >
                        💳 Pay Online
                      </button>

                      <button
                        onClick={() =>
                          cancelAppointment(apt._id)
                        }
                        style={cancelBtn}
                      >
                        ✕ Cancel
                      </button>

                    </div>

                  )}

              </div>

              {/* PRESCRIPTION */}
              {apt.isCompleted && prescriptions[apt._id] && (

                <div
                  style={{
                    marginTop: 14,
                    padding: 14,
                    background: '#eff6ff',
                    borderRadius: 10,
                    border: '1px solid #bfdbfe',
                    width: '100%'
                  }}
                >

                  <p
                    style={{
                      margin: '0 0 8px',
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#1d4ed8'
                    }}
                  >
                    📋 Your Prescription
                  </p>

                  {prescriptions[apt._id].medicines.map((m, i) => (

                    <p
                      key={i}
                      style={{
                        margin: '4px 0',
                        fontSize: 13,
                        color: '#374151'
                      }}
                    >
                      • <strong>{m.name} {m.dosage}</strong>
                      {' '}— {m.frequency} for {m.duration}
                    </p>

                  ))}

                  {prescriptions[apt._id].notes && (

                    <p
                      style={{
                        marginTop: 8,
                        fontSize: 13,
                        color: '#6b7280',
                        fontStyle: 'italic'
                      }}
                    >
                      Note: {prescriptions[apt._id].notes}
                    </p>

                  )}

                </div>

              )}

            </div>

          ))}

        </div>

      )}

    </div>

  )

}

// =========================
// STYLES
// =========================

const badge = (bg, color) => ({
  background: bg,
  color,
  fontSize: '11px',
  fontWeight: '600',
  padding: '4px 10px',
  borderRadius: '20px',
  whiteSpace: 'nowrap'
})

const page = {
  fontFamily: "'DM Sans',sans-serif",
  paddingTop: '24px'
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
  margin: '0 0 22px'
}

const card = {
  background: '#fff',
  borderRadius: '14px',
  padding: '20px',
  border: '1px solid #f3f4f6',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  display: 'flex',
  gap: '18px',
  alignItems: 'flex-start',
  flexWrap: 'wrap'
}

const empty = {
  textAlign: 'center',
  padding: '60px',
  background: '#fff',
  borderRadius: '14px',
  border: '1px solid #f3f4f6'
}

const payBtn = {
  background: '#2563EB',
  color: '#fff',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
  fontFamily: 'inherit'
}

const cancelBtn = {
  background: '#fee2e2',
  color: '#dc2626',
  border: 'none',
  padding: '8px 14px',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
  fontFamily: 'inherit'
}

export default MyAppointments