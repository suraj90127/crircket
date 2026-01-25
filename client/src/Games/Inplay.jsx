import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTennisData } from "../redux/reducer/tennisSlice";
import { fetchCricketData } from "../redux/reducer/cricketSlice";
import { fetchSoccerData } from "../redux/reducer/soccerSlice";
import Games from "../components/Games";
import { Link, useNavigate } from "react-router-dom";

import { getUser } from "../redux/reducer/authReducer";
import PageFooter from "../components/PageFooter";

const Inplay = () => {
  const [activeTab, setActiveTab] = useState("In-Play");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Fetch tennis data from Redux store

  const { userInfo } = useSelector((state) => state.auth);
  const {
    data: tennisData,
    loading: tennisLoading,
    error: tennisError,
  } = useSelector((state) => state.tennis);

  // Fetch cricket data from Redux store
  const {
    matches: cricketData,
    loading: cricketLoading,
    error: cricketError,
  } = useSelector((state) => state.cricket);

  // Fetch soccer data from Redux store
  const {
    soccerData: soccerData,
    loading: soccerLoading,
    error: soccerError,
  } = useSelector((state) => state.soccer);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchTennisData());
    dispatch(fetchCricketData());
    dispatch(fetchSoccerData());
  }, [dispatch]);


  // Debug soccer data
  useEffect(() => {
    console.log("Soccer Data in Inplay:", tennisData);
  }, [soccerData]);


  // Filter Tennis In-Play games
  const inPlayTennisGames = (tennisData || []).filter((game) => game.iplay);
  // today
  const todayTennisGames = (tennisData || []).filter((game) => {
    const gameDate = new Date(game.date).toLocaleDateString();
    const todayDate = new Date().toLocaleDateString();
    return gameDate === todayDate && game.iplay !== true;
  });
  // tommorow
  const tommrowPlayTennisGames = (tennisData || []).filter((game) => {
    const gameDate = new Date(game.date).toLocaleDateString();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toLocaleDateString();
    return gameDate === tomorrowDate && game.iplay !== true;
  });

  // Filter Cricket In-Play games
  const inPlayCricketGames = (cricketData || []).filter((game) => game.inplay);
  const todayPlayCricketGames = (cricketData || []).filter((game) => {
    const gameDate = new Date(game.date).toLocaleDateString();
    const todayDate = new Date().toLocaleDateString();
    return gameDate === todayDate && game.iplay !== true;
  })
  const tommrowPlayCricketGames = (cricketData || []).filter((game) => {
    const gameDate = new Date(game.date).toLocaleDateString();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toLocaleDateString();
    return gameDate === tomorrowDate && game.iplay !== true;
  })

  // Filter Soccer In-Play games
  const inPlaySoccerGames = (soccerData || []).filter((game) => game.iplay);
  const todayPlaySoccerGames = (soccerData || []).filter((game) => {
    const gameDate = new Date(game.date).toLocaleDateString();
    const todayDate = new Date().toLocaleDateString();
    return gameDate === todayDate && game.iplay !== true;
  })
  const tommrowPlaySoccerGames = (soccerData || []).filter((game) => {
    const gameDate = new Date(game.date).toLocaleDateString();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toLocaleDateString();
    return gameDate === tomorrowDate && game.iplay !== true;
  })

  const isGameOn = (index) => {
    return !userInfo || userInfo?.gamelock?.[index]?.lock;
  };

  const buildGameCategory = (name, dataArray, link, index) => {
    if (!isGameOn(index)) return null;
    return {
      name,
      games: dataArray.map((game) => ({
        gameid: game.id,
        teams: game.match,
        status: "",
        link,
        odds: game.odds,
        date: game.date,
      })),
    };
  };

  const categories = {
    "In-Play": (() => {
      if (!userInfo) {
        return [
          {
            name: "Tennis",
            games: inPlayTennisGames.map((game) => ({
              gameid: game.id,
              teams: game.match,
              status: "In-Play",
              link: "/tennis-bet",
              odds: game.odds,
            })),
          },
          {
            name: "Cricket",
            games: inPlayCricketGames.map((game) => ({
              gameid: game.id,
              teams: game.match,
              status: "In-Play",
              link: "/cricket-bet",
              odds: game.odds,
            })),
          },
          {
            name: "Soccer",
            games: inPlaySoccerGames.map((game) => ({
              gameid: game.id,
              teams: game.match,
              status: "In-Play",
              link: "/soccerbet",
              odds: game.odds,
            })),
          },
        ];
      }

      const arr = [];
      if (isGameOn(1)) {
        arr.push({
          name: "Tennis",
          games: inPlayTennisGames.map((game) => ({
            gameid: game.id,
            teams: game.match,
            status: "In-Play",
            link: "/tennis-bet",
            odds: game.odds,
          })),
        });
      }
      if (isGameOn(0)) {
        arr.push({
          name: "Cricket",
          games: inPlayCricketGames.map((game) => ({
            gameid: game.id,
            teams: game.match,
            status: "In-Play",
            link: "/cricket-bet",
            odds: game.odds,
          })),
        });
      }
      if (isGameOn(2)) {
        arr.push({
          name: "Soccer",
          games: inPlaySoccerGames.map((game) => ({
            gameid: game.id,
            teams: game.match,
            status: "In-Play",
            link: "/soccerbet",
            odds: game.odds,
          })),
        });
      }
      return arr;
    })(),

    "Today": [
      buildGameCategory("Tennis", todayTennisGames, "/tennis-bet", 1),
      buildGameCategory("Cricket", todayPlayCricketGames, "/cricket-bet", 0),
      buildGameCategory("Soccer", todayPlaySoccerGames, "/soccerbet", 2),
    ].filter(Boolean), // remove null entries

    "Tommorow": [
      buildGameCategory("Tennis", tommrowPlayTennisGames, "/tennis-bet", 1),
      buildGameCategory("Cricket", tommrowPlayCricketGames, "/cricket-bet", 0),
      buildGameCategory("Soccer", tommrowPlaySoccerGames, "/soccerbet", 2),
    ].filter(Boolean), // remove null entries
  };



  const handleClick = (bet, link, match, id) => {
    if (bet) {
      navigate(`${link}/${match}/${id}`);
    } else {
      navigate(`/tennis`);
    }
  };


  useEffect(() => {
    dispatch(getUser())
  }, [dispatch])


  return (
    <div className="mx-auto">
      {/* Tab Section */}
      <div className="grid grid-cols-3 md:grid-cols-6 mb-4 font-semibold text-sm mt-2">
        {Object.keys(categories).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1 text-[13px] font-semibold ${activeTab === tab
              ? "bg-[#3b5160] text-white"
              : "bg-gray-200 border-[1px] border-[#3b5160]"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Category Section */}
      {categories[activeTab]?.map((category, index) => (
        <div key={index} className="mb-4">
          {/* Category Header */}
          <div className="bg-color text-white text-sm font-bold px-4 py-0.5">
            {category.name}
          </div>
          <div className="hidden md:grid grid-cols-12 bg-[#dddcd6] text-gray-700 font-bold text-center text-[13px]">
            <div className="col-span-6 text-left pl-2"></div>
            <div className="col-span-2 text-center">1</div>
            <div className="col-span-2 text-center">X</div>
            <div className="col-span-2 text-center">2</div>
          </div>

          {/* Games List */}
          <div className="bg-gray-100 p-3">
            {cricketLoading || tennisLoading || soccerLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : cricketError || tennisError || soccerError ? (
              <div className="text-center text-red-500 py-4">
                {cricketError || tennisError || soccerError}
              </div>
            ) : (
              category.games.map((game, i) => (
                <div key={i}>
                  {/* {console.log("game", game)} */}
                  <div
                    onClick={() =>
                      handleClick(game, game.link, game.teams, game.gameid)
                    }
                    // to={game.link}
                    // state={{ gameid: game.gameid }} // Pass the gameid here
                    className="grid grid-cols-6 md:grid-cols-12 gap-1 items-center border-b last:border-none border-gray-300 py-0.5 text-[13px]"
                  >
                    <span className="flex-1 col-span-5 text-[#2789ce] font-semibold">
                      {game.teams}     <span className="text-gray-400 ml-1 font-[400] text-xs">
                        {game.date}
                      </span>
                    </span>
                    <span className="col-span-1 font-medium text-gray-600">
                      {game.status === "In-Play" ? (
                        <span
                          className="font-bold text-green-600"
                          style={{
                            animation: "blink 1s infinite alternate",
                          }}
                        >
                          In-Play
                        </span>
                      ) : (
                        game.status
                      )}
                    </span>

                    {game.odds.slice(0, 3).map((odd, j) => (
                      <div key={j} className="md:flex hidden col-span-2 px-2">
                        <div className="w-[50%]">
                          <div className="bg-[#72bbef] text-center py-0.5 cursor-pointer">
                            {odd.home}
                          </div>
                        </div>
                        <div className="w-[50%]">
                          <div className="bg-[#faa9ba] text-center py-0.5 cursor-pointer">
                            {odd.away}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ))}

   <Games />
      <PageFooter />
    </div>
  );
};

export default Inplay;
