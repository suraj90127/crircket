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
  // console.log("bettingData", bettingData);
  
  const [betOdds, setBetOdds] = useState(null);
  const [betAmount, setBetAmount] = useState(0);
  const [loader, setLoader] = useState(false);
  const [teamName, setTeamName] = useState("");
  const { loading, successMessage, errorMessage } = useSelector(
    (state) => state.bet
  );
  const { battingData } = useSelector((state) => state.cricket);
  console.log("battingData2 22222222222", battingData);

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
          <div>
            <div className="bg-blue text-white px-4 py-1 rounded-t-md font-semibold cursor-pointer" onClick={() => videoS()}>
              Live Streaming
            </div>
            {url ? (
              <LiveVideo url={url} />
            ) : null}
          </div>
          {/* odds match data */}

          <MatchOdd matchOddsList={matchOddsList} gameid={gameid} match={match} />
          {/* tied match data */}
          {/* tied match data */}
          <TiedMatch tiedMatchList={tiedMatchList} gameid={gameid} match={match} />
          {/* bookmaker match data */}
          <BookMaker BookmakerList={BookmakerList} gameid={gameid} match={match} />

          {/* toss winn loass */}
          <div className="mt-2">
            {fancy1Data.length > 0 &&
              fancy1Data[0]?.team?.split("(")[0]?.includes("Toss") && (
                <div>
                  <div className="mx-auto text-[13px] bg-gray-200">
                    <div className="flex justify-between items-center rounded-t-md bg-white">
                      <div className="font-bold bg-blue p-2 px-4 rounded-tr-3xl text-white flex gap-3">
                        <span>Which Team Will Win The Toss </span>

                        <span className="mt-1 text-lg font-black">
                          <HiOutlineExclamationCircle />
                        </span>
                      </div>
                      <div className="font-bold">
                        {fancy1Data[0].min} - {formatToK(fancy1Data[0]?.max)}
                      </div>
                    </div>

                    {fancy1Data[0]?.status === "SUSPENDED" ? (
                      <div className="border-2 border-red-500 relative mx-auto">
                        <div className="absolute flex items-center justify-centerz-10 bg-[#e1e1e17e] h-full w-full">
                          <p className="text-red-700 absolute left-1/2 transform -translate-x-1/2  font-bold text-3xl ">
                            SUSPENDED
                          </p>
                        </div>
                        <div className=" bg-gradient-to-l from-[#a2e5bd] to-[#9fe5bb]">
                          <div className="flex justify-around p-3">
                            <div className="text-center">
                              <p className="font-semibold">
                                {" "}
                                {fancy1Data[0]?.team?.split("(")[0]}
                              </p>
                              <span className="flex flex-col justify-center items-center bg-[#72e3a0] border-[1px] border-white py-0.5 w-[100px]">
                                <span className="text-[13px] font-semibold">
                                  {fancy1Data[0]?.odds[0].odds}
                                </span>
                                <span className="text-[10px] ">
                                  {" "}
                                  {fancy1Data[0]?.odds[0].size}
                                </span>
                              </span>
                            </div>
                            <div className="text-center">
                              <p className="font-semibold">
                                {fancy1Data[1]?.team?.split("(")[0]}
                              </p>
                              <span className="flex flex-col justify-center items-center bg-[#72e3a0] border-[1px] border-white py-0.5 w-[100px]">
                                <span className="text-[13px] font-semibold">
                                  1.5
                                </span>
                                <span className="text-[10px] ">3m</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className=" bg-gradient-to-l from-[#a2e5bd] to-[#9fe5bb]">
                        <div className="flex justify-around p-3">
                          <div
                            onClick={() => {
                              if (fancy1Data[0]?.odds[0].odds !== 0) {
                                handleSelect("toss", fancy1Data[0].sid);
                                setValue(
                                  fancy1Data[0]?.odds[0].odds,
                                  fancy1Data[0]?.team?.split("(")[0],

                                  fancy1Data[0]?.odds[0].otype
                                );
                              }
                            }}
                            className="text-center"
                          >
                            <p className="font-semibold text-xs">
                              {" "}
                              {fancy1Data[0]?.team?.split("(")[0]}
                            </p>
                            <span className="flex flex-col justify-center items-center bg-[#72e3a0] border-[1px] border-white py-0.5 w-[100px]">
                              <span className="text-[13px] font-semibold">
                                {fancy1Data[0]?.odds[0].odds}
                              </span>
                              <span className="text-[10px] ">
                                {" "}
                                {fancy1Data[0]?.odds[0].size}
                              </span>
                            </span>
                          </div>
                          <div
                            onClick={() => {
                              handleSelect("toss", fancy1Data[0].sid);
                              setValue(
                                fancy1Data[1]?.odds[0].odds,
                                fancy1Data[1]?.team?.split("(")[0],

                                fancy1Data[1]?.odds[0].otype
                              );
                            }}
                            className="text-center"
                          >
                            <p className=" text-xs md:text-[11px] font-bold">
                              {" "}
                              {fancy1Data[1]?.team?.split("(")[0]}
                            </p>
                            <span className="flex flex-col justify-center items-center bg-[#72e3a0] border-[1px] border-white py-0.5 w-[100px]">
                              <span className="text-[13px] font-semibold">
                                {fancy1Data[1]?.odds[0].odds}
                              </span>
                              <span className="text-[10px] ">
                                {" "}
                                {fancy1Data[1]?.odds[0].size}
                              </span>
                            </span>
                          </div>
                        </div>
                        {selectedRun?.type === "toss" &&
                          selectedRun?.index === fancy1Data[0].sid && (
                            <div className="bg-green-100 p-3 mt-2">
                              <div className="grid grid-cols-4 gap-2">
                                <button
                                  className="bg-white border border-black rounded-sm px-3 py-1 col-span-2 md:col-span-1"
                                  onClick={() => handleSelect(null, null)}
                                >
                                  Cancel
                                </button>
                                <div className="flex items-center w-full justify-between border rounded-sm overflow-hidden col-span-2 md:col-span-1">
                                  <button
                                    className="bg-gray-300 px-3 py-1 h-full"
                                    onClick={() =>
                                      setBetOdds((prev) =>
                                        prev > 1 ? prev - 0.1 : prev
                                      )
                                    }
                                  >
                                    -
                                  </button>
                                  <span className="mx-3">
                                    {betOdds.toFixed(2)}
                                  </span>
                                  <button
                                    className="bg-gray-300 px-3 py-1 h-full"
                                    onClick={() =>
                                      setBetOdds((prev) => prev + 0.1)
                                    }
                                  >
                                    +
                                  </button>
                                </div>

                                <input
                                  type="number"
                                  value={betAmount}
                                  onChange={(e) =>
                                    setBetAmount(Number(e.target.value))
                                  }
                                  placeholder="Enter Bet Amount"
                                  className="w-full bg-white text-black p-2 col-span-2 md:col-span-1"
                                />

                                <button
                                  onClick={() =>
                                    placeBet("Toss", "Toss", fancy1Data[0].max)
                                  }
                                  disabled={loading}
                                  className={`flex items-center justify-center gap-2 bg-blue text-white px-3 py-1 col-span-2 md:col-span-1 rounded-sm transition-all duration-300 ${loading
                                    ? "opacity-70 cursor-not-allowed"
                                    : ""
                                    }`}
                                >
                                  {loading ? (
                                    <>
                                      {/* <svg
                                        className="animate-spin h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                      >
                                        <circle
                                          className="opacity-25"
                                          cx="12"
                                          cy="12"
                                          r="10"
                                          stroke="currentColor"
                                          strokeWidth="4"
                                        />
                                        <path
                                          className="opacity-75"
                                          fill="currentColor"
                                          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                                        />
                                      </svg> */}
                                      Placing...
                                    </>
                                  ) : (
                                    "Place Bet"
                                  )}
                                </button>
                              </div>

                              <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mt-2">
                                {[
                                  100, 200, 500, 1000, 2000, 3000, 5000, 10000,
                                ].map((amt) => (
                                  <button
                                    key={amt}
                                    onClick={() => setBetAmount(amt)}
                                    className={`px-3 py-2 rounded-sm border border-black col-span-1
                            ${betAmount === amt
                                        ? "bg-green-600 text-white"
                                        : "bg-white"
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
                </div>
              )}
          </div>
          {/* 1st 6 over matches */}
          <div className="mt-2">
            {over6Data.length > 0 &&
              over6Data[0]?.team?.split("(")[0]?.includes("6 over") && (
                <div>
                  <div className="mx-auto text-[13px] bg-gray-200">
                    <div className="flex justify-between items-center rounded-t-md bg-white">
                      <div className="font-bold bg-blue p-2 px-4 rounded-tr-3xl text-white flex gap-3">
                        <span>Highest Score In 1st 6 Over </span>

                        <span className="mt-1 text-lg font-black">
                          <HiOutlineExclamationCircle />
                        </span>
                      </div>
                      <div className="font-bold">
                        {over6Data[0].min} - {formatToK(over6Data[0]?.max)}
                      </div>
                    </div>

                    {over6Data[0]?.status === "SUSPENDED" ? (
                      <div className="border-2 border-red-500 relative mx-auto">
                        <div className="absolute flex items-center justify-centerz-10 bg-[#e1e1e17e] h-full w-full">
                          <p className="text-red-700 absolute left-1/2 transform -translate-x-1/2  font-bold text-3xl ">
                            SUSPENDED
                          </p>
                        </div>
                        <div className=" bg-gradient-to-l from-[#a2e5bd] to-[#9fe5bb]">
                          <div className="flex justify-around p-3">
                            <div className="text-center">
                              <p className="font-semibold">
                                {" "}
                                {over6Data[0]?.team?.split("(")[0]}
                              </p>
                              <span className="flex flex-col justify-center items-center bg-[#72e3a0] border-[1px] border-white py-0.5 w-[100px]">
                                <span className="text-[13px] font-semibold">
                                  {over6Data[0]?.odds[0].odds}
                                </span>
                                <span className="text-[10px] ">
                                  {" "}
                                  {over6Data[0]?.odds[0].size}
                                </span>
                              </span>
                            </div>
                            <div className="text-center">
                              <p className="font-semibold">Kolkata</p>
                              <span className="flex flex-col justify-center items-center bg-[#72e3a0] border-[1px] border-white py-0.5 w-[100px]">
                                <span className="text-[13px] font-semibold">
                                  1.5
                                </span>
                                <span className="text-[10px] ">3m</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className=" bg-gradient-to-l from-[#a2e5bd] to-[#9fe5bb]">
                        <div className="flex justify-around p-3">
                          <div
                            onClick={() => {
                              handleSelect("six", over6Data[0].sid);
                              setValue(
                                over6Data[0]?.odds[0].odds,
                                over6Data[0]?.team,
                                over6Data[0]?.odds[0].otype
                              );
                            }}
                            className="text-center"
                          >
                            <p className="font-semibold">
                              {" "}
                              {over6Data[0]?.team?.split("(")[0]}
                            </p>
                            <span className="flex flex-col justify-center items-center bg-[#72e3a0] border-[1px] border-white py-0.5 w-[100px]">
                              <span className="text-[13px] font-semibold">
                                {over6Data[0]?.odds[0].odds}
                              </span>
                              <span className="text-[10px] ">
                                {" "}
                                {over6Data[0]?.odds[0].size}
                              </span>
                            </span>
                          </div>
                          <div
                            onClick={() => {
                              handleSelect("six", over6Data[0].sid);
                              setValue(
                                over6Data[1]?.odds[0].odds,
                                over6Data[1]?.team,

                                over6Data[1]?.odds[0].otype
                              );
                            }}
                            className="text-center"
                          >
                            <p className="font-semibold">
                              {" "}
                              {over6Data[1]?.team?.split("(")[0]}
                            </p>
                            <span className="flex flex-col justify-center items-center bg-[#72e3a0] border-[1px] border-white py-0.5 w-[100px]">
                              <span className="text-[13px] font-semibold">
                                {over6Data[1]?.odds[0].odds}
                              </span>
                              <span className="text-[10px] ">
                                {" "}
                                {over6Data[1]?.odds[0].size}
                              </span>
                            </span>
                          </div>
                        </div>
                        {selectedRun?.type === "six" &&
                          selectedRun?.index === over6Data[0].sid && (
                            <div className="bg-green-100 p-3 mt-2">
                              <div className="grid grid-cols-4 gap-2">
                                <button
                                  className="bg-white border border-black rounded-sm px-3 py-1 col-span-2 md:col-span-1"
                                  onClick={() => handleSelect(null, null)}
                                >
                                  Cancel
                                </button>
                                <div className="flex items-center w-full justify-between border rounded-sm overflow-hidden col-span-2 md:col-span-1">
                                  <button
                                    className="bg-gray-300 px-3 py-1 h-full"
                                    onClick={() =>
                                      setBetOdds((prev) =>
                                        prev > 1 ? prev - 0.1 : prev
                                      )
                                    }
                                  >
                                    -
                                  </button>
                                  <span className="mx-3">
                                    {betOdds.toFixed(2)}
                                  </span>
                                  <button
                                    className="bg-gray-300 px-3 py-1 h-full"
                                    onClick={() =>
                                      setBetOdds((prev) => prev + 0.1)
                                    }
                                  >
                                    +
                                  </button>
                                </div>

                                <input
                                  type="number"
                                  value={betAmount}
                                  onChange={(e) =>
                                    setBetAmount(Number(e.target.value))
                                  }
                                  placeholder="Enter Bet Amount"
                                  className="w-full bg-white text-black p-2 col-span-2 md:col-span-1"
                                />

                                <button
                                  onClick={() =>
                                    placeBet(
                                      "1st 6 over",
                                      teamName,
                                      over6Data[0].max
                                    )
                                  }
                                  disabled={
                                    betAmount < 1 || loading ? true : false
                                  }
                                  className={`flex items-center justify-center gap-2 bg-blue text-white px-3 py-1 col-span-2 md:col-span-1 rounded-sm transition-all duration-300 ${loading
                                    ? "opacity-70 cursor-not-allowed"
                                    : ""
                                    }`}
                                >
                                  {loading ? (
                                    <>
                                      {/* <svg
                                        className="animate-spin h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                      >
                                        <circle
                                          className="opacity-25"
                                          cx="12"
                                          cy="12"
                                          r="10"
                                          stroke="currentColor"
                                          strokeWidth="4"
                                        />
                                        <path
                                          className="opacity-75"
                                          fill="currentColor"
                                          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                                        />
                                      </svg> */}
                                      Placing...
                                    </>
                                  ) : (
                                    "Place Bet"
                                  )}
                                </button>
                              </div>

                              <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mt-2">
                                {[
                                  100, 200, 500, 1000, 2000, 3000, 5000, 10000,
                                ].map((amt) => (
                                  <button
                                    key={amt}
                                    onClick={() => setBetAmount(amt)}
                                    className={`px-3 py-2 rounded-sm border border-black col-span-1
                                     ${betAmount === amt
                                        ? "bg-green-600 text-white"
                                        : "bg-white"
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
                </div>
              )}
          </div>
          {/*fancy  */}

          <main className="h-full bg-gray-100 mt-2">
            <div className="w-full mx-auto bg-white rounded-md overflow-hidden">
              <div className="flex gap-1 text-xs md:text-sm">
                <button
                  className={`flex items-center px-4 py-2 rounded-tl-2xl ${activeTab === "fancy"
                    ? "bg-color text-white"
                    : "bg-color text-white"
                    }`}
                  onClick={() => setActiveTab("fancy")}
                >
                  <span className="font-bold">Fancy Bet</span>
                  <BiInfoCircle size={16} className="ml-2" />
                </button>
                <button
                  className={`flex items-center px-4 py-2 rounded-tl-2xl ${activeTab === "sportsbook"
                    ? "bg-orange text-white"
                    : "bg-orange text-white"
                    }`}
                  onClick={() => setActiveTab("sportsbook")}
                >
                  <span className="font-bold">Sportsbook</span>
                  <BiInfoCircle size={16} className="ml-2" />
                </button>
              </div>

              {activeTab === "fancy" && (
                <>
                  <div className="flex gap-1 overflow-x-auto whitespace-nowrap bg-color text-white justify-start py-1 px-2 scroll-smooth">
                    {subTabs.map((tab) => (
                      <button
                        key={tab.id}
                        className={`px-2 py-1 text-xs ${activeSubTab === tab.id
                          ? "bg-white text-black font-medium text-xs rounded-t-md"
                          : ""
                          }`}
                        onClick={() => setActiveSubTab(tab.id)}
                      >
                        {tab.name}
                      </button>
                    ))}
                  </div>

                  <div className="overflow-x-auto">
                    <div className="w-full text-xs">
                      <div className="">
                        <div className="text-xs grid grid-cols-6 border-b border-gray-400">
                          <span className="text-left py-2 px-4 col-span-4 md:col-span-3"></span>
                          <span className="py-2 px-4 bg-[#72bbef]  text-center col-span-1">
                            Yes
                          </span>
                          <span className="py-2 px-4 bg-[#faa9ba] text-center w-full col-span-1">
                            No
                          </span>

                          <span className="py-2 px-4  text-center col-span-1 hidden md:block">
                            Min/Max
                          </span>
                        </div>
                      </div>
                      <div>
                        {fancy2Data.length > 0 ? (
                          fancy2Data.map(
                            ({ team, odds, sid, min, max, status }, index) => (
                              <div key={index} className="w-full">
                                <div className="grid grid-cols-6">
                                  <span className="py-1 px-2 border-b border-gray-400 col-span-4 md:col-span-2  text-sm md:text-[11px] font-bold">
                                    {team}
                                    <div className="flex items-center">
                                      {/* {pendingBet?.filter(
                                        (item) =>
                                          item.gameType === activeSubTab &&
                                          item.teamName?.toLowerCase() === team?.toLowerCase()
                                      ) && (
                                          <span className="text-red-500">
                                            <FaArrowRight />
                                          </span>
                                        )} */}
                                      <p className="text-red-500">
                                        {
                                          pendingBet
                                            ?.filter(
                                              (item) =>
                                                item.gameType ===
                                                activeSubTab &&
                                                item.teamName?.toLowerCase() ===
                                                team?.toLowerCase()
                                            )
                                            .reduce(
                                              (sum, item) =>
                                                sum + (item.totalPrice || 0),
                                              ""
                                            ) // Changed initial value to 0
                                        }
                                      </p>
                                    </div>
                                  </span>
                                  <span className="py-1 px-2 border-b border-gray-400 text-center hidden md:block">
                                    <button className="bg-gray-700 hover:bg-[#243a48] text-white px-4 py-1 rounded text-xs">
                                      Book
                                    </button>
                                  </span>
                                  {status === "SUSPENDED" ? (
                                    <div className="relative col-span-2 flex item-center">
                                      <div className="absolute flex items-center justify-centerz-10 bg-[#48484869] h-full w-full">
                                        <p className="text-white absolute left-1/2 transform -translate-x-1/2">
                                          SUSPENDED
                                        </p>
                                      </div>

                                      {odds.slice(0, 2).map((odd, i) => (
                                        <span
                                          onClick={() => {
                                            setSelectedRun(index);
                                            setValue(
                                              odd?.size,
                                              team,
                                              odd.otype,
                                              odd?.odds

                                            );
                                          }}
                                          key={i}
                                          className={`p-1 border-b text-center cursor-pointer  w-full ${i === 0
                                            ? "bg-[#72bbef]"
                                            : i === 1
                                              ? "bg-[#faa9ba]"
                                              : i === 2
                                                ? "bg-[#72bbef]"
                                                : i === 3
                                                  ? "bg-[#faa9ba]"
                                                  : i === 4
                                                    ? "bg-pink-200"
                                                    : "bg-pink-100"
                                            }`}
                                        // onClick={() => {
                                        //   setSelectedRun(index);
                                        //   setCurrentOdd(odd);
                                        // }}
                                        >
                                          <div className="cursor-pointer">
                                            <div className="font-bold">
                                              {odd?.odds}
                                            </div>
                                            <div className="text-gray-800">
                                              {odd?.size}
                                            </div>
                                          </div>
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="col-span-2 flex item-center">
                                      {" "}
                                      {/* This was likely col-span-4 (2 back + 2 lay for the actual odds) */}
                                      {odds.map(
                                        (odd, i) =>
                                          // ONLY RENDER IF odd.tno IS 0
                                          odd?.tno === 0 && ( // <-- Added this conditional rendering
                                            <span
                                              onClick={() => {
                                                if (odd?.odds !== 0) {
                                                  handleSelect("fancy", index);
                                                  setValue(
                                                    odd?.size,
                                                    team,
                                                    odd.otype,
                                                    odd?.odds
                                                  );
                                                }
                                              }}
                                              key={i}
                                              className={`p-1 border-b text-center cursor-pointer w-full ${odd?.otype === "back"
                                                ? "bg-[#72bbef]"
                                                : "bg-[#faa9ba]"
                                                }`}
                                            >
                                              <div
                                                className="cursor-pointer"
                                                onClick={() => {
                                                  if (odd?.odds !== 0) {
                                                    handleSelect(
                                                      "fancy",
                                                      index
                                                    );
                                                    setValue(
                                                      odd?.size,
                                                      team,
                                                      odd.otype,
                                                      odd?.odds
                                                    );
                                                  }
                                                }}
                                              >
                                                <div className="font-bold">
                                                  <span>{odd?.odds}</span>{" "}
                                                  {/* No need for tno === 0 check here, already filtered */}
                                                </div>
                                                <div className="text-gray-800">
                                                  {odd?.size}
                                                </div>
                                              </div>
                                            </span>
                                          )
                                      )}
                                    </div>
                                  )}
                                  <span className="py-1 px-2 border-b border-gray-400 text-center font-semibold col-span-1 hidden md:block">
                                    {min} - {formatToK(max)}
                                  </span>
                                </div>
                                {selectedRun?.type === "fancy" &&
                                  selectedRun?.index === index && (
                                    <div className="bg-green-100 p-3 mt-2">
                                      <div className="grid grid-cols-4 gap-2">
                                        <button
                                          className="bg-white border border-black rounded-sm px-3 py-1 col-span-2 md:col-span-1"
                                          onClick={() =>
                                            handleSelect(null, null)
                                          }
                                        >
                                          Cancel
                                        </button>
                                        <div className="flex items-center w-full justify-between border rounded-sm overflow-hidden col-span-2 md:col-span-1">
                                          <button
                                            className="bg-gray-300 px-3 py-1 h-full"
                                            onClick={() =>
                                              setBetOdds((prev) =>
                                                prev > 1 ? prev - 0.1 : prev
                                              )
                                            }
                                          >
                                            -
                                          </button>
                                          <span className="mx-3">
                                            {betOdds.toFixed(2)}
                                          </span>
                                          <button
                                            className="bg-gray-300 px-3 py-1 h-full"
                                            onClick={() =>
                                              setBetOdds((prev) => prev + 0.1)
                                            }
                                          >
                                            +
                                          </button>
                                        </div>

                                        <input
                                          type="number"
                                          value={betAmount}
                                          onChange={(e) =>
                                            setBetAmount(Number(e.target.value))
                                          }
                                          placeholder="Enter Bet Amount"
                                          className="w-full bg-white text-black p-2 col-span-2 md:col-span-1"
                                        />

                                        <button
                                          onClick={() =>
                                            placefancyBet(
                                              activeSubTab,
                                              team,
                                              max
                                            )
                                          }
                                          disabled={loading}
                                          className={`flex items-center justify-center gap-2 bg-blue text-white px-3 py-1 col-span-2 md:col-span-1 rounded-sm transition-all duration-300 ${loading
                                            ? "opacity-70 cursor-not-allowed"
                                            : ""
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
                                                <circle
                                                  className="opacity-25"
                                                  cx="12"
                                                  cy="12"
                                                  r="10"
                                                  stroke="currentColor"
                                                  strokeWidth="4"
                                                />
                                                <path
                                                  className="opacity-75"
                                                  fill="currentColor"
                                                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                                                />
                                              </svg>
                                              Placing...
                                            </>
                                          ) : (
                                            "Place Bet"
                                          )}
                                        </button>
                                      </div>

                                      <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mt-2">
                                        {[
                                          100, 200, 500, 1000, 2000, 3000, 5000,
                                          10000,
                                        ].map((amt) => (
                                          <button
                                            key={amt}
                                            onClick={() => setBetAmount(amt)}
                                            className={`px-3 py-2 rounded-sm border border-black col-span-1
                                            ${betAmount === amt
                                                ? "bg-green-600 text-white"
                                                : "bg-white"
                                              }`}
                                          >
                                            {amt}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            )
                          )
                        ) : (
                          <tr>
                            <td
                              colSpan={5}
                              className="py-4 text-center text-gray-500"
                            >
                              No betting options available for this category
                            </td>
                          </tr>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "sportsbook" && (
                <div className="mt-2 text-xs">
                  <div className=" space-y-3">
                    {/* Odds/Evens Sections */}
                    {oddsDataraw.map((item, idx) => (
                      <div key={idx} className="rounded overflow-hidden">
                        <div className="bg-orange text-white font-semibold px-4 py-2">
                          {item.title}
                        </div>
                        <div className=" bg-gradient-to-l from-[#a2e5bd] to-[#9fe5bb]">
                          <div className="flex justify-around p-3">
                            <div className="text-center">
                              <p className="font-semibold">Kolkata</p>
                              <span className="flex flex-col justify-center items-center bg-[#72e3a0] border-[1px] border-white py-0.5 w-[100px]">
                                <span className="text-[13px] font-semibold">
                                  1.5
                                </span>
                                <span className="text-[10px] ">3m</span>
                              </span>
                            </div>
                            <div className="text-center">
                              <p className="font-semibold">Kolkata</p>
                              <span className="flex flex-col justify-center items-center bg-[#72e3a0] border-[1px] border-white py-0.5 w-[100px]">
                                <span className="text-[13px] font-semibold">
                                  1.5
                                </span>
                                <span className="text-[10px] ">3m</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* 5th Wicket Dismissal Method */}
                    <div className="rounded overflow-hidden">
                      <div className="bg-orange text-white font-semibold px-4 py-2 text-xs">
                        KKR 5th Wicket Dismissal Method
                      </div>
                      <div className="divide-y divide-gray-200">
                        {dismissalData.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center px-4 py-1 transition border-b border-gray-500"
                          >
                            <span className="font-medium">{item.method}</span>
                            <span className="bg-green-300 p-1 font-semibold flex flex-col justify-center items-center w-[100px]">
                              {item.odds}
                              <span className="text-xs">100K</span>
                            </span>
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
      )
      }
    </div >
  );
}
