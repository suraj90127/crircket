import { useEffect, useState, useRef } from "react";

import Hls from "hls.js";

import { useNavigate, useParams } from "react-router-dom";
import { getUser } from "../redux/reducer/authReducer";
import { useDispatch, useSelector } from "react-redux";
import {
  createBet,
  createfancyBet,
  getPendingBetAmo,
  messageClear,
} from "../redux/reducer/betReducer";
import { toast } from "react-toastify";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import { fetchCricketBatingData } from "../redux/reducer/cricketSlice";
import { BiInfoCircle } from "react-icons/bi";
import Spinner2 from "../components/Spinner2";
import MatchOdd from "./CircketComponent/MatchOdd";
import TiedMatch from "./CircketComponent/TiedMatch";
import BookMaker from "./CircketComponent/BookMaker";
import axios from 'axios';
import LiveVideo from "./LiveVideo";
import { host } from "../redux/api";


// import { getPendingBetAmo } from "../redux/reducer/betReducer";
// import io from "socket.io-client";

// const socket = io("http://localhost:5000"); // Replace with your backend URL

const oddsDataraw = [
  {
    title: "KKR 14 Over Total Runs (Odds / Evens)",
    options: [
      { label: "ODD", value: "1.95", stake: "1M" },
      { label: "EVEN", value: "1.95", stake: "1M" },
    ],
  },
  {
    title: "KKR 15 Over Total Runs (Odds / Evens)",
    options: [
      { label: "ODD", value: "1.95", stake: "1M" },
      { label: "EVEN", value: "1.95", stake: "1M" },
    ],
  },
];

const dismissalData = [
  { method: "Caught", odds: "1.3" },
  { method: "Bowled", odds: "4" },
  { method: "LBW", odds: "5" },
  { method: "Run Out", odds: "15" },
  { method: "Stumped", odds: "20" },
  { method: "Others", odds: "100" },
];

