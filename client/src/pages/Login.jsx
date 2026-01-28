

import React, { useState } from "react";
import { FaUser, FaEye, FaEyeSlash, FaWhatsapp } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { MdOutlineLogin } from "react-icons/md";
import logo from '../assets/icons/theme-1709828838678-aura555.png';
import { useDispatch } from 'react-redux';
import { loginUser } from "../redux/reducer/authReducer";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData)).then((res) => {
      if (res?.payload?.success) {
        toast.success(res.payload.message);
        setTimeout(() => navigate('/', { replace: true }), 1000);
      } else {
        toast.error(res.payload.message);
      }
    });
  };

  return (
    <div className="relative flex justify-center items-center h-screen w-full overflow-hidden bg-black font-sans">
      
      {/* Stadium Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
        style={{ backgroundImage: `url('https://reddy365.vip/static/media/cricket-bg.5f7754fd8ce52985a289.jpg')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black" />

      {/* Main Login Box */}
      <div className="relative z-10 w-[90%] max-w-[400px] backdrop-blur-md bg-black/30 border border-white/20 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        {/* Close Button */}
        <Link to="/" className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
          <IoMdClose size={24} />
        </Link>

        {/* Header Section */}
        <div className="flex flex-col items-center mb-8">
          <img src={logo} className="h-16 w-auto mb-4 drop-shadow-lg" alt="logo" />
          <h2 className="text-red-500 font-bold text-xl tracking-wider uppercase">Login Now</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Input */}
          <div className="space-y-1">
            <label className="text-white text-[11px] font-bold uppercase ml-1 flex items-center gap-1">
              Username/Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.userName}
                onChange={(e) => setFormData({...formData, userName: e.target.value })}
                className="w-full px-4 py-2.5 text-black bg-white rounded-md focus:ring-2 focus:ring-red-500 outline-none transition-all"
                placeholder="Enter Username"
              />
              <FaUser className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className="text-white text-[11px] font-bold uppercase ml-1 flex items-center gap-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value })}
                className="w-full px-4 py-2.5 text-black bg-white rounded-md focus:ring-2 focus:ring-red-500 outline-none transition-all"
                placeholder="Enter Password"
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

          {/* Remember & Forgot Links */}
          <div className="flex items-center justify-between text-[11px] text-gray-300 font-medium">
            <label className="flex items-center gap-1 cursor-pointer">
              <input type="checkbox" className="accent-red-500" /> Remember Me?
            </label>
            <div className="flex gap-2">
              <span className="hover:text-white cursor-pointer">Lost Username?</span>
              <span className="hover:text-white cursor-pointer">Forgot Password?</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button 
              type="submit"
              className="w-full bg-white text-black font-bold py-2.5 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              LOG IN <MdOutlineLogin size={18}/>
            </button>

            <div className="flex items-center gap-2">
                <div className="h-[1px] bg-white/20 flex-1"></div>
                <span className="text-white text-[10px] font-bold uppercase">OR</span>
                <div className="h-[1px] bg-white/20 flex-1"></div>
            </div>

            <button 
              type="button"
              className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
            >
              Login with Demo ID
            </button>

            <button 
              type="button"
              className="w-full bg-[#25D366] text-white font-bold py-2.5 rounded-full hover:bg-[#1ebe57] transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <FaWhatsapp size={20} /> Register With WhatsApp
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          Don't have account? <Link to="/register" className="text-red-500 font-bold hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;