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
                <p className="text-lg font-bold text-slate-800">{userInfo?.avbalance}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Current Exposure</p>
                <p className="text-lg font-bold text-red-500">{Number(userInfo?.exposure).toFixed(2)}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Casino Balance</p>
                <p className="text-lg font-bold text-slate-800">{userInfo?.balance}</p>
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