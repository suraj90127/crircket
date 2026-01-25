import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import {
  changePasswordBySelf,
  messageClear,
  getUser,
  loginUser,
  user_reset,
} from "../redux/reducer/authReducer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { motion, AnimatePresence } from "framer-motion";
import Spinner2 from "../components/Spinner2";

const AccountDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loading, successMessage, errorMessage } = useSelector(
    (state) => state.auth
  );
  const [showPopup, setShowPopup] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // console.log("userInfo", userInfo);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Password not match.");
      return;
    }
    if (oldPassword === newPassword) {
      toast.error("Old password and new password can't be the same.");
      return;
    }

    try {
      const res = await dispatch(
        changePasswordBySelf({ oldPassword, newPassword })
      ).unwrap();
      toast.success(res.message); // ✅ Works immediately
      setShowPopup(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.message); // 🔥 From rejected payload
    }
  };

  return (
    <>
      {loading ? (
        <div className="text-center py-4">
          <Spinner2 />
        </div>
      ) : (
        <div className=" mx-auto bg-white rounded-md overflow-hidden border border-gray-200 relative">
          <div className="bg-[#243a48] text-white px-4 py-1 font-semibold text-sm">
            Account Details
          </div>
          <div className="p-4 text-sm">
            <div className="flex justify-start border-b border-gray-300 py-2">
              <span className="font-semibold w-[150px] ">Name</span>
              <span>{userInfo?.name}</span>
            </div>
            <div className="flex justify-start border-b border-gray-300 py-2">
              <span className="font-semibold w-[150px] text-sm">Commission</span>
              <span>0</span>
            </div>
            <div className="flex justify-start border-b border-gray-300 py-2">
              <span className="font-semibold w-[150px] text-sm">Rolling Commission</span>
              <span className="cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v.01M12 9h.01M4.93 19.07a10 10 0 1114.14 0 10 10 0 01-14.14 0z"
                  />
                </svg>
              </span>
            </div>
            <div className="flex justify-start border-b border-gray-300 py-2">
              <span className="font-semibold w-[150px] text-sm">Exposure Limit</span>
              <span>{userInfo?.exposureLimit}</span>
            </div>
            <div className="flex justify-start items-center py-2">
              <span className="font-semibold w-[150px] text-sm">Password</span>
              <div className="flex items-center gap-2">
                <span className="tracking-widest">**********</span>
                <button
                  className="text-[#2189d4]"
                  onClick={() => setShowPopup(true)}
                >
                  <FaRegEdit />
                </button>
              </div>
            </div>
          </div>

        
        </div>
      )}

      {showPopup && (
        <div className="fixed h-full w-full top-0 left-0 flex justify-center items-start text-[14px] bg-[#00000065] z-10">
          <motion.div
       initial={{ opacity: 0, y: -20 }}  
  animate={{ opacity: 1, y: 0 }} 
  exit={{ opacity: 0, y: 20 }}  
  transition={{ duration: 0.4 }} 
    className="bg-white rounded-lg shadow-lg max-w-lg mt-3">
            <h2 className="font-semibold mb-2 bg-blue p-2 text-white">
              Change Password
            </h2>
            <div className="p-2 grid grid-cols-2 gap-2">
              <div className="col-span-1">
                <label htmlFor="old">Old Password *</label>
                <input
                  type="password"
                  placeholder="Old Password"
                  className="w-full p-1.5 border border-gray-300 rounded mb-2"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>
              <div className="col-span-1">
                <label htmlFor="new">New Password *</label>
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full p-1.5 border border-gray-300 rounded mb-2"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="col-span-1">
                <label htmlFor="confirm">Confirm Password *</label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full p-1.5 border border-gray-300 rounded mb-4"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 p-3 border-t-1 border-gray-300">
              <button
                className="bg-gray-600 text-white px-4 py-2 rounded"
                // onClick={() => setShowPopup(false)}
                onClick={handleChangePassword}
              >
                Confirm
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default AccountDetails;
