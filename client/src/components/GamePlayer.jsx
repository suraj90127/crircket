import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { launchGame } from "../redux/reducer/AllgameReducer";

const GamePlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { gameId } = useParams();
  const dispatch = useDispatch();

  const { allGamesdata, gameUrl } = useSelector((state) => state.game);

  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If navigation passed game state
    if (location.state?.gameUrl) {
      setGameData({
        gameUrl: location.state.gameUrl,
        gameName: location.state.gameName
      });
      setLoading(false);
    } else if (gameId) {
      fetchGameById(gameId);
    } else {
      setLoading(false);
    }
  }, [location.state, gameId]);

  const fetchGameById = (id) => {
    setLoading(true);
    try {
      if (allGamesdata?.length > 0) {
        const foundGame = allGamesdata.find(
          (game) => game.game_uid === id || game.id === id
        );
        if (foundGame) {
          setGameData({
            gameUrl: foundGame.game_url,
            gameName: foundGame.game_name
          });
        }
      } else {
        // Fetch game from backend if not in Redux
        dispatch(launchGame({ gameId: id }));
      }
    } catch (error) {
      console.error("Error fetching game:", error);
    } finally {
      setLoading(false);
    }
  };

  // Listen to Redux gameUrl changes
  useEffect(() => {
    if (gameUrl && !gameData) {
      setGameData({
        gameUrl,
        gameName: "Game"
      });
    }
  }, [gameUrl]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#1a0514] text-white">
        <p className="text-xl sm:text-2xl">Loading game...</p>
      </div>
    );
  }

  if (!gameData?.gameUrl) {
    return (
      <div className="h-screen   flex flex-col items-center justify-center bg-[#1a0514] text-white gap-4 px-4">
        <p className="text-xl sm:text-2xl">Game not found!</p>
        <button
          onClick={() => navigate("/")}
          className="bg-red-600 px-6 py-2 rounded-full hover:bg-red-700 transition-colors text-sm sm:text-base"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-black py-8 ">
      {/* Top Bar */}
      <div className="h-14 sm:h-16 bg-[#1a0514] flex items-center justify-between px-4 sm:px-6 border-b border-white/10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white hover:text-red-500 transition-colors text-sm sm:text-base"
        >
          <FaArrowLeft /> Back
        </button>
        <h1 className="text-white font-bold text-sm sm:text-lg md:text-xl truncate max-w-[60%] text-center sm:text-left">
          {gameData.gameName}
        </h1>
        <div className="w-8 sm:w-10" /> {/* Spacer */}
      </div>

      {/* Game Iframe */}
      <div className="flex-grow relative">
        <iframe
          src={gameData.gameUrl}
          className="absolute top-0 left-0 w-full h-full border-none"
          title={gameData.gameName}
          allow="autoplay; fullscreen; encrypted-media"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default GamePlayer;