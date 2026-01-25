import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSoccerData } from "../redux/reducer/soccerSlice";
import { MdPushPin } from "react-icons/md";
import Banner from "../components/Banner";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import Spinner2 from "../components/Spinner2";
import MenuNav from "../components/MenuNav";
import Games from "../components/Games";
import PageFooter from "../components/PageFooter";

const Soccer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const gameOnOff = userInfo?.gamelock[2]?.lock || false

  // Access cricket matches from Redux store
  const { matches, loader, error } = useSelector((state) => state.cricket);
  const {
    soccerData,
    soccerLoading,
    soccerError,

  } = useSelector((state) => state.soccer || {});

  const handleClick = (bet, match) => {
    if (bet) {
      navigate(`/soccerbet/${match}/${bet.id}`);
    } else {
      navigate(`/soccer`);
    }
  };

  useEffect(() => {
    dispatch(fetchSoccerData());
  }, [dispatch]);




  const renderMatches = () => (

    <div className="max-h-[40vh] md:max-h-[80vh] mx-auto overflow-auto">
      <div className="bg-color text-[13px] text-white p-1 font-semibold  hidden md:block">
        Highlights
      </div>
      <div className="hidden md:grid grid-cols-12 bg-[#dddcd6] text-gray-700 font-bold text-center text-[13px]">
        <div className="col-span-5 text-left pl-2"></div>
        <div className="col-span-2 text-center">1</div>
        <div className="col-span-2 text-center">X</div>
        <div className="col-span-2 text-center">2</div>
        <div className="col-span-1 text-center"></div>
      </div>

      <div className="bg-white">
        {soccerLoading ? (
          <div className="text-center py-4">
            <Spinner2 />
          </div>
        ) : soccerError ? (
          <div className="text-center text-red-500 py-4">{soccerError}</div>
        ) : (
          soccerData.map((bet) => (
            <div
              // to="/soccerbet"
              // state={{ gameid: bet.id }}
              key={bet.id}
              className="grid grid-cols-12 border-b border-gray-300 text-[12px] py-1 items-center hover:bg-gray-50"
            >
              {/* Match Info */}
              <div
                onClick={() => handleClick(bet, bet.match)}
                className="col-span-10 md:col-span-5 pl-2 cursor-pointer"
              >
                <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center">
                  <div className="text-[#2789ce] font-semibold text-xs">
                    <span
                      className="text-[4vw] md:text-xs lg:text-xs leading-[25px]"
                    // style={{ fontFamily: "Tahoma, Helvetica, sans-serif" }}
                    >
                      {bet.match}
                    </span>
                    <span className="text-gray-500 ml-1 font-[400]">{bet.date}</span>
                    {bet.iplay && (
                      <span className="ml-2 text-red-500 font-bold animate-pulse">
                        Inplay
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1 mt-1 md:mt-0">
                    {bet.channels.includes("BT") && (
                      <span className="bg-blue-900 text-white text-xs px-1 rounded">
                        BT
                      </span>
                    )}
                    {bet.channels.includes("F") && (
                      <span className="bg-blue-500 text-white text-xs px-1 rounded">
                        F
                      </span>
                    )}
                    {bet.channels.includes("S") && (
                      <span className="bg-orange-500 text-white text-xs px-1 rounded">
                        S
                      </span>
                    )}
                    {bet.channels.includes("TV") && (
                      <span className="bg-green-600 text-white text-xs px-1 rounded">
                        TV
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Odds */}
              {["1", "X", "2"].map((label, idx) => (
                <div key={label} className="hidden md:flex justify-center col-span-2 px-2 font-semibold text-[11px]">
                  <div className="w-[48%]">
                    <div className="bg-[#72bbef] text-center py-0.5 cursor-pointer">
                      {bet.odds[idx]?.home ?? "-"}
                    </div>
                  </div>
                  <div className="w-[48%]">
                    <div className="bg-[#faa9ba] text-center py-0.5 cursor-pointer">
                      {bet.odds[idx]?.away ?? "-"}
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
    </div>
  )

  return (
    <div>
      <Banner />
      <MenuNav />

      {userInfo ? (
        gameOnOff ? renderMatches() : (
          <div className="text-center py-10">
            <h2 className="text-3xl md:text-5xl text-red-500 font-semibold">This Game is Hidden</h2>
          </div>
        )
      ) : (
        renderMatches()
      )}

   <Games />
      <PageFooter />
    </div>
  );
};

export default Soccer;
