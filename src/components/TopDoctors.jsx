import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContextProvider } from '../context/AppContextProvider'

const TopDoctors = () => {

  const navigate = useNavigate()

  const { doctors } = useContext(AppContext)

  return (
    <div className='mt-16'>

      <div className='flex items-center justify-between mb-8'>

        <div>

          <h1 className='text-4xl font-bold text-gray-800'>
            Top Doctors
          </h1>

          <p className='text-gray-500 mt-2'>
            Book appointments with trusted specialists
          </p>

        </div>

        <button
          onClick={() => navigate('/doctors')}
          className='bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 transition'
        >
          View All
        </button>

      </div>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>

        {doctors.slice(0, 8).map((item, index) => (

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

              <div className='flex items-center gap-2 mb-3'>

                <div className={`w-3 h-3 rounded-full ${
                  item.available
                    ? 'bg-green-500'
                    : 'bg-gray-400'
                }`} />

                <p className='text-sm text-gray-500'>
                  {item.available
                    ? 'Available'
                    : 'Unavailable'}
                </p>

              </div>

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

export default TopDoctors