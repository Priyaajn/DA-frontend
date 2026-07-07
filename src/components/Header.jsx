import React from 'react'

const Header = () => {

  return (
    <div className='bg-blue-600 text-white rounded-3xl p-12'>

      <h1 className='text-5xl font-bold leading-tight'>
        Book Appointments <br />
        With Trusted Doctors
      </h1>

      <p className='mt-6 text-blue-100 text-lg max-w-2xl'>
        Easily connect with specialists, manage appointments and access AI healthcare assistance.
      </p>

      <button
        className='mt-8 bg-white text-blue-600 px-8 py-4 rounded-2xl font-semibold hover:scale-105 transition'
      >
        Explore Doctors
      </button>

    </div>
  )
}

export default Header