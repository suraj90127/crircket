
import { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { providerarray } from "../Data/GamesData";

export default function GameProviders() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      // Scroll by 80% of the visible width
      const scrollAmount = direction === "left" ? -clientWidth * 0.8 : clientWidth * 0.8;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
  <div className="my-6 px-2 lg:px-4">
    <div className="relative rounded-xl overflow-hidden bg-black border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.6)]">

      {/* Header */}
      <div className="flex justify-between items-center px-4 md:px-6 py-4 border-b border-white/10 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-7 rounded-full bg-gradient-to-b from-[#ff2ead] to-[#82175d] shadow-[0_0_12px_#ff2ead]" />
          <h2 className="text-white font-black tracking-widest uppercase text-sm md:text-base">
            Game Providers
          </h2>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center
                       bg-white/10 hover:bg-[#ff2ead] text-white
                       transition-all duration-300 active:scale-90"
          >
            <FaChevronLeft size={14} />
          </button>

          <button
            onClick={() => scroll("right")}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center
                       bg-white/10 hover:bg-[#ff2ead] text-white
                       transition-all duration-300 active:scale-90"
          >
            <FaChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Providers Slider */}
      <div
        ref={scrollRef}
        className="grid grid-rows-2 grid-flow-col gap-4 p-4 md:p-6 overflow-x-auto no-scrollbar snap-x snap-mandatory"
        style={{ gridAutoColumns: "min-content" }}
      >
        {providerarray
          .filter((item) => item.img)
          .map((item) => (
            <div
              key={item.id}
              onClick={() => item.path && navigate(`/games/${item.path}`)}
              className="group relative w-32 md:w-44 aspect-[2/1] snap-start cursor-pointer
                         rounded-2xl bg-gradient-to-br from-[#2d0b23] to-[#12030d]
                         border border-white/10 flex items-center justify-center p-3
                         transition-all duration-300
                         hover:border-[#ff2ead]/60
                         hover:shadow-[0_0_25px_rgba(255,46,173,0.25)]"
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 rounded-2xl bg-[#ff2ead] opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300" />

              <img
                src={item.img}
                alt={item.game_name}
                className="relative z-10 max-w-full max-h-[75%] object-contain
                           brightness-90 group-hover:brightness-110
                           group-hover:scale-110 transition-all duration-300"
              />
            </div>
          ))}
      </div>
    </div>
  </div>
);
}



