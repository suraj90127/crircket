"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCricketData } from "../redux/reducer/cricketSlice";
import { useNavigate } from "react-router-dom";
import { MdLock, MdPushPin } from "react-icons/md";
import { BiCricketBall, BiTv } from "react-icons/bi";

import Banner from "../components/Banner";
import MenuNav from "../components/MenuNav";
import Games from "../components/Games";
import PageFooter from "../components/PageFooter";
import Spinner2 from "../components/Spinner2";

const Cricket = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const gameOnOff = userInfo?.gamelock?.[0]?.lock;
  const { matches, loader, error } = useSelector((state) => state.cricket);

  // console.log("/cricket", matches);
  

  useEffect(() => {
    dispatch(fetchCricketData());
  }, [dispatch]);

  const handleClick = (bet, match) => {
    console.log("iii", match);
    if (bet) {
      navigate(`/cricket-bet/${match}/${bet.id}`);
    } else {
      alert("This game is suspended");
    }
  };

  const shouldShowLock = (value) => {
    return value === 0 || value === "0" || value === null || value === undefined;
  };

  // --- REUSABLE SUB-COMPONENTS (MATCHING HOME DESIGN) ---

  const SportHeader = ({ sport, icon }) => (
    <div className="flex items-center rounded-t-lg bg-black text-white overflow-hidden mb-[1px]">
      <div className="relative flex items-center w-full lg:w-[60%] bg-[#7e1d51] py-2 px-3 z-10">
        {icon}
        <span className="text-[13px] sm:text-[14px] ml-2 font-bold uppercase italic tracking-wider">
          {sport}
        </span>
        <div className="absolute right-[-14px] top-0 h-full w-[28px] bg-[#7e1d51] transform skew-x-[-20deg] z-[-1] hidden lg:block" />
      </div>

      <div className="hidden lg:flex w-[40%] justify-end">
        <div className="flex w-full text-center font-bold text-[14px]">
          <div className="w-1/3">1</div>
          <div className="w-1/3">X</div>
          <div className="w-1/3">2</div>
        </div>
      </div>
    </div>
  );

  const OddsBox = ({ value, subValue, type, suspended }) => {
    const isLocked = shouldShowLock(value) || suspended;
    const bgColor = type === "back" ? "bg-[#a5d8ff]" : type === "lay" ? "bg-[#fcc2d7]" : "bg-[#ced4da]";
    
    return (
      <div className={`relative flex flex-col justify-center items-center flex-1 h-[48px] border-r border-white ${bgColor}`}>
        {isLocked ? (
          <div className="absolute inset-0 bg-[#748c94]/90 flex items-center justify-center">
            <MdLock className="text-white/80" size={14} />
          </div>
        ) : (
          <>
            <div className="text-[#212529] text-[13px] sm:text-[14px] font-bold leading-none">{value}</div>
            <div className="text-[#495057] text-[9px] sm:text-[10px] mt-1">{subValue || '0'}</div>
          </>
        )}
      </div>
    );
  };

  const MatchRow = ({ match }) => (
    <div
      className="flex flex-col lg:flex-row bg-white border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={() => handleClick(match, match.match)}
    >
      <div className="flex items-center justify-between w-full lg:w-[60%] p-2 sm:p-3">
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[12px] sm:text-[13px] font-bold text-gray-800 uppercase truncate">
              {match.match}
            </span>
            {match.inplay && (
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
            )}
          </div>
          <span className="text-[10px] sm:text-[11px] text-gray-500 font-semibold truncate mt-0.5">
             {match.tournament || "Cricket Tournament"}
          </span>
        </div>
  
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
          {(match.hasTv || match.inplay) && (
            <BiTv size={20} className="text-blue-600 shrink-0" />
          )}

          <div className="flex flex-col items-center justify-center min-w-[65px] sm:min-w-[75px] bg-orange-50 px-1 py-1 rounded border border-orange-100">
            <span className="text-[9px] sm:text-[10px] font-bold text-gray-600 whitespace-nowrap">
              {match.date}
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold text-gray-700 whitespace-nowrap">
              {match.time || "In-Play"}
            </span>
          </div>
          <button className="rounded-full text-gray-400 hover:text-blue-500 transition-colors">
            <MdPushPin size={16} />
          </button>
        </div>
      </div>
  
      <div className="flex w-full lg:w-[40%] border-t lg:border-t-0 lg:border-l border-gray-100">
        {/* Match Odds 1 */}
        <div className="flex flex-1">
          <OddsBox value={match.odds?.[0]?.home} subValue={match.odds?.[0]?.homeStake} type="back" suspended={match.suspended} />
          <OddsBox value={match.odds?.[0]?.away} subValue={match.odds?.[0]?.awayStake} type="lay" suspended={match.suspended} />
        </div>
        {/* Draw (X) Odds - usually empty for most cricket markets unless specified */}
        <div className="flex flex-1 border-x border-white">
           <OddsBox value={match.odds?.[1]?.home} subValue={match.odds?.[1]?.homeStake} type="back" suspended={match.suspended} />
           <OddsBox value={match.odds?.[1]?.away} subValue={match.odds?.[1]?.awayStake} type="lay" suspended={match.suspended} />
        </div>
        {/* Match Odds 2 */}
        <div className="flex flex-1">
          <OddsBox value={match.odds?.[2]?.home} subValue={match.odds?.[2]?.homeStake} type="back" suspended={match.suspended} />
          <OddsBox value={match.odds?.[2]?.away} subValue={match.odds?.[2]?.awayStake} type="lay" suspended={match.suspended} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#f1f3f5] min-h-screen">
      <Banner />
      <MenuNav />

      <div className="max-w-[1400px] mx-auto px-1 sm:px-2 lg:px-4 mt-2">
        {userInfo && !gameOnOff ? (
          <div className="text-center py-10">
            <h2 className="text-3xl md:text-5xl text-red-500 font-semibold">This Game is Hidden</h2>
          </div>
        ) : (
          <section className="mb-4 shadow-sm bg-white rounded-t-lg overflow-hidden border border-gray-200">
            <SportHeader sport="Cricket" icon={<BiCricketBall className="text-white" size={20} />} />
            
            {/* Ball By Ball Feature Row */}
            <div className="flex bg-white border-b border-gray-300 p-2 items-center">
               <div className="flex-1 flex items-center gap-2">
                  <span className="text-[12px] font-bold text-[#007bff]">BALL BY BALL</span>
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               </div>
               <div className="flex-1 lg:flex-[0.4] flex justify-end">
                  <div className="w-full lg:w-1/3 h-[38px] bg-[#748c94] flex items-center justify-center rounded-sm">
                     <MdLock className="text-white/50" />
                  </div>
               </div>
            </div>

            {loader ? (
              <div className="py-10"><Spinner2 /></div>
            ) : error ? (
              <div className="text-center text-red-500 py-4">{error}</div>
            ) : (
              matches?.map(m => <MatchRow key={m.id} match={m} />)
            )}
          </section>
        )}
      </div>

      {/* <Games /> */}
      <PageFooter />
    </div>
  );
};

export default Cricket;