import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import betReducer from "./reducer/betReducer";
import cricketReducer from "./reducer/cricketSlice";
import tennisReducer from "./reducer/tennisSlice";
import soccerReducer from "./reducer/soccerSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    cricket: cricketReducer,
    tennis: tennisReducer,
    soccer: soccerReducer,
    bet: betReducer,
  },
});
