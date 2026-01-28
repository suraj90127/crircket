import React, { useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { OriginalsGames } from "../Data/GamesData";

const GameSlider = () => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Originals");

  const tabs = ["Originals", "Crash Games", "Live Roulette", "MAC88"];

  // 🔹 Filter games based on tab (DATA FIXED)
  const getFilteredGames = () => {
    switch (activeTab) {
      case "Originals":
        return OriginalsGames;

      case "Crash Games":
        return OriginalsGames.filter(
          (g) => g.game_type?.toLowerCase().includes("crash")
        );

      case "Live Roulette":
        return OriginalsGames.filter(
          (g) =>
            g.game_type?.toLowerCase().includes("table") ||
            g.game_type?.toLowerCase().includes("live")
        );

      case "MAC88":
        return OriginalsGames.filter(
          (g) => g.provider?.toLowerCase().includes("jdb")
        );

      default:
        return OriginalsGames;
    }
  };

  const filteredGames = getFilteredGames();

  // 🔹 Scroll logic (unchanged)
  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const moveDistance =
        direction === "left"
          ? -clientWidth * 0.6
          : clientWidth * 0.6;

      scrollRef.current.scrollBy({
        left: moveDistance,
        behavior: "smooth",
      });
    }
  };

  // 🔹 PLAY REDIRECT FIX
  const handlePlayGame = (game) => {
    navigate(`/play/${game.game_uid || game.id}`, {
      state: {
        gameUrl: game.game_url,
        gameName: game.game_name,
        provider: game.provider,
      },
    });
  };

  return (
    <div className="my-6 px-2 lg:px-4">
      {/* Dark Premium Wrapper */}
      <div className="bg-[#1a0514] rounded-2xl overflow-hidden shadow-2xl border border-white/5">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-[#2d0b23]/40 backdrop-blur-md border-b border-white/5">
          
          {/* Tabs */}
          <div className="flex items-center overflow-x-auto no-scrollbar w-full md:w-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-6 py-4 font-bold text-[11px] md:text-xs uppercase tracking-[0.15em] transition-all duration-300 ${
                  activeTab === tab
                    ? "text-[#ff2e2e]"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#ff2e2e] to-transparent shadow-[0_0_15px_#ff2e2e]"></div>
                )}
              </button>
            ))}
          </div>

          {/* Arrows */}
          <div className="hidden md:flex items-center px-4 gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-[#82175d] text-white transition-all border border-white/10"
            >
              <FaChevronLeft size={12} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-[#82175d] text-white transition-all border border-white/10"
            >
              <FaChevronRight size={12} />
            </button>
          </div>
        </div>

        {/* Slider */}
        <div
          ref={scrollRef}
          className="flex flex-nowrap gap-4 p-5 overflow-x-auto no-scrollbar snap-x snap-mandatory"
        >
          {filteredGames.map((game) => (
            <div
              key={game.id || game.game_uid}
              onClick={() => handlePlayGame(game)}
              className="group relative flex-shrink-0 w-[130px] sm:w-[150px] md:w-[180px] aspect-[3/4] rounded-xl overflow-hidden cursor-pointer snap-start transition-all duration-500 border border-white/5 hover:border-[#ff2e2e]/50 hover:shadow-[0_0_25px_rgba(255,46,173,0.2)]"
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a0514] via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity z-10"></div>

              <img
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110 "
                src={game.img || game.icon}
                alt={game.game_name}
                loading="lazy"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/300x400?text=Casino";
                }}
              />

              {/* Play Icon */}
              <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                <div className="w-12 h-12 bg-[#ff2e2e] rounded-full flex items-center justify-center shadow-lg shadow-[#ff2e2e]/40">
                  <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default GameSlider;