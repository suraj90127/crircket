// import { useEffect, useState } from "react";
// import { FaRegEdit } from "react-icons/fa";
// import {
//   changePasswordBySelf,
//   messageClear,
//   getUser,
//   loginUser,
//   user_reset,
// } from "../redux/reducer/authReducer";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import Spinner from "../components/Spinner";
// import { motion, AnimatePresence } from "framer-motion";
// import Spinner2 from "../components/Spinner2";

// const AccountDetails = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { userInfo, loading, successMessage, errorMessage } = useSelector(
//     (state) => state.auth
//   );
//   const [showPopup, setShowPopup] = useState(false);
//   const [oldPassword, setOldPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   // console.log("userInfo", userInfo);

//   useEffect(() => {
//     dispatch(getUser());
//   }, [dispatch]);

//   const handleChangePassword = async () => {
//     if (newPassword !== confirmPassword) {
//       toast.error("Password not match.");
//       return;
//     }
//     if (oldPassword === newPassword) {
//       toast.error("Old password and new password can't be the same.");
//       return;
//     }

//     try {
//       const res = await dispatch(
//         changePasswordBySelf({ oldPassword, newPassword })
//       ).unwrap();
//       toast.success(res.message); // ✅ Works immediately
//       setShowPopup(false);
//       setOldPassword("");
//       setNewPassword("");
//       setConfirmPassword("");
//     } catch (err) {
//       toast.error(err.message); // 🔥 From rejected payload
//     }
//   };

//   return (
//     <>
//       {loading ? (
//         <div className="text-center py-4">
//           <Spinner2 />
//         </div>
//       ) : (
//         <div className=" mx-auto bg-white rounded-md overflow-hidden border border-gray-200 relative">
//           <div className="bg-[#243a48] text-white px-4 py-1 font-semibold text-sm">
//             Account Details
//           </div>
//           <div className="p-4 text-sm">
//             <div className="flex justify-start border-b border-gray-300 py-2">
//               <span className="font-semibold w-[150px] ">Name</span>
//               <span>{userInfo?.name}</span>
//             </div>
//             <div className="flex justify-start border-b border-gray-300 py-2">
//               <span className="font-semibold w-[150px] text-sm">Commission</span>
//               <span>0</span>
//             </div>
//             <div className="flex justify-start border-b border-gray-300 py-2">
//               <span className="font-semibold w-[150px] text-sm">Rolling Commission</span>
//               <span className="cursor-pointer">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth="1.5"
//                   stroke="currentColor"
//                   className="w-5 h-5"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M12 15v.01M12 9h.01M4.93 19.07a10 10 0 1114.14 0 10 10 0 01-14.14 0z"
//                   />
//                 </svg>
//               </span>
//             </div>
//             <div className="flex justify-start border-b border-gray-300 py-2">
//               <span className="font-semibold w-[150px] text-sm">Exposure Limit</span>
//               <span>{userInfo?.exposureLimit}</span>
//             </div>
//             <div className="flex justify-start items-center py-2">
//               <span className="font-semibold w-[150px] text-sm">Password</span>
//               <div className="flex items-center gap-2">
//                 <span className="tracking-widest">**********</span>
//                 <button
//                   className="text-[#2189d4]"
//                   onClick={() => setShowPopup(true)}
//                 >
//                   <FaRegEdit />
//                 </button>
//               </div>
//             </div>
//           </div>

        
//         </div>
//       )}

//       {showPopup && (
//         <div className="fixed h-full w-full top-0 left-0 flex justify-center items-start text-[14px] bg-[#00000065] z-10">
//           <motion.div
//        initial={{ opacity: 0, y: -20 }}  
//   animate={{ opacity: 1, y: 0 }} 
//   exit={{ opacity: 0, y: 20 }}  
//   transition={{ duration: 0.4 }} 
//     className="bg-white rounded-lg shadow-lg max-w-lg mt-3">
//             <h2 className="font-semibold mb-2 bg-blue p-2 text-white">
//               Change Password
//             </h2>
//             <div className="p-2 grid grid-cols-2 gap-2">
//               <div className="col-span-1">
//                 <label htmlFor="old">Old Password *</label>
//                 <input
//                   type="password"
//                   placeholder="Old Password"
//                   className="w-full p-1.5 border border-gray-300 rounded mb-2"
//                   value={oldPassword}
//                   onChange={(e) => setOldPassword(e.target.value)}
//                 />
//               </div>
//               <div className="col-span-1">
//                 <label htmlFor="new">New Password *</label>
//                 <input
//                   type="password"
//                   placeholder="New Password"
//                   className="w-full p-1.5 border border-gray-300 rounded mb-2"
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                 />
//               </div>
//               <div className="col-span-1">
//                 <label htmlFor="confirm">Confirm Password *</label>
//                 <input
//                   type="password"
//                   placeholder="Confirm Password"
//                   className="w-full p-1.5 border border-gray-300 rounded mb-4"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="flex justify-end gap-2.5 p-3 border-t-1 border-gray-300">
//               <button
//                 className="bg-gray-600 text-white px-4 py-2 rounded"
//                 // onClick={() => setShowPopup(false)}
//                 onClick={handleChangePassword}
//               >
//                 Confirm
//               </button>
//               <button
//                 className="bg-gray-300 text-black px-4 py-2 rounded"
//                 onClick={() => setShowPopup(false)}
//               >
//                 Cancel
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </>
//   );
// };

