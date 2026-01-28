import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { BiCricketBall } from "react-icons/bi";
import { MdOutlineSportsTennis } from "react-icons/md";
import { IoIosFootball } from "react-icons/io";
import { GiHorseHead } from "react-icons/gi";
import { IoBasketballOutline } from 'react-icons/io5';
import { MdOutlineCasino } from "react-icons/md";
import { CgCardSpades } from "react-icons/cg";
import { FaHorse } from 'react-icons/fa';


const MenuNav = () => {
    const { userInfo, loading } = useSelector((state) => state.auth);
    const [activeItem, setActiveItem] = useState("Home");
    
    const lockableGames = [
        { name: "Cricket", path: "/cricket", icon: <BiCricketBall  className='h-5 w-5'/> },
        { name: "Tennis", path: "/tennis", icon: <MdOutlineSportsTennis className='h-5 w-5' /> },
        { name: "Soccer", path: "/soccer", icon: <IoIosFootball className='h-5 w-5' /> },
        { name: "Horse Racing", path: "/horse-racing", icon: <GiHorseHead className='h-5 w-5'/> },
        { name: "Greyhound Racing", path: "/greyhound-racing", icon: <FaHorse className='h-5 w-5'/> },
        { name: "Basketball", path: "/basketball", icon: <IoBasketballOutline  className='h-5 w-5'/> },
        { name: "Lottery", path: "/lottery", icon: <CgCardSpades  className='h-5 w-5'/> },
        { name: "Live Casino", path: "/live-casino", icon: <MdOutlineCasino  className='h-5 w-5'/> }
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
    // ...staticNavItems,
    ...getLockedGames().map(game => ({
      ...game,
      path: game.path || `/${game.name.toLowerCase().replace(/\s+/g, '-')}`
    }))
  ];
  return (
    <div>
           {/* Navigation Menu */}
           <nav className="bg-color text-black overflow-x-auto  md:hidden block">
        <ul className={`flex flex-row overflow-auto`}>
          {navItems.map((item, i) => (
            <li key={i}>
              <Link
                to={item.path}
                className={`flex gap-1 px-3 py-2 h-full w-full whitespace-nowrap transition-colors text-[13px] border-r border-gray-500 font-semibold
                  ${activeItem === item.name ? "text-white" : "hover:underline"}
                  ${item.highlight ? "bg-black text-red-600 " : ""}`}
                onClick={() => {
                  setActiveItem(item.name);
                }}
              >
               <span>{item?.icon}</span> {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default MenuNav


// import React, { useState } from 'react';
// import { useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// import { BiCricketBall } from "react-icons/bi";
// import { MdOutlineSportsTennis, MdOutlineCasino, MdOutlineSportsEsports, MdOutlineLocalFireDepartment } from "react-icons/md";
// import { IoIosFootball, IoMdHome, IoIosPlayCircle } from "react-icons/io";
// import { GiHorseHead, GiBoxingGlove } from "react-icons/gi";
// import { IoBasketballOutline } from 'react-icons/io5';
// import { BsShieldShaded } from "react-icons/bs";
// import { FaUsers } from "react-icons/fa";

// const MenuNav = () => {
//     const { userInfo } = useSelector((state) => state.auth);
//     const [activeItem, setActiveItem] = useState("Home");
    
//     // Updated list to match your new screenshot exactly
//     const lockableGames = [
//         { name: "Home", path: "/", icon: <IoMdHome className='h-5 w-5' /> },
//         { name: "In-Play", path: "/in-play", icon: <IoIosPlayCircle className='h-5 w-5' />, count: 13 },
//         { name: "Cricket", path: "/cricket", icon: <BiCricketBall className='h-5 w-5' /> },
//         { name: "Soccer", path: "/soccer", icon: <IoIosFootball className='h-5 w-5' />, count: 7 },
//         { name: "Tennis", path: "/tennis", icon: <MdOutlineSportsTennis className='h-5 w-5' />, count: 1 },
//         { name: "Sports Book", path: "/sports-book", icon: <BsShieldShaded className='h-5 w-5' /> },
//         { name: "Original", path: "/original", icon: <MdOutlineLocalFireDepartment className='h-5 w-5' /> },
//         { name: "Horse Racing", path: "/horse-racing", icon: <GiHorseHead className='h-5 w-5' /> },
//         { name: "Casino", path: "/live-casino", icon: <MdOutlineCasino className='h-5 w-5' /> },
//         { name: "Int Casino", path: "/int-casino", icon: <MdOutlineCasino className='h-5 w-5' /> },
//         { name: "Virtual", path: "/virtual", icon: <MdOutlineSportsEsports className='h-5 w-5' /> },
//         { name: "Boxing", path: "/boxing", icon: <GiBoxingGlove className='h-5 w-5' /> },
//         { name: "Basketball", path: "/basketball", icon: <IoBasketballOutline className='h-5 w-5' />, count: 5 },
//         { name: "Kabaddi", path: "/kabaddi", icon: <FaUsers className='h-5 w-5' /> }
//     ];

//     const getLockedGames = () => {
//         if (!userInfo?.gamelock) return lockableGames;
//         return lockableGames.filter(game => {
//             if (game.name === "Home" || game.name === "In-Play") return true;
//             const gameLock = userInfo.gamelock.find(
//                 item => item.game.toLowerCase() === game.name.toLowerCase()
//             );
//             return gameLock?.lock === true;
//         });
//     };

//     const navItems = getLockedGames();

//     return (
//         <div className="bg-gray-100 py-3 overflow-hidden">
//             <nav className="overflow-x-auto no-scrollbar">
//                 <ul className="flex flex-row items-center gap-2 px-4 h-16">
//                     {navItems.map((item, i) => {
//                         const isActive = activeItem === item.name;
//                         return (
//                             <li key={i} className="relative flex-shrink-0">
//                                 <Link
//                                     to={item.path}
//                                     className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 shadow-sm border
//                                         ${isActive 
//                                             ? "bg-black text-white border-black" 
//                                             : "bg-white text-black border-gray-200 hover:bg-gray-50"
//                                         }`}
//                                     onClick={() => setActiveItem(item.name)}
//                                 >
//                                     <span>{item.icon}</span>
//                                     <span className="text-[14px] font-bold whitespace-nowrap">{item.name}</span>
                                    
//                                     {/* Red Badge */}
//                                     {item.count && (
//                                         <span className="absolute -top-2 -right-1 bg-red-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
//                                             {item.count}
//                                         </span>
//                                     )}

//                                     {/* Speech Bubble Arrow for Active Item */}
//                                     {isActive && (
//                                         <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 
//                                             border-l-[8px] border-l-transparent 
//                                             border-r-[8px] border-r-transparent 
//                                             border-t-[8px] border-t-black">
//                                         </div>
//                                     )}
//                                 </Link>
//                             </li>
//                         );
//                     })}
//                 </ul>
//             </nav>

//             <style jsx>{`
//                 .no-scrollbar::-webkit-scrollbar {
//                     display: none;
//                 }
//                 .no-scrollbar {
//                     -ms-overflow-style: none;
//                     scrollbar-width: none;
//                 }
//             `}</style>
//         </div>
//     );
// };

// export default MenuNav;