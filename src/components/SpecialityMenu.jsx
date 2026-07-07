import React from 'react'
import { useNavigate } from 'react-router-dom'

const specialityData = [
  'General physician',
  'Gynecologist',
  'Dermatologist',
  'Pediatricians',
  'Neurologist',
  'Gastroenterologist'
]

const SpecialityMenu = () => {

  const navigate = useNavigate()

  return (
    <div className='mt-20'>

      <div className='flex items-center justify-between mb-8'>

        <div>

          <h1 className='text-4xl font-bold text-gray-800'>
            Find by Speciality
          </h1>

          <p className='text-gray-500 mt-2'>
            Browse doctors based on speciality
          </p>

        </div>

      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6'>

        {specialityData.map((item, index) => (

          <div
            key={index}
            onClick={() => navigate(`/doctors/${item}`)}
            className='bg-white border rounded-3xl p-6 text-center cursor-pointer hover:scale-105 transition shadow-sm'
          >

            <h2 className='text-lg font-semibold text-gray-700'>
              {item}
            </h2>

          </div>

        ))}

      </div>

    </div>
  )
}

export default SpecialityMenu