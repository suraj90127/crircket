import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// import axios from "axios";
import api from "../api"; // Adjust the import based on your project structure

// const api = axios.create({
//     // baseURL: "http://localhost:5000/api",
//     baseURL: "https://aura444.org/api",
// });

export const fetchTennisData = createAsyncThunk(
  "tennis/fetchTennisData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/tennis"); // Your backend API

      console.log("response", response);

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch matches"
      );
    }
  }
);

export const fetchTannisBatingData = createAsyncThunk(
  "cricket/fetchTannisBatingData",
  async (gameid, { rejectWithValue }) => {
    try {
      const response = await api.get(`/tannis/betting?gameid=${gameid}`); // Your backend API
      // console.log("response", response.data);

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch matches"
      );
    }
  }
);

// Create the slice
const tennisSlice = createSlice({
  name: "tennis",
  initialState: {
    data: [],
    battingData: [],
    loading: false,
    tesnnisError: null,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTennisData.pending, (state) => {
        state.loading = true;
        state.tesnnisError = null;
      })
      .addCase(fetchTennisData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchTennisData.rejected, (state, action) => {
        state.loading = false;
        state.tesnnisError = action.error.message;
      })
      .addCase(fetchTannisBatingData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTannisBatingData.fulfilled, (state, action) => {
        state.loading = false;
        state.battingData = action.payload.data;
      })
      .addCase(fetchTannisBatingData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default tennisSlice.reducer;
