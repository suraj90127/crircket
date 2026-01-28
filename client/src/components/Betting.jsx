// import React, { useState, useEffect } from "react";
// import { HiOutlineDotsVertical } from "react-icons/hi";
// import { useSelector, useDispatch } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { getPendingBet } from "../redux/reducer/betReducer";

// const Betting = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [betsdata, setBetsdata] = useState({
//     back: [],
//     lay: [],
//   });

//   // console.log("betsdata", betsdata);

//   // const [eventName, setEventName] = useState("");

//   const { eventName, loading, errorMessage, successMessage } = useSelector(
//     (state) => state.bet
//   );

//   // console.log("eventName", eventName);
//   // const { user } = useSelector((state) => state.user);

//   const handelBet = (event) => {
//     // const selectedEventName = event.target.value;
//     const bets = eventName.filter((bet) => bet.eventName === event);
//     const laydata = bets.filter((item) => item.otype === "lay");
//     const backdata = bets.filter((item) => item.otype === "back");
//     setBetsdata({
//       back: backdata,
//       lay: laydata,
//     });

//     // console.log("bets", bets);
//   };

//   useEffect(() => {
//     dispatch(getPendingBet());
//     // setEventName(pendingBet);
//   }, [dispatch]);

//   return (
//     <div className="w-full md:w-[25%] sticky top-[110px] h-fit me-auto hidden md:block">
//       <div className="w-full">
//         <div className="p-2 border-b border-blue-800 bg-blue flex items-center justify-between text-white">
//           <h2 className="text-[13px] font-semibold">open bets</h2>
//         </div>
//         <div>
//           <select
//             onChange={(e) => handelBet(e.target.value)}
//             className="w-full border mt-1 border-gray-500 text-[13px] overflow-hidden"
//           >
//             <option value="">Select Market</option>
//             {Array.isArray(eventName) &&
//               [
//                 ...new Map(
//                   eventName.map((bet) => [bet.eventName, bet])
//                 ).values(),
//               ].map((bet) => (
//                 <option key={bet._id} value={bet?.eventName}>
//                   {bet?.eventName}
//                 </option>
//               ))}
//           </select>
//         </div>

//         <div className="w-full mx-auto border border-gray-300 text-[10px]">
//           {/* Matched Header */}
//           <div className="flex">
//             <div className="bg-white font-bold py-2 px-4 w-1/3">Matched</div>
//             <div className="bg-gray-200 w-2/3"></div>
//           </div>

//           {/* Back (Bet For) Section */}
//           <div>
//             <div className="grid grid-cols-5 bg-white border-b border-gray-300">
//               <div className="px-1 font-semibold col-span-2">
//                 Back (Bet For)
//               </div>
//               <div className="px-1 text-center font-semibold">Odds</div>
//               <div className="px-1 text-center font-semibold">Stake</div>
//               <div className="px-1 text-right font-semibold">Profit</div>
//             </div>

          

//             {betsdata.back.map((bet, index) => (
              
              
//               <div key={index} className="border-b border-[#7dbbe9]">
//                 {/* <div className="grid grid-cols-4 text-[10px] bg-[#d4e8f8]">
//               <div className="px-1 text-gray-600">Ref:</div>
//               <div className="px-1 col-span-3">{bet.ref}</div>
//             </div> */}
//                 <div className="grid grid-cols-5 text-[10px] bg-[#beddf4]">
//                   <div className="px-1  flex item-center col-span-2 gap-0.5">
//                     <p className="bg-[#7dbbe9] p-1 my-auto">Back</p>
//                     <div className="flex flex-col">
//                       <span className="font-semibold text-[11px]">
//                         {bet.teamName}
//                       </span>
//                       <span className="text-gray-600">Match Odds</span>
//                     </div>
//                   </div>
//                   <div className="px-1 text-center self-center">
//                     {bet.xValue}
//                   </div>
//                   <div className="px-1 text-center self-center">
//                     {bet.betAmount}
                  
//                   </div>

