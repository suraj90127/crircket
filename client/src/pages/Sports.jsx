import React, { useState } from 'react'
import {
  MdSportsCricket,
  MdCasino,
  MdSportsTennis,
  MdSportsSoccer,
  MdSportsScore,
  MdPets,
  MdSportsBasketball,
  MdAttachMoney,
} from "react-icons/md"
import { BiChevronRightSquare, BiSolidCricketBall } from "react-icons/bi";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { BsClock, BsPinFill } from "react-icons/bs"
import { IoHome } from "react-icons/io5"
import { BiDisc, BiTrophy, BiUser } from "react-icons/bi"
import { Link } from "react-router-dom"

import { IoIosTennisball, IoMdFootball } from 'react-icons/io';
import Inplay from '../Games/Inplay';
import Market from '../Games/Market';
import Circket from '../Games/Circket';
import Soccer from '../Games/Soccer';
import Tennis from '../Games/Tennis';
import { FaAngleRight, FaChevronRight } from 'react-icons/fa';
const Sports = () => {
  const [activeItem, setActiveItem] = useState(null)
  const [activeTab, setActiveTab] = useState("Sports")

  const navigationItems = [
    {
      name: "In-Play",
      icon: <BsClock className="h-5 w-6" />,
      href: "in-play",
    },
    {
      name: "Multi Market",
      icon: <BsPinFill className="h-5 w-6" />,
      href: "multi-markets",
    },
    {
      name: "Cricket",
      icon: <BiSolidCricketBall className="h-5 w-6" />,
      href: "cricket",
    },
    {
      name: "Football",
      icon: <IoMdFootball className="h-5 w-6" />,
      href: "soccer",
    },
    {
      name: "Tennis",
      icon: <IoIosTennisball className="h-5 w-6" />,
      href: "tennis",
    },
  ]
  const SportsList = [
    { name: "Cricket", link: "/cricket", icon: MdSportsCricket },
    { name: "Casino", link: "/live-casino", icon: MdCasino },
    { name: "Tennis", link: "/tennis", icon: MdSportsTennis },
    { name: "Soccer", link: "/soccer", icon: MdSportsSoccer },
    { name: "Horse Racing", link: "/horse-racing", icon: MdSportsScore },
    { name: "Greyhound Racing", link: "/greyhound-racing", icon: MdPets },
    { name: "Basketball", link: "/basketball", icon: MdSportsBasketball },
    { name: "Lottery", link: "/lottery", icon: MdAttachMoney },
  ]
  return (
    <div>
      <div className="w-full">
        <nav className="mx-auto bg-[#243a47] grid grid-cols-5 px-1">
          {navigationItems.map((item) => (
            <div
              key={item.name}
              onClick={() => {
                setActiveTab(item.name)
              }}
              className={`flex w-full flex-col col-span-1 items-center justify-center py-2 text-xs font-medium text-white ${activeTab === item.name
                ? " bg-blue"
                : "hover:bg-gray-700"
                }`}
            >
              <span
                className={`flex  items-center justify-center rounded-full ${activeTab === item.name ? "bg-gray-700" : ""
                  }`}
              >
                {item.icon}
              </span>
              <span className="mt-1">{item.name}</span>
            </div>
          ))}
        </nav>
        <div className="p-2 border-b border-blue-800 bg-blue flex items-center justify-center text-white">
          <h2 className="text-[13px] text-center font-semibold">All Sports</h2>
        </div>

        {activeTab === "Sports" && (

          <nav>
            <ul>
              {SportsList.map((sport, index) => (
                <li key={index}>
                  <Link to={sport.link}
                    className={`w-full flex items-center justify-between p-2 text-[13px] text-blue transition-colors duration-200 border-b border-blue-800/30 `}
                  >
                    <div className="flex items-center gap-3 font-semibold">
                      <span>{sport.name}</span>
                    </div>
                    <span className='border border-gray-400 p-1 rounded-sm'>
                      <FaChevronRight
                        className={`text-gray-800 transition-transform duration-200 size-3 md:size-4`}
                      />
                    </span>
                  </Link>


                </li>
              ))}
            </ul>
          </nav>
        )}

        {activeTab === "In-Play" && (
          <Inplay />
        )}
        {activeTab === "Multi Market" && (
          <Market />
        )}
        {activeTab === "Cricket" && (
          <Circket />
        )}
        {activeTab === "Football" && (
          <Soccer />
        )}
        {activeTab === "Tennis" && (
          <Tennis />
        )}
      </div>
    </div>
  )
}

export default Sports
