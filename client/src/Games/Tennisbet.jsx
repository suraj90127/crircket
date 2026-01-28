import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { createBet, getPendingBetAmo } from "../redux/reducer/betReducer";
import { getUser, messageClear } from "../redux/reducer/authReducer";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchTannisBatingData } from "../redux/reducer/tennisSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import { getPendingBet } from "../redux/reducer/betReducer";
import Spinner2 from "../components/Spinner2";
import { host } from "../redux/api";

export default function Tennisbet() {
  const [bettingData, setBettingData] = useState(null);
  const hasCheckedRef = useRef(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { gameid } = useParams() || {};
  const { match } = useParams() || {};
  const { loading, successMessage, errorMessage } = useSelector(
    (state) => state.bet
  );
  const { pendingBet } = useSelector((state) => state.bet);
  const { battingData, error } = useSelector((state) => state.tennis);
  // console.log("battingData", battingData);

  // const [bettingData, setBettingData] = useState([]);
  const [betOdds, setBetOdds] = useState(1.29);
  const [betAmount, setBetAmount] = useState(0);
  const [loader, setLoader] = useState(false);
  const [seletTeamName, setSeletTeamName] = useState("");

  const [formData, setFormData] = useState({
    gameId: gameid,
    sid: 2,
    otype: "",
    price: null,
    xValue: "",
    gameType: "",
    gameName: "Tennis Game",
    teamName: "",
  });



  // Global ref (outside component)
  let sharedSocket;

  useEffect(() => {
    if (!gameid) return;

    if (!sharedSocket || sharedSocket.readyState !== 1) {
      sharedSocket = new WebSocket(host);

      sharedSocket.onopen = () => {
        console.log("✅ Socket connected");
        sharedSocket.send(JSON.stringify({ type: "subscribe", gameid, apitype: "tennis" }));
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
      sharedSocket.send(JSON.stringify({ type: "subscribe", gameid, apitype: "tennis" }));
    }

    return () => {
      // Optionally leave socket open for reuse
    };
  }, [gameid]);







  useEffect(() => {
    // let intervalId;
    if (gameid) {
      dispatch(fetchTannisBatingData(gameid)); // initial

      // intervalId = setInterval(() => {
      //   dispatch(fetchTannisBatingData(gameid));
      // }, 2000);
    }

    // return () => {
    //   clearInterval(intervalId);
    // };
  }, [gameid]);


  useEffect(() => {
    setBettingData(battingData);
  }, [battingData]);


  const setValue = (xValue, team, otype) => {
    setSeletTeamName(team);
    setBetOdds(xValue);
    // console.log("xValue,team,sid,otype", xValue, team, sid, otype);

    setFormData((prev) => ({
      ...prev,
      xValue: xValue,
      teamName: team,
      otype: otype,
    }));
  };

  const placeBet = async (gameType, marketName, maxAmo) => {

    if (betAmount > maxAmo) {
      toast.error(`Bet amount cannot exceed ${maxAmo}`);
      return;
    }

    const updatedFormData = {
      ...formData,
      price: betAmount,
      gameType,
      marketName,
      eventName: match,
    };
    setFormData(updatedFormData);

    await dispatch(createBet(updatedFormData)); // Wait for bet to process
    await dispatch(getUser()); // Then fetch updated user data
    dispatch(getPendingBet());
    dispatch(getPendingBetAmo(gameid));
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      setSelectedRun(null, null);
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

  // const matchOddsList = bettingData.filter(
  //   (item) => item.mname === "MATCH_ODDS"
  // );

  const matchOddsList = Array.isArray(bettingData)
    ? bettingData.filter((item) => item.mname === "MATCH_ODDS")
    : [];

  console.log("bettingData", bettingData)

  const oddsData =
    Array.isArray(matchOddsList) &&
      matchOddsList.length > 0 &&
      matchOddsList[0].section
      ? matchOddsList[0].section.map((sec) => ({
        team: sec.nat,
        sid: sec.sid,
        odds: sec.odds,
        mname: "Match Odds", // ✅ Access from first item
        status: matchOddsList[0].status, // ✅ Access from first item
      }))
      : [];


  useEffect(() => {
    if (hasCheckedRef.current || !Array.isArray(bettingData) || bettingData.length === 0) return;

    const allSectionsEmpty = (
      [
        ...matchOddsList,

      ]
    ).every(item => !Array.isArray(item.section) || item.section.length === 0);

    if (allSectionsEmpty) {
      hasCheckedRef.current = true;
      navigate("/tennis");
    }
  }, [bettingData]);


  // Helper function
  const getBetDetails = (pendingBet, matchData, team) => {
    // Always find the bet for the current match and current team
    const matchedTeamBet = pendingBet?.find(
      (item) =>
        item.gameType === matchData?.mname &&
        item.teamName?.toLowerCase() === team?.toLowerCase()
    );

    // Also find *any* other bet on the same match (for fallback price)
    const otherTeamBet = pendingBet?.find(
      (item) => item.gameType === matchData?.mname
    );

    // console.log(matchedTeamBet, 'bet amount')
    const otype = matchedTeamBet?.otype || otherTeamBet?.otype || "";
    const totalBetAmount = matchedTeamBet?.totalBetAmount || otherTeamBet?.totalBetAmount || "";
    const totalPrice = matchedTeamBet?.totalPrice || otherTeamBet?.totalPrice || "";
    const teamName = matchedTeamBet?.teamName || otherTeamBet?.teamName || "";


    return {
      otype,
      totalBetAmount,
      totalPrice,
      teamName,
    };
  };

  const [selectedRun, setSelectedRun] = useState({ type: null, index: null });

  const [betOddsValue, setBetOddsValue] = useState(0);
  const [betOddsType, setBetOddsType] = useState("");



  const handleSelect = (type, index, odds, back) => {
    setSelectedRun({ type, index });
    setBetAmount(0);
    setBetOddsValue(odds);
    setBetOddsType(back)
  };

  // Inside your React functional component (e.g., in a file like MyComponent.jsx)
  function MyComponent({ team, matchData, pendingBet, myAmount, index, selectedRun }) {
    const { otype, totalBetAmount, totalPrice, teamName } = getBetDetails(
      pendingBet,
      matchData,
      team
    );

    // console.log("seletTeamName", seletTeamName)
    // console.log("teamName", teamName)

    const isMatchedTeam = teamName?.toLowerCase() === team?.toLowerCase();

    // console.log("isMatchedTeam", isMatchedTeam)


    const existingBet = (otype && totalBetAmount || totalPrice && teamName && isMatchedTeam ? true : false);


    let betColor =
      otype === "lay" ? (isMatchedTeam ? "red" : "green") :
        otype === "back" ? (isMatchedTeam ? "green" : "red") :
          "green";

    // const valueColor =
    //   betOddsType === "lay"
    //     ? "green" : "red";

    // const elseColor = betOddsType !== "lay" ? "green" : "red";



    const displayValue = (() => {
      if (otype === "lay") {
        return isMatchedTeam ? totalPrice : totalBetAmount;
      } else if (otype === "back") {
        return isMatchedTeam ? totalBetAmount : totalPrice;
      } else {
        return isMatchedTeam ? totalPrice : totalBetAmount;
      }
    })();

    const isSelected =
      selectedRun?.type === "odd" &&
      selectedRun?.index === index;
    const isSelectedTeam =
      selectedRun?.type === "odd";

    let p = parseFloat(myAmount);
    let x = parseFloat(betOddsValue).toFixed(2);
    let b = 0;


    // let betColor;
    let elseColor;

    // let displayValue = 0;

    let calValue = 0;

    b = betOddsType === "lay" ? p : p * (x - 1);
    p = betOddsType === "lay" ? p * (x - 1) : p;


    if (isSelected && p !== 0) {
      calValue = betOddsType === "back" ? b : p || 0;
      elseColor = betOddsType === "back" && calValue >= 0 ? "green" : "red";
    } else if (isSelectedTeam && myAmount !== 0) {
      calValue = betOddsType === "back" ? p : b || 0;
      elseColor = betOddsType === "back" || calValue < 0 ? "red" : "green";
    }

    if (existingBet) {
      if (seletTeamName?.toLowerCase() === teamName?.toLowerCase()) {

        if (betOddsType === otype) {
          if (isSelected && p !== 0) {
            b = b + totalBetAmount
            p = p + totalPrice
            calValue = betOddsType === "back" ? b : p;
            elseColor = betOddsType === "back" && calValue >= 0 ? "green" : "red";
          } else if (isSelectedTeam && myAmount !== 0) {
            p = p + totalPrice;
            b = b + totalBetAmount;
            calValue = betOddsType === "back" ? p : b;
            elseColor = betOddsType === "back" || calValue < 0 ? "red" : "green";
          }


        }
        else {
          if (betOddsType === "back") {

            if (totalBetAmount > p) {

              if (isSelected && p !== 0) {

                p = totalPrice - b
                calValue = p || 0;
                elseColor = "red";
              } else if (isSelectedTeam && myAmount !== 0) {

                b = totalBetAmount - p;
                calValue = b || 0;
                elseColor = calValue < 0 ? "red" : "green";
              }

            } else {
              if (isSelected && p !== 0) {
                b = b - totalPrice;
                calValue = b || 0;

                elseColor = calValue < 0 ? "red" : "green";
              } else if (isSelectedTeam && myAmount !== 0) {

                p = p - totalBetAmount
                calValue = p || 0;
                elseColor = "red";
              }

            }
          } else if (betOddsType === "lay") {
            if (totalPrice >= b) {

              if (isSelected && p !== 0) {


                b = totalBetAmount - p;
                calValue = b || 0;
                elseColor = calValue < 0 ? "red" : "green";
              } else if (isSelectedTeam && myAmount !== 0) {


                p = totalPrice - b
                calValue = p || 0;
                elseColor = "red";
              }

            } else {
              if (isSelected && p !== 0) {

                p = p - totalBetAmount
                calValue = p || 0;
                elseColor = "red";
              } else if (isSelectedTeam && myAmount !== 0) {

                b = b - totalPrice;
                calValue = b || 0;
                elseColor = calValue < 0 ? "red" : "green";
              }

            }
          }

        }
      } else {
        if (betOddsType === otype) {
          if (betOddsType === "back") {

            if (totalPrice >= b) {

              if (isSelected && p !== 0) {

                p = totalPrice - b
                calValue = p || 0;
                elseColor = "red";
              } else if (isSelectedTeam && myAmount !== 0) {

                b = totalBetAmount - p;
                calValue = b || 0;
                elseColor = calValue < 0 ? "red" : "green";
              }

            } else {
              if (isSelected && p !== 0) {

                b = b - totalPrice;
                calValue = b || 0;
                elseColor = calValue < 0 ? "red" : "green";
              } else if (isSelectedTeam && myAmount !== 0) {
                p = p - totalBetAmount

                calValue = p || 0;
                elseColor = "red";
              }

            }
          } else if (betOddsType === "lay") {
            if (totalPrice >= b) {

              if (isSelected && p !== 0) {

                b = totalBetAmount - p;
                calValue = b || 0;
                elseColor = calValue < 0 ? "red" : "green";


              } else if (isSelectedTeam && myAmount !== 0) {

                p = totalPrice - b
                calValue = p || 0;
                elseColor = "red";
              }

            } else {
              if (isSelected && p !== 0) {
                p = p - totalBetAmount;
                calValue = p || 0;
                elseColor = "red";

              } else if (isSelectedTeam && myAmount !== 0) {
                b = b - totalPrice
                calValue = b || 0;
                elseColor = calValue < 0 ? "red" : "green";

              }

            }
          }
        }
        else {
          if (isSelected && p !== 0) {
            b = b + totalBetAmount
            p = p + totalPrice
            calValue = betOddsType === "back" ? b : p;
            elseColor = betOddsType === "back" && calValue >= 0 ? "green" : "red";
          } else if (isSelectedTeam && myAmount !== 0) {
            p = p + totalPrice;
            b = b + totalBetAmount;
            calValue = betOddsType === "back" ? p : b;
            elseColor = betOddsType === "back" || calValue < 0 ? "red" : "green";
          }

        }
      }
    }
    calValue = parseFloat(calValue).toFixed(2) || 0;


    // console.log("existingBet", existingBet)



    return (
      <div className="col-span-5 md:col-span-5 text-sm md:text-[11px] font-bold p-1 text-left pl-4">
        <div>
          <p>{team}</p>
          <p className="col-span-2" style={{ color: betColor }}>
            {displayValue}
            {/* {isSelected && myAmount !== 0 ? ( */}
            {selectedRun?.type ? (
              <span style={{ color: elseColor }}>

                ({calValue})
              </span>
            ) : ""}

            {/* )} */}
          </p>
        </div>
      </div>
    );

  }

  const formatToK = (num) => {
    if (!num || num < 1000) return num;
    const n = Number(num);
    return `${n / 1000}k`;
  };




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
    <div>
      {/* Odds Match Data */}
      {oddsData.length > 0 && (
        <div className="shadow-sm bg-white rounded-t-lg overflow-hidden border border-gray-200 mb-4">
          {/* Header */}
          <div className="flex items-center rounded-t-lg bg-black text-white overflow-hidden">
            <div className="relative flex items-center w-full bg-[#7e1d51] py-2 px-4 z-10">
              <span className="text-[13px] sm:text-[14px] font-bold uppercase italic tracking-wider">
                {oddsData[0]?.mname}
              </span>
              <HiOutlineExclamationCircle className="ml-2 text-white" size={18} />
              <div className="absolute right-[-14px] top-0 h-full w-[28px] bg-[#7e1d51] transform skew-x-[-20deg] z-[-1]" />
            </div>
          </div>

          {/* Matched Amount Row */}
          <div className="flex justify-between items-center bg-gray-100 p-2 border-b">
            <div className="text-[12px] font-bold text-gray-700">
              Matched: 
            </div>
            <div className="text-[12px] font-bold text-gray-700">
              Min/Max: {matchOddsList[0]?.min} - {formatToK(matchOddsList[0]?.maxb)}
            </div>
          </div>

          {oddsData[0]?.status === "SUSPENDED" ? (
            <div className="relative">
              {/* Suspended Overlay */}
              <div className="absolute inset-0 bg-[#748c94]/90 flex items-center justify-center z-10">
                <p className="text-white font-bold text-xl">SUSPENDED</p>
              </div>
              
              {/* Table Header */}
              <div className="grid grid-cols-12 border-b border-gray-300">
                <div className="col-span-8 md:col-span-5 py-2 px-3 text-left">
                  <span className="text-[12px] font-bold text-gray-700">Market</span>
                </div>
                <div className="col-span-2 py-2 px-3 bg-[#a5d8ff] text-center">
                  <span className="text-[12px] font-bold">Back</span>
                </div>
                <div className="col-span-2 py-2 px-3 bg-[#fcc2d7] text-center">
                  <span className="text-[12px] font-bold">Lay</span>
                </div>
                <div className="hidden md:block col-span-3 py-2 px-3 text-center">
                  <span className="text-[12px] font-bold text-gray-700">Stake</span>
                </div>
              </div>

              {/* Suspended Rows */}
              {oddsData.map(({ team, odds, sid }, index) => (
                <div key={index} className="grid grid-cols-12 border-b border-gray-200">
                  {/* Team Name */}
                  <div className="col-span-8 md:col-span-5 py-2 px-3">
                    <span className="text-[11px] sm:text-[12px] font-bold text-gray-800 opacity-50">
                      {team}
                    </span>
                  </div>
                  
                  {/* Odds Columns */}
                  {odds
                    .filter(odd => odd?.tno === 0)
                    .map((odd, i) => (
                      <div key={i} className={`col-span-2 py-2 px-3 border-l border-white ${odd?.otype === "back" ? "bg-[#ced4da]" : "bg-[#ced4da]"}`}>
                        <div className="text-center opacity-30">
                          <div className="font-bold text-[13px]">{odd?.odds || 0}</div>
                          <div className="text-gray-800 text-[10px]">{odd?.size || 0}</div>
                        </div>
                      </div>
                    ))
                  }
                  
                  {/* Stake Column (Desktop) */}
                  <div className="hidden md:flex col-span-3 items-center justify-center">
                    <div className="text-[11px] text-gray-500 opacity-50">
                      {matchOddsList[0]?.min} - {formatToK(matchOddsList[0]?.maxb)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              {/* Active Table Header */}
              <div className="grid grid-cols-12 border-b border-gray-300">
                <div className="col-span-8 md:col-span-5 py-2 px-3 text-left">
                  <span className="text-[12px] font-bold text-gray-700">Market</span>
                </div>
                <div className="col-span-2 py-2 px-3 bg-[#a5d8ff] text-center">
                  <span className="text-[12px] font-bold">Back</span>
                </div>
                <div className="col-span-2 py-2 px-3 bg-[#fcc2d7] text-center">
                  <span className="text-[12px] font-bold">Lay</span>
                </div>
                <div className="hidden md:block col-span-3 py-2 px-3 text-center">
                  <span className="text-[12px] font-bold text-gray-700">Stake</span>
                </div>
              </div>

              {/* Active Rows */}
              {oddsData.map(({ team, odds, sid }, index) => (
                <div key={index}>
                  <div className="grid grid-cols-12 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                    {/* Team Name with Pending Bets */}
                    <div className="col-span-8 md:col-span-5 py-2 px-3">
                      <div className="flex flex-col">
                        <span className="text-[11px] sm:text-[12px] font-bold text-gray-800">
                          {team}
                        </span>
                        <MyComponent
                          key={team}
                          team={team}
                          matchData={oddsData[0]}
                          pendingBet={pendingBet}
                          myAmount={betAmount}
                          index={index}
                          selectedRun={selectedRun}
                        />
                      </div>
                    </div>
                    
                    {/* Odds Columns */}
                    {odds
                      .filter(odd => odd?.tno === 0)
                      .map((odd, i) => (
                        <div
                          key={i}
                          className={`col-span-2 py-2 px-3 border-l border-white cursor-pointer transition-colors hover:opacity-90 ${
                            odd?.otype === "back" ? "bg-[#a5d8ff]" : "bg-[#fcc2d7]"
                          }`}
                          onClick={() => {
                            if (odd?.odds !== 0) {
                              handleSelect("odd", index, odd?.odds, odd?.otype);
                              setValue(odd?.odds, team, odd.otype);
                            }
                          }}
                        >
                          <div className="text-center">
                            <div className="font-bold text-[13px]">{odd?.odds}</div>
                            <div className="text-gray-800 text-[10px]">
                              {formatToK(odd?.size) || 0}
                            </div>
                          </div>
                        </div>
                      ))
                    }
                    
                    {/* Stake Column (Desktop) */}
                    <div className="hidden md:flex col-span-3 items-center justify-center">
                      <div className="text-[11px] font-bold text-gray-700">
                        {matchOddsList[0]?.min} - {formatToK(matchOddsList[0]?.maxb)}
                      </div>
                    </div>
                  </div>

                  {/* Betting Form */}
                  {selectedRun?.type === "odd" && selectedRun?.index === index && (
                    <div className="bg-gray-50 p-3 border-b border-gray-200">
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        <button
                          className="bg-white border border-gray-300 rounded-sm px-3 py-2 text-[12px] font-semibold hover:bg-gray-50 transition-colors"
                          onClick={() => handleSelect(null, null, null, null)}
                        >
                          Cancel
                        </button>
                        
                        <div className="flex items-center justify-between border border-gray-300 rounded-sm overflow-hidden">
                          <button
                            className="bg-gray-200 hover:bg-gray-300 px-3 py-2 h-full transition-colors"
                            onClick={() => setBetOdds((prev) => (prev > 1 ? prev - 0.1 : prev))}
                          >
                            -
                          </button>
                          <span className="mx-3 text-[13px] font-bold">{betOdds.toFixed(2)}</span>
                          <button
                            className="bg-gray-200 hover:bg-gray-300 px-3 py-2 h-full transition-colors"
                            onClick={() => setBetOdds((prev) => prev + 0.1)}
                          >
                            +
                          </button>
                        </div>
                        
                        <input
                          type="number"
                          value={betAmount}
                          onChange={(e) => setBetAmount(Number(e.target.value))}
                          placeholder="Amount"
                          className="w-full bg-white text-black p-2 border border-gray-300 rounded-sm text-[13px] focus:outline-none focus:border-[#7e1d51]"
                        />
                        
                        <button
                          onClick={() => placeBet(oddsData[0]?.mname, oddsData[0]?.mname) && setBetAmount(0)}
                          disabled={loading}
                          className={`flex items-center justify-center gap-2 bg-[#7e1d51] text-white px-3 py-2 rounded-sm text-[13px] font-semibold transition-all duration-300 hover:bg-[#6a1846] ${
                            loading ? "opacity-70 cursor-not-allowed" : ""
                          }`}
                        >
                          {loading ? "Placing..." : "Place Bet"}
                        </button>
                      </div>

                      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                        {[100, 200, 500, 1000, 2000, 3000, 5000, 10000].map((amt) => (
                          <button
                            key={amt}
                            onClick={() => setBetAmount(amt)}
                            className={`px-2 py-1.5 rounded-sm border text-[11px] font-semibold transition-colors ${
                              betAmount === amt
                                ? "bg-[#7e1d51] text-white border-[#7e1d51]"
                                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {amt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )}
</div>
  );
}
