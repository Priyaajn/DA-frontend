import React, { useState, useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DoctorContext } from '../../context/DoctorContextProvider'

const PrescriptionForm = ({ appointment, onDone }) => {
  const { dToken, backendUrl } = useContext(DoctorContext)

  const [medicines, setMedicines] = useState([
    { name: '', dosage: '', frequency: '', duration: '' }
  ])
  const [notes,     setNotes]     = useState('')
  const [nextVisit, setNextVisit] = useState('')
  const [loading,   setLoading]   = useState(false)

  const addRow = () =>
    setMedicines([...medicines, { name: '', dosage: '', frequency: '', duration: '' }])

  const removeRow = (i) =>
    setMedicines(medicines.filter((_, idx) => idx !== i))

  const updateRow = (i, field, value) => {
    const updated = [...medicines]
    updated[i][field] = value
    setMedicines(updated)
  }

  const handleSubmit = async () => {
    const valid = medicines.every(m => m.name && m.dosage && m.frequency && m.duration)
    if (!valid) return toast.warn('Please fill all medicine fields')

    setLoading(true)
    try {
      const { data } = await axios.post(
        backendUrl + '/api/doctor/add-prescription',
        {
          appointmentId: appointment._id,
          medicines,
          notes,
          nextVisit
        },
        { headers: { dToken } }
      )

      if (data.success) {
        toast.success('Prescription sent to patient via email!')
        onDone()
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error(err.message)
    }
    setLoading(false)
  }

  return (
    <div style={formWrap}>
      <h3 style={formTitle}>
        Write Prescription — {appointment.userData?.name}
      </h3>

      {/* Medicine rows */}
      {medicines.map((m, i) => (
        <div key={i} style={medRow}>
          <input
            placeholder="Medicine name"
            value={m.name}
            onChange={e => updateRow(i, 'name', e.target.value)}
            style={inp}
          />
          <input
            placeholder="Dosage e.g. 500mg"
            value={m.dosage}
            onChange={e => updateRow(i, 'dosage', e.target.value)}
            style={inp}
          />
          <input
            placeholder="Frequency e.g. 3x daily"
            value={m.frequency}
            onChange={e => updateRow(i, 'frequency', e.target.value)}
            style={inp}
          />
          <input
            placeholder="Duration e.g. 5 days"
            value={m.duration}
            onChange={e => updateRow(i, 'duration', e.target.value)}
            style={inp}
          />
          {medicines.length > 1 && (
            <button onClick={() => removeRow(i)} style={removeBtn}>✕</button>
          )}
        </div>
      ))}

      <button onClick={addRow} style={addBtn}>+ Add medicine</button>

      {/* Notes */}
      <textarea
        placeholder="Doctor's notes (optional)..."
        value={notes}
        onChange={e => setNotes(e.target.value)}
        rows={3}
        style={{ ...inp, width: '100%', marginTop: 10, resize: 'vertical' }}
      />

      {/* Next visit date */}
      <div style={{ marginTop: 10 }}>
        <label style={{ fontSize: 13, color: '#6b7280', display: 'block', marginBottom: 4 }}>
          Next Visit Date (optional)
        </label>
        <input
          type="date"
          value={nextVisit}
          onChange={e => setNextVisit(e.target.value)}
          style={{ ...inp, width: '100%' }}
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          marginTop: 16,
          width: '100%',
          background: loading ? '#d1d5db' : '#2563EB',
          color: '#fff',
          border: 'none',
          padding: '13px 0',
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit'
        }}
      >
        {loading ? '⏳ Sending...' : '✔ Complete & Send Prescription to Patient'}
      </button>
    </div>
  )
}

const formWrap = {
  border: '1px solid #e5e7eb',
  borderRadius: 12,
  padding: 20,
  marginTop: 12,
  background: '#f9fafb',
  gridColumn: '1 / -1'
}
const formTitle = {
  margin: '0 0 14px',
  fontSize: 15,
  fontWeight: 600,
  color: '#111827'
}
const medRow = {
  display: 'grid',
  gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
  gap: 8,
  marginBottom: 8
}
const inp = {
  padding: '8px 10px',
  borderRadius: 8,
  border: '1px solid #d1d5db',
  fontSize: 13,
  fontFamily: 'inherit',
  outline: 'none',
  background: '#fff'
}
const removeBtn = {
  background: '#fee2e2',
  color: '#dc2626',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 700,
  padding: '0 10px',
  fontSize: 14
}
const addBtn = {
  background: '#f0fdf4',
  color: '#16a34a',
  border: '1px dashed #86efac',
  borderRadius: 8,
  padding: '7px 14px',
  fontSize: 13,
  cursor: 'pointer',
  marginTop: 4,
  fontFamily: 'inherit'
}

export default PrescriptionForm