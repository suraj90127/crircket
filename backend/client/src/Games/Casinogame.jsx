import React, { useState, useEffect } from "react";
import { liveCasino } from "../Data/GamesData";
import { FaPlay, FaSearch } from "react-icons/fa";

const Casinogame = () => {
  const [activeTab, setActiveTab] = useState("Live Casino");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const gamesPerPage = 20;

  const tabs = ["Live Casino"];

  // Filter logic for Search + Tab
  const filteredData = liveCasino.filter(game => 
    game.game_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = filteredData.slice(indexOfFirstGame, indexOfLastGame);
  const totalPages = Math.ceil(filteredData.length / gamesPerPage);

  return (
    <div className="mb-10 p-2 md:p-4 bg-[#f8fafc] min-h-screen font-sans">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header & Search Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 gap-4">
          <div className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative py-2 text-sm font-black uppercase tracking-widest transition-all ${
                  activeTab === tab ? "text-red-600" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-red-600 rounded-full"></span>
                )}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-3" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all"
            />
          </div>
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4 md:gap-6">
          {currentGames.map((game) => (
            <div 
              key={game.id || game.game_uid} 
              className="group bg-white rounded overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-red-100 transition-all duration-300"
            >
              {/* Image with Play Overlay */}
              <div className="relative aspect-[1/1.2] overflow-hidden bg-gray-100">
                <img
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  src={game.img || game.icon}
                  alt={game.game_name}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x500?text=Casino";
                  }}
                />
                
                {/* Glassmorphism Play Button Overlay */}
                <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button className="bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <FaPlay className="ml-1 text-lg" />
                  </button>
                </div>

                {/* Tag */}
                <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur shadow-sm rounded-md text-[10px] font-bold text-gray-700 uppercase">
                  {game.provider || "Live"}
                </div>
              </div>

              {/* Title Section */}
              <div className="p-3">
                <h3 className="text-sm font-bold text-gray-800 truncate group-hover:text-red-600 transition-colors">
                  {game.game_name}
                </h3>
                <p className="text-[10px] text-gray-400 font-medium uppercase mt-0.5">Live Studio</p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {currentGames.length === 0 && (
          <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200 mt-6">
            <p className="text-gray-400 font-medium">No games match your search.</p>
          </div>
        )}

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="mt-10 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="px-4 py-2 text-xs font-bold text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-all"
              >
                PREV
              </button>

              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded text-xs font-bold transition-all ${
                      currentPage === i + 1
                        ? "bg-red-600 text-white shadow-md shadow-red-200"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-red-300"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-4 py-2 text-xs font-bold text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-all"
              >
                NEXT
              </button>
            </div>
            <p className="text-[11px] text-gray-400 font-semibold tracking-widest uppercase">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Casinogame;