//                   <div className="px-1 text-right self-center">
//                     {/* bet.betAmount * (bet.xValue - 1) */}
//                     <div className="px-1 text-right self-center">
//                       {/* {bet.betAmount} (-{bet.price}) */}
//                       {(bet.betAmount * (bet.xValue - 1)).toFixed(2)} (-{bet.betAmount})

//                     </div>{" "}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Lay (Bet Against) Section */}
//           <div className="mt-2">
//             <div className="grid grid-cols-5 bg-white border-b border-gray-300">
//               <div className="px-1 col-span-2">Lay (Bet Against)</div>
//               <div className="px-1 text-center col-span-1">Odds</div>
//               <div className="px-1 text-center col-span-1">Stake</div>
//               <div className="px-1 text-center col-span-1">Liability</div>
//             </div>

//             {betsdata.lay.map((bet, index) => (
//               <div key={index} className="border-b border-[#dfa3b3]">
//                 <div className="grid grid-cols-5 text-[10px] bg-[#f3dce2] ">
//                   <div className="px-1  flex item-center col-span-2 gap-0.5">
//                     <p className="bg-[#dfa3b3] p-1 my-auto">Lay</p>
//                     <div className="flex flex-col">
//                       <span className="font-semibold text-[11px]">
//                         {bet.teamName}
//                       </span>
//                       <span className="text-gray-600">Match Odds</span>
//                     </div>
//                   </div>
//                   <div className="px-1 text-center self-center">
//                     {bet.xValue}
//                   </div>
//                   <div className="px-1 text-center self-center">
//                   {bet.betAmount}
                    
//                   </div>
//                   <div className="px-1 text-right self-center">
//                     {bet.betAmount} (-{bet.price})
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <nav></nav>
//       </div>
//     </div>
//   );
// };

// export default Betting;



import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getPendingBet } from "../redux/reducer/betReducer";

