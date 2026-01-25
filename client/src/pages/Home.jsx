"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCricketData } from "../redux/reducer/cricketSlice";
import { fetchTennisData } from "../redux/reducer/tennisSlice";
import { fetchSoccerData } from "../redux/reducer/soccerSlice";
import Banner from "../components/Banner";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import Spinner2 from "../components/Spinner2";
import { BiCricketBall } from "react-icons/bi";
import { MdOutlineSportsTennis } from "react-icons/md";
import { IoIosFootball } from "react-icons/io";
import { MdPushPin } from "react-icons/md";
import MenuNav from "../components/MenuNav";
import Games from "../components/Games";
import PageFooter from "../components/PageFooter";

export default function Home() {
  const [activeTab, setActiveTab] = useState("cricket");
  const [activeItem, setActiveItem] = useState("Home");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const lockableGames = [
    { name: "Cricket", path: "/cricket", icon: <BiCricketBall /> },
    { name: "Tennis", path: "/tennis", icon: <MdOutlineSportsTennis /> },
    { name: "Soccer", path: "/soccer", icon: <IoIosFootball /> },
    { name: "Horse Racing", path: "/horse-racing", icon: <BiCricketBall /> },
    { name: "Greyhound Racing", path: "/greyhound-racing", icon: <BiCricketBall /> },
    { name: "Basketball", path: "/basketball", icon: <BiCricketBall /> },
    { name: "Lottery", path: "/lottery", icon: <BiCricketBall /> },
    { name: "Live Casino", path: "/live-casino", icon: <BiCricketBall /> }
  ];

  // Always visible menu items (not affected by lock status)
  const staticNavItems = [
    { name: "Home", path: "/" },
    { name: "In-Play", path: "/in-play" },
    { name: "Multi Markets", path: "/multi-markets" },
    { name: "Vimaan", path: "/vimaan", highlight: true },
    { name: "Tips & Previews", path: "/tips-previews" }
  ];


  // Redux selectors for Cricket and Tennis data
  const {
    matches,
    loader,
    error,
  } = useSelector((state) => state.cricket);
  console.log("matches", matches);
  const {
    data,
    loading,
    tesnnisError,
  } = useSelector((state) => state.tennis);
  const {
    soccerData,
    soccerLoading,
    soccerError,
  } = useSelector((state) => state.soccer);

  const handleClick = (bet, match) => {
    // console.log("iii", bet);
    if (bet) {
      navigate(`/cricket-bet/${match}/${bet.id}`);
    } else {
      alert("This game is suspended");
    }
  };

  // Fetch Cricket data when the Cricket tab is active
  useEffect(() => {
    if (activeTab === "cricket") {
      dispatch(fetchCricketData());
    }
  }, [activeTab, dispatch]);

  // Fetch Tennis data when the Tennis tab is active
  useEffect(() => {
    if (activeTab === "tennis") {
      dispatch(fetchTennisData());
    }
  }, [activeTab, dispatch]);
  //
  useEffect(() => {
    if (activeTab === "soccer") {
      dispatch(fetchSoccerData());
    }
  }, [activeTab, dispatch]);

  useEffect(() => {
    dispatch(fetchCricketData());
  }, [dispatch])

  const getLockedGames = () => {
    if (!userInfo?.gamelock) return lockableGames;

    return lockableGames.filter(game => {
      const gameLock = userInfo.gamelock.find(
        item => item.game.toLowerCase() === game.name.toLowerCase()
      );
      return gameLock?.lock === true;
    }).map(game => ({
      ...game,
      // Generate path from name if missing
      path: game.path || `/${game.name.toLowerCase().replace(/\s+/g, '-')}`
    }));
  };

  const navItems = [
    // ...staticNavItems,
    ...getLockedGames().map(game => ({
      ...game,
      path: game.path || `/${game.name.toLowerCase().replace(/\s+/g, '-')}`
    }))
  ];


  return (
    <div className="text-white">
      <Banner />
      {/* Betting Section */}

      <MenuNav />


      <div className="mx-auto h-[40vh] md:h-[80vh] overflow-y-scroll">
        {/* Highlights Header */}
        <div className="bg-color text-[13px] text-white p-2 font-semibold  hidden md:block">
          Highlights
        </div>

        {/* Sports Tabs */}
        {userInfo ? (
          <div className=" hidden md:flex bg-color gap-3 py-1">
            {userInfo?.gamelock
              ?.filter((tab) => tab.lock).slice(0, 3)
              .map((tab) => (
                <div
                  key={tab.game}
                  className={`px-6 text-[13px] rounded-full cursor-pointer ${activeTab === tab.game
                    ? "bg-green-800 text-white"
                    : "bg-gray-700 text-gray-200"
                    }`}
                  onClick={() => setActiveTab(tab.game)}
                >
                  {tab.game}
                </div>
              ))}

          </div>
        ) : (
          <div className="hidden md:flex bg-color">
            {["cricket", "tennis", "soccer"].map((tab) => (
              <div
                key={tab}
                className={`px-6 text-[13px] rounded-full cursor-pointer ${activeTab === tab
                  ? "bg-green-800 text-white"
                  : "bg-gray-700 text-gray-200"
                  }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </div>
            ))}
          </div>
        )}

        {/* Column Headers */}
        <div className="hidden md:grid grid-cols-14 bg-[#dddcd6] text-gray-700 font-bold text-center text-[13px]">
          <div className="col-span-7 text-left pl-2"></div>
          <div className="col-span-2 text-center">1</div>
          <div className="col-span-2 text-center">X</div>
          <div className="col-span-2 text-center">2</div>
          <div className="col-span-1 text-center"></div>
        </div>
        {loader ? (
          <div className="text-center py-4">
            <Spinner2 />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : (
          activeTab === "cricket" && (
            <div className="bg-white">
              {tesnnisError ? (
                <div className="text-center text-red-500 py-4">
                  {tesnnisError}
                </div>
              ) : (
                matches?.map((bet) => (
                  <div
                    key={bet.id}
                    className="grid grid-cols-13 md:grid-cols-14 gap-1 border-b border-gray-200 py-0.5 items-center text-[12px]"
                  >
                    <div className="col-span-10 md:col-span-6 pl-2 flex justify-between items-center">
                      <div className="flex items-center gap-0.5">
                        <div
                          onClick={() => handleClick(bet, bet.match)}
                          className="text-[#2789ce] font-semibold cursor-pointer flex-wrap gap-5"
                        >
                          <span
                            className="text-[4vw] md:text-xs lg:text-xs leading-[25px]"
                          // style={{ fontFamily: "Tahoma, Helvetica, sans-serif" }}
                          >
                            {bet.match}
                          </span>
                          <span className="text-gray-400 ml-1 font-[400]">
                            {bet.date}
                          </span>
                          {bet.inplay && (
                            <span
                              className="ml-2 text-[12px] font-bold"
                              style={{
                                animation: "blink 1s infinite alternate",
                              }}
                            >
                              Inplay
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="game-mookmaker text-[4vw] md:text-sm lg:text-sm col-span-1 mx-auto">BM</span>

                    {bet.odds.slice(0, 3).map((odd, index) => (
                      <div
                        key={index}
                        className="md:flex justify-center hidden col-span-2 items-center px-2 text-[11px]"
                      >
                        <div className="w-[48%]">
                          <div className="bg-[#72bbef] text-center py-0.5 text-black font-semibold cursor-pointer">
                            {odd.home}
                          </div>
                        </div>
                        <div className="w-[48%]">
                          <div className="bg-[#faa9ba] text-center py-0.5 text-black font-semibold cursor-pointer">
                            {odd.away}
                          </div>
                        </div>
                      </div>
                    ))}



                    {/* Pin Button */}
                    <div className="col-span-2 md:col-span-1 text-center">
                      <button className="rounded-full text-gray-500 w-6 h-6 flex items-center justify-center mx-auto border border-gray-500">
                        <MdPushPin size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )
        )}

        {/* Tennis Tab */}
        {activeTab === "tennis" && (
          <div className="bg-white">
            {loading ? (
              <div className="text-center py-4">
                <Spinner2 />
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-4">{error}</div>
            ) : (
              data.map((bet) => (
                <Link
                  to="/tennis-bet"
                  state={{ gameid: bet.id }}
                  key={bet.id}
                  className="grid grid-cols-12 gap-1 border-b border-gray-400 py-0.5 items-center text-[12px]"
                >
                  <div className="col-span-10 md:col-span-5 pl-2 flex justify-between items-center">
                    <div className="flex items-center gap-0.5">
                      <div className="text-[#2789ce] font-semibold">
                        {bet.match}
                        <span className="text-gray-400 ml-1 font-[400]">{bet.date}</span>
                        {bet.iplay && (
                          <span
                            className="ml-2 text-[12px] font-bold"
                            style={{
                              animation: "blink 1s infinite alternate",
                            }}
                          >
                            Inplay
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {bet.odds.slice(0, 3).map((odd, index) => (
                    <div
                      key={index}
                      className="md:flex hidden col-span-2 items-center px-2"
                    >
                      <div className="w-[50%]">
                        <div className="bg-[#72bbef] text-center py-0.5 text-black font-semibold cursor-pointer">
                          {odd.home}
                        </div>
                      </div>
                      <div className="w-[50%]">
                        <div className="bg-[#faa9ba] text-center py-0.5 text-black font-semibold cursor-pointer">
                          {odd.away}
                        </div>
                      </div>
                    </div>
                  ))}
                </Link>
              ))
            )}
          </div>
        )}

        {/* Soccer Tab */}
        {/* {activeTab === "Soccer" && <div className="bg-white">Soccer Content</div>} */}
        {activeTab === "soccer" && (
          <div className="bg-white">
            {soccerLoading ? (
              <div className="text-center py-4">
                <Spinner2 />
              </div>
            ) : soccerError ? (
              <div className="text-center text-red-500 py-4">{soccerError}</div>
            ) : (
              soccerData?.map((bet) => (
                <Link
                  to="/soccerbet"
                  state={{ gameid: bet.id }}
                  key={bet.id}
                  className="grid grid-cols-12 gap-1 border-b border-gray-400 py-0.5 items-center text-[12px]"
                >
                  <div className="col-span-10 md:col-span-5 pl-2 flex justify-between items-center">
                    <div className="flex items-center gap-0.5">
                      <div className="text-[#2789ce] font-semibold">
                        {bet.match}
                        <span className="text-gray-400 ml-1 font-[400]">{bet.date}</span>
                        {bet.iplay && (
                          <span
                            className="ml-2 text-[12px] font-bold"
                            style={{
                              animation: "blink 1s infinite alternate",
                            }}
                          >
                            Inplay
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {bet.odds.slice(0, 3).map((odd, index) => (
                    <div
                      key={index}
                      className="md:flex hidden col-span-2 items-center px-2"
                    >
                      <div className="w-[50%]">
                        <div className="bg-[#72bbef] text-center py-0.5 text-black font-semibold cursor-pointer">
                          {odd.home}
                        </div>
                      </div>
                      <div className="w-[50%]">
                        <div className="bg-[#faa9ba] text-center py-0.5 text-black font-semibold cursor-pointer">
                          {odd.away}
                        </div>
                      </div>
                    </div>
                  ))}
                </Link>
              ))
            )}
          </div>
        )}
      </div>

      <Games />
      <PageFooter />

    </div>
  );
}
