import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../../context/AppContextProvider'


const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

const Appointment = () => {

  const { docId } = useParams()
  const navigate = useNavigate()

  const {
    doctors,
    getDoctorsData,
    token,
    backendUrl,
    currency
  } = useContext(AppContext)

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')
  const [loading, setLoading] = useState(false)

  // Fetch Doctor Info
  useEffect(() => {

    if (doctors.length > 0) {

      const doctor = doctors.find(doc => doc._id === docId)

      setDocInfo(doctor || null)
    }

  }, [doctors, docId])

  // Generate Slots
  useEffect(() => {

    if (docInfo) {
      generateSlots()
    }

  }, [docInfo])

  const generateSlots = () => {

    const slots = []
    const today = new Date()

    for (let i = 0; i < 7; i++) {

      const currentDate = new Date(today)

      currentDate.setDate(today.getDate() + i)

      const endTime = new Date(currentDate)

      endTime.setHours(21, 0, 0, 0)

      // Start timing
      if (i === 0) {

        currentDate.setHours(
          currentDate.getHours() < 10
            ? 10
            : currentDate.getHours() + 1
        )

        currentDate.setMinutes(
          currentDate.getMinutes() > 30 ? 30 : 0
        )

      } else {

        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      currentDate.setSeconds(0)

      const daySlots = []

      while (currentDate < endTime) {

        const time = currentDate.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })

        const d = currentDate.getDate()
        const m = currentDate.getMonth() + 1
        const y = currentDate.getFullYear()

        const slotDate = `${d}_${m}_${y}`

        // Check booked
        const booked =
          (docInfo.slots_booked?.[slotDate] || []).includes(time)

        daySlots.push({
          datetime: new Date(currentDate),
          time,
          booked
        })

        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }

      slots.push(daySlots)
    }

    setDocSlots(slots)
  }

  // Book Appointment
  const bookAppointment = async () => {

    if (!token) {

      toast.warn('Please login first')

      return navigate('/login')
    }

    if (!slotTime) {

      return toast.warn('Please select a slot')
    }

    const selectedDate = docSlots[slotIndex]?.[0]?.datetime

    if (!selectedDate) return

    const d = selectedDate.getDate()
    const m = selectedDate.getMonth() + 1
    const y = selectedDate.getFullYear()

    const slotDate = `${d}_${m}_${y}`

    try {

      setLoading(true)

      const { data } = await axios.post(

        backendUrl + '/api/user/book-appointment',

        {
          docId,
          slotDate,
          slotTime
        },

        {
          headers: {
            token
          }
        }
      )

      if (data.success) {

        toast.success('Appointment Booked')

        await getDoctorsData()

        navigate('/my-appointments')

      } else {

        toast.error(data.message)
      }

    } catch (error) {

      toast.error(
        error.response?.data?.message || error.message
      )

    } finally {

      setLoading(false)
    }
  }

  if (!docInfo) {

    return (
      <div
        style={{
          textAlign: 'center',
          padding: '80px',
          color: '#9ca3af',
          fontFamily: "'DM Sans',sans-serif"
        }}
      >
        <p style={{ fontSize: '32px' }}>⏳</p>
        <p>Loading doctor info...</p>
      </div>
    )
  }

  const today = new Date()

  const slotDates = Array.from({ length: 7 }, (_, i) => {

    const date = new Date(today)

    date.setDate(today.getDate() + i)

    return date
  })

  return (

    <div style={page}>

      {/* Doctor Card */}
      <div style={docCard}>

        <img
          src={docInfo.image}
          alt=""
          style={docImg}
        />

        <div style={docInfo2}>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '6px'
            }}
          >

            <h1
              style={{
                margin: 0,
                fontSize: '22px',
                fontWeight: '700',
                color: '#111827'
              }}
            >
              {docInfo.name}
            </h1>

            <span
              style={{
                color: '#2563EB',
                fontSize: '18px'
              }}
            >
              ✔
            </span>

          </div>

          <p
            style={{
              margin: '0 0 4px',
              fontSize: '14px',
              color: '#6b7280'
            }}
          >
            {docInfo.degree} · {docInfo.speciality}
          </p>

          <span style={expBadge}>
            {docInfo.experience}
          </span>

          <div style={{ marginTop: '14px' }}>

            <p
              style={{
                margin: '0 0 6px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#111827'
              }}
            >
              About
            </p>

            <p
              style={{
                margin: 0,
                fontSize: '13px',
                color: '#6b7280',
                lineHeight: '1.6',
                maxWidth: '600px'
              }}
            >
              {docInfo.about}
            </p>

          </div>

          <p
            style={{
              marginTop: '12px',
              fontSize: '14px',
              color: '#111827'
            }}
          >
            Consultation Fee:{' '}
            <strong style={{ color: '#059669' }}>
              {currency}{docInfo.fees}
            </strong>
          </p>

        </div>

      </div>

      {/* Slots */}
      <div style={slotSection}>

        <h2
          style={{
            fontSize: '17px',
            fontWeight: '700',
            color: '#111827',
            margin: '0 0 16px'
          }}
        >
          Select Appointment Date
        </h2>

        {/* Date Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            paddingBottom: '8px',
            marginBottom: '20px'
          }}
        >

          {slotDates.map((date, i) => (

            <button
              key={i}

              onClick={() => {

                setSlotIndex(i)
                setSlotTime('')
              }}

              style={{
                minWidth: '64px',
                padding: '10px 8px',
                borderRadius: '12px',
                border: 'none',
                background:
                  slotIndex === i
                    ? '#2563EB'
                    : '#f3f4f6',

                color:
                  slotIndex === i
                    ? '#fff'
                    : '#374151',

                cursor: 'pointer',
                fontFamily: 'inherit',
                flexShrink: 0,
                transition: 'all 0.15s'
              }}
            >

              <div
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  marginBottom: '4px'
                }}
              >
                {DAYS[date.getDay()]}
              </div>

              <div
                style={{
                  fontSize: '18px',
                  fontWeight: '700'
                }}
              >
                {date.getDate()}
              </div>

            </button>
          ))}

        </div>

        {/* Time Slots */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '24px'
          }}
        >

          {docSlots[slotIndex]?.map((slot, i) => (

            <button
              key={i}

              disabled={slot.booked}

              onClick={() =>
                !slot.booked &&
                setSlotTime(slot.time)
              }

              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: '1.5px solid',

                borderColor: slot.booked
                  ? '#e5e7eb'
                  : slotTime === slot.time
                  ? '#2563EB'
                  : '#d1d5db',

                background: slot.booked
                  ? '#f9fafb'
                  : slotTime === slot.time
                  ? '#2563EB'
                  : '#fff',

                color: slot.booked
                  ? '#d1d5db'
                  : slotTime === slot.time
                  ? '#fff'
                  : '#374151',

                fontSize: '13px',
                fontWeight: '500',

                cursor: slot.booked
                  ? 'not-allowed'
                  : 'pointer',

                fontFamily: 'inherit',

                textDecoration: slot.booked
                  ? 'line-through'
                  : 'none',

                transition: 'all 0.15s'
              }}
            >
              {slot.time}
            </button>
          ))}

        </div>

        {/* Book Button */}
        <button

          onClick={bookAppointment}

          disabled={loading || !slotTime}

          style={{
            background:
              loading || !slotTime
                ? '#d1d5db'
                : '#2563EB',

            color: '#fff',
            border: 'none',
            padding: '14px 36px',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '600',

            cursor:
              loading || !slotTime
                ? 'not-allowed'
                : 'pointer',

            fontFamily: 'inherit'
          }}
        >

          {loading
            ? '⏳ Booking...'
            : 'Book Appointment'}

        </button>

      </div>

    </div>
  )
}

const page = {
  fontFamily: "'DM Sans',sans-serif",
  paddingTop: '24px'
}

const docCard = {
  display: 'flex',
  gap: '28px',
  background: '#fff',
  borderRadius: '16px',
  padding: '28px',
  border: '1px solid #f3f4f6',
  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
  marginBottom: '28px',
  flexWrap: 'wrap'
}

const docImg = {
  width: '200px',
  height: '200px',
  borderRadius: '14px',
  objectFit: 'cover',
  background: '#dbeafe',
  flexShrink: 0
}

const docInfo2 = {
  flex: 1,
  minWidth: '260px'
}

const expBadge = {
  background: '#f0fdf4',
  color: '#059669',
  fontSize: '12px',
  fontWeight: '600',
  padding: '4px 12px',
  borderRadius: '20px'
}

const slotSection = {
  background: '#fff',
  borderRadius: '16px',
  padding: '28px',
  border: '1px solid #f3f4f6'
}

export default Appointment