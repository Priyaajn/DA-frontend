import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

import { AdminContext } from '../../context/AdminContextProvider'
import { AppContext } from '../../context/AppContextProvider'

const AdminPatients = () => {

  // FIXED: pass AdminContext into useContext
  const { aToken } = useContext(AdminContext)

  const { backendUrl, calculateAge } = useContext(AppContext)

  const [patients, setPatients] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  // FETCH ALL PATIENTS
  useEffect(() => {

    // wait until token exists
    if (!aToken) return

    const getPatients = async () => {

      try {

        setLoading(true)

        const { data } = await axios.get(
          `${backendUrl}/api/admin/all-patients`,
          {
            headers: {
              atoken: aToken // FIXED
            }
          }
        )

        if (data.success) {
          setPatients(data.patients || [])
        } else {
          toast.error(data.message)
        }

      } catch (error) {

        console.log(error)

        toast.error(
          error.response?.data?.message ||
          error.message ||
          'Failed to load patients'
        )

      } finally {
        setLoading(false)
      }
    }

    getPatients()

  }, [aToken, backendUrl])

  // SEARCH FILTER
  const filteredPatients = patients.filter((p) => {

    const name = p?.name?.toLowerCase() || ''
    const email = p?.email?.toLowerCase() || ''
    const query = search.toLowerCase()

    return (
      name.includes(query) ||
      email.includes(query)
    )
  })

  return (
    <div style={page}>

      {/* HEADER */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={h1}>All Patients</h1>

        <p style={sub}>
          {patients.length} registered patients
        </p>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍 Search by name or email..."
        style={searchInput}
      />

      {/* LOADING */}
      {loading ? (
        <Loader />
      ) : (

        <>
          {/* NO PATIENTS */}
          {filteredPatients.length === 0 ? (

            <div style={emptyBox}>
              No patients found.
            </div>

          ) : (

            <div style={grid}>

              {filteredPatients.map((p) => (

                <div key={p._id} style={patCard}>

                  {/* IMAGE */}
                  <img
                    src={p.image || 'https://via.placeholder.com/80'}
                    alt={p.name}
                    style={avatar}
                  />

                  {/* INFO */}
                  <div style={{ flex: 1 }}>

                    <p style={nameStyle}>
                      {p.name || 'No Name'}
                    </p>

                    <p style={emailStyle}>
                      {p.email || 'No Email'}
                    </p>

                    <div style={chipContainer}>

                      {/* GENDER */}
                      {p.gender && (
                        <span style={chip}>
                          {p.gender}
                        </span>
                      )}

                      {/* AGE */}
                      {p.dob && p.dob !== 'Not Selected' && (
                        <span style={chip}>
                          Age {calculateAge(p.dob)}
                        </span>
                      )}

                      {/* PHONE */}
                      {p.phone && p.phone !== '0000000000' && (
                        <span style={chip}>
                          📞 {p.phone}
                        </span>
                      )}

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}
        </>

      )}

    </div>
  )
}

// LOADER
const Loader = () => (
  <div style={loader}>
    ⏳ Loading patients...
  </div>
)

// STYLES

const page = {
  padding: '20px',
  fontFamily: "'DM Sans', sans-serif"
}

const h1 = {
  margin: 0,
  fontSize: '24px',
  fontWeight: '700',
  color: '#111827'
}

const sub = {
  marginTop: '4px',
  fontSize: '14px',
  color: '#6b7280'
}

const searchInput = {
  width: '100%',
  maxWidth: '380px',
  padding: '12px 16px',
  border: '1.5px solid #e5e7eb',
  borderRadius: '12px',
  outline: 'none',
  fontSize: '14px',
  marginBottom: '24px',
  boxSizing: 'border-box',
  fontFamily: 'inherit'
}

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '18px'
}

const patCard = {
  background: '#ffffff',
  borderRadius: '16px',
  padding: '18px',
  display: 'flex',
  gap: '14px',
  alignItems: 'flex-start',
  border: '1px solid #f3f4f6',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
}

const avatar = {
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  objectFit: 'cover',
  border: '2px solid #dbeafe'
}

const nameStyle = {
  margin: '0 0 4px',
  fontSize: '16px',
  fontWeight: '700',
  color: '#111827'
}

const emailStyle = {
  margin: '0 0 10px',
  fontSize: '13px',
  color: '#6b7280',
  wordBreak: 'break-word'
}

const chipContainer = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px'
}

const chip = {
  background: '#f3f4f6',
  color: '#374151',
  fontSize: '11px',
  fontWeight: '600',
  padding: '5px 10px',
  borderRadius: '999px'
}

const loader = {
  padding: '60px',
  textAlign: 'center',
  color: '#6b7280',
  fontSize: '15px'
}

const emptyBox = {
  padding: '50px',
  textAlign: 'center',
  background: '#ffffff',
  borderRadius: '14px',
  color: '#9ca3af',
  border: '1px solid #f3f4f6'
}

export default AdminPatients