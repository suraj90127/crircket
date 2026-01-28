import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const GamePlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { gameUrl, gameName } = location.state || {};

  if (!gameUrl) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#1a0514] text-white">
        <div className="text-center">
          <p className="text-xl mb-4">Game not found!</p>
          <button onClick={() => navigate("/")} className="bg-red-600 px-6 py-2 rounded-full">Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[999] bg-black flex flex-col">
      {/* Top Bar */}
      <div className="h-14 bg-[#1a0514] flex items-center justify-between px-4 border-b border-white/10">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-white hover:text-red-500 transition-colors"
        >
          <FaArrowLeft /> <span>Back</span>
        </button>
        <h1 className="text-white font-bold">{gameName}</h1>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      {/* Game Iframe */}
      <div className="flex-grow bg-black">
        <iframe
          src={gameUrl}
          className="w-full h-full border-none"
          title={gameName}
          allow="autoplay; fullscreen; encrypted-media"
        />
      </div>
    </div>
  );
};

export default GamePlayer;