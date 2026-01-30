

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaPlay, FaSearch, FaArrowLeft, FaSpinner } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

import {
  OriginalsGames,
  liveCasino,
  Sexy,
  Exclusivegame,
  Hotgame,
  Toppicker,
  GameShowdata,
  TableGames,
  SlotsGames,
  BingoGames,
} from "../Data/GamesData";

import { getAllGames, launchGame , checkGameBalance } from "../redux/reducer/AllgameReducer";

const Gamesections = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { allGamesdata, launchLoading } = useSelector((state) => state.game);
  const { userInfo, loading } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const gamesPerPage = 20;

  // Fetch all games
  useEffect(() => {
    dispatch(getAllGames());
    dispatch(checkGameBalance());
  }, [dispatch]);

  /* ===========================
     STATIC SECTIONS
  =========================== */
  const gamesBySection = {
    OriginalsGames,
    liveCasino,
    Sexy,
    Exclusivegame,
    Hotgame,
    Toppicker,
    GameShowdata,
    TableGames,
    SlotsGames,
    BingoGames,
  };

  const staticAllGames = useMemo(
    () => [
      ...OriginalsGames,
      ...liveCasino,
      ...Sexy,
      ...Exclusivegame,
      ...Hotgame,
      ...Toppicker,
      ...GameShowdata,
      ...TableGames,
      ...SlotsGames,
      ...BingoGames,
    ],
    []
  );

  const providerNames = {
    OriginalsGames: "Originals",
    liveCasino: "Live Casino",
    Sexy: "Sexy ",
    Exclusivegame: "Exclusive ",
    Hotgame: "Hot ",
    Toppicker: "Top Picker",
    GameShowdata: "Game Shows",
    TableGames: "Table ",
    SlotsGames: "Slots ",
    BingoGames: "Bingo ",
  };
  

  

  const apiGames = allGamesdata?.data || [];
  const allGames = apiGames.length > 0 ? apiGames : staticAllGames;

  const baseGames = gamesBySection[providerId]
    ? gamesBySection[providerId]
    : allGames;

  /* ===========================
     FILTER
  =========================== */
  const filteredGames = useMemo(() => {
    return baseGames.filter((game) => {
      const matchesProvider = gamesBySection[providerId]
        ? true
        : providerId
        ? game.provider?.toLowerCase() === providerId.toLowerCase()
        : true;

      const matchesSearch = game.game_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      return matchesProvider && matchesSearch;
    });
  }, [baseGames, providerId, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [providerId, searchTerm]);

  const totalPages = Math.ceil(filteredGames.length / gamesPerPage);

  const currentGames = filteredGames.slice(
    (currentPage - 1) * gamesPerPage,
    currentPage * gamesPerPage
  );

  /* ===========================
     GAME CLICK → REDIRECT TO GAME PAGE
  =========================== */
  const handlePlayGame = async (game) => {
    
    if (!userInfo) {
      navigate("/login", {
        state: { redirectTo: `/games/${providerId || ""}` },
      });
      return;
    }
  
    try {
      await dispatch(
        launchGame({ gameId: game.game_uid || game.id })
      ).unwrap();
  
      navigate(`/play/${game.game_uid || game.id}`, {
        state: {
          gameUrl: game.game_url,
          gameName: game.game_name,
          provider: game.provider,
        },
      });
    } catch (err) {
      alert(err || "Failed to launch game");
    }
  };
  

  /* ===========================
     UI
  =========================== */
  return (
    <div className="mb-10 pb-16 p-2 md:p-4 bg-[#f8fafc] min-h-screen font-sans">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-400 hover:text-gray-700 text-sm font-bold"
            >
              <FaArrowLeft /> Back
            </button>

            <h2 className="text-sm md:text-base font-black uppercase tracking-widest text-red-600">
  {providerId ? `${providerNames[providerId] || providerId} Games` : "All Games"}
</h2>

          </div>

          {/* Search */}
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
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 md:gap-6">
          {currentGames.map((game) => (
            <div
              key={game.id || game.game_uid}
              onClick={() => handlePlayGame(game)}
              className="group cursor-pointer bg-white rounded overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-red-100 transition-all duration-300"
            >
              <div className="relative aspect-[1/1.2] overflow-hidden bg-gray-100">
                <img
                  src={game.img || game.icon}
                  alt={game.game_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x500?text=Casino";
                  }}
                />

                {/* Play Overlay */}
                <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <FaPlay className="ml-1 text-lg" />
                  </div>
                </div>

                {/* Provider Tag */}
                <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur shadow-sm rounded-md text-[10px] font-bold text-gray-700 uppercase">
                  {game.provider || "Live"}
                </div>
              </div>

              <div className="p-3">
                <h3 className="text-sm font-bold text-gray-800 truncate group-hover:text-red-600 transition-colors">
                  {game.game_name}
                </h3>
                <p className="text-[10px] text-gray-400 font-medium uppercase mt-0.5">
                  Live Studio
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {currentGames.length === 0 && (
          <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200 mt-6">
            <p className="text-gray-400 font-medium">
              No games match your search.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-4 py-2 text-xs font-bold text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
              >
                PREV
              </button>

              {/* Current Page */}
              <button
                onClick={() => setCurrentPage(currentPage)}
                className="w-10 h-10 rounded text-xs font-bold bg-red-600 text-white shadow-md shadow-red-200 transition-all"
              >
                {currentPage}
              </button>

              {/* Next Page */}
              {currentPage < totalPages && (
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="w-10 h-10 rounded text-xs font-bold bg-white text-gray-600 border border-gray-200 hover:border-red-300 transition-all"
                >
                  {currentPage + 1}
                </button>
              )}

              {/* Ellipsis */}
              {currentPage < totalPages - 1 && (
                <span className="px-2 text-gray-400 text-xs font-bold">...</span>
              )}

              {/* Last Page */}
              {currentPage < totalPages - 1 && (
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className="w-10 h-10 rounded text-xs font-bold bg-white text-gray-600 border border-gray-200 hover:border-red-300 transition-all"
                >
                  {totalPages}
                </button>
              )}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-4 py-2 text-xs font-bold text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
              >
                NEXT
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gamesections;

