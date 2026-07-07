import React from 'react'

const Footer = () => {

  return (
    <div className='bg-white border-t mt-20'>

      <div className='max-w-7xl mx-auto px-8 py-12'>

        <div className='grid md:grid-cols-3 gap-10'>

          <div>

            <h1 className='text-3xl font-bold text-blue-600'>
              MediCare+
            </h1>

            <p className='text-gray-500 mt-4 leading-7'>
              Modern healthcare management platform connecting patients with experienced doctors online.
            </p>

          </div>

          <div>

            <h2 className='text-xl font-bold text-gray-800 mb-4'>
              Company
            </h2>

            <div className='flex flex-col gap-3 text-gray-500'>

              <p>Home</p>
              <p>About</p>
              <p>Contact</p>

            </div>

          </div>

          <div>

            <h2 className='text-xl font-bold text-gray-800 mb-4'>
              Contact
            </h2>

            <div className='flex flex-col gap-3 text-gray-500'>

              <p>support@medicare.com</p>
              <p>+1 234 567 890</p>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Footer