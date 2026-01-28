import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
const Spinner = ({ path = "" }) => {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevValue) => --prevValue);
    }, 1000);
    if (userInfo) {
      navigate({
        state: location.pathname,
      });
    }
    count === 0 &&
      navigate(`/${path}`, {
        state: location.pathname,
      });
    return () => clearInterval(interval);
  }, [count, navigate, location, path]);
  return (
    <>
      {count !== 0 ? (
        /* From Uiverse.io by clarencedion */
        <div className="max-w-8xl mx-auto overflow-hidden flex justify-center items-center">
        <div className="loader">
        <p className="transform -rotate-90 absolute">Loading ...</p>
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
            <defs>
              <filter id="goo">
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="6"
                  result="blur"
                ></feGaussianBlur>
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                  result="goo"
                ></feColorMatrix>
                <feBlend in="SourceGraphic" in2="goo"></feBlend>
              </filter>
            </defs>
          </svg>
        </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default Spinner;
