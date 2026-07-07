import React from 'react'
import TopDoctors from '../../components/TopDoctors'

const ReminderPages = () => {

  return (
    <div className='p-8'>

      <div className='bg-white rounded-3xl border shadow-sm p-10 max-w-3xl'>

        <h1 className='text-4xl font-bold text-gray-800 mb-6'>
          Appointment Reminder
        </h1>

        <p className='text-lg text-gray-600 leading-8'>
          Your next appointment is scheduled for tomorrow at 10:30 AM.
        </p>

      </div>

    </div>
  )
}

export default ReminderPages