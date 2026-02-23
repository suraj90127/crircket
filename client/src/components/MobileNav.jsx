
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaPlayCircle, FaPiggyBank, FaWallet, FaCommentDots } from "react-icons/fa";
import { IoHome } from "react-icons/io5";

export default function MobileNavigation() {
  const [activeTab, setActiveTab] = useState("Home");

  const navigationItems = [
    { name: "Profile", icon: <FaUserCircle className="h-5 w-5" />, href: "/profile" },
    { name: "In-Play", icon: <FaPlayCircle className="h-5 w-5" />, href: "/in-play" },
    { name: "Home", icon: <IoHome className="h-5 w-5" />, href: "/" },
    { name: "Deposit", icon: <FaPiggyBank className="h-5 w-5" />, href: "/wallet/deposit" },
{ name: "Withdrawal", icon: <FaWallet className="h-5 w-5" />, href: "/wallet/withdrawal" },


  ];

  return (
    <div className="fixed bottom-0 left-0 z-[100] w-full md:hidden">
      
      {/* Support Icon - Scaled down */}
      {/* <div className="absolute -top-12 right-4 flex items-center justify-center">
        <div className="bg-[#701a52] h-10 w-10 rounded-full rounded-tr-none flex items-center justify-center text-white shadow-lg cursor-pointer">
          <FaCommentDots className="h-5 w-5" />
        </div>
      </div> */}

      {/* Main Navigation Bar - More compact height */}
      <div className="bg-black rounded-t-[20px] pb-2 pt-1">
        <nav className="mx-auto flex max-w-md justify-around items-end relative h-10 px-1">
          {navigationItems.map((item) => {
            const isActive = activeTab === item.name;

            if (item.name === "Home") {
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setActiveTab(item.name)}
                  className="relative -top-5 z-10"
                >
                  {/* Smaller Central Ring */}
                  <div className="flex h-13 w-13 p-3.5 items-center justify-center rounded-full bg-black border-[3px] border-white shadow-xl">
                    <div className="text-white">
                      {item.icon}
                    </div>
                  </div>
                </Link>
              );
            }

            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setActiveTab(item.name)}
                className="flex flex-col items-center justify-center transition-all w-16"
              >
                <div className={`flex flex-col items-center gap-0.5 ${isActive ? "text-white" : "text-gray-300"}`}>
                  <span className="flex items-center justify-center">
                    {item.icon}
                  </span>
                  {/* Smaller Text: text-[10px] */}
                  <span className="text-[10px] font-bold tracking-tight">
                    {item.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}