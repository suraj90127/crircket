"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTennisData } from "../redux/reducer/tennisSlice";
import { useNavigate } from "react-router-dom";
import { MdLock } from "react-icons/md";
import { BiTv } from "react-icons/bi";
import { MdOutlineSportsTennis } from "react-icons/md";

import Banner from "../components/Banner";
import MenuNav from "../components/MenuNav";
import Games from "../components/Games";
import PageFooter from "../components/PageFooter";
import Spinner2 from "../components/Spinner2";

const Tennis = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const { data, loading, tesnnisError } = useSelector((state) => state.tennis);

  // Check if game is locked based on user info
  const gameOnOff = userInfo?.gamelock?.[1]?.lock;

  useEffect(() => {
    dispatch(fetchTennisData());
  }, [dispatch]);

  const handleClick = (bet, match) => {
    // console.log("iii", match);
    if (bet) {
      navigate(`/tennis-bet/${match}/${bet.id}`);
    } else {
      alert("This game is suspended");
    }
  };

  const shouldShowLock = (value) => {
    return value === 0 || value === "0" || value === null || value === undefined;
  };

  // --- REUSABLE COMPONENTS (Matching Home Design) ---

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
            <div className="text-[#495057] text-[9px] sm:text-[10px] mt-1">{subValue}</div>
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
            {match.tournament || "Tennis Tournament"}
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
              {match.time || "00:00"}
            </span>
          </div>
        </div>
      </div>
  
      <div className="flex w-full lg:w-[40%] border-t lg:border-t-0 lg:border-l border-gray-100">
        <div className="flex flex-1">
          <OddsBox value={match.odds?.[0]?.home} subValue={match.odds?.[0]?.homeStake} type="back" suspended={match.suspended} />
          <OddsBox value={match.odds?.[0]?.away} subValue={match.odds?.[0]?.awayStake} type="lay" suspended={match.suspended} />
        </div>
        <div className="flex flex-1 border-x border-white">
          <OddsBox type="locked" suspended />
          <OddsBox type="locked" suspended />
        </div>
        <div className="flex flex-1">
          <OddsBox value={match.odds?.[1]?.home} subValue={match.odds?.[1]?.homeStake} type="back" suspended={match.suspended} />
          <OddsBox value={match.odds?.[1]?.away} subValue={match.odds?.[1]?.awayStake} type="lay" suspended={match.suspended} />
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) return <div className="py-10"><Spinner2 /></div>;
    if (tesnnisError) return <div className="text-center text-red-500 py-10">{tesnnisError}</div>;

    return (
      <div className="max-w-[1400px] mx-auto px-1 sm:px-2 lg:px-4 mt-2">
        <section className="mb-4 shadow-sm bg-white rounded-t-lg overflow-hidden border border-gray-200">
          <SportHeader sport="Tennis" icon={<MdOutlineSportsTennis className="text-white" size={20} />} />
          {data?.map((m) => (
            <MatchRow key={m.id} match={m} />
          ))}
        </section>
      </div>
    );
  };

  return (
    <div className="bg-[#f1f3f5] min-h-screen pb-10">
      <Banner />
      <MenuNav />

      {/* Logic to show matches or Lock screen */}
      {userInfo && !gameOnOff ? (
        <div className="text-center py-20">
          <h2 className="text-3xl md:text-5xl text-red-500 font-semibold uppercase tracking-tighter">
            This Game is Hidden
          </h2>
        </div>
      ) : (
        renderContent()
      )}

      {/* <Games /> */}
      <PageFooter />
    </div>
  );
};

export default Tennis;