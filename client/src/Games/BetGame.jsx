import React, { useState } from 'react'

import img from '../assets/icons/Joker Teen Patti-min.png'
const BetGame = () => {
    const [activeTab, setActiveTab] = useState("ALL");
    const games = [
        {
          id: 1,
          title: "POINT TEEN PATTI",
          image: img,
          bgColor: "bg-emerald-700",
        },
        {
          id: 2,
          title: "JOKER TEEN PATTI",
          image: img,
          bgColor: "bg-emerald-700",
        },
        {
          id: 3,
          title: "MUFLIS TEEN PATTI",
          image: img,
          bgColor: "bg-emerald-700",
        },
        {
          id: 4,
          title: "1DAY TEEN PATTI",
          image: img,
          bgColor: "bg-emerald-700",
        },
        {
          id: 5,
          title: "DTL TEENPATTI",
          image: img,
          bgColor: "bg-emerald-700",
        },
        {
          id: 6,
          title: "20-20 TEENPATTI",
          image: img,
          bgColor: "bg-emerald-700",
        },
        {
          id: 7,
          title: "20-20 POKER - A",
          image: img,
          bgColor: "bg-emerald-700",
        },
        {
          id: 8,
          title: "20-20 POKER - B",
          image: img,
          bgColor: "bg-emerald-700",
        },
        {
          id: 9,
          title: "ROYAL TEEN PATTI",
          image: img,
          bgColor: "bg-emerald-700",
        },
        {
          id: 10,
          title: "GOLDEN TEEN PATTI",
          image: img,
          bgColor: "bg-emerald-700",
        },
        {
          id: 11,
          title: "KING TEEN PATTI",
          image: img,
          bgColor: "bg-emerald-700",
        },
        {
          id: 12,
          title: "ROYAL FLUSH",
          image: img,
          bgColor: "bg-emerald-700",
        },
      ]

  const subCategories = [
    "ALL",
  ]

  return (
   
    <div>
    <nav className="flex flex-wrap font-bold bg-color border-b border-emerald-600 relative text-[12px]">
      {subCategories.map((category, index) => (
        <button
          key={index}
          className={`px-4 py-2 hover:bg-emerald-600 transition-colors ${activeTab === category ? "bg-emerald-600" : ""}`}
          onClick={() => setActiveTab(category)}
        >
          {category}
        </button>
      ))}

      {/* Search button */}
      {/* <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
        <button className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-500 transition-colors">
          <BiSearch className="text-white" size={20} />
        </button>
      </div> */}
    </nav>

  {/* Game grid */}
  {activeTab === "ALL" && (

  <div className="container mx-auto p-1 md:p-4 relative">
    <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-4">
      {games.map((game) => (
        <div key={game.id} className="relative group cursor-pointer">
          <div
            className={` bg-color rounded-lg overflow-hidden shadow-lg transition-transform duration-300 transform group-hover:scale-105`}
          >
            <div className="md:h-48 relative flex items-center justify-center">
                <img src={game.image} alt="game" />
            </div>
            <div className="py-2 text-center text-white font-bold bg-color text-[12px]">{game.title}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
      
)}
  {activeTab === "Roulette" && (

  <div className="container mx-auto p-1 md:p-4 relative">
    <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-4">
      {games.map((game) => (
        <div key={game.id} className="relative group cursor-pointer">
          <div
            className={` bg-color rounded-lg overflow-hidden shadow-lg transition-transform duration-300 transform group-hover:scale-105`}
          >
            <div className="md:h-48 relative flex items-center justify-center">
                <img src={game.image} alt="game" />
            </div>
            <div className="py-2 text-center text-white font-bold bg-color text-[12px]">{game.title}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
      
)}
  {activeTab === "Baccarat" && (

  <div className="container mx-auto p-1 md:p-4 relative">
    <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-4">
      {games.map((game) => (
        <div key={game.id} className="relative group cursor-pointer">
          <div
            className={` bg-color rounded-lg overflow-hidden shadow-lg transition-transform duration-300 transform group-hover:scale-105`}
          >
            <div className="md:h-48 relative flex items-center justify-center">
                <img src={game.image} alt="game" />
            </div>
            <div className="py-2 text-center text-white font-bold bg-color text-[12px]">{game.title}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
      
)}
  {activeTab === "Game Show" && (

  <div className="container mx-auto p-1 md:p-4 relative">
    <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-4">
      {games.map((game) => (
        <div key={game.id} className="relative group cursor-pointer">
          <div
            className={` bg-color rounded-lg overflow-hidden shadow-lg transition-transform duration-300 transform group-hover:scale-105`}
          >
            <div className="md:h-48 relative flex items-center justify-center">
                <img src={game.image} alt="game" />
            </div>
            <div className="py-2 text-center text-white font-bold bg-color text-[12px]">{game.title}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
      
)}
  {activeTab === "other" && (

  <div className="container mx-auto p-1 md:p-4 relative">
    <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-4">
      {games.map((game) => (
        <div key={game.id} className="relative group cursor-pointer">
          <div
            className={` bg-color rounded-lg overflow-hidden shadow-lg transition-transform duration-300 transform group-hover:scale-105`}
          >
            <div className="md:h-48 relative flex items-center justify-center">
                <img src={game.image} alt="game" />
            </div>
            <div className="py-2 text-center text-white font-bold bg-color text-[12px]">{game.title}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
      
)}
</div>
  )
}

export default BetGame
