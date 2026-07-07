import React from 'react'

const NotificationBell = ({ count = 0 }) => {
  return (
    <button className='relative' style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-7 w-7 text-gray-700'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        style={{ width: '26px', height: '26px' }}
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
        />
      </svg>
      {count > 0 && (
        <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: '#ef4444', color: '#fff', fontSize: '10px', fontWeight: '700', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  )
}

export default NotificationBell