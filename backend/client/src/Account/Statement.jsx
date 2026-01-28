import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getTransactionHistory } from "../redux/reducer/betReducer";

const Statement = () => {
  const dispatch = useDispatch();
  const { transHistory, loading, successMessage } = useSelector(
    (state) => state.bet
  );

  const currentDate = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(currentDate.getMonth() - 1);
  const formatDate = (date) => date.toISOString().split("T")[0]; // Format as YYYY-MM-DD

  const [selectedOption, setSelectedOption] = useState("LIVE DATA");
  const [selectedVoid, setSelectedVoid] = useState("");
  const [startDate, setStartDate] = useState(formatDate(oneMonthAgo));
  const [endDate, setEndDate] = useState(formatDate(currentDate));
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

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

  const fetchBets = () => {
    if (!startDate || !endDate) return;
    dispatch(getTransactionHistory({ startDate, endDate, page, limit }));
  };

  useEffect(() => {
    fetchBets();
  }, [page, limit]);

  return (
    <div className="mx-auto overflow-hidden relative text-sm">
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

      <div className="mt-4 overflow-auto">
        <div className="bg-blue-one text-white px-4 py-2 font-semibold w-full">
          Account Statement
        </div>
        <div className="flex items-center gap-1 my-2 font-[500]">
          <span className="">Show</span>
          <select
            className="border border-gray-300 px-2 py-1"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="">entries</span>
        </div>
        <table className="w-full border border-gray-300 overflow-x-scroll">
          <thead className="">
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-center">Date/Time</th>
              <th className="border px-4 py-2 text-center">Deposit</th>
              <th className="border px-4 py-2 text-center">Withdraw</th>
              <th className="border px-4 py-2 text-center">Balance</th>
              <th className="border px-4 py-2 text-center">Remark</th>
              <th className="border px-4 py-2 text-center">From / To</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="border px-4 py-2 text-center">
                  Loading data...
                </td>
              </tr>
            ) : transHistory && transHistory.length > 0 ? (
              transHistory.map((transaction, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="border px-4 py-2 text-center">
                    {new Date(transaction.createdAt).toLocaleString()}
                  </td>
                  <td
                    className={`border px-4 py-2 text-center ${transaction.deposite == 0 ? "text-red-500" : ""
                      }`}
                  >
                    ({transaction.deposite || 0})
                  </td>
                  <td
                    className={`border px-4 py-2 text-center ${transaction.withdrawl == 0 ? "text-red-500" : ""
                      }`}
                  >
                    ({transaction.withdrawl || 0})
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {transaction.amount}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {transaction.remark || "-"}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    Upline {transaction.from}({transaction.from}) --{" "}
                    {transaction.to}({transaction.to})
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="border px-4 py-2 text-center">
                  No data found!
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
    </div>
  );
};

export default Statement;
