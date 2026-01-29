import React, { useState } from "react";
import { FaUser, FaEye, FaEyeSlash, FaWhatsapp, FaPhoneAlt, FaArrowLeft } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { MdAppRegistration } from "react-icons/md";
import logo from '../assets/icons/theme-1709828838678-aura555.png';
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    // Logic for registration API goes here
    toast.success("Registration request sent!");
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen w-full overflow-y-auto bg-black font-sans py-10">
      
      {/* Stadium Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-80"
        style={{ backgroundImage: `url('https://reddy365.vip/static/media/cricket-bg.5f7754fd8ce52985a289.jpg')` }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-black/20 via-transparent to-black" />

      {/* Glassmorphism Container */}
      <div className="relative z-10 w-[90%] max-w-[450px] backdrop-blur-md bg-black/20 border border-white/20 rounded-2xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        {/* Navigation Buttons */}
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <button onClick={() => navigate(-1)} className="text-white/70 hover:text-white">
            <FaArrowLeft size={18} />
          </button>
          <Link to="/" className="text-white/70 hover:text-white">
            <IoMdClose size={24} />
          </Link>
        </div>

        {/* Header Section */}
        <div className="flex flex-col items-center mb-6 mt-4">
          <img src="https://i.ibb.co/8Dx8cb2f/REDDY111-LOGO.png" alt="loading"  className="h-12 w-auto mb-3 drop-shadow-lg" />
          <h2 className="text-red-500 font-bold text-xl tracking-wider uppercase italic">Join Us Now</h2>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          
          {/* Username */}
          <div className="space-y-1">
            <label className="text-white text-[11px] font-bold uppercase ml-1">Username <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Choose Username"
                className="w-full px-4 py-2.5 text-black bg-white rounded-md outline-none text-sm"
                onChange={(e) => setFormData({...formData, userName: e.target.value})}
              />
              <FaUser className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Mobile Number */}
          <div className="space-y-1">
            <label className="text-white text-[11px] font-bold uppercase ml-1">Mobile Number <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                type="tel"
                required
                placeholder="Enter Mobile Number"
                className="w-full px-4 py-2.5 text-black bg-white rounded-md outline-none text-sm"
                onChange={(e) => setFormData({...formData, mobile: e.target.value})}
              />
              <FaPhoneAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 size-3.5" />
            </div>
          </div>

          {/* Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-white text-[11px] font-bold uppercase ml-1">Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  className="w-full px-4 py-2.5 text-black bg-white rounded-md outline-none text-sm"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-white text-[11px] font-bold uppercase ml-1">Confirm <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Confirm"
                  className="w-full px-4 py-2.5 text-black bg-white rounded-md outline-none text-sm"
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>

          {/* Register Button */}
          <div className="pt-4 space-y-4">
            <button 
              type="submit"
              className="w-full bg-red-600 text-white font-bold py-3 rounded-full hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-lg tracking-widest"
            >
              CREATE ACCOUNT <MdAppRegistration size={20}/>
            </button>

            <div className="flex items-center gap-2">
                <div className="h-[1px] bg-white/20 flex-1"></div>
                <span className="text-white text-[10px] font-bold">OR REGISTER ON</span>
                <div className="h-[1px] bg-white/20 flex-1"></div>
            </div>

            <button 
              type="button"
              className="w-full bg-[#25D366] text-white font-bold py-3 rounded-full hover:bg-[#1ebe57] transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <FaWhatsapp size={22} /> WhatsApp Registration
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-gray-300 font-medium">
          Already have an account? <Link to="/login" className="text-white font-bold underline hover:text-red-500 ml-1">Login Here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;