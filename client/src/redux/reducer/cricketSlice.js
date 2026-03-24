import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../api";
// const api = axios.create({
//     // baseURL: "http://localhost:5000/api",
//     baseURL: "https://aura444.org/api",
// });

// Async thunk to fetch cricket data

export const fetchCricketData = createAsyncThunk(
  "cricket/fetchCricketData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/cricket/matches"); // Your backend API
      console.log("responce", response);


      return response.data.matches;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch matches"
      );
    }
  }
);





export const fetchCricketBatingData = createAsyncThunk(
  "cricket/fetchCricketBatingData",
  async (gameid, { rejectWithValue }) => {

    try {
      const response = await api.get(`/cricket/betting?gameid=${gameid}`); // Your backend API

      
      let data = response.data.data; 
      console.log("response.data.data",data); 
      

      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch matches"
      );
    }
  }
);

// Slice
const cricketSlice = createSlice({
  name: "cricket",
  initialState: {
    matches: [],
    battingData: [],
    loader: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCricketData.pending, (state) => {
        state.loader = true;
        state.error = null;
      })
      .addCase(fetchCricketData.fulfilled, (state, action) => {
        state.loader = false;
        state.matches = action.payload;

      })
      .addCase(fetchCricketData.rejected, (state, action) => {
        state.loader = false;
        state.error = action.payload;
      })
      .addCase(fetchCricketBatingData.pending, (state) => {
        state.loader = true;
        state.error = null;
      })
      .addCase(fetchCricketBatingData.fulfilled, (state, action) => {
        console.log("action.payload.data",action.payload.data);
        state.loader = false;
        
        state.battingData = action.payload.data;

      })
      .addCase(fetchCricketBatingData.rejected, (state, action) => {
        state.loader = false;
        state.error = action.payload;
      });
  },
});

export default cricketSlice.reducer;
