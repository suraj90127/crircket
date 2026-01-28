import { BiSearch } from "react-icons/bi"
import { useState } from "react"
import Casino from "../Games/Casino";
import Virtual from "../Games/Virtual";
import Evolution from "../Games/Evolution";
import Ezugi from "../Games/Ezugi";
import TvBet from "../Games/TvBet";
import BetGame from "../Games/BetGame";
import Platingame from "../Games/Platingame";


export default function Games() {
    const [activeTab, setActiveTab] = useState("ALL");
  // Main navigation categories
  const mainCategories = ["ALL", "OUR CASINO", "OUR VIRTUAL", "EVOLUTION", "EZUGI", "TVBET", "BETGAME", "PLATINGAMES"]


  // Game data
 

  return (
    <div className="w-full relative">
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("../assets/casinobg.4aafd0d08a047031.png")`,
        }}
      />

      {/* Main navigation */}
      <div className="relative  text-[13px]">
      <nav className="flex bg-color font-bold border-b border-emerald-600 w-full overflow-auto">
  {mainCategories.map((category, index) => (
    <button
      key={index}
      className={`px-4 py-3 hover:bg-emerald-600 transition-colors whitespace-nowrap ${activeTab === category ? " text-white" : " text-black"}`}
      onClick={() => setActiveTab(category)}
    >
      {category}
    </button>
  ))}
</nav>
      </div>
      {activeTab == "ALL" && (
        <Casino />
      )}
      {activeTab == "OUR CASINO" && (
        <Casino />
      )}
      {activeTab == "OUR VIRTUAL" && (
        <Virtual />
      )}
      {activeTab == "EVOLUTION" && (
        <Evolution />
      )}
      {activeTab == "EZUGI" && (
        <Ezugi />
      )}
      {activeTab == "TVBET" && (
        <TvBet />
      )}
      {activeTab == "BETGAME" && (
        <BetGame />
      )}
      {activeTab == "PLATINGAMES" && (
        <Platingame />
      )}
    </div>
  )
}

