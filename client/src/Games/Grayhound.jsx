import React, { useState } from 'react'
import { MdPushPin } from "react-icons/md"
import Banner from '../components/Banner'
import { Link } from 'react-router-dom';
import MenuNav from '../components/MenuNav';
import Games from '../components/Games';
import PageFooter from '../components/PageFooter';

const scheduleData = [
  {
    location: "Hove",
    times: ["19:41", "21:16", "21:34", "21:53", "22:12", "22:31", "22:49"],
  },
  {
    location: "Towcester",
    times: ["21:26", "21:44", "22:03", "22:21", "22:39", "22:54"],
  },
  {
    location: "Valley",
    times: ["21:18", "21:37", "21:56", "22:14", "22:29", "22:46"],
  },
  {
    location: "Perry Barr",
    times: [
      "23:08",
      "23:26",
      "23:42",
      "23:59",
      "0:16",
      "0:33",
      "0:49",
      "1:07",
      "1:24",
    ],
    extraTimes: ["1:41", "1:59", "2:16"],
  },
  {
    location: "Yarmouth",
    times: ["23:14", "23:31", "23:48", "0:06", "0:22", "0:39", "0:56"],
    extraTimes: ["1:47", "2:04", "2:23"],
  },
  {
    location: "Romford",
    times: ["23:37", "23:53", "0:11", "0:27", "0:44", "1:01", "1:19"],
    extraTimes: ["2:11", "2:28", "2:46"],
  },
  {
    location: "Sunderland",
    times: ["21:28", "21:47", "22:06", "22:24", "22:43"],
  },
  {
    location: "Harlow",
    times: ["23:11", "23:29", "23:46", "0:04", "0:24", "0:42", "0:58"],
    extraTimes: ["1:52"],
  },
];
const Grayhound = () => {
  const [activeTab, setActiveTab] = useState("ALL")
  // Betting data
  const bettingData = [
    {
      id: 1,
      match: "Circket Ball By Ball",
      date: "16-09-2024 20:56",
      channels: ["S"],
      odds: [
        { home: "2.18", away: "0" },
        { home: "7.92", away: "0" },
        { home: "2.62", away: "0" },
      ],
    },
    {
      id: 2,
      match: "Women's Premier League",
      date: "14-02-2025 19:00",
      channels: ["TV"],
      odds: [
        { home: "2.72", away: "3.4" },
        { home: "4.3", away: "6.4" },
        { home: "2", away: "2.12" },
      ],
    },
    {
      id: 3,
      match: "Dolphins v Titans",
      date: "12-03-2025 16:00",
      channels: ["BT", "F", "S"],
      odds: [
        { home: "0", away: "0" },
        { home: "0.0", away: "0.0" },
        { home: "0", away: "0" },
      ],
    },
    {
      id: 4,
      match: "England Masters v Australia Masters",
      date: "12-03-2025 19:00",
      channels: ["BT", "F", "S"],
      odds: [
        { home: "0", away: "0" },
        { home: "0.0", away: "0.0" },
        { home: "0", away: "0" },
      ],
    },
    {
      id: 5,
      match: "Namibia v Netherlands",
      date: "13-03-2025 12:30",
      channels: ["BT", "F", "S"],
      odds: [
        { home: "0", away: "0" },
        { home: "0.0", away: "0.0" },
        { home: "0", away: "0" },
      ],
    },
    {
      id: 6,
      match: "New Zealand Women v Sri Lanka Women",
      date: "14-03-2025 11:15",
      channels: ["BT", "F", "S"],
      odds: [
        { home: "0", away: "0" },
        { home: "0.0", away: "0.0" },
        { home: "0", away: "0" },
      ],
    },
    {
      id: 7,
      match: "Kolkata Knight Riders v Royal Challengers Bengalu",
      date: "22-03-2025 19:00",
      channels: [],
      odds: [
        { home: "0", away: "0" },
        { home: "0.0", away: "0.0" },
        { home: "0", away: "0" },
      ],
    },
    {
      id: 8,
      match: "Sunrisers Hyderabad v Rajasthan Royals",
      date: "23-03-2025 15:00",
      channels: [],
      odds: [
        { home: "0", away: "0" },
        { home: "0.0", away: "0.0" },
        { home: "0", away: "0" },
      ],
    },
    {
      id: 9,
      match: "Chennai Super Kings v Mumbai Indians",
      date: "23-03-2025 19:00",
      channels: [],
      odds: [
        { home: "0", away: "0" },
        { home: "0.0", away: "0.0" },
        { home: "0", away: "0" },
      ],
    },
    {
      id: 10,
      match: "Delhi Capitals v Lucknow Super Giants",
      date: "24-03-2025 19:00",
      channels: [],
      odds: [
        { home: "0", away: "0" },
        { home: "0.0", away: "0.0" },
        { home: "0", away: "0" },
      ],
    },
    {
      id: 11,
      match: "Gujarat Titans v Punjab Kings",
      date: "25-03-2025 19:00",
      channels: [],
      odds: [
        { home: "0", away: "0" },
        { home: "0.0", away: "0.0" },
        { home: "0", away: "0" },
      ],
    },
  ]
  return (
    <div>
      <Banner />
      <MenuNav />

      {/* Betting Section */}
      <div className="max-h-[40vh] md:max-h-[80vh] mx-auto">
        <div className="bg-color text-[13px] text-white p-2 font-semibold  hidden md:block">Highlights</div>
        <div className="flex bg-gray-100 gap-1">
          {["ALL", "GB"].map((tab) => (
            <div
              key={tab}
              className={`px-6 py-2 font-bold  text-[13px] cursor-pointer ${activeTab === tab ? "bg-white text-black" : "bg-gray-100 text-black"
                }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>
        {activeTab === "ALL" && (

          <div className="bg-white">
            {bettingData.map((bet) => (
              <Link key={bet.id} className="grid grid-cols-12 gap-1 border-b border-gray-400 py-0.5 items-center text-[12px]">
                <div className="col-span-10 md:col-span-11 pl-2 flex justify-between items-center">
                  <div className="flex items-center gap-0.5">
                    <div className="text-[#2789ce] font-semibold">
                      <span
                        className="text-[4vw] md:text-xs lg:text-xs leading-[25px]"
                      // style={{ fontFamily: "Tahoma, Helvetica, sans-serif" }}
                      >
                        {bet.match}
                      </span></div>
                    <div className="text-gray-400 font-[400] ">{bet.date}</div>
                  </div>
                </div>

                <div className="col-span-2 md:col-span-1 text-center">
                  <button className="rounded-full text-gray-500 w-6 h-6 flex items-center justify-center mx-auto border border-gray-500">
                    <MdPushPin size={16} />
                  </button>
                </div>
              </Link>
            ))}
          </div>

        )}

        {activeTab === "GB" && (
          <div className=" mx-auto p-4">
            {scheduleData.map((item, index) => (
              <div key={index} className="mb-4 grid grid-cols-6">
                <h2 className="font-bold text-sm mb-2 col-span-2">{item.location}</h2>
                <div className="flex flex-wrap gap-2 col-span-4">
                  {item.times.map((time, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-300 px-3 py-1 rounded-md font-semibold text-[13px]"
                    >
                      {time}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Games />
      <PageFooter />
    </div>
  )
}

export default Grayhound
