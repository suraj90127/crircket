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
