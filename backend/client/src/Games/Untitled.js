import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getUser } from "../redux/reducer/authReducer";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/Spinner";
import { createBet, messageClear } from "../redux/reducer/betReducer";
import { toast } from "react-toastify";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import { fetchCricketBatingData } from "../redux/reducer/cricketSlice";
// import io from "socket.io-client";

// const socket = io("http://localhost:5000"); // Replace with your backend URL

export default function Cricketbet() {
  const { gameid } = useParams() || {};

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, successMessage, errorMessage } = useSelector(
    (state) => state.bet
  );
  const { battingData } = useSelector((state) => state.cricket);
  console.log("battingData", battingData);

  const { userInfo } = useSelector((state) => state.auth);

  const [selectedRun, setSelectedRun] = useState(null);
  const [betOdds, setBetOdds] = useState(null);
  const [betAmount, setBetAmount] = useState(100);
  const [loader, setLoader] = useState(false);

  // console.log("fancyData", fancyData);

  const [formData, setFormData] = useState({
    gameId: gameid,
    sid: "",
    otype: "",
    price: null,
    xValue: "",
    gameType: "",
    gameName: "Cricket Game",
    teamName: "",
  });

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

      intervalId = setInterval(() => {
        dispatch(fetchCricketBatingData(gameid));
      }, 2000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [gameid]);
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const setValue = (xValue, team, sid, otype) => {
    setBetOdds(xValue);
    // console.log("xValue,team,sid,otype", xValue, team, sid, otype);

    setFormData((prev) => ({
      ...prev,
      xValue: xValue,
      teamName: team,
      sid: sid,
      otype: otype,
    }));
  };

  const placeBet = (gameType) => {
    const updatedFormData = {
      ...formData,
      price: betAmount,
      gameType: gameType,
    };

    setFormData(updatedFormData);
    dispatch(createBet(updatedFormData));
    dispatch(getUser());
  };

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

  // console.log("matchOddsList", battingData);

  // 0 idex data/ Match odds data
  const matchOddsList = Array.isArray(battingData)
    ? battingData.filter((item) => item?.mname === "MATCH_ODDS")
    : [];

  const targetItem =
    matchOddsList.length > 0 ? matchOddsList[0] : battingData?.[0];

  const oddsData =
    targetItem?.section?.map((sec) => ({
      team: sec.nat,
      sid: sec.sid,
      odds: sec.odds,
      mname: targetItem.mname,
      status: targetItem.status,
    })) || [];

  // 1 idex data/ TIED_MATCH data

  const tiedMatchList = Array.isArray(battingData)
    ? battingData.filter((item) => item?.mname === "TIED_MATCH")
    : [];

  const tiedTargetItem =
    tiedMatchList.length > 0 ? tiedMatchList[0] : battingData?.[1];

  const tiedData = tiedTargetItem?.section?.length
    ? tiedTargetItem.section.map((sec) => ({
        team: sec.nat,
        sid: sec.sid,
        odds: sec.odds,
        mname: tiedTargetItem.mname,
        status: tiedTargetItem.status,
      }))
    : [];

  // console.log("tiedData", tiedData);

  const BookmakerList = battingData.filter(
    (item) => item.mname === "Bookmaker"
  );
  // console.log("BookmakerList", BookmakerList);
  const bookmakerData =
    Array.isArray(BookmakerList) &&
    BookmakerList.length > 0 &&
    BookmakerList[0].section
      ? BookmakerList[0].section.map((sec) => ({
          team: sec.nat,
          sid: sec.sid,
          odds: sec.odds,
          mname: BookmakerList[0].mname, // ✅ Access from first item
          status: BookmakerList[0].status, // ✅ Access from first item
        }))
      : [];
  const fancy1List = battingData.filter((item) => item.mname === "fancy1");
  const fancy1Data =
    Array.isArray(BookmakerList) &&
    fancy1List.length > 0 &&
    fancy1List[0].section
      ? fancy1List[0].section.map((sec) => ({
          team: sec.nat,
          sid: sec.sid,
          odds: sec.odds,
          mname: fancy1List[0].mname, // ✅ Access from first item
          status: fancy1List[0].status, // ✅ Access from first item
        }))
      : [];

  console.log("fancy1List", fancy1List);

  return (
    <div className="bg-gray-400">
      {loader ? (
        <div className="text-center py-4">
          <Spinner />
        </div>
      ) : (
        <div>
          {/* odds match data */}
          <div>
            {oddsData.length > 0 && (
              <div>
                <div className="mx-auto text-[13px] bg-gray-200 border-x-2">
                  <div className="flex justify-between items-center rounded-t-md bg-white">
                    <div className="font-bold bg-blue p-2 px-4 rounded-tr-3xl text-white flex gap-3">
                      <span>{oddsData[0]?.mname}</span>

                      <span className="mt-1 text-lg font-black">
                        <HiOutlineExclamationCircle />
                      </span>
                    </div>
                    <div className="font-bold">Matched € 204.7K</div>
                  </div>

                  {oddsData[0]?.status === "SUSPENDED" ? (
                    <div className="border-2 border-red-500 relative mx-auto">
                      <div className="absolute flex items-center justify-centerz-10 bg-[#e1e1e17e] h-full w-full">
                        <p className="text-red-700 absolute left-1/2 transform -translate-x-1/2  font-bold text-3xl ">
                          SUSPENDED
                        </p>
                      </div>

                      <div className="grid grid-cols-9 text-center border-b border-gray-300 bg-white">
                        <div className="col-span-5"></div>
                        <div className="bg-sky-300 text-slate-800 p-1 md:col-span-1 font-bold rounded-t-2xl">
                          Back
                        </div>
                        <div className="bg-pink-300 text-slate-800 p-1  md:col-span-1 font-bold rounded-t-2xl">
                          Lay
                        </div>
                        <div className="bg-[#bed5d8] text-[#2789ce] p-1 text-[10px] rounded-lg col-span-2 hidden md:block">
                          Min/Max 100-100000
                        </div>
                      </div>
                      {oddsData.map(({ team, odds, sid }, index) => (
                        <div key={index}>
                          <div
                            className="grid grid-cols-9 text-center text-[10px] opacity-30 font-semibold border-b bg-white border-gray-300 cursor-pointer hover:bg-gray-200"
                            // onClick={() => setSelectedRun(index)}
                          >
                            <div className="col-span-3 text-[10px] font-semibold  p-1  text-left pl-4">
                              {team}
                            </div>
                            {odds.map((odd, i) => (
                              <div
                                key={i}
                                className={`p-1 col-span-2 md:col-span-1 ${
                                  i === 0
                                    ? "bg-sky-100"
                                    : i === 1
                                    ? "bg-sky-200"
                                    : i === 2
                                    ? "bg-sky-300"
                                    : i === 3
                                    ? "bg-pink-300"
                                    : i === 4
                                    ? "bg-pink-200"
                                    : "bg-pink-100"
                                }`}
                                // onClick={() => {
                                //   setSelectedRun(index);
                                //   setCurrentOdd(odd);
                                // }}
                              >
                                <div
                                  className="font-bold"
                                  onClick={() => {
                                    setSelectedRun(index);
                                    setValue(odd?.odds, team, sid, odd.otype);
                                  }}
                                >
                                  {odd?.odds}
                                </div>
                                <div className="text-gray-800">{odd?.size}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <div className="grid grid-cols-9 text-center border-b border-gray-300 bg-white">
                        <div className="col-span-5"></div>
                        <div className="bg-sky-300 text-slate-800 p-1 md:col-span-1 font-bold rounded-t-2xl">
                          Back
                        </div>
                        <div className="bg-pink-300 text-slate-800 p-1  md:col-span-1 font-bold rounded-t-2xl">
                          Lay
                        </div>
                        <div className="bg-[#bed5d8] text-[#2789ce] p-1 text-[10px] rounded-lg col-span-2 hidden md:block">
                          Min/Max 100-100000
                        </div>
                      </div>
                      {oddsData.map(({ team, odds, sid }, index) => (
                        <div key={index}>
                          <div
                            className="grid grid-cols-9 text-center text-[10px] font-semibold border-b bg-white border-gray-300 cursor-pointer hover:bg-gray-200"
                            // onClick={() => setSelectedRun(index)}
                          >
                            <div className="col-span-3 text-[10px] font-semibold  p-1  text-left pl-4">
                              {team}
                            </div>
                            {odds.map((odd, i) => (
                              <div
                                key={i}
                                className={`p-1 col-span-2 md:col-span-1 ${
                                  i === 0
                                    ? "bg-sky-100"
                                    : i === 1
                                    ? "bg-sky-200"
                                    : i === 2
                                    ? "bg-sky-300"
                                    : i === 3
                                    ? "bg-pink-300"
                                    : i === 4
                                    ? "bg-pink-200"
                                    : "bg-pink-100"
                                }`}
                                // onClick={() => {
                                //   setSelectedRun(index);
                                //   setCurrentOdd(odd);
                                // }}
                              >
                                <div
                                  onClick={() => {
                                    setSelectedRun(index);
                                    setValue(odd?.odds, team, sid, odd.otype);
                                  }}
                                >
                                  <div className="font-bold">{odd?.odds}</div>
                                  <div className="text-gray-800">
                                    {odd?.size}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {selectedRun === index && (
                            <div className="bg-green-100 p-3 mt-2">
                              <div className="grid grid-cols-4 gap-2">
                                <button
                                  className="bg-white border border-black rounded-sm px-3 py-1 col-span-2 md:col-span-1"
                                  onClick={() => setSelectedRun(null)}
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
                                  onClick={() => placeBet("match")}
                                  disabled={loading}
                                  className={`flex items-center justify-center gap-2 bg-blue text-white px-3 py-1 col-span-2 md:col-span-1 rounded-sm transition-all duration-300 ${
                                    loading
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

                              <div className="grid grid-cols-5 md:grid-cols-8 gap-2 mt-2">
                                {[
                                  100, 200, 500, 1000, 2000, 3000, 5000, 10000,
                                ].map((amt) => (
                                  <button
                                    key={amt}
                                    onClick={() => setBetAmount(amt)}
                                    className={`px-3 py-2 rounded-sm border border-black col-span-1
                            ${
                              betAmount === amt
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
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* tied match data */}
          <div>
            {tiedMatchList.length > 0 ? (
              <div>
                <div className="mx-auto text-[13px] bg-gray-200 border-x-2">
                  <div className="flex justify-between items-center rounded-t-md bg-white">
                    <div className="font-bold bg-blue p-2 px-4 rounded-tr-3xl text-white flex gap-3">
                      <span>{tiedData[0]?.mname}</span>

                      <span className="mt-1 text-lg font-black">
                        <HiOutlineExclamationCircle />
                      </span>
                    </div>
                    <div className="font-bold">Matched € 204.7K</div>
                  </div>

                  {tiedData[0]?.status === "SUSPENDED" ? (
                    <div className="border-2 border-red-500 relative mx-auto">
                      <div className="absolute flex items-center justify-centerz-10 bg-[#e1e1e17e] h-full w-full">
                        <p className="text-red-700 absolute left-1/2 transform -translate-x-1/2  font-bold text-3xl ">
                          SUSPENDED
                        </p>
                      </div>
                      <div className="grid grid-cols-9 text-center border-b border-gray-300 bg-white">
                        <div className="col-span-5"></div>
                        <div className="bg-sky-300 text-slate-800 p-1 md:col-span-1 font-bold rounded-t-2xl">
                          Back
                        </div>
                        <div className="bg-pink-300 text-slate-800 p-1  md:col-span-1 font-bold rounded-t-2xl">
                          Lay
                        </div>
                        <div className="bg-[#bed5d8] text-[#2789ce] p-1 text-[10px] rounded-lg col-span-2 hidden md:block">
                          Min/Max 100-100000
                        </div>
                      </div>
                      {tiedData.map(({ team, odds, sid }, index) => (
                        <div key={index}>
                          <div
                            className="grid grid-cols-9 text-center text-[10px] font-semibold border-b bg-white border-gray-300 cursor-pointer hover:bg-gray-200"
                            // onClick={() => setSelectedRun(index)}
                          >
                            <div
                              className={`col-span-5 text-[10px] font-semibold  p-1  text-left pl-4`}
                            >
                              {team}
                            </div>
                            {odds.map((odd, i) => (
                              <div
                                key={i}
                                className={`p-1 col-span-2 md:col-span-1 ${
                                  i === 0
                                    ? "bg-sky-100"
                                    : i === 1
                                    ? "bg-sky-200"
                                    : i === 2
                                    ? "bg-sky-300"
                                    : i === 3
                                    ? "bg-pink-300"
                                    : i === 4
                                    ? "bg-pink-200"
                                    : "bg-pink-100"
                                }`}
                                // onClick={() => {
                                //   setSelectedRun(index);
                                //   setCurrentOdd(odd);
                                // }}
                              >
                                <div
                                  className="font-bold"
                                  onClick={() => {
                                    setSelectedRun(index);
                                    setValue(odd?.odds, team, sid, odd.otype);
                                  }}
                                >
                                  {odd?.odds}
                                </div>
                                <div className="text-gray-800">{odd?.size}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <div className="grid grid-cols-9 text-center border-b border-gray-300 bg-white">
                        <div className="col-span-5"></div>
                        <div className="bg-sky-300 text-slate-800 p-1 md:col-span-1 font-bold rounded-t-2xl">
                          Back
                        </div>
                        <div className="bg-pink-300 text-slate-800 p-1  md:col-span-1 font-bold rounded-t-2xl">
                          Lay
                        </div>
                        <div className="bg-[#bed5d8] text-[#2789ce] p-1 text-[10px] rounded-lg col-span-2 hidden md:block">
                          Min/Max 100-100000
                        </div>
                      </div>
                      {tiedData.map(({ team, odds, sid }, index) => (
                        <div key={index}>
                          <div
                            className="grid grid-cols-9 text-center text-[10px] font-semibold border-b bg-white border-gray-300 cursor-pointer hover:bg-gray-200"
                            // onClick={() => setSelectedRun(index)}
                          >
                            <div className="col-span-3 text-[10px] font-semibold  p-1  text-left pl-4">
                              {team}
                            </div>
                            {odds.map((odd, i) => (
                              <div
                                key={i}
                                className={`p-1 col-span-2 md:col-span-1 ${
                                  i === 0
                                    ? "bg-sky-100"
                                    : i === 1
                                    ? "bg-sky-200"
                                    : i === 2
                                    ? "bg-sky-300"
                                    : i === 3
                                    ? "bg-pink-300"
                                    : i === 4
                                    ? "bg-pink-200"
                                    : "bg-pink-100"
                                }`}
                                // onClick={() => {
                                //   setSelectedRun(index);
                                //   setCurrentOdd(odd);
                                // }}
                              >
                                <div
                                  onClick={() => {
                                    setSelectedRun(index);
                                    setValue(odd?.odds, team, sid, odd.otype);
                                  }}
                                >
                                  <div className="font-bold">{odd?.odds}</div>
                                  <div className="text-gray-800">
                                    {odd?.size}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {selectedRun === index && (
                            <div className="bg-green-100 p-3 mt-2">
                              <div className="grid grid-cols-4 gap-2">
                                <button
                                  className="bg-white border border-black rounded-sm px-3 py-1 col-span-2 md:col-span-1"
                                  onClick={() => setSelectedRun(null)}
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
                                  onClick={() => placeBet("match")}
                                  disabled={loading}
                                  className={`flex items-center justify-center gap-2 bg-blue text-white px-3 py-1 col-span-2 md:col-span-1 rounded-sm transition-all duration-300 ${
                                    loading
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

                              <div className="grid grid-cols-5 md:grid-cols-8 gap-2 mt-2">
                                {[
                                  100, 200, 500, 1000, 2000, 3000, 5000, 10000,
                                ].map((amt) => (
                                  <button
                                    key={amt}
                                    onClick={() => setBetAmount(amt)}
                                    className={`px-3 py-2 rounded-sm border border-black col-span-1
                            ${
                              betAmount === amt
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
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div className="mx-auto text-[13px] bg-gray-200 border-x-2">
                  <div className="flex justify-between items-center rounded-t-md bg-white">
                    <div className="font-bold bg-blue p-2 px-4 rounded-tr-3xl text-white flex gap-3">
                      <span>{tiedData[0]?.mname}</span>

                      <span className="mt-1 text-lg font-black">
                        <HiOutlineExclamationCircle />
                      </span>
                    </div>
                    <div className="font-bold">Matched € 204.7K</div>
                  </div>

                  {tiedData[0]?.status === "SUSPENDED" ? (
                    <div className="border-2 border-red-500 relative mx-auto">
                      <div className="absolute flex items-center justify-centerz-10 bg-[#e1e1e17e] h-full w-full">
                        <p className="text-red-700 absolute left-1/2 transform -translate-x-1/2  font-bold text-3xl ">
                          SUSPENDED
                        </p>
                      </div>
                      <div className="grid grid-cols-9 text-center border-b border-gray-300 bg-white">
                        <div className="col-span-5"></div>
                        <div className="bg-sky-300 text-slate-800 p-1 md:col-span-1 font-bold rounded-t-2xl">
                          Back
                        </div>
                        <div className="bg-pink-300 text-slate-800 p-1  md:col-span-1 font-bold rounded-t-2xl">
                          Lay
                        </div>
                        <div className="bg-[#bed5d8] text-[#2789ce] p-1 text-[10px] rounded-lg col-span-2 hidden md:block">
                          Min/Max 100-100000
                        </div>
                      </div>
                      {tiedData.map(({ team, odds, sid }, index) => (
                        <div key={index}>
                          <div
                            className="grid grid-cols-9 text-center text-[10px] font-semibold border-b bg-white border-gray-300 cursor-pointer hover:bg-gray-200"
                            // onClick={() => setSelectedRun(index)}
                          >
                            <div
                              className={`col-span-3 text-[10px] font-semibold  p-1  text-left pl-4`}
                            >
                              {team}
                            </div>
                            {odds
                              ?.flatMap((odd) => [odd, odd, odd])
                              .map((odd, i) => (
                                <div
                                  key={i}
                                  className={`p-1 col-span-2 md:col-span-1 ${
                                    i === 0
                                      ? "bg-sky-100"
                                      : i === 1
                                      ? "bg-sky-200"
                                      : i === 2
                                      ? "bg-sky-300"
                                      : i === 3
                                      ? "bg-pink-300"
                                      : i === 4
                                      ? "bg-pink-200"
                                      : "bg-pink-100"
                                  }`}
                                >
                                  <div
                                    className="font-bold"
                                    onClick={() => {
                                      setSelectedRun(index);
                                      setValue(odd?.odds, team, sid, odd.otype);
                                    }}
                                  >
                                    {odd?.odds}
                                  </div>
                                  <div className="text-gray-800">
                                    {odd?.size}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <div className="grid grid-cols-9 text-center border-b border-gray-300 bg-white">
                        <div className="col-span-5"></div>
                        <div className="bg-sky-300 text-slate-800 p-1 md:col-span-1 font-bold rounded-t-2xl">
                          Back
                        </div>
                        <div className="bg-pink-300 text-slate-800 p-1  md:col-span-1 font-bold rounded-t-2xl">
                          Lay
                        </div>
                        <div className="bg-[#bed5d8] text-[#2789ce] p-1 text-[10px] rounded-lg col-span-2 hidden md:block">
                          Min/Max 100-100000
                        </div>
                      </div>
                      {tiedData.map(({ team, odds, sid }, index) => (
                        <div key={index}>
                          <div
                            className="grid grid-cols-9 text-center text-[10px] font-semibold border-b bg-white border-gray-300 cursor-pointer hover:bg-gray-200"
                            // onClick={() => setSelectedRun(index)}
                          >
                            <div className="col-span-3 text-[10px] font-semibold  p-1  text-left pl-4">
                              {team}
                            </div>
                            {odds
                              ?.flatMap((odd) => [odd, odd, odd])
                              .map((odd, i) => (
                                <div
                                  key={i}
                                  className={`p-1 col-span-2 md:col-span-1 ${
                                    i === 0
                                      ? "bg-sky-100"
                                      : i === 1
                                      ? "bg-sky-200"
                                      : i === 2
                                      ? "bg-sky-300"
                                      : i === 3
                                      ? "bg-pink-300"
                                      : i === 4
                                      ? "bg-pink-200"
                                      : "bg-pink-100"
                                  }`}
                                >
                                  <div
                                    className="font-bold"
                                    onClick={() => {
                                      setSelectedRun(index);
                                      setValue(odd?.odds, team, sid, odd.otype);
                                    }}
                                  >
                                    {odd?.odds}
                                  </div>
                                  <div className="text-gray-800">
                                    {odd?.size}
                                  </div>
                                </div>
                              ))}
                          </div>

                          {selectedRun === index && (
                            <div className="bg-green-100 p-3 mt-2">
                              <div className="grid grid-cols-4 gap-2">
                                <button
                                  className="bg-white border border-black rounded-sm px-3 py-1 col-span-2 md:col-span-1"
                                  onClick={() => setSelectedRun(null)}
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
                                  onClick={() => placeBet("match")}
                                  disabled={loading}
                                  className={`flex items-center justify-center gap-2 bg-blue text-white px-3 py-1 col-span-2 md:col-span-1 rounded-sm transition-all duration-300 ${
                                    loading
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

                              <div className="grid grid-cols-5 md:grid-cols-8 gap-2 mt-2">
                                {[
                                  100, 200, 500, 1000, 2000, 3000, 5000, 10000,
                                ].map((amt) => (
                                  <button
                                    key={amt}
                                    onClick={() => setBetAmount(amt)}
                                    className={`px-3 py-2 rounded-sm border border-black col-span-1
                          ${
                            betAmount === amt
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
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* bookmaker match data */}
          <div>
            {bookmakerData.length > 0 && (
              <div>
                <div className="mx-auto text-[13px] bg-gray-200 border-x-2">
                  <div className="flex justify-between items-center rounded-t-md bg-white">
                    <div className="font-bold bg-blue p-2 px-4 rounded-tr-3xl text-white flex gap-3">
                      <span>{bookmakerData[0]?.mname}</span>

                      <span className="mt-1 text-lg font-black">
                        <HiOutlineExclamationCircle />
                      </span>
                    </div>
                    <div className="font-bold">Matched € 204.7K</div>
                  </div>

                  {bookmakerData[0]?.status === "SUSPENDED" ? (
                    <div className="border-2 border-red-500 relative mx-auto">
                      <div className="absolute flex items-center justify-centerz-10 bg-[#e1e1e17e] h-full w-full">
                        <p className="text-red-700 absolute left-1/2 transform -translate-x-1/2  font-bold text-3xl ">
                          SUSPENDED
                        </p>
                      </div>

                      <div className="grid grid-cols-9 text-center border-b border-gray-300 bg-white">
                        <div className="col-span-5"></div>
                        <div className="bg-sky-300 text-slate-800 p-1 md:col-span-1 font-bold rounded-t-2xl">
                          Back
                        </div>
                        <div className="bg-pink-300 text-slate-800 p-1  md:col-span-1 font-bold rounded-t-2xl">
                          Lay
                        </div>
                        <div className="bg-[#bed5d8] text-[#2789ce] p-1 text-[10px] rounded-lg col-span-2 hidden md:block">
                          Min/Max 100-100000
                        </div>
                      </div>
                      {bookmakerData.map(({ team, odds, sid }, index) => (
                        <div key={index}>
                          <div
                            className="grid grid-cols-9 text-center text-[10px] opacity-30 font-semibold border-b bg-white border-gray-300 cursor-block"
                            // onClick={() => setSelectedRun(index)}
                          >
                            <div className="col-span-3 text-[10px] font-semibold  p-1  text-left pl-4">
                              {team}
                            </div>
                            {odds.map((odd, i) => (
                              <div
                                key={i}
                                className={`p-1 col-span-2 md:col-span-1 ${
                                  i === 0
                                    ? "bg-sky-100"
                                    : i === 1
                                    ? "bg-sky-200"
                                    : i === 2
                                    ? "bg-sky-300"
                                    : i === 3
                                    ? "bg-pink-300"
                                    : i === 4
                                    ? "bg-pink-200"
                                    : "bg-pink-100"
                                }`}
                                // onClick={() => {
                                //   setSelectedRun(index);
                                //   setCurrentOdd(odd);
                                // }}
                              >
                                <div className="font-bold">{odd?.odds}</div>
                                <div className="text-gray-800">{odd?.size}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <div className="grid grid-cols-9 text-center border-b border-gray-300 bg-white">
                        <div className="col-span-5"></div>
                        <div className="bg-sky-300 text-slate-800 p-1 md:col-span-1 font-bold rounded-t-2xl">
                          Back
                        </div>
                        <div className="bg-pink-300 text-slate-800 p-1  md:col-span-1 font-bold rounded-t-2xl">
                          Lay
                        </div>
                        <div className="bg-[#bed5d8] text-[#2789ce] p-1 text-[10px] rounded-lg col-span-2 hidden md:block">
                          Min/Max 100-100000
                        </div>
                      </div>
                      {bookmakerData.map(({ team, odds, sid }, index) => (
                        <div key={index}>
                          <div
                            className="grid grid-cols-9 text-center text-[10px] font-semibold border-b bg-white border-gray-300 cursor-pointer hover:bg-gray-200"
                            // onClick={() => setSelectedRun(index)}
                          >
                            <div className="col-span-3 text-[10px] font-semibold  p-1  text-left pl-4">
                              {team}
                            </div>
                            {odds.map((odd, i) => (
                              <div
                                key={i}
                                className={`p-1 col-span-2 md:col-span-1 ${
                                  i === 0
                                    ? "bg-sky-100"
                                    : i === 1
                                    ? "bg-sky-200"
                                    : i === 2
                                    ? "bg-sky-300"
                                    : i === 3
                                    ? "bg-pink-300"
                                    : i === 4
                                    ? "bg-pink-200"
                                    : "bg-pink-100"
                                }`}
                                // onClick={() => {
                                //   setSelectedRun(index);
                                //   setCurrentOdd(odd);
                                // }}
                              >
                                <div
                                  onClick={() => {
                                    setSelectedRun(index);
                                    setValue(odd?.odds, team, sid, odd.otype);
                                  }}
                                >
                                  <div className="font-bold">{odd?.odds}</div>
                                  <div className="text-gray-800">
                                    {odd?.size}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {selectedRun === index && (
                            <div className="bg-green-100 p-3 mt-2">
                              <div className="grid grid-cols-4 gap-2">
                                <button
                                  className="bg-white border border-black rounded-sm px-3 py-1 col-span-2 md:col-span-1"
                                  onClick={() => setSelectedRun(null)}
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
                                  onClick={() => placeBet("match")}
                                  disabled={loading}
                                  className={`flex items-center justify-center gap-2 bg-blue text-white px-3 py-1 col-span-2 md:col-span-1 rounded-sm transition-all duration-300 ${
                                    loading
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

                              <div className="grid grid-cols-5 md:grid-cols-8 gap-2 mt-2">
                                {[
                                  100, 200, 500, 1000, 2000, 3000, 5000, 10000,
                                ].map((amt) => (
                                  <button
                                    key={amt}
                                    onClick={() => setBetAmount(amt)}
                                    className={`px-3 py-2 rounded-sm border border-black col-span-1
                            ${
                              betAmount === amt
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
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
