import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaPlay, FaSearch, FaArrowLeft } from "react-icons/fa";
// Import all your data
import * as AllData from "../Data/GamesData";

const Gamesections = () => {
  const { providerId } = useParams(); // Gets provider name from URL
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Combine all categories into one array for filtering
  const allGames = [
    ...AllData.OriginalsGames, 
    ...AllData.SlotsGames, 
    ...AllData.TableGames,
    ...AllData.liveCasino
  ];

  // Filter logic: Match provider AND search term
  const filteredGames = allGames.filter((game) => {
    const matchesProvider = providerId 
      ? game.provider?.toLowerCase() === providerId.toLowerCase() 
      : true;
    const matchesSearch = game.game_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesProvider && matchesSearch;
  });

  const handlePlayGame = (game) => {
    // Navigate to player and pass game data via state
    navigate(`/play/${game.game_uid || game.id}`, { 
      state: { 
        gameUrl: game.game_url || "https://example-game-url.com", // Ensure your data has game_url
        gameName: game.game_name 
      } 
    });
  };

  return (
    <div className="mb-10 p-4 bg-[#0f020c] min-h-screen text-white">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white">
            <FaArrowLeft /> Back
          </button>
          <h2 className="text-2xl font-bold uppercase tracking-widest text-red-500">
            {providerId ? `${providerId} Games` : "All Games"}
          </h2>
          <div className="relative w-full md:w-72">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search in provider..."
              className="w-full pl-10 pr-4 py-2 bg-[#1a0514] border border-white/10 rounded-lg focus:outline-none focus:border-red-500"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredGames.map((game) => (
            <div 
              key={game.id || game.game_uid} 
              onClick={() => handlePlayGame(game)}
              className="group cursor-pointer bg-[#1a0514] rounded-xl overflow-hidden border border-white/5 hover:border-red-500/50 transition-all"
            >
              <div className="relative aspect-[1/1.2]">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={game.img || game.icon} alt={game.game_name} />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <div className="bg-red-600 p-4 rounded-full"><FaPlay className="text-white" /></div>
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-bold truncate">{game.game_name}</h3>
                <p className="text-[10px] text-gray-500 uppercase">{game.provider}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gamesections;