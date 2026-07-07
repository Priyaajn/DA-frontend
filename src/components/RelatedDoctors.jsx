import React, {
  useContext,
  useEffect,
  useState
} from 'react'

import { useNavigate } from 'react-router-dom'

import { AppContext } from '../context/AppContext'

const RelatedDoctors = ({ speciality, docId }) => {

  const navigate = useNavigate()

  const { doctors } = useContext(AppContext)

  const [relDoc, setRelDoc] = useState([])

  useEffect(() => {

    if (doctors.length > 0 && speciality) {

      const doctorsData = doctors.filter(
        (doc) =>
          doc.speciality === speciality &&
          doc._id !== docId
      )

      setRelDoc(doctorsData)

    }

  }, [doctors, speciality, docId])

  return (
    <div className='mt-20'>

      <h1 className='text-4xl font-bold text-gray-800 mb-8'>
        Related Doctors
      </h1>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>

        {relDoc.map((item, index) => (

          <div
            key={index}
            onClick={() => navigate(`/appointment/${item._id}`)}
            className='bg-white rounded-3xl border shadow-sm overflow-hidden cursor-pointer hover:scale-105 transition'
          >

            <img
              src={item.image}
              alt=''
              className='w-full h-64 object-cover'
            />

            <div className='p-5'>

              <h2 className='text-xl font-bold text-gray-800'>
                {item.name}
              </h2>

              <p className='text-gray-500 mt-2'>
                {item.speciality}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}

export default RelatedDoctors