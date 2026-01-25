import React from 'react'
import { MdPushPin } from "react-icons/md"
import Banner from '../components/Banner'


const Market = () => {
      // Betting data
      const bettingData = [
        {
          id: 1,
          match: "AUS vs IND",
          date: "16-09-2024 20:56",
          channels: ["S"],
          odds: [
            { home: "2.18", away: "0" },
            { home: "7.92", away: "0" },
            { home: "2.62", away: "0" },
          ],
        },
      ]
  return (
    <div>
      {/* Betting Section */}
      <div className=" mx-auto">
      <div className="bg-color text-[13px] text-white p-1 font-semibold">Highlights</div>
      <div className="hidden md:grid grid-cols-12 bg-[#dddcd6] text-black font-bold  text-center text-[13px] border-gray-600">
          <div className="col-span-5 text-left pl-2"></div>
          <div className="col-span-2 text-center">1</div>
          <div className="col-span-2 text-center">X</div>
          <div className="col-span-2 text-center">2</div>
          <div className="col-span-1 text-center"></div>
        </div>

        <div className="bg-white">
          {bettingData.map((bet) => (
            <div key={bet.id} className="grid grid-cols-12 gap-1 border-b border-gray-400 py-0.5 items-center text-[12px]">
              <div className="col-span-10 md:col-span-5 pl-2 flex justify-between items-center">
              <div className="flex items-center gap-0.5">
                <div className="text-[#2789ce] font-medium">{bet.match}
                 <span className="text-gray-400 ml-1 font-[400]">{bet.date}</span></div>
                </div>
                <div className="flex space-x-1 mt-1">
                  {bet.channels.includes("BT") && (
                    <span className="bg-blue-900 text-white text-xs px-1 rounded">BT</span>
                  )}
                  {bet.channels.includes("F") && <span className="bg-blue-500 text-white text-xs px-1 rounded">F</span>}
                  {bet.channels.includes("S") && (
                    <span className="bg-orange-500 text-white text-xs px-1 rounded">S</span>
                  )}
                  {bet.channels.includes("TV") && (
                    <span className="bg-green-600 text-white text-xs px-1 rounded">TV</span>
                  )}
                </div>
              </div>
          
              {bet.odds.map((odd, index) => (
                <div key={index} className="md:flex hidden col-span-2 px-2">
                  <div className="w-[50%]">
                   <div className="bg-[#72bbef] text-center py-0.5 cursor-pointer">{odd.home}</div>
                  </div>
                  <div className="w-[50%]">
                    <div className="bg-[#faa9ba] text-center py-0.5 cursor-pointer">{odd.away}</div>
                  </div>
                </div>
              ))}

              <div className="col-span-2 md:col-span-1 text-center">
                <button className="rounded-full bg-gray-200 text-gray-500 w-8 h-8 flex items-center justify-center mx-auto hover:bg-gray-300">
                  <MdPushPin size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
    </div>
    </div>
  )
}

export default Market
