"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTennisData } from "../redux/reducer/tennisSlice";
import { fetchCricketData } from "../redux/reducer/cricketSlice";
import { fetchSoccerData } from "../redux/reducer/soccerSlice";
import { getUser } from "../redux/reducer/authReducer";
import { useNavigate } from "react-router-dom";
import { MdLock } from "react-icons/md";
import { BiCricketBall, BiTv } from "react-icons/bi";
import { MdOutlineSportsTennis } from "react-icons/md";
import { IoIosFootball } from "react-icons/io";

import Games from "../components/Games";
import PageFooter from "../components/PageFooter";

const Inplay = () => {
  const [activeTab, setActiveTab] = useState("In-Play");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const { data: tennisData, loading: tennisLoading } = useSelector((state) => state.tennis);
  const { matches: cricketData, loader: cricketLoading } = useSelector((state) => state.cricket);
  const { soccerData, soccerLoading } = useSelector((state) => state.soccer);

  useEffect(() => {
    dispatch(fetchTennisData());
    dispatch(fetchCricketData());
    dispatch(fetchSoccerData());
    dispatch(getUser());
  }, [dispatch]);

  // Logic for filtering maintained from your original code
  const inPlayTennisGames = (tennisData || []).filter((game) => game.iplay);
  const todayTennisGames = (tennisData || []).filter((game) => {
    const gameDate = new Date(game.date).toLocaleDateString();
    return gameDate === new Date().toLocaleDateString() && !game.iplay;
  });

  const inPlayCricketGames = (cricketData || []).filter((game) => game.inplay);
  const todayPlayCricketGames = (cricketData || []).filter((game) => {
    const gameDate = new Date(game.date).toLocaleDateString();
    return gameDate === new Date().toLocaleDateString() && !game.inplay;
  });

  const inPlaySoccerGames = (soccerData || []).filter((game) => game.iplay);
  const todayPlaySoccerGames = (soccerData || []).filter((game) => {
    const gameDate = new Date(game.date).toLocaleDateString();
    return gameDate === new Date().toLocaleDateString() && !game.iplay;
  });

  const isGameOn = (index) => !userInfo || userInfo?.gamelock?.[index]?.lock;

  const categories = {
    "In-Play": [
      { name: "Cricket", icon: <BiCricketBall size={18} />, games: inPlayCricketGames, id: 0 },
      { name: "Tennis", icon: <MdOutlineSportsTennis size={18} />, games: inPlayTennisGames, id: 1 },
      { name: "Soccer", icon: <IoIosFootball size={18} />, games: inPlaySoccerGames, id: 2 },
    ].filter(item => isGameOn(item.id)),
    "Today": [
      { name: "Cricket", icon: <BiCricketBall size={18} />, games: todayPlayCricketGames, id: 0 },
      { name: "Tennis", icon: <MdOutlineSportsTennis size={18} />, games: todayTennisGames, id: 1 },
      { name: "Soccer", icon: <IoIosFootball size={18} />, games: todayPlaySoccerGames, id: 2 },
    ].filter(item => isGameOn(item.id)),
  };

  const handleClick = (match, link) => {
    navigate(`${link}/${match.match}/${match.id}`);
  };

  // --- UI HELPER COMPONENTS ---

  const OddsBox = ({ value, stake, type, isLocked }) => {
    // Colors from your screenshot
    const bgMap = {
      back: "bg-[#a5d8ff]", // Light Blue
      lay: "bg-[#fcc2d7]",  // Light Pink
      locked: "bg-[#748c94]", // Darker Gray-ish Blue
    };

    return (
      <div className={`relative flex flex-col justify-center items-center flex-1 h-[44px] border-r border-white ${isLocked ? bgMap.locked : bgMap[type]}`}>
        {isLocked ? (
          <MdLock className="text-white/60" size={16} />
        ) : (
          <>
            <div className="text-[#212529] text-[13px] font-bold leading-none">{value || "-"}</div>
            <div className="text-[#495057] text-[9px] mt-1 font-semibold">{stake || "0"}</div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#f1f3f5] min-h-screen">
      {/* Tab bar consistent with screenshot style */}
      <div className="flex bg-[#2c3e50] border-b border-gray-700">
        {Object.keys(categories).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-[12px] font-bold transition-all ${
              activeTab === tab ? "bg-[#34495e] text-[#f1c40f] border-b-2 border-[#f1c40f]" : "text-white"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="max-w-[1400px] mx-auto px-0 sm:px-1 mt-2">
        {categories[activeTab]?.map((cat, idx) => (
          <div key={idx} className="mb-3 overflow-hidden shadow-sm border border-gray-300">
            
            {/* Header Section from Screenshot */}
            <div className="flex items-center bg-black text-white h-[36px]">
              <div className="relative flex items-center w-full lg:w-[60%] bg-[#7e1d51] px-3 h-full z-10">
                <span className="shrink-0">{cat.icon}</span>
                <span className="ml-2 text-[13px] font-bold uppercase">{cat.name}</span>
                {/* Skewed edge effect */}
                <div className="absolute right-[-12px] top-0 h-full w-[24px] bg-[#7e1d51] transform skew-x-[-25deg] z-[-1] hidden lg:block" />
              </div>
              <div className="hidden lg:flex w-[40%] justify-around text-center font-bold text-[13px]">
                <div className="flex-1">1</div>
                <div className="flex-1">X</div>
                <div className="flex-1">2</div>
              </div>
            </div>

            {/* Match Rows */}
            {cat.games.map((match, mIdx) => (
              <div 
                key={mIdx} 
                className="flex flex-col lg:flex-row bg-white border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleClick(match, cat.name === "Cricket" ? "/cricket-bet" : cat.name === "Tennis" ? "/tennis-bet" : "/soccerbet")}
              >
                {/* Match Info (60%) */}
                <div className="flex items-center justify-between w-full lg:w-[60%] p-2 sm:p-3">
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-bold text-gray-900 uppercase truncate">{match.match}</span>
                      {(match.inplay || match.iplay) && (
                         <span className="w-2 h-2 rounded-full bg-[#28a745] animate-pulse" />
                      )}
                    </div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase mt-0.5">{match.tournament || "General"}</span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <BiTv size={18} className="text-blue-500" />
                    <div className="text-right leading-tight min-w-[60px]">
                      <div className="text-[9px] font-bold text-gray-500">{match.date}</div>
                      <div className="text-[10px] font-bold text-gray-700">{match.time || "LIVE"}</div>
                    </div>
                  </div>
                </div>

                {/* Betting Grid (40%) */}
                <div className="flex w-full lg:w-[40%] border-t lg:border-t-0 border-gray-100">
                  {/* Market 1 */}
                  <div className="flex flex-1 gap-[1px]">
                    <OddsBox type="back" value={match.odds?.[0]?.home} stake={match.odds?.[0]?.homeStake} />
                    <OddsBox type="lay" value={match.odds?.[0]?.away} stake={match.odds?.[0]?.awayStake} />
                  </div>
                  {/* Market X (Draw) - Often Locked in Cricket/Tennis */}
                  <div className="flex flex-1 gap-[1px] mx-[1px]">
                    <OddsBox isLocked={cat.name !== "Soccer"} type="back" value={match.odds?.[1]?.home} stake={match.odds?.[1]?.homeStake} />
                    <OddsBox isLocked={cat.name !== "Soccer"} type="lay" value={match.odds?.[1]?.away} stake={match.odds?.[1]?.awayStake} />
                  </div>
                  {/* Market 2 */}
                  <div className="flex flex-1 gap-[1px]">
                    <OddsBox type="back" value={match.odds?.[2]?.home} stake={match.odds?.[2]?.homeStake} />
                    <OddsBox type="lay" value={match.odds?.[2]?.away} stake={match.odds?.[2]?.awayStake} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* <Games /> */}
      <PageFooter />
    </div>
  );
};

export default Inplay;