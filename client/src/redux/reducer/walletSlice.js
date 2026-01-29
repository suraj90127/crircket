import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

/* =========================
   CHECK WALLET BALANCE
========================= */
export const checkBalance = createAsyncThunk(
  "wallet/checkBalance",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/wallet/balance", {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* =========================
   ADD BANK ACCOUNT
   POST /user/addbank
========================= */
export const addBankAccount = createAsyncThunk(
  "wallet/addBank",
  async (bankData, { rejectWithValue }) => {
    try {
      // 🔍 FRONTEND CONFIRMATION
      console.log("Sending bankData 👉", bankData);

      // ✅ ENUM FIX (VERY IMPORTANT)
    //   const payload = {
    //     ...bankData,
    //     accountType: bankData.accountType?.toLowerCase(), // "bank"
    //   };

      const res = await api.post("/user/addbank", bankData, {
        withCredentials: true,
      });

      return res.data;
    } catch (err) {
      console.error("Add bank error 👉", err.response?.data || err.message);

      return rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);

/* =========================
   WITHDRAW REQUEST
   POST /wallet/withdraw
========================= */
export const requestWithdrawal = createAsyncThunk(
  "wallet/requestWithdrawal",
  async ({ amount, paymentMethod, accountDetails }, { rejectWithValue }) => {
    try {
      const res = await api.post(
        "/wallet/withdraw",
        { amount, paymentMethod, accountDetails },
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* =========================
   WITHDRAWAL HISTORY
   GET /wallet/withdrawals
========================= */
export const getWithdrawalHistory = createAsyncThunk(
  "wallet/withdrawHistory",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const res = await api.get(
        `/wallet/withdrawals?page=${page}&limit=${limit}`,
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* =========================
   SLICE
========================= */
const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    balance: 0,
    bankAccounts: [],
    withdrawals: [],

    loading: false,
    error: null,
    success: null,

    pagination: {
      total: 0,
      totalPages: 0,
      currentPage: 1,
    },
  },

  reducers: {
    clearWalletState: (state) => {
      state.error = null;
      state.success = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* BALANCE */
      .addCase(checkBalance.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.balance;
      })
      .addCase(checkBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ADD BANK */
      .addCase(addBankAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(addBankAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.bankAccounts.unshift(action.payload.data);
        state.success = action.payload.message;
      })
      .addCase(addBankAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* WITHDRAW */
      .addCase(requestWithdrawal.pending, (state) => {
        state.loading = true;
      })
      .addCase(requestWithdrawal.fulfilled, (state, action) => {
        state.loading = false;
        state.withdrawals.unshift(action.payload.data);
        state.success = action.payload.message;
      })
      .addCase(requestWithdrawal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* HISTORY */
      .addCase(getWithdrawalHistory.fulfilled, (state, action) => {
        state.withdrawals = action.payload.data;
        state.pagination.total = action.payload.total;
        state.pagination.totalPages = action.payload.totalPages;
        state.pagination.currentPage = action.payload.currentPage;
      });
  },
});

export const { clearWalletState } = walletSlice.actions;
export default walletSlice.reducer;