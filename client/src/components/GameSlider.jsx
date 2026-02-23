import React, { useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // ✅ MISSING IMPORT FIXED
import { OriginalsGames } from "../Data/GamesData";
import { useSelector } from "react-redux";


const GameSlider = () => {
  const scrollRef = useRef(null);
  const navigate = useNavigate(); // ✅ works now

  const [activeTab, setActiveTab] = useState("Originals");
  const { userInfo, loading } = useSelector((state) => state.auth);


  const tabs = ["Originals", "Crash Games", "Live Roulette", "MAC88"];

  // 🔹 Filter games
  const getFilteredGames = () => {
    switch (activeTab) {
      case "Originals":
        return OriginalsGames;

      case "Crash Games":
        return OriginalsGames.filter((g) =>
          g.game_type?.toLowerCase().includes("crash")
        );

      case "Live Roulette":
        return OriginalsGames.filter(
          (g) =>
            g.game_type?.toLowerCase().includes("table") ||
            g.game_type?.toLowerCase().includes("live")
        );

      case "MAC88":
        return OriginalsGames.filter((g) =>
          g.provider?.toLowerCase().includes("jdb")
        );

      default:
        return OriginalsGames;
    }
  };

  const filteredGames = getFilteredGames();

  // 🔹 Scroll logic
  const scroll = (direction) => {
    if (!scrollRef.current) return;

    const { clientWidth } = scrollRef.current;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -clientWidth * 0.6 : clientWidth * 0.6,
      behavior: "smooth",
    });
  };

  // 🔹 GAME PLAY NAVIGATION (API SAFE)
  const handlePlayGame = (game) => {
    if (!game) return;
  
    // ❌ Not logged in → login page
    if (!userInfo) {
      navigate("/login", {
        state: { redirectTo: window.location.pathname },
      });
      return;
    }
  
    // ✅ Logged in → play game
    navigate(`/play/${game.game_uid || game.id}`, {
      state: {
        gameUrl: game.game_url,
        gameName: game.game_name,
        provider: game.provider,
      },
    });
  };
  

  return (
    <div className="mb-2 p-1">
      <div className="bg-white rounded-md shadow-sm">

        {/* Tabs + Arrows */}
        <div className="flex justify-between items-center border-b border-gray-200 py-1">

          {/* Tabs */}
          <div className="flex items-center overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <div
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-2 md:px-3 py-2 font-bold text-[12px] md:text-[14px] cursor-pointer whitespace-nowrap
                  ${
                    activeTab === tab
                      ? "text-red-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-red-600 rounded-full" />
                )}
              </div>
            ))}
          </div>

          {/* Arrows */}
          <div className="flex items-center gap-2 px-2">
            <button
              onClick={() => scroll("left")}
              className="p-2 rounded-md bg-[#82175d] text-white"
            >
              <FaChevronLeft size={10} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2 rounded-md bg-[#82175d] text-white"
            >
              <FaChevronRight size={10} />
            </button>
          </div>
        </div>

        {/* Slider */}
        <div
          ref={scrollRef}
          className="p-2 flex gap-2 overflow-x-auto scroll-smooth no-scrollbar"
        >
          {filteredGames.map((game) => (
            <img
              key={game.id || game.game_uid}
              src={game.img || game.icon}
              alt={game.game_name}
              onClick={() => handlePlayGame(game)} // ✅ CLICK FIXED
              className="w-[120px] sm:w-[140px] md:w-[160px] lg:w-[180px]
                         aspect-[0.9/1] rounded-md object-cover cursor-pointer
                         flex-shrink-0 hover:scale-[1.03] transition"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/180x200?text=Game";
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameSlider;