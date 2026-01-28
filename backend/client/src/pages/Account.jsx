import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import api from "../redux/api";
import { user_reset } from "../redux/reducer/authReducer";
import { FaChevronRight } from "react-icons/fa";

const Account = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logout = async () => {
    try {
      const { data } = await api.get("/customer/logout", {
        withCredentials: true,
      }); // ✅ Important!
      localStorage.removeItem("auth");

      dispatch(user_reset());
      navigate("/");
    } catch (error) {
      console.log(error?.response?.data || error.message);
    }
  };
  return (
    <div>
      <ul className="py-2 text-[#2789ce] font-semibold text-sm">
        <li className="px-4 py-2 hover:bg-gray-200 border-b border-gray-300 flex justify-between">
          <Link to="/profile">My Profile</Link>
          <span className='border border-gray-500 p-1 rounded-sm'>
            <FaChevronRight
              className={`text-gray-800 transition-transform duration-200 size-3 md:size-4`}
            />
          </span>
        </li>
        <li className="px-4 py-2 hover:bg-gray-200 border-b border-gray-300 flex justify-between">
          <Link to="/rolling">Rolling Commission</Link>
          <span className='border border-gray-500 p-1 rounded-sm'>
            <FaChevronRight
              className={`text-gray-800 transition-transform duration-200 size-3 md:size-4`}
            />
          </span>
        </li>
        <li className="px-4 py-2 hover:bg-gray-200 border-b border-gray-300 flex justify-between">
          <Link to="/statement">Account Statement</Link>
          <span className='border border-gray-500 p-1 rounded-sm'>
            <FaChevronRight
              className={`text-gray-800 transition-transform duration-200 size-3 md:size-4`}
            />
          </span>
        </li>
        <li className="px-4 py-2 hover:bg-gray-200 border-b border-gray-300 flex justify-between">
          <Link to="/bet-history">Bet History</Link>
          <span className='border border-gray-500 p-1 rounded-sm'>
            <FaChevronRight
              className={`text-gray-800 transition-transform duration-200 size-3 md:size-4`}
            />
          </span>
        </li>
        <li className="px-4 py-2 hover:bg-gray-200 border-b border-gray-300 flex justify-between">
          <Link to="/p&l">Profit & Loss</Link>
          <span className='border border-gray-500 p-1 rounded-sm'>
            <FaChevronRight
              className={`text-gray-800 transition-transform duration-200 size-3 md:size-4`}
            />
          </span>
        </li>
        <li className="px-4 py-2 hover:bg-gray-200 border-b border-gray-300 flex justify-between">
          <Link to="/passhistory">Password History</Link>
          <span className='border border-gray-500 p-1 rounded-sm'>
            <FaChevronRight
              className={`text-gray-800 transition-transform duration-200 size-3 md:size-4`}
            />
          </span>
        </li>
        <li className="px-4 py-2 hover:bg-gray-200 border-b border-gray-300 flex justify-between">
          <Link to="/activity">Activity log</Link>
          <span className='border border-gray-500 p-1 rounded-sm'>
            <FaChevronRight
              className={`text-gray-800 transition-transform duration-200 size-3 md:size-4`}
            />
          </span>
        </li>
        <li className="px-0 py-1 hover:bg-gray-200 border-b border-gray-300">
          <button onClick={logout} className="bg-gradient-to-t from-[#e93522] to-[#be2414] text-white w-full p-3">Logout</button>
        </li>
      </ul>
    </div>
  );
};

export default Account;
