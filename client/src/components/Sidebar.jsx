
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
  MdSportsCricket, 
  MdSportsSoccer, 
  MdSportsTennis, 
  MdCasino, 
  MdOutlineSportsEsports, 
  MdSportsKabaddi,
  MdOutlineHistoryEdu,
  MdOutlineLocalFireDepartment,
  MdMenu,
  MdClose,
  MdSportsBasketball
} from "react-icons/md";
import { IoMdHome, IoIosPlayCircle, IoIosArrowDown, IoMdChatbubbles } from "react-icons/io";
import { FaWhatsapp, FaInstagram, FaHorseHead, FaTelegram } from "react-icons/fa";
import { GiBoxingGlove } from "react-icons/gi";
import { BsShieldShaded } from "react-icons/bs";
import {
  
  MdLiveTv,
  MdWhatshot,
  MdStars,
  MdEmojiEvents,
  MdTableBar,
} from "react-icons/md";
import {
  FaGamepad,
  FaHeart,
  FaThLarge,
  FaTicketAlt,
} from "react-icons/fa";

const AllSportsList = [
  { name: "Home", link: "/", icon: IoMdHome, hasArrow: false, isHeader: true },
  { name: "In-Play", link: "/in-play", icon: IoIosPlayCircle, hasArrow: false, count: 13 },
  { name: "Cricket", link: "/cricket", icon: MdSportsCricket, hasArrow: false },
  { name: "Soccer", link: "/soccer", icon: MdSportsSoccer, hasArrow: false, count: 7 },
  { name: "Tennis", link: "/tennis", icon: MdSportsTennis, hasArrow: false, count: 1 },
  
  // { name: "Sports Book", link: "/sports-book", icon: BsShieldShaded, hasArrow: false },
  // { name: "Horse Racing", link: "/horse-racing", icon: FaHorseHead, hasArrow: false },
 
  // { name: "Int Casino", link: "/int-casino", icon: MdOutlineHistoryEdu, hasArrow: false },
  // { name: "Virtual", link: "/virtual", icon: MdOutlineSportsEsports, hasArrow: true },
  // { name: "Boxing", link: "/boxing", icon: GiBoxingGlove, hasArrow: true },
  // { name: "Basketball", link: "/basketball", icon: MdSportsBasketball, hasArrow: true, count: 5 },
  // { name: "Kabaddi", link: "/kabaddi", icon: MdSportsKabaddi, hasArrow: false },


  { name: "OriginalsGames", link: "/games/OriginalsGames", icon: FaGamepad, hasArrow: false },
  { name: "LiveCasino", link: "/games/liveCasino", icon: MdLiveTv, hasArrow: false },
  // { name: "Sexy", link: "/games/sexy", icon: FaHeart, hasArrow: false },
  { name: "Exclusivegame", link: "/games/Exclusivegame", icon: MdStars, hasArrow: false },
  { name: "Hotgame", link: "/games/Hotgame", icon: MdWhatshot, hasArrow: false },
  { name: "Toppicker", link: "/games/Toppicker", icon: MdEmojiEvents, hasArrow: false },
  { name: "GameShowdata", link: "/games/GameShowdata", icon: FaTicketAlt, hasArrow: false },
  { name: "TableGames", link: "/games/TableGames", icon: MdTableBar, hasArrow: false },
  { name: "SlotsGames", link: "/games/SlotsGames", icon: FaThLarge, hasArrow: false },
  { name: "BingoGames", link: "/games/BingoGames", icon: MdCasino, hasArrow: false },



  // { name: "WhatsApp", link: "https://wa.me/", icon: FaWhatsapp, hasArrow: false, color: "text-green-600", external: true },
  // { name: "Instagram", link: "https://instagram.com/", icon: FaInstagram, hasArrow: false, color: "text-pink-600", external: true },
  // { name: "Telegram", link: "https://t.me/", icon: FaTelegram, hasArrow: false, color: "text-blue-500", external: true },
  // { name: "Chat With us", link: "/support", icon: IoMdChatbubbles, hasArrow: false, badge: "Live" },


  
];

