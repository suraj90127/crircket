// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getBetHistory } from "../redux/reducer/betReducer";
// // import { getBetHistory } from "../../redux/thunks/betThunks";

// const Bethistory = () => {
//   const dispatch = useDispatch();
//   const { betHistory, loading, successMessage } = useSelector(
//     (state) => state.bet
//   );
//   const currentDate = new Date();
//   const oneMonthAgo = new Date();
//   oneMonthAgo.setMonth(currentDate.getMonth() - 1);
//   const formatDate = (date) => date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
//   const [startDate, setStartDate] = useState(formatDate(oneMonthAgo));
//   const [endDate, setEndDate] = useState(formatDate(currentDate));
//   const [page, setPage] = useState(1);
//   const [selectedOption, setSelectedOption] = useState("LIVE DATA");
//   const [selectedGame, setSelectedGame] = useState("");
//   const [selectedVoid, setSelectedVoid] = useState("unsettle");
//   const [pages, setPages] = useState(10);

//   useEffect(() => {
//     const currentDate = new Date();
//     const twoDaysAgo = new Date();
//     twoDaysAgo.setDate(currentDate.getDate() - 1);

//     const oneMonthAgo = new Date();
//     oneMonthAgo.setMonth(currentDate.getMonth() - 1);
//     const fiveMonthAgo = new Date();
//     fiveMonthAgo.setMonth(currentDate.getMonth() - 12);

//     if (selectedOption === "LIVE DATA") {
//       setStartDate(formatDate(currentDate));
//       setEndDate(formatDate(currentDate));
//     } else if (selectedOption === "BACKUP DATA") {
//       setStartDate(formatDate(oneMonthAgo));
//       setEndDate(formatDate(twoDaysAgo));
//     } else if (selectedOption === "OLD DATA") {
//       setStartDate(formatDate(fiveMonthAgo));
//       setEndDate(formatDate(currentDate));
//     }
//   }, [selectedOption]);
//   const handleOptionChange = (event) => {
//     setSelectedOption(event.target.value);
//   };

//   const fetchBets = () => {
//     if (!startDate || !endDate) return;
//     dispatch(getBetHistory({ startDate, endDate, page, selectedGame, selectedVoid, limit: pages }));
//   };

//   useEffect(() => {
//     if (startDate && endDate) fetchBets();
//   }, [page, startDate, endDate, selectedGame, selectedVoid, pages]);

//   useEffect(() => {
//     if (pages) fetchBets();
//   }, [pages]);

//   return (
//     <div className="mx-auto overflow-hidden relative text-sm">
//       <div className="p-2 grid grid-cols-3 gap-2 items-center border">
//         <select
//           value={selectedOption}
//           onChange={handleOptionChange}
//           className="border p-2 bg-white col-span-1"
//         >
//           <option>LIVE DATA</option>
//           <option>BACKUP DATA</option>
//           <option>OLD DATA</option>
//         </select>
//         <select
//           value={selectedGame}
//           onChange={(e) => setSelectedGame(e.target.value)}
//           className="border p-2 bg-white col-span-1"
//         >
//           <option value="">All</option>
//           <option value="Cricket Game">Cricket</option>
//           <option value="Tennis Game">Tennis</option>
//           <option value="Soccer Game">Soccer</option>
//           <option value="Casino Game">Casino</option>
//           <option value="Horse Racing Game">Horse Racing</option>
//           <option value="Greyhound Racing Game">Greyhound Racing</option>
//           <option value="Basket Ball Game">Basket Ball</option>
//           <option value="Lottery Game">Lottery</option>
//         </select>
//         <select
//           value={selectedVoid}
//           onChange={(e) => setSelectedVoid(e.target.value)}
//           className="border p-2 bg-white col-span-1">
//           <option value="" disabled>Bet Type</option>
//           <option value="settel">Settel</option>
//           <option value="void">Void</option>
//           <option value="unsettle">Unsettle</option>
//         </select>
//         <input
//           type="date"
//           className="border p-2 bg-white col-span-1"
//           value={startDate}
//           onChange={(e) => setStartDate(e.target.value)}
//           max={new Date().toISOString().split("T")[0]}


//         />
//         <input
//           type="date"
//           className="border p-2 bg-white col-span-1"
//           value={endDate}
//           onChange={(e) => setEndDate(e.target.value)}
//           max={new Date().toISOString().split("T")[0]}
//         />
//         <button
//           onClick={fetchBets}
//           className="bg-blue text-white px-4 py-2 col-span-1"
//         >
//           Get Bet History
//         </button>
//       </div>

