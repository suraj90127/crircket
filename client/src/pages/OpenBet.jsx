import React, { useState, useEffect } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getPendingBet } from "../redux/reducer/betReducer";

const OpenBet = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [betsdata, setBetsdata] = useState({
    back: [],
    lay: [],
  });

  // console.log("betsdata", betsdata);

  // const [eventName, setEventName] = useState("");

  const { eventName, loading, errorMessage, successMessage } = useSelector(
    (state) => state.bet
  );

  // console.log("eventName", eventName);
  // const { user } = useSelector((state) => state.user);

  const handelBet = (event) => {
    // const selectedEventName = event.target.value;
    const bets = eventName.filter((bet) => bet.eventName === event);
    const laydata = bets.filter((item) => item.otype === "lay");
    const backdata = bets.filter((item) => item.otype === "back");
    setBetsdata({
      back: backdata,
      lay: laydata,
    });

    // console.log("bets", bets);
  };

  useEffect(() => {
    dispatch(getPendingBet());
    // setEventName(pendingBet);
  }, [dispatch]);

  return (
    <div className="w-full">
      <div className="w-full">
        <div className="p-2 border-b border-blue-800 bg-blue flex items-center justify-between text-white">
          <h2 className="text-[13px] font-semibold">open bets</h2>
        </div>
        <div>
          <select
            onChange={(e) => handelBet(e.target.value)}
            className="w-full border mt-1 border-gray-500 text-xs  overflow-hidden"
          >
            <option value="" className="w-full">Select Market</option>
            {Array.isArray(eventName) &&
              [
                ...new Map(
                  eventName.map((bet) => [bet.eventName, bet])
                ).values(),
              ].map((bet) => (
                <option key={bet._id} value={bet?.eventName}>
                  {bet?.eventName}
                </option>
              ))}
          </select>
        </div>

        <div className="w-full mx-auto border border-gray-300 text-[10px]">
          {/* Matched Header */}
          <div className="flex">
            <div className="bg-white font-bold py-2 px-4 w-1/3">Matched</div>
            <div className="bg-gray-200 w-2/3"></div>
          </div>

          {/* Back (Bet For) Section */}
          <div>
            <div className="grid grid-cols-5 bg-white border-b border-gray-300">
              <div className="px-1 font-semibold col-span-2">
                Back (Bet For)
              </div>
              <div className="px-1 text-center font-semibold">Odds</div>
              <div className="px-1 text-center font-semibold">Stake</div>
              <div className="px-1 text-right font-semibold">Profit</div>
            </div>

            {betsdata.back.map((bet, index) => (
              <div key={index} className="border-b border-[#7dbbe9]">
                {/* <div className="grid grid-cols-4 text-[10px] bg-[#d4e8f8]">
              <div className="px-1 text-gray-600">Ref:</div>
              <div className="px-1 col-span-3">{bet.ref}</div>
            </div> */}
                <div className="grid grid-cols-5 text-[10px] bg-[#beddf4]">
                  <div className="px-1  flex item-center col-span-2 gap-0.5">
                    <p className="bg-[#7dbbe9] p-1 my-auto">Back</p>
                    <div className="flex flex-col">
                      <span className="font-semibold text-[11px]">
                        {bet.teamName}
                      </span>
                      <span className="text-gray-600">Match Odds</span>
                    </div>
                  </div>
                  <div className="px-1 text-center self-center">
                    {bet.xValue}
                  </div>
                  <div className="px-1 text-center self-center">
                    {bet.betAmount}
                  </div>

                  <div className="px-1 text-right self-center">
                    {/* bet.betAmount * (bet.xValue - 1) */}
                    <div className="px-1 text-right self-center">
                      {bet.betAmount} (-{bet.price})
                    </div>{" "}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Lay (Bet Against) Section */}
          <div className="mt-2">
            <div className="grid grid-cols-5 bg-white border-b border-gray-300">
              <div className="px-1 col-span-2">Lay (Bet Against)</div>
              <div className="px-1 text-center col-span-1">Odds</div>
              <div className="px-1 text-center col-span-1">Stake</div>
              <div className="px-1 text-center col-span-1">Liability</div>
            </div>

            {betsdata.lay.map((bet, index) => (
              <div key={index} className="border-b border-[#dfa3b3]">
                <div className="grid grid-cols-5 text-[10px] bg-[#f3dce2] ">
                  <div className="px-1  flex item-center col-span-2 gap-0.5">
                    <p className="bg-[#dfa3b3] p-1 my-auto">Lay</p>
                    <div className="flex flex-col">
                      <span className="font-semibold text-[11px]">
                        {bet.teamName}
                      </span>
                      <span className="text-gray-600">Match Odds</span>
                    </div>
                  </div>
                  <div className="px-1 text-center self-center">
                    {bet.xValue}
                  </div>
                  <div className="px-1 text-center self-center">
                    {bet.betAmount}
                  </div>
                  <div className="px-1 text-right self-center">
                    {bet.betAmount} (-{bet.price})
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <nav></nav>
      </div>
    </div>
  );
};

export default OpenBet;