export default function Cricketbet() {
  const { gameid } = useParams() || {};
  const { match } = useParams() || {};
  const hasCheckedRef = useRef(false); // ✅ run only once
  const navigate = useNavigate();
  const dispatch = useDispatch();



  const [selectedRun, setSelectedRun] = useState({ type: null, index: null });
  // ✅ WebSocket Setup (Real-time updates)
  const [bettingData, setBettingData] = useState(null);
  const [betOdds, setBetOdds] = useState(null);
  const [betAmount, setBetAmount] = useState(0);
  const [loader, setLoader] = useState(false);
  const [teamName, setTeamName] = useState("");
  const { loading, successMessage, errorMessage } = useSelector(
    (state) => state.bet
  );
  const { battingData } = useSelector((state) => state.cricket);
  // console.log("battingData2 22222222222", battingData);

  const { userInfo } = useSelector((state) => state.auth);
  const { pendingBet } = useSelector((state) => state.bet);

  // setBettingData(battingData);

  const [formData, setFormData] = useState({
    gameId: gameid,
    sid: 4,
    otype: "",
    price: null,
    xValue: "",
    gameType: "",
    gameName: "Cricket Game",
    teamName: "",
  });



  const [activeTab, setActiveTab] = useState("fancy");
  const [activeSubTab, setActiveSubTab] = useState("Normal");

  const subTabs = [
    { id: "Normal", name: "ALL" },
    { id: "Normal", name: "Fancy" },
    { id: "line", name: "Line Markets" },
    { id: "ball", name: "Ball by Ball" },
    { id: "meter", name: "Meter Markets" },
    { id: "khado", name: "Khado Markets" },
  ];

  const handleSelect = (type, index,) => {
    setSelectedRun({ type, index });
    setBetAmount(0);
  };

  // ✅ Fetch once before using socket (optional)
  useEffect(() => {
    if (gameid) {
      setLoader(true);
      dispatch(fetchCricketBatingData(gameid)).finally(() => {
        setLoader(false);
      });
    }
  }, [dispatch, gameid]);



  useEffect(() => {
    if (!gameid) return;

    const socket = new WebSocket(host);

    // socket.onopen = () => {
    //   console.log("✅ WebSocket connected");
    //   socket.send(JSON.stringify({ type: "subscribe", gameid }));
    // };

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "subscribe", gameid, apitype: "cricket" }));
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.gameid === gameid) {
          setBettingData(message.data);
        }
      } catch (err) {
        console.error("❌ Error parsing message:", err);
      }
    };

    socket.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
    };

    socket.onclose = () => {
      console.log("❌ WebSocket disconnected");
    };

    return () => socket.close();
  }, [gameid]);

  // console.log("bettingData111111111111111", bettingData)

  useEffect(() => {
    let intervalId;

    if (gameid) {
      // Set loader true before initial fetch
      setLoader(true);

      const fetchData = async () => {
        await dispatch(fetchCricketBatingData(gameid));
        setLoader(false); // Stop loader after first successful fetch
      };

      fetchData();

      // intervalId = setInterval(() => {
      //   dispatch(fetchCricketBatingData(gameid));
      // }, 2000);
    }


    return () => {
      clearInterval(intervalId);
    };
  }, [gameid]);

  useEffect(() => {
    setBettingData(battingData);
  }, [battingData]);



  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const setValue = (xValue, team, otype, fancyScore) => {
    setBetOdds(xValue);
    // console.log("xValue,team,sid,otype", xValue, team, sid, otype);
    setTeamName(team);

    setFormData((prev) => ({
      ...prev,
      xValue: xValue,
      teamName: team,
      otype: otype,
      fancyScore: fancyScore,
    }));
  };

  const placeBet = async (gameType, marketName, maxAmo) => {
    // console.log("maxAmo", maxAmo);

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
    dispatch(getPendingBetAmo(gameid));
    setSelectedRun(null, null); // Reset selected run after placing bet
  };

  const placefancyBet = async (gameType, marketName, maxAmo) => {
    if (betAmount > maxAmo) {
      toast.error(`Bet amount cannot exceed ${maxAmo}`);
      return;
    }
    try {
      const updatedFormData = {
        ...formData,
        price: betAmount,
        gameType,
        marketName,
        eventName: match,
      };
      setFormData(updatedFormData);

      const data = await dispatch(createfancyBet(updatedFormData)).then((res) => {
        if (successMessage) {
          toast.success(successMessage);
          setSelectedRun(null);
          dispatch(messageClear());
        }

        if (errorMessage) {
          toast.error(errorMessage);
          dispatch(messageClear());
        }
      }) // Wait for bet to process
      // toast.success(data.message || "Bet placed successfully");
      await dispatch(getUser()); // Then fetch updated user data
      dispatch(getPendingBetAmo(gameid));
    } catch (error) {
      toast.error(error);
    }
  };


  const matchOddsList = Array.isArray(bettingData)
    ? bettingData.filter(
      (item) =>
        item?.mname === "MATCH_ODDS" || item?.mname === "TOURNAMENT_WINNER"
    )
    : [];

  const tiedMatchList = Array.isArray(bettingData)
    ? bettingData.filter(
      (item) =>
        item?.mname === "Tied Match" || item?.mname === "Bookmaker IPL CUP"
    )
    : [];


  const BookmakerList = Array.isArray(bettingData)
    ? bettingData.filter((item) => item.mname === "Bookmaker")
    : [];


  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      setSelectedRun(null);
      dispatch(messageClear());
    }

    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);
  const fancy1List = bettingData?.filter((item) => item.mname === "fancy1");

  const fancy1Data =
    Array.isArray(fancy1List) && fancy1List.length > 0 && fancy1List[0].section
      ? fancy1List[0].section.map((sec) => ({
        team: sec.nat,
        sid: sec.sid,
        odds: sec.odds,
        max: sec.max,
        min: sec.min,
        mname: fancy1List[0].mname, // ✅ Access from first item
        status: fancy1List[0].status, // ✅ Access from first item
      }))
      : [];

  const over6List = bettingData?.filter((item) => item.mname === "Normal");
  const over6Data =
    Array.isArray(over6List) && over6List.length > 0 && over6List[0].section
      ? over6List[0].section.map((sec) => ({
        team: sec.nat,
        sid: sec.sid,
        odds: sec.odds,
        max: sec.max,
        min: sec.min,
        mname: over6List[0].mname, // ✅ Access from first item
        status: sec.gstatus, // ✅ Access from first item
      }))
      : [];

  const fancy2List = bettingData?.filter((item) => item.mname === activeSubTab);
  const fancy2Data =
    Array.isArray(fancy2List) && fancy2List.length > 0 && fancy2List[0].section
      ? fancy2List[0].section.map((sec) => ({
        team: sec.nat,
        sid: sec.sid,
        odds: sec.odds,
        max: sec.max,
        min: sec.min,
        mname: fancy2List[0].mname, // ✅ Access from first item
        status: sec.gstatus, // ✅ Access from first item
      }))
      : [];


  useEffect(() => {
    if (hasCheckedRef.current || !Array.isArray(bettingData) || bettingData.length === 0) return;

    const allSectionsEmpty = (
      [
        ...matchOddsList,
        ...tiedMatchList,
        ...BookmakerList,
        ...fancy1List,
        ...over6List,
        ...fancy2List,
      ]
    ).every(item => !Array.isArray(item.section) || item.section.length === 0);

    if (allSectionsEmpty) {
      hasCheckedRef.current = true; // ✅ prevent future runs
      navigate("/");
    }
  }, [bettingData]);

  // console.log("fancy2Data", fancy2Data);

  useEffect(() => {
    dispatch(getPendingBetAmo(gameid));
  }, [dispatch]);





  // Inside your React functional component (e.g., in a file like MyComponent.jsx)
  const [url, setUrl] = useState("");

  const videoS = async () => {
    if (url) {
      setUrl("");
      return;
    }
    try {
      const response = await axios.get(
        `https://api.cricketid.xyz/tv_url?key=uniique5557878&gmid=${gameid}&sid=4`
      );
      const data = response?.data;
      // console.log("API response:", data);
      setUrl(data?.tv_url); // make sure the field is `tv_url`
    } catch (error) {
      console.error("Video API Error:", error?.response?.data || error.message);
    }
  };

  // useEffect(() => {
  //   const videoS = async () => {
  //     try {
  //       const response = await axios.get(
  //         `https://api.cricketid.xyz/tv_url?key=uniique5557878&gmid=${gameid}&sid=4`
  //       );
  //       const data = response?.data;
  //       console.log("API response:", data);
  //       setUrl(data?.tv_url); // make sure the field is `tv_url`
  //     } catch (error) {
  //       console.error("Video API Error:", error?.response?.data || error.message);
  //     }
  //   };

  //   if (gameid) videoS();
  // }, [gameid]);

  console.log("url", url);

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
    <div className="z-0">
      {/* Live Streaming Header */}
      <div>
        <div className="bg-[#7e1d51] text-white px-4 py-2 rounded-t-md font-bold uppercase italic tracking-wider cursor-pointer" onClick={() => videoS()}>
          Live Streaming
        </div>
        {url && <LiveVideo url={url} />}
      </div>

      {/* Odds match data */}
      <MatchOdd matchOddsList={matchOddsList} gameid={gameid} match={match} />
      
      {/* Tied match data */}
      <TiedMatch tiedMatchList={tiedMatchList} gameid={gameid} match={match} />
      
      {/* Bookmaker match data */}
      <BookMaker BookmakerList={BookmakerList} gameid={gameid} match={match} />

      {/* Toss Win/Loss */}
      <div className="mt-4">
        {fancy1Data.length > 0 && fancy1Data[0]?.team?.split("(")[0]?.includes("Toss") && (
          <div className="shadow-sm bg-white rounded-t-lg overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="flex items-center rounded-t-lg bg-black text-white overflow-hidden">
              <div className="relative flex items-center w-full bg-[#7e1d51] py-2 px-4 z-10">
                <span className="text-[13px] sm:text-[14px] font-bold uppercase italic tracking-wider">
                  Toss Winner
                </span>
                <div className="absolute right-[-14px] top-0 h-full w-[28px] bg-[#7e1d51] transform skew-x-[-20deg] z-[-1]" />
              </div>
            </div>

            {/* Min-Max Row */}
            <div className="flex justify-between items-center bg-gray-100 p-2 border-b">
              <div className="text-[12px] font-bold text-gray-700 flex items-center gap-2">
                <span>Which Team Will Win The Toss</span>
                <HiOutlineExclamationCircle className="text-gray-500" size={16} />
              </div>
              <div className="text-[12px] font-bold text-gray-700">
                {fancy1Data[0].min} - {formatToK(fancy1Data[0]?.max)}
              </div>
            </div>

            {fancy1Data[0]?.status === "SUSPENDED" ? (
              <div className="relative border-2 border-red-300">
                <div className="absolute inset-0 bg-[#748c94]/90 flex items-center justify-center z-10">
                  <p className="text-white font-bold text-xl">SUSPENDED</p>
                </div>
                <div className="flex">
                  {fancy1Data.slice(0, 2).map((data, index) => (
                    <div key={index} className="flex-1 p-3 border-r border-white last:border-r-0">
                      <div className="text-center mb-2">
                        <p className="text-[12px] font-bold text-gray-800">
                          {data?.team?.split("(")[0]}
                        </p>
                      </div>
                      <div className="relative">
                        <div className="flex items-center justify-center h-[48px] bg-[#ced4da] border border-white">
                          <MdLock className="text-white/80" size={14} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex">
                {fancy1Data.slice(0, 2).map((data, index) => (
                  <div key={index} className="flex-1 p-3 border-r border-gray-200 last:border-r-0">
                    <div 
                      className="text-center mb-2 cursor-pointer"
                      onClick={() => {
                        if (data?.odds[0].odds !== 0) {
                          handleSelect("toss", fancy1Data[0].sid);
                          setValue(
                            data?.odds[0].odds,
                            data?.team?.split("(")[0],
                            data?.odds[0].otype
                          );
                        }
                      }}
                    >
                      <p className="text-[12px] font-bold text-gray-800">
                        {data?.team?.split("(")[0]}
                      </p>
                    </div>
                    <div className="relative">
                      <div 
                        className={`flex flex-col justify-center items-center h-[48px] cursor-pointer transition-colors ${
                          data?.odds[0].otype === "back" ? "bg-[#a5d8ff]" : "bg-[#fcc2d7]"
                        }`}
                        onClick={() => {
                          handleSelect("toss", fancy1Data[0].sid);
                          setValue(
                            data?.odds[0].odds,
                            data?.team?.split("(")[0],
                            data?.odds[0].otype
                          );
                        }}
                      >
                        <div className="text-[#212529] text-[13px] sm:text-[14px] font-bold leading-none">
                          {data?.odds[0].odds}
                        </div>
                        <div className="text-[#495057] text-[9px] sm:text-[10px] mt-1">
                          {data?.odds[0].size}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Betting Form */}
            {selectedRun?.type === "toss" && selectedRun?.index === fancy1Data[0].sid && (
              <div className="bg-gray-50 p-3 border-t border-gray-200">
                <div className="grid grid-cols-4 gap-2 mb-3">
                  <button
                    className="bg-white border border-gray-300 rounded-sm px-3 py-2 text-[12px] font-semibold hover:bg-gray-50 transition-colors"
                    onClick={() => handleSelect(null, null)}
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
                    onClick={() => placeBet("Toss", "Toss", fancy1Data[0].max)}
                    disabled={loading}
                    className={`flex items-center justify-center gap-2 bg-[#7e1d51] text-white px-3 py-2 rounded-sm text-[13px] font-semibold transition-all duration-300 hover:bg-[#6a1846] ${
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? "Placing..." : "Place Bet"}
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[100, 200, 500, 1000].map((amt) => (
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
        )}
      </div>

      {/* 1st 6 Over Matches */}
      <div className="mt-4">
        {over6Data.length > 0 && over6Data[0]?.team?.split("(")[0]?.includes("6 over") && (
          <div className="shadow-sm bg-white rounded-t-lg overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="flex items-center rounded-t-lg bg-black text-white overflow-hidden">
              <div className="relative flex items-center w-full bg-[#7e1d51] py-2 px-4 z-10">
                <span className="text-[13px] sm:text-[14px] font-bold uppercase italic tracking-wider">
                  1st 6 Overs
                </span>
                <div className="absolute right-[-14px] top-0 h-full w-[28px] bg-[#7e1d51] transform skew-x-[-20deg] z-[-1]" />
              </div>
            </div>

            {/* Min-Max Row */}
            <div className="flex justify-between items-center bg-gray-100 p-2 border-b">
              <div className="text-[12px] font-bold text-gray-700 flex items-center gap-2">
                <span>Highest Score In 1st 6 Over</span>
                <HiOutlineExclamationCircle className="text-gray-500" size={16} />
              </div>
              <div className="text-[12px] font-bold text-gray-700">
                {over6Data[0].min} - {formatToK(over6Data[0]?.max)}
              </div>
            </div>

            {over6Data[0]?.status === "SUSPENDED" ? (
              <div className="relative border-2 border-red-300">
                <div className="absolute inset-0 bg-[#748c94]/90 flex items-center justify-center z-10">
                  <p className="text-white font-bold text-xl">SUSPENDED</p>
                </div>
                <div className="flex">
                  {over6Data.slice(0, 2).map((data, index) => (
                    <div key={index} className="flex-1 p-3 border-r border-white last:border-r-0">
                      <div className="text-center mb-2">
                        <p className="text-[12px] font-bold text-gray-800">
                          {data?.team?.split("(")[0]}
                        </p>
                      </div>
                      <div className="relative">
                        <div className="flex items-center justify-center h-[48px] bg-[#ced4da] border border-white">
                          <MdLock className="text-white/80" size={14} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex">
                {over6Data.slice(0, 2).map((data, index) => (
                  <div key={index} className="flex-1 p-3 border-r border-gray-200 last:border-r-0">
                    <div 
                      className="text-center mb-2 cursor-pointer"
                      onClick={() => {
                        handleSelect("six", over6Data[0].sid);
                        setValue(
                          data?.odds[0].odds,
                          data?.team,
                          data?.odds[0].otype
                        );
                      }}
                    >
                      <p className="text-[12px] font-bold text-gray-800">
                        {data?.team?.split("(")[0]}
                      </p>
                    </div>
                    <div className="relative">
                      <div 
                        className={`flex flex-col justify-center items-center h-[48px] cursor-pointer transition-colors ${
                          data?.odds[0].otype === "back" ? "bg-[#a5d8ff]" : "bg-[#fcc2d7]"
                        }`}
                        onClick={() => {
                          handleSelect("six", over6Data[0].sid);
                          setValue(
                            data?.odds[0].odds,
                            data?.team,
                            data?.odds[0].otype
                          );
                        }}
                      >
                        <div className="text-[#212529] text-[13px] sm:text-[14px] font-bold leading-none">
                          {data?.odds[0].odds}
                        </div>
                        <div className="text-[#495057] text-[9px] sm:text-[10px] mt-1">
                          {data?.odds[0].size}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Betting Form */}
            {selectedRun?.type === "six" && selectedRun?.index === over6Data[0].sid && (
              <div className="bg-gray-50 p-3 border-t border-gray-200">
                <div className="grid grid-cols-4 gap-2 mb-3">
                  <button
                    className="bg-white border border-gray-300 rounded-sm px-3 py-2 text-[12px] font-semibold hover:bg-gray-50 transition-colors"
                    onClick={() => handleSelect(null, null)}
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
                    onClick={() => placeBet("1st 6 over", teamName, over6Data[0].max)}
                    disabled={betAmount < 1 || loading}
                    className={`flex items-center justify-center gap-2 bg-[#7e1d51] text-white px-3 py-2 rounded-sm text-[13px] font-semibold transition-all duration-300 hover:bg-[#6a1846] ${
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? "Placing..." : "Place Bet"}
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[100, 200, 500, 1000].map((amt) => (
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
        )}
      </div>

      {/* Fancy & Sportsbook */}
      <main className="h-full bg-[#f1f3f5] mt-4">
        <div className="w-full mx-auto bg-white rounded-lg overflow-hidden border border-gray-200">
          {/* Tab Headers */}
          <div className="flex gap-[1px] text-xs md:text-sm">
            <button
              className={`flex items-center px-4 py-3 rounded-tl-lg ${activeTab === "fancy"
                  ? "bg-[#7e1d51] text-white"
                  : "bg-gray-800 text-white"
                }`}
              onClick={() => setActiveTab("fancy")}
            >
              <span className="font-bold uppercase italic">Fancy Bet</span>
              <BiInfoCircle size={16} className="ml-2" />
            </button>
            <button
              className={`flex items-center px-4 py-3 ${activeTab === "sportsbook"
                  ? "bg-[#7e1d51] text-white"
                  : "bg-gray-800 text-white"
                }`}
              onClick={() => setActiveTab("sportsbook")}
            >
              <span className="font-bold uppercase italic">Sportsbook</span>
              <BiInfoCircle size={16} className="ml-2" />
            </button>
          </div>

          {activeTab === "fancy" && (
            <>
              {/* Sub Tabs */}
              <div className="flex gap-1 overflow-x-auto whitespace-nowrap bg-gray-800 text-white py-2 px-3">
                {subTabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${activeSubTab === tab.id
                        ? "bg-white text-black"
                        : "hover:bg-gray-700"
                      }`}
                    onClick={() => setActiveSubTab(tab.id)}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>

              {/* Fancy Table */}
              <div className="overflow-x-auto">
                <div className="w-full text-xs">
                  {/* Table Header */}
                  <div className="grid grid-cols-6 border-b border-gray-300">
                    <div className="col-span-4 md:col-span-3 py-2 px-3 text-left text-[12px] font-bold text-gray-700">
                      Market
                    </div>
                    <div className="col-span-1 py-2 px-3 bg-[#a5d8ff] text-center text-[12px] font-bold">
                      Yes
                    </div>
                    <div className="col-span-1 py-2 px-3 bg-[#fcc2d7] text-center text-[12px] font-bold">
                      No
                    </div>
                    <div className="hidden md:block col-span-1 py-2 px-3 text-center text-[12px] font-bold text-gray-700">
                      Min/Max
                    </div>
                  </div>

                  {/* Table Rows */}
                  <div>
                    {fancy2Data.length > 0 ? (
                      fancy2Data.map(({ team, odds, sid, min, max, status }, index) => (
                        <div key={index} className="w-full">
                          <div className="grid grid-cols-6 border-b border-gray-200 hover:bg-gray-50">
                            {/* Team Name */}
                            <div className="col-span-4 md:col-span-3 py-2 px-3">
                              <div className="text-[11px] sm:text-[12px] font-bold text-gray-800">
                                {team}
                              </div>
                              {pendingBet?.filter(
                                (item) =>
                                  item.gameType === activeSubTab &&
                                  item.teamName?.toLowerCase() === team?.toLowerCase()
                              ).length > 0 && (
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] text-[#7e1d51] font-semibold">
                                    {pendingBet
                                      ?.filter(
                                        (item) =>
                                          item.gameType === activeSubTab &&
                                          item.teamName?.toLowerCase() === team?.toLowerCase()
                                      )
                                      .reduce((sum, item) => sum + (item.totalPrice || 0), 0)}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Book Button (Desktop) */}
                            <div className="hidden md:block md:col-span-0"></div>

                            {/* Odds Columns */}
                            {status === "SUSPENDED" ? (
                              <div className="relative col-span-2 flex">
                                <div className="absolute inset-0 bg-[#748c94]/90 flex items-center justify-center z-10">
                                  <span className="text-white text-[11px] font-bold">SUSPENDED</span>
                                </div>
                                {odds.slice(0, 2).map((odd, i) => (
                                  <div
                                    key={i}
                                    className={`flex-1 py-2 px-3 border-l border-white ${i === 0 ? "bg-[#ced4da]" : "bg-[#ced4da]"}`}
                                  >
                                    <div className="text-center opacity-30">
                                      <div className="font-bold">{odd?.odds}</div>
                                      <div className="text-gray-800">{odd?.size}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="col-span-2 flex">
                                {odds
                                  .filter((odd) => odd?.tno === 0)
                                  .map((odd, i) => (
                                    <div
                                      key={i}
                                      className={`flex-1 py-2 px-3 border-l border-white cursor-pointer transition-colors hover:opacity-90 ${odd?.otype === "back"
                                          ? "bg-[#a5d8ff]"
                                          : "bg-[#fcc2d7]"
                                        }`}
                                      onClick={() => {
                                        if (odd?.odds !== 0) {
                                          handleSelect("fancy", index);
                                          setValue(odd?.size, team, odd.otype, odd?.odds);
                                        }
                                      }}
                                    >
                                      <div className="text-center">
                                        <div className="font-bold text-[13px]">{odd?.odds}</div>
                                        <div className="text-gray-800 text-[10px]">{odd?.size}</div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            )}

                            {/* Min/Max (Desktop) */}
                            <div className="hidden md:flex md:col-span-1 items-center justify-center">
                              <span className="text-[11px] font-bold text-gray-700">
                                {min} - {formatToK(max)}
                              </span>
                            </div>
                          </div>

                          {/* Betting Form */}
                          {selectedRun?.type === "fancy" && selectedRun?.index === index && (
                            <div className="bg-gray-50 p-3 border-b border-gray-200">
                              <div className="grid grid-cols-4 gap-2 mb-3">
                                <button
                                  className="bg-white border border-gray-300 rounded-sm px-3 py-2 text-[12px] font-semibold hover:bg-gray-50 transition-colors"
                                  onClick={() => handleSelect(null, null)}
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
                                  onClick={() => placefancyBet(activeSubTab, team, max)}
                                  disabled={loading}
                                  className={`flex items-center justify-center gap-2 bg-[#7e1d51] text-white px-3 py-2 rounded-sm text-[13px] font-semibold transition-all duration-300 hover:bg-[#6a1846] ${loading ? "opacity-70 cursor-not-allowed" : ""
                                    }`}
                                >
                                  {loading ? (
                                    <>
                                      <svg
                                        className="animate-spin h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                      >
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                                      </svg>
                                      Placing...
                                    </>
                                  ) : (
                                    "Place Bet"
                                  )}
                                </button>
                              </div>

                              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                                {[100, 200, 500, 1000, 2000, 3000, 5000, 10000].map((amt) => (
                                  <button
                                    key={amt}
                                    onClick={() => setBetAmount(amt)}
                                    className={`px-2 py-1.5 rounded-sm border text-[11px] font-semibold transition-colors ${betAmount === amt
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
                      ))
                    ) : (
                      <div className="py-8 text-center text-gray-500 text-[14px]">
                        No betting options available for this category
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "sportsbook" && (
            <div className="p-4">
              <div className="space-y-4">
                {/* Odds/Evens Sections */}
                {oddsDataraw.map((item, idx) => (
                  <div key={idx} className="shadow-sm rounded-lg overflow-hidden border border-gray-200">
                    <div className="bg-[#7e1d51] text-white font-bold px-4 py-2 uppercase italic tracking-wider">
                      {item.title}
                    </div>
                    <div className="flex">
                      {[0, 1].map((i) => (
                        <div key={i} className="flex-1 p-4 border-r border-gray-200 last:border-r-0">
                          <div className="text-center mb-3">
                            <p className="text-[12px] font-bold text-gray-800">Team {i + 1}</p>
                          </div>
                          <div className="flex flex-col items-center justify-center h-[48px] bg-[#a5d8ff] rounded">
                            <div className="text-[#212529] text-[14px] font-bold">1.5</div>
                            <div className="text-[#495057] text-[10px] mt-1">3m</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Dismissal Method */}
                <div className="shadow-sm rounded-lg overflow-hidden border border-gray-200">
                  <div className="bg-[#7e1d51] text-white font-bold px-4 py-2 uppercase italic tracking-wider text-[12px]">
                    KKR 5th Wicket Dismissal Method
                  </div>
                  <div className="divide-y divide-gray-200">
                    {dismissalData.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-[12px] font-semibold text-gray-800">{item.method}</span>
                        <div className="flex flex-col items-center justify-center bg-[#a5d8ff] w-[80px] h-[40px] rounded">
                          <span className="text-[13px] font-bold">{item.odds}</span>
                          <span className="text-[10px] text-gray-700">100K</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )}
</div>
  );
}