//       <div className="mt-4 overflow-auto">
//         <div className="bg-blue-one text-white px-4 py-2 font-semibold w-full">
//           Bet History
//         </div>
//         <div className="flex items-center gap-1 my-2 font-[500]">
//           <span className="">Show</span>
//           <select
//             className="border border-gray-300 px-2 py-1"
//             value={pages}
//             onChange={(e) => setPages(e.target.value)}
//           >
//             <option value={10}>10</option>
//             <option value={25}>25</option>
//             <option value={50}>50</option>
//             <option value={100}>100</option>
//           </select>
//           <span className="">entries</span>
//         </div>
//         <table className="w-full border border-gray-300 overflow-x-scroll">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border px-4 py-2 text-center">Sports</th>
//               <th className="border px-4 py-2 text-center">Event</th>
//               <th className="border px-4 py-2 text-center">Market</th>
//               <th className="border px-4 py-2 text-center">Selection</th>
//               <th className="border px-4 py-2 text-center">Type</th>
//               <th className="border px-4 py-2 text-center">Odds</th>
//               <th className="border px-4 py-2 text-center">Stake</th>
//               <th className="border px-4 py-2 text-center">Place Time</th>
//               <th className="border px-4 py-2 text-center">Match Time</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan="9" className="text-center py-4">
//                   Loading...
//                 </td>
//               </tr>
//             ) : betHistory?.length ? (
//               betHistory.map((bet, i) => (
//                 <tr key={i}>
//                   <td className="border px-2 py-1 text-center">
//                     {bet.gameName}
//                   </td>
//                   <td className="border px-2 py-1 text-center">
//                     {bet.eventName}
//                   </td>
//                   <td className="border px-2 py-1 text-center">
//                     {bet.marketName}
//                   </td>
//                   <td className="border px-2 py-1 text-center">
//                     {bet.teamName}
//                   </td>
//                   <td className="border px-2 py-1 text-center">{bet.otype}</td>
//                   <td className="border px-2 py-1 text-center">{bet.xValue}</td>
//                   {/* <td className="border px-2 py-1 text-center">{bet.price}</td> */}
//                   <td className="border px-2 py-1 text-center">
//   {/* {bet.otype === "lay" ? bet.betAmount : bet.price} */}
//                 {bet.betAmount}
// </td>
//                   <td className="border px-2 py-1 text-center">
//                     {new Date(bet.createdAt).toLocaleString()}
//                   </td>
//                   <td className="border px-2 py-1 text-center">
//                     {new Date(bet.date).toLocaleDateString()}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="9" className="text-center py-4">
//                   No data!
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>

//         {/* Pagination Controls */}
//         <div className="flex justify-center gap-4 mt-4">
//           <button
//             disabled={page <= 1}
//             onClick={() => setPage((p) => p - 1)}
//             className="bg-gray-200 px-3 py-1 disabled:opacity-50"
//           >
//             Previous
//           </button>
//           <span className="px-4 py-1">Page {page}</span>
//           <button
//             onClick={() => setPage((p) => p + 1)}
//             className="bg-gray-200 px-3 py-1"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Bethistory;
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBetHistory } from "../redux/reducer/betReducer";
// import { getBetHistory } from "../../redux/thunks/betThunks";

