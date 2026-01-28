import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { fetchSoccerBatingData } from "../redux/reducer/soccerSlice";
import Spinner2 from "../components/Spinner2";
import SoccerOdds from "./SoccerComponents/SoccerOdds";
import SoccerOver15 from "./SoccerComponents/SoccerOver15";
import SoccerOver5 from "./SoccerComponents/SoccerOver_5";
import SoccerOver25 from "./SoccerComponents/SoccerOver25";
import { useNavigate, useParams } from "react-router-dom";
import { getPendingBetAmo, messageClear } from "../redux/reducer/betReducer";
import { host } from "../redux/api";
import { IoIosFootball } from "react-icons/io";

export default function Soccerbet() {
  const [bettingData, setBettingData] = useState(null);
  const dispatch = useDispatch();
  const { gameid } = useParams() || {};
  const { match } = useParams() || {};
  const hasCheckedRef = useRef(false);
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const { loading, successMessage, errorMessage } = useSelector(
    (state) => state.bet
  );

  const { battingData } = useSelector((state) => state.soccer);
  let sharedSocket;

  useEffect(() => {
    if (!gameid) return;

    if (!sharedSocket || sharedSocket.readyState !== 1) {
      sharedSocket = new WebSocket(host);

      sharedSocket.onopen = () => {
        console.log("✅ Socket connected");
        sharedSocket.send(JSON.stringify({ type: "subscribe", gameid, apitype: "soccer" }));
      };

      sharedSocket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.gameid === gameid) {
            setBettingData(message.data);
          }
        } catch (e) {
          console.error("❌ Message error", e);
        }
      };

      sharedSocket.onerror = (err) => {
        console.error("WebSocket error:", err);
      };

      sharedSocket.onclose = () => {
        console.log("Socket closed");
      };
    } else {
      // Already connected, just send subscription
      sharedSocket.send(JSON.stringify({ type: "subscribe", gameid, apitype: "soccer" }));
    }

    return () => {
      // Optionally leave socket open for reuse
    };
  }, [gameid]);

  useEffect(() => {
    if (gameid) {
      dispatch(fetchSoccerBatingData(gameid));
    }
  }, [gameid]);

  useEffect(() => {
    setBettingData(battingData);
  }, [battingData]);

  const matchOddsList = bettingData?.filter(
    (item) => item.mname === "MATCH_ODDS"
  ) || [];

  const matcUnder5List = bettingData?.filter(
    (item) => item.mname === "OVER_UNDER_05"
  ) || [];

  const matcUnder15List = bettingData?.filter(
    (item) => item.mname === "OVER_UNDER_15"
  ) || [];

  const matcUnder25List = bettingData?.filter(
    (item) => item.mname === "OVER_UNDER_25"
  ) || [];

  useEffect(() => {
    if (hasCheckedRef.current || !Array.isArray(bettingData) || bettingData.length === 0) return;

    const allSectionsEmpty = (
      [
        ...matchOddsList,
        ...matcUnder5List,
        ...matcUnder15List,
        ...matcUnder25List
      ]
    ).every(item => !Array.isArray(item.section) || item.section.length === 0);

    if (allSectionsEmpty) {
      hasCheckedRef.current = true;
      navigate("/soccer");
    }
  }, [bettingData]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }

    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);

  useEffect(() => {
    dispatch(getPendingBetAmo(gameid));
  }, [dispatch]);

  return (
    <div className="relative">
      {loading ? (
        <div className="text-center py-4 fixed top-52 left-[40%]">
          <Spinner2 />
        </div>
      ) : null}
      
      {loader ? (
        <div className="text-center py-4">
          <Spinner2 />
        </div>
      ) : (
        <div className="bg-[#f1f3f5] min-h-screen pb-10">
          <div className="max-w-[1400px] mx-auto px-1 sm:px-2 lg:px-4 pt-2">
            
            {/* Match Odds Section */}
            {matchOddsList.length > 0 && (
              <section className="mb-4 shadow-sm bg-white rounded-t-lg overflow-hidden border border-gray-200">
                {/* Sport Header */}
                <div className="flex items-center rounded-t-lg bg-black text-white overflow-hidden mb-[1px]">
                  <div className="relative flex items-center w-full lg:w-[60%] bg-[#7e1d51] py-2 px-3 z-10">
                    <IoIosFootball className="text-white" size={20} />
                    <span className="text-[13px] sm:text-[14px] ml-2 font-bold uppercase italic tracking-wider">
                      Match Odds
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

                {/* Component Content */}
                <SoccerOdds
                  matchOddsList={matchOddsList}
                  gameid={gameid}
                  match={match}
                />
              </section>
            )}

            {/* Over/Under 0.5 Goals Section */}
            {matcUnder5List.length > 0 && (
              <section className="mb-4 shadow-sm bg-white rounded-t-lg overflow-hidden border border-gray-200">
                {/* Sport Header */}
                <div className="flex items-center rounded-t-lg bg-black text-white overflow-hidden mb-[1px]">
                  <div className="relative flex items-center w-full lg:w-[60%] bg-[#7e1d51] py-2 px-3 z-10">
                    <IoIosFootball className="text-white" size={20} />
                    <span className="text-[13px] sm:text-[14px] ml-2 font-bold uppercase italic tracking-wider">
                      Over/Under 0.5 Goals
                    </span>
                    <div className="absolute right-[-14px] top-0 h-full w-[28px] bg-[#7e1d51] transform skew-x-[-20deg] z-[-1] hidden lg:block" />
                  </div>

                  <div className="hidden lg:flex w-[40%] justify-end">
                    <div className="flex w-full text-center font-bold text-[14px]">
                      <div className="w-1/2">Over</div>
                      <div className="w-1/2">Under</div>
                    </div>
                  </div>
                </div>

                {/* Component Content */}
                <SoccerOver5
                  matcUnder5List={matcUnder5List}
                  gameid={gameid}
                  match={match}
                />
              </section>
            )}

            {/* Over/Under 1.5 Goals Section */}
            {matcUnder15List.length > 0 && (
              <section className="mb-4 shadow-sm bg-white rounded-t-lg overflow-hidden border border-gray-200">
                {/* Sport Header */}
                <div className="flex items-center rounded-t-lg bg-black text-white overflow-hidden mb-[1px]">
                  <div className="relative flex items-center w-full lg:w-[60%] bg-[#7e1d51] py-2 px-3 z-10">
                    <IoIosFootball className="text-white" size={20} />
                    <span className="text-[13px] sm:text-[14px] ml-2 font-bold uppercase italic tracking-wider">
                      Over/Under 1.5 Goals
                    </span>
                    <div className="absolute right-[-14px] top-0 h-full w-[28px] bg-[#7e1d51] transform skew-x-[-20deg] z-[-1] hidden lg:block" />
                  </div>

                  <div className="hidden lg:flex w-[40%] justify-end">
                    <div className="flex w-full text-center font-bold text-[14px]">
                      <div className="w-1/2">Over</div>
                      <div className="w-1/2">Under</div>
                    </div>
                  </div>
                </div>

                {/* Component Content */}
                <SoccerOver15
                  matcUnder15List={matcUnder15List}
                  gameid={gameid}
                  match={match}
                />
              </section>
            )}

            {/* Over/Under 2.5 Goals Section */}
            {matcUnder25List.length > 0 && (
              <section className="mb-4 shadow-sm bg-white rounded-t-lg overflow-hidden border border-gray-200">
                {/* Sport Header */}
                <div className="flex items-center rounded-t-lg bg-black text-white overflow-hidden mb-[1px]">
                  <div className="relative flex items-center w-full lg:w-[60%] bg-[#7e1d51] py-2 px-3 z-10">
                    <IoIosFootball className="text-white" size={20} />
                    <span className="text-[13px] sm:text-[14px] ml-2 font-bold uppercase italic tracking-wider">
                      Over/Under 2.5 Goals
                    </span>
                    <div className="absolute right-[-14px] top-0 h-full w-[28px] bg-[#7e1d51] transform skew-x-[-20deg] z-[-1] hidden lg:block" />
                  </div>

                  <div className="hidden lg:flex w-[40%] justify-end">
                    <div className="flex w-full text-center font-bold text-[14px]">
                      <div className="w-1/2">Over</div>
                      <div className="w-1/2">Under</div>
                    </div>
                  </div>
                </div>

                {/* Component Content */}
                <SoccerOver25
                  matcUnder25List={matcUnder25List}
                  gameid={gameid}
                  match={match}
                />
              </section>
            )}

            {/* Empty State - No Betting Data */}
            {matchOddsList.length === 0 && 
             matcUnder5List.length === 0 && 
             matcUnder15List.length === 0 && 
             matcUnder25List.length === 0 && (
              <div className="flex flex-col items-center justify-center h-[60vh]">
                <div className="text-center">
                  <IoIosFootball className="text-gray-400 mx-auto mb-4" size={64} />
                  <h3 className="text-lg font-bold text-gray-700 mb-2">No Soccer Betting Available</h3>
                  <p className="text-gray-500 mb-4">No betting options are currently available for this match.</p>
                  <button
                    onClick={() => navigate("/soccer")}
                    className="bg-[#7e1d51] text-white px-6 py-2 rounded-md font-semibold hover:bg-[#6a1846] transition-colors"
                  >
                    Back to Soccer Matches
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}