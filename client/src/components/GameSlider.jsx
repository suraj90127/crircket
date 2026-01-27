import React, { useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { OriginalsGames } from "../Data/GamesData";

const GameSlider = () => {
  const scrollRef = useRef(null);
  const [activeTab, setActiveTab] = useState("Originals");

  const tabs = ["Originals", "Crash Games", "Live Roulette", "MAC88"];

  // Filter games based on active tab
  const getFilteredGames = () => {
    switch (activeTab) {
      case "Originals":
        return OriginalsGames;
      case "Crash Games":
        return OriginalsGames.filter(
          game => game.game_type.toLowerCase().includes("crash")
        );
      case "Live Roulette":
        return OriginalsGames.filter(
          game => game.game_type.toLowerCase().includes("table") ||
                 game.game_type.toLowerCase().includes("live")
        );
      case "MAC88":
        return OriginalsGames.filter(
          game => game.provider.toLowerCase().includes("jdb")
        );
      default:
        return OriginalsGames;
    }
  };

  const filteredGames = getFilteredGames();

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (!current) return;
    
    if (direction === "left") {
      current.scrollLeft -= 200;
    } else {
      current.scrollLeft += 200;
    }
  };

  return (
    <div className="mb-2 p-1">
      <div className="bg-white rounded-md shadow-sm">
        {/* Tab Header Section */}
        <div className="flex justify-between items-center border-b border-gray-200 py-1">
          <div className="flex items-center overflow-x-auto no-scrollbar mr-2">
            {tabs.map((tab) => (
              <div
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative ml-1 md:ml-0 px-2 md:px-4 font-bold py-2 cursor-pointer whitespace-nowrap text-[12px] md:text-[14px] transition-colors ${
                  activeTab === tab ? "text-red-600" : "text-gray-600"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute w-full h-[3px] bg-red-600 bottom-0 rounded-full left-0 animate-in fade-in duration-300"></div>
                )}
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center px-2 flex-1 justify-end gap-2">
            <button
              onClick={() => scroll("left")}
              className="p-1.5 md:p-2 rounded-md bg-[#82175d] text-white hover:bg-[#6a124c] transition-colors"
            >
              <FaChevronLeft size={10} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-1.5 md:p-2 rounded-md bg-[#82175d] text-white hover:bg-[#6a124c] transition-colors"
            >
              <FaChevronRight size={10} />
            </button>
          </div>
        </div>

        {/* Game Thumbnails Grid/Scroll */}
        <div
          ref={scrollRef}
          className="p-2 overflow-x-auto flex items-center scroll-smooth no-scrollbar gap-2"
        >
          {filteredGames.map((game) => (
            <img
              key={game.id || game.game_uid}
              className="w-[120px] sm:w-[140px] md:w-[160px] lg:w-[180px] aspect-[0.9/1] rounded-md cursor-pointer hover:scale-[1.02] transition-transform object-cover flex-shrink-0"
              src={game.img || game.icon}
              alt={game.game_name}
              title={`${game.game_name}\n${game.game_type}\n${game.provider}`}
              onError={(e) => {
                e.target.src = game.icon || "https://via.placeholder.com/180x200";
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameSlider;


