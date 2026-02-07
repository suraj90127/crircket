import React, { useEffect, useState } from "react";
import { FaUser, FaEye, FaEyeSlash, FaWhatsapp } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { MdOutlineLogin } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

import { loginUser, getWhatsappNumber } from "../redux/reducer/authReducer";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ✅ CORRECT SELECTOR (auth, not user) */
  const { whatsappNumber, whatsappLoading } = useSelector(
    (state) => state.auth
  );

  /* ================= LOGIN ================= */
  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(loginUser(formData)).then((res) => {
      if (res?.payload?.success) {
        toast.success(res.payload.message);
        setTimeout(() => navigate("/", { replace: true }), 1000);
      } else {
        toast.error(res?.payload?.message || "Login failed");
      }
    });
  };

  /* ================= FETCH WHATSAPP ================= */
  useEffect(() => {
    dispatch(getWhatsappNumber());
  }, [dispatch]);

  /* ================= WHATSAPP CLICK ================= */
  const handleWhatsapp = () => {
    if (!whatsappNumber) {
      toast.error("WhatsApp number not available");
      return;
    }
    window.open(`https://wa.me/${whatsappNumber}`, "_blank");
  };


  

  return (
    <div className="relative flex justify-center items-center h-screen w-full overflow-hidden bg-black font-sans">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
        style={{
          backgroundImage:
            "url('https://i.ibb.co/rGyRyRhk/cricket-bg-5f7754fd8ce52985a289.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black" />

      {/* Login Box */}
      <div className="relative z-10 w-[90%] max-w-[400px] backdrop-blur-md bg-black/30 border border-white/20 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        {/* Close */}
        <Link
          to="/"
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
        >
          <IoMdClose size={24} />
        </Link>

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="https://i.ibb.co/8Dx8cb2f/REDDY111-LOGO.png"
            alt="logo"
            className="h-16 w-auto mb-4 drop-shadow-lg"
          />
          <h2 className="text-red-500 font-bold text-xl tracking-wider uppercase">
            Login Now
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div className="space-y-1">
            <label className="text-white text-[11px] font-bold uppercase ml-1">
              Username / Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.userName}
                onChange={(e) =>
                  setFormData({ ...formData, userName: e.target.value })
                }
                className="w-full px-4 py-2.5 text-black bg-white rounded-md outline-none"
                placeholder="Enter Username"
              />
              <FaUser className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-white text-[11px] font-bold uppercase ml-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2.5 text-black bg-white rounded-md outline-none"
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

          {/* Buttons */}
          <div className="space-y-3 pt-2">
            <button
              type="submit"
              className="w-full bg-white text-black font-bold py-2.5 rounded-full flex items-center justify-center gap-2"
            >
              LOG IN <MdOutlineLogin size={18} />
            </button>

            <button
              type="button"
              onClick={handleWhatsapp}
              disabled={whatsappLoading}
              className="w-full bg-[#25D366] text-white font-bold py-2.5 rounded-full hover:bg-[#1ebe57] transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <FaWhatsapp size={20} />
              {whatsappLoading ? "Loading..." : "Register With WhatsApp"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
