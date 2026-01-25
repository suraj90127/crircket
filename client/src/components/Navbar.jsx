import { useState, useEffect, useRef } from "react";
import { IoMdClose, IoMdRefresh } from "react-icons/io";
import { Link } from "react-router-dom";
import { BsCoin, BsPersonCircle } from "react-icons/bs";
import { MdOutlineArrowDropDown } from "react-icons/md";
import logo from "../assets/icons/theme-1709828838678-aura555.png";
import { getUser, loginUser, user_reset } from "../redux/reducer/authReducer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../redux/api";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearchPlus } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";


const Navbar = () => {
  const { userInfo, loading } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const [showPopup, setShowPopup] = useState(false);
  const [showPopup1, setShowPopup1] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [serachbar, setSearchbar] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPopup(false);
    dispatch(loginUser(formData)).then((res) => {
      if (res?.payload?.success) {
        toast.success(res.payload.message);
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1000);
      } else {
        toast.error(res.payload.message);
      }
    });
  };

  const handlego = () => {
    setShowPopup1(false);
    navigate("/login");
  }

  // console.log('user', userInfo)

  const lockableGames = [
    { name: "Cricket", path: "/cricket" },
    { name: "Tennis", path: "/tennis" },
    { name: "Soccer", path: "/soccer" },
    { name: "Horse Racing", path: "/horse-racing" },
    { name: "Greyhound Racing", path: "/greyhound-racing" },
    { name: "Basketball", path: "/basketball" },
    { name: "Lottery", path: "/lottery" },
    { name: "Live Casino", path: "/live-casino" }
  ];

  // Always visible menu items (not affected by lock status)
  const staticNavItems = [
    { name: "Home", path: "/" },
    { name: "In-Play", path: "/in-play" },
    { name: "Multi Markets", path: "/multi-markets" },
    { name: "Vimaan", path: "/vimaan", highlight: true },
    { name: "Tips & Previews", path: "/tips-previews" }
  ];

  // Filter games based on lock status// Update getLockedGames to include path generation
  const getLockedGames = () => {
    if (!userInfo?.gamelock) return lockableGames;

    return lockableGames.filter(game => {
      const gameLock = userInfo.gamelock.find(
        item => item.game.toLowerCase() === game.name.toLowerCase()
      );
      return gameLock?.lock === true;
    }).map(game => ({
      ...game,
      // Generate path from name if missing
      path: game.path || `/${game.name.toLowerCase().replace(/\s+/g, '-')}`
    }));
  };

  // Create navItems (no changes needed here)
  const navItems = [
    ...staticNavItems,
    ...getLockedGames().map(game => ({
      ...game,
      path: game.path || `/${game.name.toLowerCase().replace(/\s+/g, '-')}`
    }))
  ];


  // console.log("navItems", navItems)

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
    <div className="w-full sticky top-0 z-10"
      ref={dropdownRef}>
      <header className="flex flex-col md:flex-row items-center justify-between p-2 bg-color border-b border-gray-800">
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link to="/" className=" hidden md:flex items-center gap-2">
            <img src={logo} alt="logo" className="h-[60px] block" />
          </Link>
          {userInfo ? (

            <Link to="/open-bet" className=" md:hidden block py-1 px-4 font-semibold text-white border border-[#2f2f2f] bg-color">
              <div className="flex items-center gap-0.5 text-[13px]"><BsCoin />Bets</div>
            </Link>
          ) : (
            <Link to="/" className="flex md:hidden items-center gap-2">
                <img src={logo} alt="logo" className="h-[45px] block" />
              </Link>
          )}

          {loading ? (
            // Loader while fetching userInfo
            <div className="text-white text-sm font-semibold md:hidden">
              Loading...
            </div>
          ) : userInfo ? (
            <div className="relative flex items-center gap-2 md:hidden">
              <div className="text-white text-[12px] font-semibold  text-center">
                <p>
                  Main PTI <span>{userInfo?.balance}</span>
                </p>
                <p>
                  Explsure (
                  <span className="text-[#e52219]">
                    {Number(userInfo?.exposure).toFixed(2)}
                  </span>
                  )
                </p>
              </div>
              <button className="bg-color text-[20px] text-white p-1.5 border-[1px] border-[#303030]">
                <IoMdRefresh />
              </button>
            </div>
          ) : (
                <div
                  onClick={(e) => setShowPopup1(true) && e.preventDefault()}
                // to="/login"
              className="bg-[#e52219] md:hidden text-white font-bold py-2 px-4 text-xs rounded flex items-center gap-1 md:w-auto justify-center md:mt-0"
            >
              Login <span><MdOutlineLogout /></span>
                </div>
          )}
        </div>

        <div
          className={`flex flex-col md:flex-row items-center gap-4 w-full md:w-auto mt-4 md:mt-0 ${isMenuOpen ? "block" : "hidden md:flex"
            }`}
        >
          {/* Search Bar */}
          {serachbar && (
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search Events"
                className="w-full bg-white text-black pl-2 pr-10 py-0.5 text-[13px] rounded focus:outline-none"
              />
            </div>
          )}
          <span><FaSearchPlus className="text-xl text-white" onClick={() => setSearchbar(!serachbar)} /></span>

          {/* Login/Profile Section */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            {userInfo ? (
              <div className="relative flex items-center gap-2">
                <div className="text-white text-[13px] font-semibold">
                  <p>
                    Main PTI <span>{userInfo?.avbalance}</span>
                  </p>
                  <p>
                    Explsure (
                    <span className="text-red-500">
                      {Number(userInfo?.exposure).toFixed(2)}
                    </span>
                    )
                  </p>
                </div>
                <button className="bg-[#2a2a2a] text-[20px] text-white p-1">
                  <IoMdRefresh />
                </button>
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-2 text-[13px] bg-[#2a2a2a]  text-white px-4 py-1"
                >
                  <BsPersonCircle /> My Account{" "}
                  <MdOutlineArrowDropDown className="size-5" />
                </button>

                {/* Profile Dropdown */}
                {showProfileDropdown && (
                  <div className="absolute right-0 top-6 mt-2 w-60 bg-white text-black text-sm shadow-2xl">
                    <p className="bg-gray-300 w-full px-2 py-1 font-bold">
                      Exchange
                    </p>
                    <ul className="py-2">
                      <li
                        onClick={() => setShowProfileDropdown(false)}
                        className="px-4 py-1 hover:bg-gray-200 border-b border-gray-300"
                      >
                        <Link className="w-full flex" to="/profile">My Profile</Link>
                      </li>
                      <li
                        onClick={() => setShowProfileDropdown(false)}
                        className="px-4 py-1 hover:bg-gray-200 border-b border-gray-300"
                      >
                        <Link className="w-full flex" to="/rolling">Rolling Commission</Link>
                      </li>
                      <li
                        onClick={() => setShowProfileDropdown(false)}
                        className="px-4 py-1 hover:bg-gray-200 border-b border-gray-300"
                      >
                        <Link className="w-full flex" to="/statement">Account Statement</Link>
                      </li>
                      <li
                        onClick={() => setShowProfileDropdown(false)}
                        className="px-4 py-1 hover:bg-gray-200 border-b border-gray-300"
                      >
                        <Link className="w-full flex" to="/bet-history">Bet History</Link>
                      </li>
                      <li
                        onClick={() => setShowProfileDropdown(false)}
                        className="px-4 py-1 hover:bg-gray-200 border-b border-gray-300"
                      >
                        <Link className="w-full flex" to="/p&l">Profit & Loss</Link>
                      </li>
                      <li
                        onClick={() => setShowProfileDropdown(false)}
                        className="px-4 py-1 hover:bg-gray-200 border-b border-gray-300"
                      >
                        <Link className="w-full flex" to="/passhistory">Password History</Link>
                      </li>
                      <li
                        onClick={() => setShowProfileDropdown(false)}
                        className="px-4 py-1 hover:bg-gray-200 border-b border-gray-300"
                      >
                        <Link className="w-full flex" to="/activity">Activity log</Link>
                      </li>
                      <li
                        // onClick={() => setShowProfileDropdown(false)}
                        className="px-4 py-1 hover:bg-gray-200 border-b border-gray-300"
                      >
                        <button onClick={logout}>Logout</button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Username"
                  value={formData.userName}
                  onChange={(e) =>
                    setFormData({ ...formData, userName: e.target.value })
                  }
                  className="w-full md:w-40 bg-white text-black py-0.5 px-2 rounded  focus:outline-none"
                />
                  <div className="relative w-full md:w-40">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="Password"
                      className="w-full bg-white text-black py-0.5 px-2 rounded focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                <button
                  onClick={(e) => setShowPopup(true) && e.preventDefault()}
                  className="bg-[#e52219] text-white font-bold py-0.5 px-4 rounded flex items-center gap-1 w-full md:w-auto justify-center mt-2 md:mt-0"
                >
                  Login <span><MdOutlineLogout /></span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation Menu */}
      <nav className="bg-color text-black overflow-x-auto hidden md:block">
        <ul className={`flex flex-row overflow-auto`}>
          {navItems.map((item, i) => (
            <li key={i}>
              <Link
                to={item.path}
                className={`block px-3 py-2 h-full w-full whitespace-nowrap transition-colors text-[13px] border-r border-gray-500 font-semibold
                  ${activeItem === item.name ? "text-white" : "hover:underline"}
                  ${item.highlight ? "bg-black text-red-600 " : ""}`}
                onClick={() => {
                  setActiveItem(item.name);
                  console.log("Navigating to", item.path);
                  if (window.innerWidth < 768) {
                    setIsMenuOpen(false);
                  }
                }}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="bg-color text-white p-4 w-full md:max-w-lg shadow-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-center">
                Non-Gambling Territories.
              </h2>
              <button
                onClick={() => setShowPopup(false)}
                className="text-xl bg-color p-1 rounded-md"
              >
                <IoMdClose />
              </button>
            </div>
            <hr className="my-2 border-white" />
            <p className="text-[14px] text-center font-[700] px-10">
              Connecting to our site from non-gambling countries, it will be
              User's responsibility to ensure that their use of the service is
              lawful.
            </p>
            <h3 className="font-bold text-center my-6">
              Underage gambling is prohibited.
            </h3>
            <p className="text-sm text-center">
              Please confirm if you are 18 years old and above as of today.
            </p>
            <hr className="my-2 border-white" />
            <div className="flex justify-center gap-2 mt-4">
              <button
                className="bg-white text-black w-[130px] py-1 rounded hover:bg-gray-300"
                onClick={handleSubmit}
              >
                Confirm
              </button>
              <button
                className="bg-black text-white w-[130px] py-1 border border-white rounded"
                onClick={() => setShowPopup(false)}
              >
                Exit
              </button>
            </div>
          </motion.div>
        </div>
      )}
      {showPopup1 && (
        <>
          <div className="absolute h-[100vh] w-full bg-[#00000080]"></div>
          <div className="fixed inset-0 flex items-center justify-center mx-2">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="bg-color text-white py-4 w-full md:max-w-lg shadow-lg p-4">
              <div className="items-center relative">
                <h2 className="text-lg font-bold text-center py-2">
                  Non-Gambling Territories.
                </h2>
                <button
                  onClick={() => setShowPopup1(false)}
                  className=" bg-color rounded-md absolute -right-2 -top-2 p-1"
                >
                  <IoMdClose />
                </button>
              </div>
              <hr className="my-2 border-white" />
              <p className="text-[14px] text-center font-[700]">
                Connecting to our site from non-gambling countries, it will be
                User's responsibility to ensure that their use of the service is
                lawful.
              </p>
              <h3 className="font-bold text-center my-6">
                Underage gambling is prohibited.
              </h3>
              <hr className="my-2 border-white" />
              <p className="text-sm text-center font-semibold">
                Please confirm if you are 18 years old and above as of today.
              </p>
              <div className="flex justify-center gap-2 mt-4">
                <button
                  className="bg-white text-black w-[130px] py-1 rounded hover:bg-gray-300 text-center"
                  onClick={handlego}
                >
                  Confirm
                </button>
                <button
                  className="bg-black text-white w-[130px] py-1 border border-white rounded"
                  onClick={() => setShowPopup1(false)}
                >
                  Exit
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;
