// redux/slices/gameSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import  api  from "./../api";

/* ===========================
   CHECK GAME BALANCE
=========================== */
export const checkGameBalance = createAsyncThunk(
  "game/checkBalance",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/game/balance/transfer", {
        withCredentials: true,
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Balance check failed" }
      );
    }
  }
);

/* ===========================
   TRANSFER BALANCE
=========================== */
export const transferFromGame = createAsyncThunk(
  "game/transferFromGame",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.post(
        "/game/transfer-balance",
        {},
        { withCredentials: true }
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Balance transfer failed" }
      );
    }
  }
);

/* ===========================
   LAUNCH GAME
=========================== */
export const launchGame = createAsyncThunk(
  "game/launchGame",
  async ({ gameId }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(
        "/game/get/game",
        { gameId },
        { withCredentials: true }
      );
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Game launch failed"
      );
    }
  }
);

/* ===========================
   GET ALL GAMES
=========================== */
export const getAllGames = createAsyncThunk(
  "game/getAllGames",
  async ({ page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/game/get/all-game?page=${page}&size=${limit}`,
        { withCredentials: true }
      );
      return data.data || [];
    } catch {
      return rejectWithValue("Failed to fetch games");
    }
  }
);

/* ===========================
   SLICE
=========================== */
const gameSlice = createSlice({
  name: "game",
  initialState: {
    allGames: [],
    filteredGames: [],
    gameUrl: null,

    gameBalance: 0,
    balanceMessage: "",
    balanceStatus: null,

    isBalanceLoading: false,
    launchLoading: false,
    transferLoading: false,
    loading: false,

    error: null,
    launchError: null,
    transferError: null,
  },
  reducers: {
    resetGameState: (state) => {
      state.gameUrl = null;
      state.launchError = null;
      state.transferError = null;
      state.error = null;
      state.balanceMessage = "";
      state.balanceStatus = null;
    },
    clearGameUrl: (state) => {
      state.gameUrl = null;
      state.launchLoading = false;
      state.launchError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* CHECK BALANCE */
      .addCase(checkGameBalance.pending, (state) => {
        state.isBalanceLoading = true;
        state.balanceMessage = "";
      })
      .addCase(checkGameBalance.fulfilled, (state, action) => {
        state.isBalanceLoading = false;
        state.gameBalance = action.payload.balance || 0;
        state.balanceStatus = action.payload.status;
        state.balanceMessage = action.payload.message;
      })
      .addCase(checkGameBalance.rejected, (state, action) => {
        state.isBalanceLoading = false;
        state.balanceStatus = false;
        state.balanceMessage =
          action.payload?.message || "Balance check failed";
      })

      /* TRANSFER */
      .addCase(transferFromGame.pending, (state) => {
        state.transferLoading = true;
      })
      .addCase(transferFromGame.fulfilled, (state, action) => {
        state.transferLoading = false;
        state.gameBalance = 0;
        state.balanceStatus = true;
        state.balanceMessage = action.payload.message;
      })
      .addCase(transferFromGame.rejected, (state, action) => {
        state.transferLoading = false;
        state.balanceStatus = false;
        state.balanceMessage =
          action.payload?.message || "Transfer failed";
      })

      /* LAUNCH GAME */
      .addCase(launchGame.pending, (state) => {
        state.launchLoading = true;
      })
      .addCase(launchGame.fulfilled, (state, action) => {
        state.launchLoading = false;
        state.gameUrl = action.payload.launch_view_url;
      })
      .addCase(launchGame.rejected, (state, action) => {
        state.launchLoading = false;
        state.launchError = action.payload;
      })

      /* GET ALL GAMES */
      .addCase(getAllGames.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllGames.fulfilled, (state, action) => {
        state.loading = false;
        state.allGames = action.payload;
        state.filteredGames = action.payload;
      })
      .addCase(getAllGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearGameUrl, resetGameState } = gameSlice.actions;
export default gameSlice.reducer;