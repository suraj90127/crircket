import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getProLoss } from "../redux/reducer/betReducer";

const ProfitLoss = () => {
  const { proLossHistory, loading, successMessage, errorMessage } = useSelector(
    (state) => state.bet
  );
  console.log(proLossHistory, 'loss')
  const currentDate = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(currentDate.getMonth() - 1);
  const formatDate = (date) => date.toISOString().split("T")[0]; // Format as YYYY-MM-DD

  const [pages, setPages] = useState(10);
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState(formatDate(oneMonthAgo));
  const [endDate, setEndDate] = useState(formatDate(currentDate));
  const [selectedOption, setSelectedOption] = useState("LIVE DATA");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const currentDate = new Date();
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(currentDate.getDate() - 1);

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(currentDate.getMonth() - 1);
    const fiveMonthAgo = new Date();
    fiveMonthAgo.setMonth(currentDate.getMonth() - 12);

    if (selectedOption === "LIVE DATA") {
      setStartDate(formatDate(currentDate));
      setEndDate(formatDate(currentDate));
    } else if (selectedOption === "BACKUP DATA") {
      setStartDate(formatDate(oneMonthAgo));
      setEndDate(formatDate(twoDaysAgo));
    } else if (selectedOption === "OLD DATA") {
      setStartDate(formatDate(fiveMonthAgo));
      setEndDate(formatDate(currentDate));
    }
  }, [selectedOption]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleDateChange = (e, isStartDate) => {
    const date = e.target.value;
    if (isStartDate) {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  useEffect(() => {
    dispatch(getProLoss({ startDate, endDate, limit: pages, page }));
  }, [dispatch, pages, page]);

  const fetchBets = () => {
    if (!startDate || !endDate) return;
    dispatch(getProLoss({ startDate, endDate, limit: pages, page }));
  };

  return (
    <div className="mx-auto overflow-hidden relative text-sm">
      {/* Filters */}
      <div className="p-2 grid grid-cols-3 gap-1 items-center justify-between border overflow-hidden">
        <select
          value={selectedOption}
          onChange={handleOptionChange}
          className="border p-2 bg-white col-span-1"
        >
          <option>LIVE DATA</option>
          <option>BACKUP DATA</option>
          <option>OLD DATA</option>
        </select>
        <input
          type="date"
          value={startDate}
          onChange={(e) => handleDateChange(e, true)}
          className="border p-2 bg-white col-span-1"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => handleDateChange(e, false)}
          className="border p-2 bg-white col-span-1"
        />
        <button
          onClick={fetchBets}
          className="bg-blue text-white px-4 py-2 col-span-1"
          disabled={loading}
        >
          {loading ? "Loading..." : "Get Statement"}
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="mt-4 p-4 text-center">
          <p>Loading data...</p>
          {/* You can add a spinner here if you want */}
        </div>
      )}

      {/* Content when not loading */}
      {!loading && (
        <div className="mt-4 overflow-auto">
          <div className="bg-blue-one text-white px-4 py-2 font-semibold w-full">
            Profit / Loss
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
          <table className="w-full border border-gray-300 font-semibold">
            <thead>
              <tr className="bg-[#e0e6e6]">
                <th className="border border-gray-300 px-4 py-2 text-center">Sport Name</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Profit/Loss</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Commission</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Total P&L</th>
              </tr>
            </thead>
            <tbody>
              {proLossHistory?.length > 0 ? (
                proLossHistory?.map((sport, i) => (
                  <tr key={i} className="cursor-pointer">
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <Link to={`/event/${sport.gameName}`} className="text-blue-800">
                        {sport.gameName}
                      </Link>
                    </td>
                    <td className={`border border-gray-300 px-4 py-2 text-center ${sport.myProfit > 0 ? "text-green-500" : "text-red-500"}`}>
                      {sport?.myProfit}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      0
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {sport?.myProfit}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="border border-gray-300 px-4 py-2 text-center">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
      )}
    </div>
  );
};

export default ProfitLoss;