// export default AccountDetails;




import { useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash, FaShieldAlt, FaCoins, FaLock } from "react-icons/fa";
import { changePasswordBySelf, getUser } from "../redux/reducer/authReducer";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Spinner2 from "../components/Spinner2";

const AccountDetails = () => {
  const dispatch = useDispatch();
  const { userInfo, loading } = useSelector((state) => state.auth);

  // Form States
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState({ old: false, new: false, conf: false });

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Password not match.");
      return;
    }
    try {
      const res = await dispatch(changePasswordBySelf({ oldPassword, newPassword })).unwrap();
      toast.success(res.message || "Password updated successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner2 /></div>;

  console.log("userInfouserInfouserInfo",userInfo);
  

  return (
    <div className="p-6 bg-[#f4f7fe] min-h-screen font-sans text-slate-700 pb-16">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* --- OVERVIEW SECTION (Full Width) --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Account Overview</span>
            <span className="bg-green-100 text-green-600 text-[10px] px-2 py-1 rounded-full font-bold">Active Account</span>
          </div>
          <div className="p-6">
            <div className="mb-6">
               <h2 className="text-2xl font-extrabold text-slate-800">{userInfo?.name || 'User'}</h2>
               <p className="text-sm text-slate-400 font-medium">Username: <span className="text-blue-600">{userInfo?.userName || 'demo123'}</span></p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Available Balance</p>
                <p className="text-lg font-bold text-slate-800">{userInfo?.balance}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Current Exposure</p>
                <p className="text-lg font-bold text-red-500">0.00</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Casino Balance</p>
                <p className="text-lg font-bold text-slate-800">0.00</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Bet Sound</p>
                  <p className="text-xs font-bold text-slate-600">Enabled</p>
                </div>
                <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 bg-white w-3 h-3 rounded-full shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* --- STACK SECTION --- */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <FaCoins className="text-amber-500" />
              <span className="text-sm font-bold text-slate-700">Quick Stack Settings</span>
            </div>
            <div className="p-6 grid grid-cols-2 gap-3 flex-grow bg-slate-50/30">
              {[["10", "0"], ["1K", "0"], ["100K", "0"], ["8", "0"], ["500", "0"], ["50K", "0"], ["200K", "0"], ["500K", "0"]].map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                    <div className="bg-slate-100 px-3 flex items-center text-[10px] font-black text-slate-500 w-14 border-r border-slate-200 uppercase">{item[0]}</div>
                    <input type="text" defaultValue={item[1]} className="w-full px-3 py-2 text-sm focus:outline-none font-medium" />
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-white border-t border-slate-100">
              <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-all shadow-md active:scale-[0.98]">
                Update Stakes
              </button>
            </div>
          </div>

          {/* --- PASSWORD SECTION --- */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FaLock className="text-blue-500" />
                <span className="text-sm font-bold text-slate-700">Security & Privacy</span>
              </div>
              <button className="text-blue-600 text-[11px] font-bold hover:underline transition-all">VIEW SECURITY LOGS</button>
            </div>
            <div className="p-6 space-y-4 flex-grow">
              {[
                { label: "Current Password", state: oldPassword, set: setOldPassword, type: 'old' },
                { label: "New Password", state: newPassword, set: setNewPassword, type: 'new' },
                { label: "Confirm Password", state: confirmPassword, set: setConfirmPassword, type: 'conf' }
              ].map((field, i) => (
                <div key={i} className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">{field.label}</label>
                  <div className="relative">
                    <input 
                      type={showPass[field.type] ? "text" : "password"} 
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                      value={field.state}
                      onChange={(e) => field.set(e.target.value)}
                    />
                    <button 
                      onClick={() => setShowPass({...showPass, [field.type]: !showPass[field.type]})} 
                      className="absolute right-4 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPass[field.type] ? <FaRegEyeSlash size={16}/> : <FaRegEye size={16}/>}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-white border-t border-slate-100">
              <button 
                onClick={handleChangePassword}
                className="w-full bg-[#d31134] text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-all shadow-md active:scale-[0.98]"
              >
                Change Password
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AccountDetails;