import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCricketData } from "../redux/reducer/cricketSlice";
import Banner from "../components/Banner";
import { MdPushPin } from "react-icons/md";
import Spinner2 from "../components/Spinner2";
import MenuNav from "../components/MenuNav";
import Games from "../components/Games";
import { useNavigate } from "react-router-dom";
import PageFooter from "../components/PageFooter";

const Cricket = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const gameOnOff = userInfo?.gamelock?.[0]?.lock;
  const { matches, loader, error } = useSelector((state) => state.cricket);

  useEffect(() => {
    dispatch(fetchCricketData());
  }, [dispatch]);

  const handleClick = (bet, match) => {
    if (bet) {
      navigate(`/cricket-bet/${match}/${bet.id}`);
    } else {
      navigate(`/cricket`);
    }
  };

  const renderMatches = () => (
    <div className="max-h-[40vh] md:max-h-[80vh] mx-auto overflow-auto">
      <div className="bg-color text-[13px] text-white p-1 font-semibold hidden md:block">Highlights</div>
      <div className="hidden md:grid grid-cols-12 bg-[#dddcd6] text-gray-700 font-bold text-center text-[13px]">
        <div className="col-span-5 text-left pl-2"></div>
        <div className="col-span-2">1</div>
        <div className="col-span-2">X</div>
        <div className="col-span-2">2</div>
        <div className="col-span-1"></div>
      </div>

      <div className="bg-white">
        {loader ? (
          <div className="text-center py-4"><Spinner2 /></div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : (
          matches.map((bet) => (
            <div key={bet.id} className="grid grid-cols-12 gap-1 border-b border-gray-400 py-0.5 items-center text-[12px]">
              <div
                onClick={() => handleClick(bet, bet.match)}
                className="cursor-pointer col-span-10 md:col-span-5 pl-2 flex justify-between items-center"
              >
                <div className="flex items-center gap-0.5">
                  <div className="text-[#2789ce] font-[600]">
                    <span className="text-[4vw] md:text-xs lg:text-xs leading-[25px]">
                      {bet.match}
                    </span>
                    {bet.inplay ? (
                      <span className="ml-2 text-[12px] font-bold text-green-600" style={{ animation: "blink 1s infinite alternate" }}>
                        In-Play
                      </span>
                    ) : (
                      <span className="text-gray-400 ml-1 font-[400]">{bet.date}</span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-1 mt-1">
                  {["BT", "F", "S", "TV"].map((label) =>
                    bet.channels.includes(label) && (
                      <span key={label} className={`text-white text-xs px-1 rounded ${label === "BT" ? "bg-blue-900" :
                        label === "F" ? "bg-blue-500" :
                          label === "S" ? "bg-orange-500" :
                            "bg-green-600"
                        }`}>
                        {label}
                      </span>
                    )
                  )}
                </div>
              </div>

              {bet.odds.map((odd, index) => (
                <div key={index} className="md:flex justify-center hidden col-span-2 font-semibold px-2">
                  <div className="w-[48%]">
                    <div className="bg-[#72bbef] text-center py-0.5 cursor-pointer">{odd.home}</div>
                  </div>
                  <div className="w-[48%]">
                    <div className="bg-[#faa9ba] text-center py-0.5 cursor-pointer">{odd.away}</div>
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
  );

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

export default Cricket;
