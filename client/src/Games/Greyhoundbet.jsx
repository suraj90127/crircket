import { useState } from "react";
import { IoIosInformationCircleOutline } from "react-icons/io";

const bettingData = [
  {
    team: "Adelaide United",
    odds: [1.29, 1.3, 1.31, 1.33, 1.34, 1.35],
    amounts: [9100, 9500, 5400, 3500, 6500, 3500],
  },
  {
    team: "Macarthur FC",
    odds: [13, 13.5, 14, 14.5, 15, 15.5],
    amounts: [396.89, 243.13, 234.98, 102.42, 299.51, 807.28],
  },
  {
    team: "The Draw",
    odds: [5.4, 5.5, 5.6, 5.8, 6, 6.2],
    amounts: [151.58, 1100, 437.18, 284.88, 246.84, 1400],
  },
];

export default function Greyhoundbet() {
  const [selectedRun, setSelectedRun] = useState(null);
  const [betOdds, setBetOdds] = useState(1.29);
  const [betAmount, setBetAmount] = useState(0);

  return (
    <div className="mx-auto text-[13px]">
      <div className="flex justify-between items-center rounded-t-md">
        <span className="font-bold bg-blue p-2 px-4 rounded-tr-3xl text-white flex items-center gap-1">A4 492m <IoIosInformationCircleOutline className="size-5" /></span>
        <div>Matched <span className="font-bold">€ 204.7K</span></div>
      </div>
      <div className="grid grid-cols-7 text-center border-b border-gray-300">
        <div className="col-span-3"></div>
        <div className="bg-[#72bbef] text-slate-800 p-1 col-span-2 md:col-span-1 font-bold md:rounded-t-2xl">Back</div>
        <div className="bg-[#faa9ba] text-slate-800 p-1 col-span-2 md:col-span-1 font-bold md:rounded-t-2xl">Lay</div>
        <div className="bg-[#bed5d8] text-[#2789ce] p-1 rounded-lg col-span-2 hidden md:block">Min/Max 100-100000</div>
      </div>
      {bettingData.map(({ team, odds, amounts }, index) => (
        <div key={index}>
          <div
            className="grid grid-cols-7 text-center border-b border-gray-300 cursor-pointer hover:bg-gray-200"
            onClick={() => setSelectedRun(index)}
          >
            <div className="col-span-3 md:col-span-1 p-1 font-bold text-left pl-4">{team}</div>
            {odds.map((odd, i) => (
              <div key={i} className={`p-1 col-span-2 md:col-span-1 ${i === 2 ? "bg-[#72bbef]" : i === 3 ? "bg-[#faa9ba]" : "bg-gray-100  md:block hidden"}`}>
                <div className="font-bold">{odd}</div>
                <div className="text-gray-800">{amounts[i]}</div>
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
                    onClick={() => setBetOdds((prev) => (prev > 1 ? prev - 0.1 : prev))}
                  >
                    -
                  </button>
                  <span className="mx-3">{betOdds.toFixed(2)}</span>
                  <button
                    className="bg-gray-300 px-3 py-1 h-full"
                    onClick={() => setBetOdds((prev) => prev + 0.1)}
                  >
                    +
                  </button>
                </div>

                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  placeholder="Enter Bet Amount"
                  className="w-full bg-white text-black p-2 col-span-2 md:col-span-1"
                />

                <button className="bg-blue text-white px-3 py-1 col-span-2 md:col-span-1 rounded-sm">
                  Place Bet
                </button>
              </div>

              <div className="grid grid-cols-5 md:grid-cols-8 gap-2 mt-2">
                {[100, 200, 500, 1000, 2000, 3000, 5000, 10000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setBetAmount(amt)}
                    className="bg-white px-3 py-2 rounded-sm border border-black col-span-1"
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
  );
}