const Bethistory = () => {
  const dispatch = useDispatch();
  const { betHistory, loading, successMessage } = useSelector(
    (state) => state.bet
  );
  const currentDate = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(currentDate.getMonth() - 1);
  const formatDate = (date) => date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  const [startDate, setStartDate] = useState(formatDate(oneMonthAgo));
  const [endDate, setEndDate] = useState(formatDate(currentDate));
  const [page, setPage] = useState(1);
  const [selectedOption, setSelectedOption] = useState("LIVE DATA");
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedVoid, setSelectedVoid] = useState("unsettle");
  const [pages, setPages] = useState(10);

  useEffect(() => {
    const currentDate = new Date();
    const oneDayAgo = new Date();
    oneDayAgo.setDate(currentDate.getDate() - 1);

    const fourMonthsAgo = new Date();
    fourMonthsAgo.setMonth(currentDate.getMonth() - 4);
    
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

    if (selectedOption === "LIVE DATA") {
      // Live data: only current day
      setStartDate(formatDate(currentDate));
      setEndDate(formatDate(currentDate));
    } else if (selectedOption === "BACKUP DATA") {
      // Backup data: 4 months ago to yesterday
      setStartDate(formatDate(fourMonthsAgo));
      setEndDate(formatDate(oneDayAgo));
    } else if (selectedOption === "OLD DATA") {
      // Old data: 1 year ago to current date
      setStartDate(formatDate(oneYearAgo));
      setEndDate(formatDate(currentDate));
    }
  }, [selectedOption]);
  
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const fetchBets = () => {
    if (!startDate || !endDate) return;
    dispatch(getBetHistory({ startDate, endDate, page, selectedGame, selectedVoid, limit: pages }));
  };

  useEffect(() => {
    if (startDate && endDate) fetchBets();
  }, [page, startDate, endDate, selectedGame, selectedVoid, pages]);

  useEffect(() => {
    if (pages) fetchBets();
  }, [pages]);

  return (
    <div className="mx-auto overflow-hidden relative text-sm">
      <div className="p-2 grid grid-cols-3 gap-2 items-center border">
        <select
          value={selectedOption}
          onChange={handleOptionChange}
          className="border p-2 bg-white col-span-1"
        >
          <option>LIVE DATA</option>
          <option>BACKUP DATA</option>
          <option>OLD DATA</option>
        </select>
        <select
          value={selectedGame}
          onChange={(e) => setSelectedGame(e.target.value)}
          className="border p-2 bg-white col-span-1"
        >
          <option value="">All</option>
          <option value="Cricket Game">Cricket</option>
          <option value="Tennis Game">Tennis</option>
          <option value="Soccer Game">Soccer</option>
          <option value="Casino Game">Casino</option>
          <option value="Horse Racing Game">Horse Racing</option>
          <option value="Greyhound Racing Game">Greyhound Racing</option>
          <option value="Basket Ball Game">Basket Ball</option>
          <option value="Lottery Game">Lottery</option>
        </select>
        <select
          value={selectedVoid}
          onChange={(e) => setSelectedVoid(e.target.value)}
          className="border p-2 bg-white col-span-1">
          <option value="" disabled>Bet Type</option>
          <option value="settel">Settel</option>
          <option value="void">Void</option>
          <option value="unsettle">Unsettle</option>
        </select>
        <input
          type="date"
          className="border p-2 bg-white col-span-1"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          min={selectedOption === "LIVE DATA" ? formatDate(new Date()) : 
               selectedOption === "BACKUP DATA" ? formatDate(new Date(new Date().setMonth(new Date().getMonth() - 4))) :
               formatDate(new Date(new Date().setFullYear(new Date().getFullYear() - 1)))}
          max={selectedOption === "LIVE DATA" ? formatDate(new Date()) : 
               selectedOption === "BACKUP DATA" ? formatDate(new Date(new Date().setDate(new Date().getDate() - 1))) :
               formatDate(new Date())}
        />
        <input
          type="date"
          className="border p-2 bg-white col-span-1"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          min={startDate}
          max={selectedOption === "LIVE DATA" ? formatDate(new Date()) : 
               selectedOption === "BACKUP DATA" ? formatDate(new Date(new Date().setDate(new Date().getDate() - 1))) :
               formatDate(new Date())}
        />
        <button
          onClick={fetchBets}
          className="bg-blue text-white px-4 py-2 col-span-1"
        >
          Get Bet History
        </button>
      </div>

      <div className="mt-4 overflow-auto">
        <div className="bg-blue-one text-white px-4 py-2 font-semibold w-full">
          Bet History
        </div>
        <div className="flex items-center gap-1 my-2 font-[500]">
          <span className="">Show</span>
          <select
            className="border border-gray-300 px-2 py-1"
            value={pages}
            onChange={(e) => setPages(e.target.value)}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="">entries</span>
        </div>
        <table className="w-full border border-gray-300 overflow-x-scroll">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-center">Sports</th>
              <th className="border px-4 py-2 text-center">Event</th>
              <th className="border px-4 py-2 text-center">Market</th>
              <th className="border px-4 py-2 text-center">Selection</th>
              <th className="border px-4 py-2 text-center">Type</th>
              <th className="border px-4 py-2 text-center">Odds</th>
              <th className="border px-4 py-2 text-center">Stake</th>
              <th className="border px-4 py-2 text-center">Place Time</th>
              <th className="border px-4 py-2 text-center">Match Time</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : betHistory?.length ? (
              betHistory.map((bet, i) => (
                <tr key={i}>
                  <td className="border px-2 py-1 text-center">
                    {bet.gameName}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {bet.eventName}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {bet.marketName}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {bet.teamName}
                  </td>
                  <td className="border px-2 py-1 text-center">{bet.otype}</td>
                  <td className="border px-2 py-1 text-center">{bet.xValue}</td>
                  <td className="border px-2 py-1 text-center">
                    {bet.betAmount}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {new Date(bet.createdAt).toLocaleString()}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {new Date(bet.date).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-4">
                  No data!
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="bg-gray-200 px-3 py-1 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-1">Page {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            className="bg-gray-200 px-3 py-1"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bethistory;