import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTennisData } from "../redux/reducer/tennisSlice";
import { MdPushPin } from "react-icons/md";
import Banner from "../components/Banner";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import Spinner2 from "../components/Spinner2";
import MenuNav from "../components/MenuNav";
import Games from "../components/Games";
import PageFooter from "../components/PageFooter";

const Tennis = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  // console.log("userInfo", userInfo.gamelock);

  const gameOnOff = userInfo?.gamelock[1]?.lock
  const {
    data,
    loading,
    tesnnisError,
  } = useSelector((state) => state.tennis);

  useEffect(() => {
    dispatch(fetchTennisData());
  }, [dispatch]);

  // bettingData.map((bet) => {
  //   console.log(bet);
  // });

  const handleClick = (bet, match) => {
    if (bet) {
      navigate(`/tennis-bet/${match}/${bet.id}`);
    } else {
      navigate(`/tennis`);
    }
  };




  const renderMatches = () => (
    <div className="h-[40vh] md:h-[80vh] mx-auto overflow-auto">
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
        {loading ? (
          <div className="text-center py-4">
            <Spinner2 />
          </div>
        ) : tesnnisError ? (
          <div className="text-center text-red-500 py-4">{tesnnisError}</div>
        ) : (
          data.map((bet) => (
            <div
              // state={{ gameid: bet.id }}
              key={bet.id}
              className="grid grid-cols-12 gap-1 border-b border-gray-400 py-0.5 items-center text-[12px]"
            >
              <div
                onClick={() => handleClick(bet, bet.match)}
                className="col-span-10 md:col-span-5 pl-2 flex justify-between items-center cursor-pointer"
              >
                <div className="flex items-center gap-0.5">
                  <div className="text-[#2789ce] font-semibold">
                    <span
                      className="text-[4vw] md:text-xs lg:text-xs leading-[25px]"
                    // style={{ fontFamily: "Tahoma, Helvetica, sans-serif" }}
                    >
                      {bet.match}
                    </span>
                    <span className="text-gray-400 ml-1 font-[400]">
                      {bet.date}
                    </span>

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
                <div className="flex space-x-1 mt-1">
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

              {bet.odds.map((odd, index) => (
                <div
                  key={index}
                  className="md:flex justify-center hidden col-span-2 font-semibold px-2 text-[11px]"
                >
                  <div className="w-[48%]">
                    <div className="bg-[#72bbef] text-center py-0.5 cursor-pointer">
                      {odd.home}
                    </div>
                  </div>
                  <div className="w-[48%]">
                    <div className="bg-[#faa9ba] text-center py-0.5 cursor-pointer">
                      {odd.away}
                    </div>
                  </div>
                </div>
              ))}

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

export default Tennis;
