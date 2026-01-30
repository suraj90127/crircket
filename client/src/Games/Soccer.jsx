"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSoccerData } from "../redux/reducer/soccerSlice";
import { useNavigate } from "react-router-dom";
import { MdLock, MdPushPin } from "react-icons/md";
import { IoIosFootball } from "react-icons/io";
import { BiTv } from "react-icons/bi";

import Banner from "../components/Banner";
import MenuNav from "../components/MenuNav";
import Games from "../components/Games";
import PageFooter from "../components/PageFooter";
import Spinner2 from "../components/Spinner2";

const Soccer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const gameOnOff = userInfo?.gamelock[2]?.lock || false;

  const { soccerData, soccerLoading, soccerError } = useSelector((state) => state.soccer || {});

  useEffect(() => {
    dispatch(fetchSoccerData());
  }, [dispatch]);

  const handleClick = (bet, match) => {
    if (bet) {
      navigate(`/soccerbet/${match}/${bet.id}`);
    } else {
      navigate(`/soccer`);
    }
  };

  const shouldShowLock = (value) => {
    return value === 0 || value === "0" || value === null || value === undefined;
  };

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
            <div className="text-[#495057] text-[9px] sm:text-[10px] mt-1">{subValue || "0"}</div>
          </>
        )}
      </div>
    );
  };

  const renderMatches = () => (
    <div className="max-w-[1400px] mx-auto px-1 sm:px-2 lg:px-4 mt-2">
      <section className="mb-4 shadow-sm bg-white rounded-t-lg overflow-hidden border border-gray-200">
        {/* Sport Header */}
        <div className="flex items-center rounded-t-lg bg-black text-white overflow-hidden mb-[1px]">
          <div className="relative flex items-center w-full lg:w-[60%] bg-[#7e1d51] py-2 px-3 z-10">
            <IoIosFootball className="text-white" size={20} />
            <span className="text-[13px] sm:text-[14px] ml-2 font-bold uppercase italic tracking-wider">Soccer</span>
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

        {soccerLoading ? (
          <div className="py-10 text-center"><Spinner2 /></div>
        ) : soccerError ? (
          <div className="text-center text-red-500 py-4">{soccerError}</div>
        ) : (
          soccerData.map((bet) => (
            <div key={bet.id} className="flex flex-col lg:flex-row bg-white border-b border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors">
              <div onClick={() => handleClick(bet, bet.match)} className="flex items-center justify-between w-full lg:w-[60%] p-2 sm:p-3">
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] sm:text-[13px] font-bold text-gray-800 uppercase truncate">{bet.match}</span>
                    {bet.iplay && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] sm:text-[11px] text-gray-500 font-semibold">{bet.date}</span>
                    <div className="flex gap-1">
                      {["BT", "F", "S", "TV"].map((label) => bet.channels.includes(label) && (
                        <span key={label} className="text-[9px] px-1 bg-gray-200 text-gray-700 rounded font-bold">{label}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-2">
                  <BiTv size={20} className="text-blue-600 shrink-0" />
                  <button className="rounded-full text-gray-400 border border-gray-300 w-6 h-6 flex items-center justify-center"><MdPushPin size={14} /></button>
                </div>
              </div>
              
              <div className="flex w-full lg:w-[40%] border-t lg:border-t-0 lg:border-l border-gray-100">
                {/* 1, X, 2 Columns */}
                {[0, 1, 2].map((idx) => (
                  <div key={idx} className={`flex flex-1 ${idx === 1 ? 'border-x border-white' : ''}`}>
                    <OddsBox value={bet.odds[idx]?.home} subValue={bet.odds[idx]?.homeStake} type="back" suspended={bet.suspended} />
                    <OddsBox value={bet.odds[idx]?.away} subValue={bet.odds[idx]?.awayStake} type="lay" suspended={bet.suspended} />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );

  return (
    <div className="bg-[#f1f3f5] min-h-screen">
      <Banner />
      <MenuNav />
      {userInfo ? (gameOnOff ? renderMatches() : <div className="text-center py-10"><h2 className="text-3xl text-red-500 font-semibold">This Game is Hidden</h2></div>) : renderMatches()}
      {/* <Games /> */}
      <PageFooter />
    </div>
  );
};

export default Soccer;