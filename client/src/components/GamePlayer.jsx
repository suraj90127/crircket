// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { FaArrowLeft } from "react-icons/fa";

// const GamePlayer = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { gameUrl, gameName } = location.state || {};

//   if (!gameUrl) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-[#1a0514] text-white">
//         <div className="text-center">
//           <p className="text-xl mb-4">Game not found!</p>
//           <button onClick={() => navigate("/")} className="bg-red-600 px-6 py-2 rounded-full">Go Home</button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 z-[999] bg-black flex flex-col">
//       {/* Top Bar */}
//       <div className="h-14 bg-[#1a0514] flex items-center justify-between px-4 border-b border-white/10">
//         <button 
//           onClick={() => navigate(-1)} 
//           className="flex items-center gap-2 text-white hover:text-red-500 transition-colors"
//         >
//           <FaArrowLeft /> <span>Back</span>
//         </button>
//         <h1 className="text-white font-bold">{gameName}</h1>
//         <div className="w-10"></div> {/* Spacer */}
//       </div>

//       {/* Game Iframe */}
//       <div className="flex-grow bg-black">
//         <iframe
//           src={gameUrl}
//           className="w-full h-full border-none"
//           title={gameName}
//           allow="autoplay; fullscreen; encrypted-media"
//         />
//       </div>
//     </div>
//   );
// };

// export default GamePlayer;


import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux"; // Added Redux imports
import {
  getAllGames,
  launchGame,
  clearGameUrl,
  resetGameState,
} from "../redux/reducer/AllgameReducer";

const GamePlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { gameId } = useParams(); // Get gameId from URL params
  const dispatch = useDispatch();
  
  const { allGamesdata, gameUrl, launchLoading } = useSelector(
    (state) => state.game
  );

  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if game data is passed via location state (from Gamesections component)
    if (location.state?.gameUrl) {
      setGameData({
        gameUrl: location.state.gameUrl,
        gameName: location.state.gameName
      });
      setLoading(false);
    } else if (gameId) {
      // If no location state, try to find game by ID from your data
      findGameById(gameId);
    } else {
      setLoading(false);
    }
  }, [location.state, gameId]);

  const findGameById = async (id) => {
    setLoading(true);
    try {
      // Option 1: If you have all games in Redux
      if (allGamesdata && allGamesdata.length > 0) {
        const foundGame = allGamesdata.find(
          game => game.game_uid === id || game.id === id
        );
        if (foundGame) {
          setGameData({
            gameUrl: foundGame.game_url,
            gameName: foundGame.game_name
          });
        }
      } else {
        // Option 2: Dispatch action to get game by ID
        dispatch(launchGame({ gameId: id }));
      }
    } catch (error) {
      console.error("Error finding game:", error);
    } finally {
      setLoading(false);
    }
  };

  // Listen to Redux gameUrl changes
  useEffect(() => {
    if (gameUrl && !gameData) {
      setGameData({
        gameUrl: gameUrl,
        gameName: "Game" // You might want to store game name in Redux too
      });
    }
  }, [gameUrl]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#1a0514] text-white">
        <div className="text-center">
          <p className="text-xl mb-4">Loading game...</p>
        </div>
      </div>
    );
  }

  if (!gameData?.gameUrl) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#1a0514] text-white">
        <div className="text-center">
          <p className="text-xl mb-4">Game not found!</p>
          <button 
            onClick={() => navigate("/")} 
            className="bg-red-600 px-6 py-2 rounded-full hover:bg-red-700 transition-colors"
          >
            Go Home
          </button>
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
        <h1 className="text-white font-bold">{gameData.gameName}</h1>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      {/* Game Iframe */}
      <div className="flex-grow bg-black">
        <iframe
          src={gameData.gameUrl}
          className="w-full h-full border-none"
          title={gameData.gameName}
          allow="autoplay; fullscreen; encrypted-media"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default GamePlayer;