const Sidebar = ({ activeNavItem }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("Home");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    // First priority: activeNavItem from Navbar
    if (activeNavItem) {
      setActiveItem(activeNavItem);
    } 
    // Second priority: current route
    else {
      const path = location.pathname;
      const item = AllSportsList.find(item => 
        item.link === path || 
        (path.startsWith(item.link) && item.link !== "/")
      );
      if (item) {
        setActiveItem(item.name);
      }
    }
  }, [location, activeNavItem]);

  const handleExternalLink = (link) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const toggleExpand = (itemName) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  const getLockedSports = () => {
    if (!userInfo?.gamelock) return AllSportsList;
    return AllSportsList.filter(sport => {
        if (sport.isHeader || sport.external || sport.name === "Chat With us") return true;
        const gameLock = userInfo.gamelock.find(
          game => game.game.toLowerCase() === sport.name.toLowerCase()
        );
        return !gameLock || gameLock?.lock === true;
    });
  };

  const filteredItems = getLockedSports();

  const getSubItems = (parentName) => {
    // Example sub-items structure
    const subItemsMap = {
      "Cricket": [
        { name: "International", link: "/cricket/international" },
        { name: "Domestic", link: "/cricket/domestic" },
        { name: "Leagues", link: "/cricket/leagues" }
      ],
      "Soccer": [
        { name: "Premier League", link: "/soccer/premier-league" },
        { name: "Champions League", link: "/soccer/champions-league" },
        { name: "La Liga", link: "/soccer/la-liga" }
      ]
    };
    return subItemsMap[parentName] || [];
  };

  return (
    <>
      

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container - Sticky on desktop */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-40 h-screen bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out
        w-64 flex flex-col md:translate-x-0 md:h-[calc(100vh-5rem)]
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 md:hidden border-b border-gray-200 bg-black">
          <Link to="/" onClick={() => setIsMobileOpen(false)} className="flex items-baseline font-serif">
            <span className="text-xl font-bold text-[#c9a86a]">RED</span>
            <div className="flex flex-col items-center justify-center border border-[#c9a86a] px-0.5 mx-0.5 leading-none">
              <span className="text-[6px] text-[#c9a86a] font-bold">365</span>
            </div>
            <span className="text-xl font-bold text-[#c9a86a]">DY</span>
          </Link>
          <button onClick={() => setIsMobileOpen(false)} className="p-1 hover:bg-gray-800 rounded">
            <MdClose size={24} className="text-white" />
          </button>
        </div>

        {/* Navigation Content */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            {filteredItems.map((item, index) => {
              const hasSubItems = item.hasArrow ;
              const isExpanded = expandedItems[item.name];
              
              return (
                <li key={index} className={item.name === "Cricket" ? "mt-2 pt-2 border-t border-gray-100" : ""}>
                  {item.external ? (
                    <button
                      onClick={() => handleExternalLink(item.link)}
                      className="flex items-center justify-between w-full px-4 py-3 transition-all duration-200 group hover:bg-gray-50 text-left"
                    >
                      <div className="flex items-center gap-4">
                        <item.icon className={`text-xl ${item.color || "text-slate-600"}`} />
                        <span className="text-sm font-medium text-slate-700">{item.name}</span>
                      </div>
                    </button>
                  ) : (
                    <>
                      <Link
                        to={item.link}
                        onClick={(e) => {
                          if (hasSubItems) {
                            e.preventDefault();
                            toggleExpand(item.name);
                          } else {
                            setActiveItem(item.name);
                            setIsMobileOpen(false);
                          }
                        }}
                        className={`flex items-center justify-between px-4 py-3 transition-all duration-200 group
                          ${activeItem === item.name ? "bg-gray-100 text-black border-r-4 border-[#c9a86a]" : "text-slate-700 hover:bg-gray-50"}
                        `}
                      >
                        <div className="flex items-center gap-4">
                          <item.icon className={`text-xl ${item.color || (activeItem === item.name ? "text-black" : "text-slate-600 group-hover:text-slate-800")}`} />
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* {item.count && (
                            <span className="bg-[#E18786] text-white text-[10px] px-2 py-1 rounded font-bold">
                              {item.count}
                            </span>
                          )} */}
                          {item.badge && (
                            <span className="bg-green-500 text-white text-[10px] px-2 py-1 rounded font-bold animate-pulse">
                              {item.badge}
                            </span>
                          )}
                          {hasSubItems && (
                            <IoIosArrowDown className={`text-slate-400 text-sm transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                          )}
                        </div>
                      </Link>

                      {/* Sub-items */}
                      {/* {hasSubItems && isExpanded && (
                        <div className="pl-12 bg-gray-50">
                          {getSubItems(item.name).map((subItem, subIndex) => (
                            <Link
                              key={subIndex}
                              to={subItem.link}
                              onClick={() => setIsMobileOpen(false)}
                              className="block py-2 text-sm text-slate-600 hover:text-black hover:bg-gray-100 px-2"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )} */}
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info Footer (only when logged in) */}
        {userInfo && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-xs text-slate-600">
              <p className="font-semibold">Account ID: <span className="text-black">{userInfo?.userName || "N/A"}</span></p>
              <p className="mt-1">Balance: <span className="text-green-600 font-bold">₹{userInfo?.avbalance?.toFixed(2) || "0.00"}</span></p>
              <p className="text-red-500 text-[10px]">Exposure: ₹{userInfo?.exposure?.toFixed(2) || "0.00"}</p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;


