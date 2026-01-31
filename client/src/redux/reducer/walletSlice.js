import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

/* =========================
   CHECK WALLET BALANCE
========================= */
export const zilpayRecharge = createAsyncThunk(
  "auth/zilpay",
  async ({amount,type}, { rejectWithValue, fulfillWithValue }) => {
  
    try {
      const { data } = await api.post("/zilpay", {amount:amount,type:type} ,{
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
/* =========================
   ADD BANK ACCOUNT
========================= */
export const addBankAccount = createAsyncThunk(
  "wallet/addBank",
  async (bankData, { rejectWithValue }) => {
    try {
      console.log("Sending bankData 👉", bankData);
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
========================= */
export const requestWithdrawal = createAsyncThunk(
  "wallet/requestWithdrawal",
  async ({ amount, bankAccountId }, { rejectWithValue }) => {
    try {
      const res = await api.post(
        "/user/withdraw",  
        { amount, bankAccountId },
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
========================= */
export const getWithdrawalHistory = createAsyncThunk(
  "wallet/withdrawHistory",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const res = await api.get(
        "/user/withdraw-history?page=${page}&limit=${limit}",
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


export const getRechargeHistory = createAsyncThunk(
  "wallet/rechargeHistory",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const res = await api.get(
        `/user/recharge-history?page=${page}&limit=${limit}`, 
        { withCredentials: true }
      );
      console.log("Recharge History API Response:", res);
      return res.data;
    } catch (err) {
      console.error("Recharge History Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* =========================
   GET USER BANK DETAILS
========================= */
export const getUserBankDetails = createAsyncThunk(
  "wallet/getUserBankDetails",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/user/bank-details", {
        withCredentials: true,
      });

      // 🔍 Log the full response
      console.log("Bank Details Response 👉", res.data);

      return res.data;
    } catch (err) {
      console.error("Error fetching bank details 👉", err.response?.data || err.message);
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch bank details"
      );
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
    rechargeData: [],
   errorMessage: "",
    successMessage: "",
    loadingBalance: false,
    loadingBank: false,
    loadingWithdraw: false,
    loadingHistory: false,
    loadingBankDetails: false,

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
      

      /* ADD BANK */
      .addCase(addBankAccount.pending, (state) => {
        state.loadingBank = true;
      })
      .addCase(addBankAccount.fulfilled, (state, action) => {
        state.loadingBank = false;
        state.bankAccounts.unshift(action.payload.data);
        state.success = action.payload.message;
      })
      .addCase(addBankAccount.rejected, (state, action) => {
        state.loadingBank = false;
        state.error = action.payload;
      })

      /* WITHDRAW */
      .addCase(requestWithdrawal.pending, (state) => {
        state.loadingWithdraw = true;
      })
      .addCase(requestWithdrawal.fulfilled, (state, action) => {
        state.loadingWithdraw = false;
        state.withdrawals.unshift(action.payload.data);
        state.success = action.payload.message;
      })
      .addCase(requestWithdrawal.rejected, (state, action) => {
        state.loadingWithdraw = false;
        state.error = action.payload;
      })

      /* HISTORY */
      .addCase(getWithdrawalHistory.pending, (state) => {
        state.loadingHistory = true;
      })
      .addCase(getWithdrawalHistory.fulfilled, (state, action) => {
        state.loadingHistory = false;
        state.withdrawals = action.payload.data;
        state.pagination.total = action.payload.total;
        state.pagination.totalPages = action.payload.totalPages;
        state.pagination.currentPage = action.payload.currentPage;
      })
      .addCase(getWithdrawalHistory.rejected, (state, action) => {
        state.loadingHistory = false;
        state.error = action.payload;
      })
      /* HISTORY */
      .addCase(getRechargeHistory.pending, (state) => {
        state.loadingHistory = true;
      })
      .addCase(getRechargeHistory.fulfilled, (state, action) => {
        state.loadingHistory = false;
        state.rechargeData = action.payload.data;
        state.pagination.total = action.payload.total;
        state.pagination.totalPages = action.payload.totalPages;
        state.pagination.currentPage = action.payload.currentPage;
      })
      .addCase(getRechargeHistory.rejected, (state, action) => {
        state.loadingHistory = false;
        state.error = action.payload;
      })

      /* BANK DETAILS */
      .addCase(getUserBankDetails.pending, (state) => {
        state.loadingBankDetails = true;
      })
      .addCase(getUserBankDetails.fulfilled, (state, action) => {
  console.log("Redux action.payload 👉", action.payload); 
  state.loading = false;
  state.bankAccounts = action.payload.data || action.payload || [];
})
      .addCase(getUserBankDetails.rejected, (state, action) => {
        state.loadingBankDetails = false;
        state.error = action.payload;
      });
  },
});

export const { clearWalletState } = walletSlice.actions;
export default walletSlice.reducer;