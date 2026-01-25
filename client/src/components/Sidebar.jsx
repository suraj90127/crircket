import { useState } from "react";
import {
  MdSportsCricket,
  MdCasino,
  MdSportsTennis,
  MdSportsSoccer,
  MdSportsScore,
  MdPets,
  MdSportsBasketball,
  MdAttachMoney,
} from "react-icons/md";
import { BiChevronRightSquare } from "react-icons/bi";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const AllSportsList = [
  { name: "Cricket", link: "/cricket", icon: MdSportsCricket },
  { name: "Casino", link: "/live-casino", icon: MdCasino },
  { name: "Tennis", link: "/tennis", icon: MdSportsTennis },
  { name: "Soccer", link: "/soccer", icon: MdSportsSoccer },
  { name: "Horse Racing", link: "/horse-racing", icon: MdSportsScore },
  { name: "Greyhound Racing", link: "/greyhound-racing", icon: MdPets },
  { name: "Basketball", link: "/basketball", icon: MdSportsBasketball },
  { name: "Lottery", link: "/lottery", icon: MdAttachMoney },
];

const Sidebar = () => {
  const { userInfo, loading } = useSelector((state) => state.auth);
  const [activeItem, setActiveItem] = useState(null);

  // console.log("locked game", userInfo?.gamelock)

  // Filter sports based on locked status
  const getLockedSports = () => {
    if (!userInfo?.gamelock) return AllSportsList;

    return AllSportsList.filter(sport => {
      const gameLock = userInfo.gamelock.find(
        game => game.game.toLowerCase() === sport.name.toLowerCase()
      );
      return gameLock?.lock === true;
    });
  };

  const lockedSports = getLockedSports();

  return (
    <div className="w-[20%] me-auto sticky top-[110px] h-fit hidden md:block">
      <div className="w-full">
        <div className="p-2 border-b border-blue-800 bg-blue flex items-center justify-between text-white">
          <HiOutlineDotsVertical className="text-[13px]" />
          <h2 className="text-[13px] font-semibold">Sports</h2>
        </div>

        <nav>
          <ul>
            {lockedSports.length > 0 ? (
              lockedSports.map((sport, index) => (
                <li key={index}>
                  <Link
                    to={sport.link}
                    onClick={() => setActiveItem(activeItem === sport.name ? null : sport.name)}
                    className={`w-full flex items-center justify-between p-2 text-[13px] text-blue transition-colors duration-200 border-b border-blue-800/30 ${activeItem === sport.name ? "" : ""
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span>{sport.name}</span>
                    </div>
                    <BiChevronRightSquare
                      className={`text-green transition-transform duration-200 size-4 ${activeItem === sport.name ? "rotate-90" : ""
                        }`}
                    />
                  </Link>
                </li>
              ))
            ) : (
              <li className="p-2 text-[13px] text-gray-500">
                No locked sports available
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;