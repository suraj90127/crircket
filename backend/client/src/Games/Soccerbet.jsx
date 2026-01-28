import { useEffect, useRef, useState } from "react";

import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";

import { fetchSoccerBatingData } from "../redux/reducer/soccerSlice";


import Spinner2 from "../components/Spinner2";
import SoccerOdds from "./SoccerComponents/SoccerOdds";
import SoccerOver15 from "./SoccerComponents/SoccerOver15";
import SoccerOver5 from "./SoccerComponents/SoccerOver_5";
import SoccerOver25 from "./SoccerComponents/SoccerOver25";
import { useNavigate, useParams } from "react-router-dom";
import { getPendingBetAmo, messageClear } from "../redux/reducer/betReducer";
import { host } from "../redux/api";
export default function Soccerbet() {
  const [bettingData, setBettingData] = useState(null);
  // const location = useLocation();
  const dispatch = useDispatch();
  const { gameid } = useParams() || {};
  const { match } = useParams() || {};
  const hasCheckedRef = useRef(false);
  const navigate = useNavigate()


  const [loader, setLoader] = useState(false);

  const { loading, successMessage, errorMessage } = useSelector(
    (state) => state.bet
  );
  // const { loading } = useSelector((state) => state.bet);

  const { battingData } = useSelector((state) => state.soccer);


  let sharedSocket;

  useEffect(() => {
    if (!gameid) return;

    if (!sharedSocket || sharedSocket.readyState !== 1) {
      sharedSocket = new WebSocket(host);

      sharedSocket.onopen = () => {
        console.log("✅ Socket connected");
        sharedSocket.send(JSON.stringify({ type: "subscribe", gameid, apitype: "soccer" }));
      };

      sharedSocket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.gameid === gameid) {
            setBettingData(message.data);
          }
        } catch (e) {
          console.error("❌ Message error", e);
        }
      };

      sharedSocket.onerror = (err) => {
        console.error("WebSocket error:", err);
      };

      sharedSocket.onclose = () => {
        console.log("Socket closed");
      };
    } else {
      // Already connected, just send subscription
      sharedSocket.send(JSON.stringify({ type: "subscribe", gameid, apitype: "soccer" }));
    }

    return () => {
      // Optionally leave socket open for reuse
    };
  }, [gameid]);

  // console.log("object111111111111111", bettingData);



  useEffect(() => {
    // let intervalId;

    if (gameid) {
      dispatch(fetchSoccerBatingData(gameid)); // initial

      // intervalId = setInterval(() => {
      //   dispatch(fetchSoccerBatingData(gameid));
      // }, 2000);
    }

    // return () => {
    // clearInterval(intervalId);
    // };
  }, [gameid]);




  useEffect(() => {
    setBettingData(battingData);
  }, [battingData]);


  const matchOddsList = bettingData?.filter(
    (item) => item.mname === "MATCH_ODDS"
  ) || [];

  const matcUnder5List = bettingData?.filter(
    (item) => item.mname === "OVER_UNDER_05"
  ) || [];

  const matcUnder15List = bettingData?.filter(
    (item) => item.mname === "OVER_UNDER_15"
  ) || [];

  const matcUnder25List = bettingData?.filter(
    (item) => item.mname === "OVER_UNDER_25"
  ) || [];

  useEffect(() => {
    if (hasCheckedRef.current || !Array.isArray(bettingData) || bettingData.length === 0) return;

    const allSectionsEmpty = (
      [
        ...matchOddsList,
        ...matcUnder5List,
        ...matcUnder15List,
        ...matcUnder25List
      ]
    ).every(item => !Array.isArray(item.section) || item.section.length === 0);

    if (allSectionsEmpty) {
      hasCheckedRef.current = true;
      navigate("/soccer");
    }
  }, [bettingData]);




  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      // setSelectedRun(null);
      dispatch(messageClear());
    }

    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);

  useEffect(() => {
    dispatch(getPendingBetAmo(gameid));
  }, [dispatch]);


  // Inside your React functional component (e.g., in a file like MyComponent.jsx)

  return (
    <div className="relative">
      {loading ? (
        <div className="text-center  py-4 fixed top-52 left-[40%]">
          <Spinner2 />
        </div>
      ) : null}
      {loader ? (
        <div className="text-center py-4">
          <Spinner2 />
        </div>
      ) : (
        <div className="mx-auto text-[13px]">
          {/* odds match data */}
          <SoccerOdds
            matchOddsList={matchOddsList}
            gameid={gameid}
            match={match}
          />

          <SoccerOver5
            matcUnder5List={matcUnder5List}
            gameid={gameid}
            match={match}
          />
          {/* matcUnder15 match data */}
          <SoccerOver15
            matcUnder15List={matcUnder15List}
            gameid={gameid}
            match={match}
          />

          {/* matcUnder15 match data */}
          <SoccerOver25
            matcUnder25List={matcUnder25List}
            gameid={gameid}
            match={match}
          />
        </div>
      )}
    </div>
  );
}
