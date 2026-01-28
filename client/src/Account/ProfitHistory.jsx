import { use, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProLoss } from "../redux/reducer/betReducer";

const ProfitHistory = () => {
    const params = useParams();
    const {state} = useLocation();
  const { proLossHistory, loading, successMessage, errorMessage } = useSelector(
    (state) => state.bet
  );

  console.log(params, state)

  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log("proLossHistory", proLossHistory);
  useEffect(() => {
    dispatch(getProLoss({ limit: 100, eventName: params.id, gameName: state.gameName, marketName: state.marketName, page: 1 }));
  }, [dispatch]);


  return (
    <div className="mx-auto overflow-hidden relative text-sm">

      {/* Sports Table (Hidden if an event is selected) */}
      
      <div className="mt-4 overflow-auto">
          <div className="bg-blue-one text-white px-4 py-2 font-semibold w-full">Profit / Loss</div>
        <div className="font-semibold overflow-auto">
          {/* <div className="bg-gray-200 text-black px-4 py-2 font-semibold w-full flex justify-between">
            <span>{selectedSport} - Events</span>
            <button
              onClick={() => setSelectedSport(null)}
              className="text-sm text-red-500 underline"
            >
              Back to Sports
            </button>
          </div> */}
          
      {loading && (
        <div className="mt-4 p-4 text-center">
          <p>Loading data...</p>
        </div>
      )}
      {!loading && (
          <table className="w-full border border-gray-200">
            <thead>
              <tr className="bg-[#e0e6e6]">
                <th className="border border-gray-400 px-4 py-2 text-center">Sports Name</th>
                <th className="border border-gray-400 px-4 py-2 text-center">Event Name</th>
                <th className="border border-gray-400 px-4 py-2 text-center">Market Name</th>
                <th className="border border-gray-400 px-4 py-2 text-center">Selection Name</th>
                <th className="border border-gray-400 px-4 py-2 text-center">Bet Type</th>
                <th className="border border-gray-400 px-4 py-2 text-center">User price</th>
                <th className="border border-gray-400 px-4 py-2 text-center">Amount</th>
                <th className="border border-gray-400 px-4 py-2 text-center">Profit/Loss</th>
                <th className="border border-gray-400 px-4 py-2 text-center">Place Date</th>
                <th className="border border-gray-400 px-4 py-2 text-center">Match Date</th>
              </tr>
            </thead>
            <tbody>
              {proLossHistory?.map((event, i) => (
                  <tr key={i} className="font-[500]">
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {event.gameName}
                    </td>
                    <td className="border border-gray-300 px-4 py-2text-center">
                     <Link >{event.eventName}</Link> 
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center "> <Link> {event.marketName}</Link></td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{event.teamName}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center ">{event.otype}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center ">{event.xValue}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center ">{event.betAmount}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center "><span className={`${event.status === 1 ? "text-red-500" : "text-red-500"}`}>{event.betAmount}</span>/<span className={`${event.status === 1 ? "text-green-500" : "text-red-500"}`}>{event.price}</span></td>
                    <td className="border border-gray-300 px-4 py-2 text-center ">  {new Date(event.date).toISOString()}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center ">  {new Date(event.date).toISOString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
      )}
        </div>
      
      </div>
    </div>
  );
};

export default ProfitHistory;
