import React, { useState } from "react";
import { FaUser, FaWhatsapp, FaArrowLeft } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { MdOutlineVpnKey } from "react-icons/md";
import logo from '../assets/icons/theme-1709828838678-aura555.png';
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [method, setMethod] = useState("username"); // 'username' or 'whatsapp'
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  const handleResetRequest = (e) => {
    e.preventDefault();
    // Logic for password reset API goes here
    toast.info("Reset instructions sent if account exists.");
  };

  return (
    <div className="relative flex justify-center items-center h-screen w-full overflow-hidden bg-black font-sans">
      
      {/* Stadium Background Image (Matches Login) */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
        style={{ backgroundImage: `url('https://reddy365.vip/static/media/cricket-bg.5f7754fd8ce52985a289.jpg')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black" />

      {/* Transparent Container */}
      <div className="relative z-10 w-[90%] max-w-[400px] backdrop-blur-md bg-black/20 border border-white/20 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        {/* Close & Back Button */}
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <button onClick={() => navigate(-1)} className="text-white/70 hover:text-white transition-colors">
            <FaArrowLeft size={18} />
          </button>
          <Link to="/" className="text-white/70 hover:text-white transition-colors">
            <IoMdClose size={24} />
          </Link>
        </div>

        {/* Header Section */}
        <div className="flex flex-col items-center mb-8 mt-2">
          <img src={logo} className="h-14 w-auto mb-4 drop-shadow-lg" alt="logo" />
          <h2 className="text-red-500 font-bold text-xl tracking-wider uppercase">Forgot Password</h2>
          <p className="text-gray-300 text-[11px] text-center mt-2 px-4">
            Enter your details to receive a recovery link or contact support.
          </p>
        </div>

        <form onSubmit={handleResetRequest} className="space-y-6">
          
          {/* Input Field */}
          <div className="space-y-1">
            <label className="text-white text-[11px] font-bold uppercase ml-1">
              Username or Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full px-4 py-3 text-black bg-white rounded-md outline-none"
                placeholder="Enter your registered ID"
              />
              <FaUser className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button 
              type="submit"
              className="w-full bg-white text-black font-bold py-3 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              RESET PASSWORD <MdOutlineVpnKey size={18}/>
            </button>

            <div className="flex items-center gap-2">
                <div className="h-[1px] bg-white/20 flex-1"></div>
                <span className="text-white text-[10px] font-bold uppercase">OR CONTACT SUPPORT</span>
                <div className="h-[1px] bg-white/20 flex-1"></div>
            </div>

            <button 
              type="button"
              className="w-full bg-[#25D366] text-white font-bold py-3 rounded-full hover:bg-[#1ebe57] transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <FaWhatsapp size={20} /> Reset via WhatsApp
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <Link to="/login" className="text-white text-xs font-medium hover:text-red-500 transition-colors uppercase tracking-widest underline underline-offset-4">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;