const Betting = () => {
  const dispatch = useDispatch();
  const [betsdata, setBetsdata] = useState({ back: [], lay: [] });
  
  // Animation State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const { eventName } = useSelector((state) => state.bet);

  const topWinners = [
    { id: 1, name: "Brandon1020", date: "24/12/2025", amount: "₹4736000.00", bgGradient: "linear-gradient(to right, #41295a, #2f0743)" },
    { id: 2, name: "Connor565", date: "01/01/2026", amount: "₹3203673.38", bgGradient: "linear-gradient(to right, #485563, #29323c)" },
    { id: 3, name: "Jaggu163", date: "09/12/2025", amount: "₹2452799.20", bgGradient: "linear-gradient(to right, #141e30, #243b55)" },
    { id: 4, name: "Kyle761", date: "25/01/2026", amount: "₹1702755.00", bgGradient: "linear-gradient(to right, #000000, #434343)" },
    { id: 5, name: "Patel 27", date: "08/11/2025", amount: "₹1572639.87", bgGradient: "linear-gradient(to right, #16222a, #3a6073)" },
    { id: 6, name: "Mike210", date: "02/12/2025", amount: "₹1297010.00", bgGradient: "linear-gradient(to right, #0f0c29, #302b63, #24243e)" },
  ];

  // Logic: Move the list up by one item height every 2.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % topWinners.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [isPaused, topWinners.length]);

  const handelBet = (event) => {
    const bets = eventName.filter((bet) => bet.eventName === event);
    setBetsdata({
      back: bets.filter((item) => item.otype === "back"),
      lay: bets.filter((item) => item.otype === "lay"),
    });
  };

  useEffect(() => {
    dispatch(getPendingBet());
  }, [dispatch]);

  // We double the list to ensure a smooth loop
  const extendedWinners = [...topWinners, ...topWinners];

  return (
    <div className="w-full md:w-[25%] sticky top-[110px] h-fit me-auto hidden md:block select-none">
      
      {/* Top Winner Players Section */}
      <div className="mb-4">
        <div className="rounded-t-md bg-black text-white px-4 py-2 border-b border-gray-800">
          <div className="text-[12px] font-bold uppercase tracking-wider">Top Winner Players</div>
        </div>
        
        {/* VIEWPORT: Shows only 2 items height (~132px) */}
        <div 
          className="bg-gray-900/40 p-1 rounded-b-md overflow-hidden h-[132px] relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* SCROLLING CONTAINER */}
          <div 
            className="flex flex-col gap-1.5 transition-transform duration-700 ease-in-out"
            style={{ 
              transform: `translateY(-${currentIndex * 66}px)` // 66px is the height of one card + gap
            }}
          >
            {extendedWinners.map((winner, idx) => (
              <div 
                key={`${winner.id}-${idx}`} 
                className="text-white rounded border border-white/10 border-dashed py-2 px-3 h-[60px] shrink-0"
                style={{ background: winner.bgGradient }}
              >
                <div className="text-[11px] font-bold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                      {winner.name.charAt(0)}
                    </div>
                    <span className="truncate max-w-[80px]">{winner.name}</span>
                  </div>
                  <span className="opacity-60 text-[9px]">{winner.date}</span>
                </div>
                <div className="text-[10px] mt-1 flex justify-between items-center">
                  <span className="opacity-80">Win:</span>
                  <span className="text-green-400 font-bold">{winner.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Open Bets Section --- */}
      <div className="w-full border border-gray-800 rounded-md overflow-hidden bg-white shadow-sm">
        <div className="p-2 bg-black text-white flex justify-between items-center">
          <h2 className="text-[12px] font-bold uppercase">Open Bets</h2>
        </div>
        
        <div className="p-1">
          <select
            onChange={(e) => handelBet(e.target.value)}
            className="w-full border border-gray-300 text-[11px] p-1.5 rounded bg-gray-50 outline-none"
          >
            <option value="">Select Market</option>
            {Array.isArray(eventName) && [...new Map(eventName.map(b => [b.eventName, b])).values()].map((bet) => (
                <option key={bet._id} value={bet?.eventName}>{bet?.eventName}</option>
            ))}
          </select>
        </div>

        <div className="w-full text-[9px]">
          <div className="flex bg-gray-100 font-bold border-y border-gray-200 py-1 px-2 text-blue-800 uppercase text-[8px]">
             Matched
          </div>

          {/* BACK SECTION */}
          <div className="grid grid-cols-5 bg-gray-50 py-1 px-1 font-bold border-b border-gray-200 uppercase text-[8px]">
            <div className="col-span-2">Back</div>
            <div className="text-center">Odds</div>
            <div className="text-center">Stake</div>
            <div className="text-right">Profit</div>
          </div>
          {betsdata.back.map((bet, i) => (
            <div key={i} className="grid grid-cols-5 bg-[#e3f2fd] border-b border-[#bbdefb] py-1.5 px-1 items-center">
              <div className="col-span-2 font-bold truncate">{bet.teamName}</div>
              <div className="text-center font-bold">{bet.xValue}</div>
              <div className="text-center">{bet.betAmount}</div>
              <div className="text-right text-green-700 font-bold">+{(bet.betAmount * (bet.xValue - 1)).toFixed(2)}</div>
            </div>
          ))}

          {/* LAY SECTION */}
          <div className="grid grid-cols-5 bg-gray-50 py-1 px-1 font-bold border-y border-gray-200 uppercase text-[8px]">
            <div className="col-span-2">Lay</div>
            <div className="text-center">Odds</div>
            <div className="text-center">Stake</div>
            <div className="text-right">Lib.</div>
          </div>
          {betsdata.lay.map((bet, i) => (
            <div key={i} className="grid grid-cols-5 bg-[#fce4ec] border-b border-[#f8bbd0] py-1.5 px-1 items-center">
              <div className="col-span-2 font-bold truncate">{bet.teamName}</div>
              <div className="text-center font-bold">{bet.xValue}</div>
              <div className="text-center">{bet.betAmount}</div>
              <div className="text-right text-red-700 font-bold">-{(bet.betAmount * (bet.xValue - 1)).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Betting;