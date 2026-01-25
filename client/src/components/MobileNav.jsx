import React, { useState } from "react";
import { BsClock } from "react-icons/bs";
import { IoHome } from "react-icons/io5";
import { BiTrophy, BiUser } from "react-icons/bi";
import { Link } from "react-router-dom";
import cas from '../assets/icons/ChipRotate-(100x100).gif';
import { LuCircleUser } from "react-icons/lu";

export default function MobileNavigation() {
  const [activeTab, setActiveTab] = useState("Sports");

  const navigationItems = [
    {
      name: "Home",
      icon: <IoHome className="h-5 w-5" />,
      href: "/",
    },
    {
      name: "In-Play",
      icon: <BsClock className="h-5 w-5" />,
      href: "/in-play",
    },
    {
      name: "Sports",
      icon: (
        <BiTrophy className="h-6 w-6 text-white" />
      ),
      href: "/sports",
    },
    {
      name: "Casino",
      icon: (
        <img src={cas} alt="Casino" className="h-6 w-6" />
      ),
      href: "/live-casino",
    },
    {
      name: "Account",
      icon: <LuCircleUser className="h-6 w-6" />,
      href: "/account",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t bg-[#243a47] shadow-lg md:hidden">
      <nav className="mx-auto flex max-w-md justify-between relative">
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            onClick={() => setActiveTab(item.name)}
            className={`flex w-full flex-col items-center justify-center py-2 text-xs font-medium text-white ${
              activeTab === item.name ? "bg-blue-2" : "hover:bg-gray-700"
            }`}
          >
            {item.name === "Sports" ? (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className={`h-20 w-20 rounded-t-full flex flex-col items-center justify-center ${ activeTab === "Sports"  ? "bg-blue-2" : "bg-[#243a47]"}`}>
                  <span className="flex items-center justify-center">
                    {item.icon}
                  </span>
                  <span className="mt-0.5">{item.name}</span>
                </div>
              </div>
            ) : (
              <>
                <span className="flex items-center justify-center">
                  {item.icon}
                </span>
                <span className="mt-0.5">{item.name}</span>
              </>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
}