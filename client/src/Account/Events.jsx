import { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProLoss } from "../redux/reducer/betReducer";

const Events = () => {
  const params = useParams();
  const { proLossHistory, loading, successMessage, errorMessage } = useSelector(
    (state) => state.bet
  );
  const [selectedSport, setSelectedSport] = useState(null);

  console.log(params.id)

  const filterData = proLossHistory.filter((item) => item.gameName === params.id);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const uniqueGames = proLossHistory.filter(
    (item, index, self) =>
      index === self.findIndex(t => t.gameName === params.id)
  );

  useEffect(() => {
    dispatch(getProLoss({ limit: 100, gameName: params.id, page: 1 }));
  }, [dispatch]);


  return (
    <div className="mx-auto overflow-hidden relative text-sm">

      {loading && (
        <div className="mt-4 p-4 text-center">
          <p>Loading data...</p>
          {/* You can add a spinner here if you want */}
        </div>
      )}

      {!loading && (
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
            <table className="w-full border border-gray-300">
              <thead>
                <tr className="bg-[#e0e6e6]">
                  <th className="border border-gray-300 px-4 py-2 text-center">Sports Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Event Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Profit/Loss</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Commission</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Total P&L</th>
                </tr>
              </thead>
              <tbody>
                {proLossHistory?.map((event, i) => (
                   

                  <tr key={i}>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {event.gameName}
                   
                    </td>
                    <td className="border border-gray-300 px-4 py-2text-center">
                      <Link to={`/event-matches/${event.eventName}`} className=" text-blue-800 ">{event.eventName}</Link>
                    </td>
                    <td className={`border border-gray-300 px-4 py-2 text-center ${event.myProfit > 0 ? "text-green-500" : "text-red-500"}`}>{event.myProfit}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">0</td>
                    <td className="border border-gray-300 px-4 py-2 text-center ">{event.myProfit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}
    </div>
  );
};

export default Events;
