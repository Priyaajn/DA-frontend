import React, { useState, useEffect, useContext } from "react";
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import NotificationBell from './NotificationBell'

const Navbar = () => {

  const navigate = useNavigate()

  const [showMenu, setShowMenu] = useState(false)
  const [open, setOpen] = useState(false)

  // ✅ CONTEXT (FIXED)
  const { token, setToken, userData, backendUrl, reminders } = useContext(AppContext)

  // ✅ FORM STATE
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    image: "",
    speciality: "",
    degree: "",
    experience: "",
    about: "",
    available: true,
    fees: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      image: form.image,
      speciality: form.speciality,
      degree: form.degree,
      experience: form.experience,
      about: form.about,
      available: form.available,
      fees: Number(form.fees),
      address: {
        line1: form.address_line1,
        line2: form.address_line2,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      },
    };

    const dtoken = localStorage.getItem('token')

    const res = await axios.post(`${backendUrl}/api/doctor/add`, payload, {
      headers: {
        'Authorization': dtoken
      }
    })

    if (res.data.success) {
      toast.success(res.data.message)
      setOpen(false)
    } else {
      toast.error(res.data.message)
    }
  };

  const logout = () => {
    localStorage.removeItem('token')
    setToken("")
    navigate('/login')
  }

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-[#ADADAD]'>

      {/* LOGO */}
      <img onClick={() => navigate('/')} className='w-44 cursor-pointer' src={assets.logo} alt="" />

      {/* MENU */}
      <ul className='md:flex items-start gap-5 font-medium hidden'>
        <NavLink to='/'><li className='py-1'>HOME</li></NavLink>
        <NavLink to='/doctors'><li className='py-1'>ALL DOCTORS</li></NavLink>
        <NavLink to='/about'><li className='py-1'>ABOUT</li></NavLink>
        <NavLink to='/contact'><li className='py-1'>CONTACT</li></NavLink>
        <NavLink to='/add-doctor'><li className='py-1'>ADD DOCTOR</li></NavLink>
      </ul>

      <div className='flex items-center gap-4'>

        {/* 🔔 NOTIFICATION BELL */}
        {token && (
          <div className="relative cursor-pointer" onClick={() => navigate('/reminders')}>
            <NotificationBell count={reminders.length} />
          </div>
        )}

        {
          token && userData
            ? <div className='flex items-center gap-2 cursor-pointer group relative'>
              <img className='w-8 rounded-full' src={userData.image} alt="" />
              <img className='w-2.5' src={assets.dropdown_icon} alt="" />

              <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                <div className='min-w-48 bg-gray-50 rounded flex flex-col gap-4 p-4'>
                  <p onClick={() => navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                  <p onClick={() => navigate('/my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>

                  {/* 🔔 REMINDERS PAGE */}
                  <p onClick={() => navigate('/reminders')} className='hover:text-black cursor-pointer'>🔔 Reminders</p>

                  <button onClick={() => setOpen(!open)} className='bg-primary text-white px-4 py-2 rounded-full font-light'>
                    Add Doctor
                  </button>

                  <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                </div>
              </div>
            </div>
            : <button onClick={() => navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'>
              Create account
            </button>
        }

        <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />

        {/* MOBILE MENU */}
        <div className={`md:hidden ${showMenu ? 'fixed w-full' : 'h-0 w-0'} right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
          <div className='flex items-center justify-between px-5 py-6'>
            <img src={assets.logo} className='w-36' alt="" />
            <img onClick={() => setShowMenu(false)} src={assets.cross_icon} className='w-7' alt="" />
          </div>

          <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
            <NavLink onClick={() => setShowMenu(false)} to='/'><p>HOME</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/doctors'><p>ALL DOCTORS</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/about'><p>ABOUT</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/contact'><p>CONTACT</p></NavLink>
          </ul>
        </div>
      </div>

      {/* FORM MODAL */}
      <div className={`fixed z-[999] overflow-scroll top-0 left-0 right-0 bottom-0 bg-black/50 ${open ? 'block' : 'hidden'}`}>
        <div className="min-h-screen flex justify-center items-center p-6">

          <form onSubmit={handleSubmit} className="bg-white relative p-5 rounded shadow-xl w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-5">

            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-2xl">X</button>

            <h2 className="col-span-2 text-3xl font-bold text-center">
              Doctor Form
            </h2>

            <input name="name" placeholder="Name" onChange={handleChange} required className="input" />
            <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="input" />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="input" />
            <input name="image" placeholder="Image URL" onChange={handleChange} required className="input" />
            <input name="speciality" placeholder="Speciality" onChange={handleChange} required className="input" />
            <input name="degree" placeholder="Degree" onChange={handleChange} required className="input" />
            <input name="experience" placeholder="Experience" onChange={handleChange} required className="input" />
            <input name="fees" type="number" placeholder="Fees" onChange={handleChange} required className="input" />

            <textarea name="about" placeholder="About Doctor" onChange={handleChange} required className="input md:col-span-2 h-28" />

            <label className="flex items-center gap-2">
              <input type="checkbox" name="available" checked={form.available} onChange={handleChange} />
              Available
            </label>

            <input name="address_line1" placeholder="Address Line 1" onChange={handleChange} required className="input" />
            <input name="address_line2" placeholder="Address Line 2" onChange={handleChange} className="input" />
            <input name="city" placeholder="City" onChange={handleChange} required className="input" />
            <input name="state" placeholder="State" onChange={handleChange} required className="input" />
            <input name="pincode" placeholder="Pincode" onChange={handleChange} required className="input" />

            <button className="col-span-2 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700">
              Submit Doctor
            </button>

          </form>
        </div>
      </div>

    </div>
  )
}

export default Navbar