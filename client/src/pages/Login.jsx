import React, { useState } from "react";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import logo from '../assets/icons/theme-1709828838678-aura555.png'
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from "../redux/reducer/authReducer";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [ formData, setFormData] = useState({
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
        setTimeout(() => {
          navigate('/', { replace: true });
      }, 1000); 
      } else {
        toast.error(res.payload.message);
      }
    });

  }


  return (
    <div className="flex md:hidden justify-center items-center bg-color fixed h-[100vh] w-full z-[99999000]">
      {/* Close Button */}
      <Link to="/" className="absolute top-4 right-4 text-black text-xl hover:text-gray-700 bg-color p-1 rounded-md font-bold">
        <IoMdClose />
      </Link>

      <form onSubmit={handleSubmit} className="bg-transparent p-6 rounded-lg text-center">
        {/* Logo */}
       <img src={logo} className="h-[70px] w-auto" alt="logo" />

        {/* Username Input */}
        <div className="relative mb-4">
          <input
            type="text"
            value={formData.userName}
            onChange={(e) => setFormData({...formData, userName: e.target.value })}
            placeholder="Username"
            className="w-full px-4 py-2 text-white bg-white/10 border border-white/50 rounded-md placeholder-gray-300 focus:outline-none"
          />
          <FaUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white" />
        </div>
        <p className="text-gray-300 text-sm -mt-3 mb-4 text-left px-2">Please enter username.</p>

        {/* Password Input */}
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value })}
            placeholder="Password"
            className="w-full px-4 py-2 text-white bg-white/10 border border-white/50 rounded-md placeholder-gray-300 focus:outline-none"
          />
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Buttons */}
        <button className="w-full bg-color text-white py-2 rounded-md mb-2">
          Login
        </button>
        <button className="w-full bg-color text-white py-2 rounded-md">
          Login with Demo ID
        </button>
      </form>
    </div>
  );
};

export default Login;
