
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
      {/* Container with a sophisticated dark-gaming gradient */}
      <div className="bg-[#1a0514] rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-[#3d0e2d]">
        
        {/* Header Section */}
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#2d0b23] to-[#1a0514] border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1.5 bg-gradient-to-b from-[#ff2ead] to-[#82175d] rounded-full shadow-[0_0_10px_#ff2ead]"></div>
            <h2 className="text-white font-extrabold uppercase tracking-widest text-sm md:text-base">
              Game Providers
            </h2>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => scroll("left")}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#3d0e2d] hover:bg-[#ff2ead] text-white transition-all duration-300 border border-white/10 active:scale-90"
            >
              <FaChevronLeft size={16} />
            </button>
            <button 
              onClick={() => scroll("right")}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#3d0e2d] hover:bg-[#ff2ead] text-white transition-all duration-300 border border-white/10 active:scale-90"
            >
              <FaChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* 2-Row Horizontal Grid */}
        <div 
          ref={scrollRef}
          className="grid grid-rows-2 grid-flow-col gap-4 p-5 overflow-x-auto no-scrollbar snap-x snap-mandatory"
          style={{ gridAutoColumns: 'min-content' }}
        >
          {providerarray
            .filter((item) => item.img)
            .map((item) => (
              <div
                key={item.id}
                onClick={() => item.path && navigate(`/games/${item.path}`)}
                className="group relative w-32 md:w-44 aspect-[2/1] rounded-xl cursor-pointer 
                           bg-gradient-to-br from-[#2d0b23] to-[#12030d] snap-start
                           flex items-center justify-center p-3
                           border border-white/5 hover:border-[#ff2ead]/40
                           transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,46,173,0.15)]"
              >
                {/* Background Glow on Hover */}
                <div className="absolute inset-0 rounded-xl bg-[#ff2ead] opacity-0 group-hover:opacity-5 blur-xl transition-opacity duration-300"></div>
                
                <img
                  src={item.img}
                  alt={item.game_name}
                  className="max-w-full max-h-[80%] object-contain z-10 
                             brightness-90 group-hover:brightness-110 group-hover:scale-110 transition-all duration-300"
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}



