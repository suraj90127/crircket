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
        "/user/withdraw", // ✅ Changed from /wallet/withdraw to /user/withdraw
        { 
          amount, 
          paymentMethod: "Bank Transfer" // ✅ Added paymentMethod as required by backend
        },
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      console.error("Withdrawal error 👉", err.response?.data || err.message);
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
        `/user/withdraw-history?page=${page}&limit=${limit}`, // ✅ Changed to correct endpoint
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      console.error("History error 👉", err.response?.data || err.message);
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
   DELETE BANK ACCOUNT
========================= */
export const deleteBankAccount = createAsyncThunk(
  "wallet/deleteBank",
  async (bankId, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/user/bank/${bankId}`, {
        withCredentials: true,
      });
      return { id: bankId, message: res.data.message };
    } catch (err) {
      console.error("Delete bank error 👉", err.response?.data || err.message);
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete bank account"
      );
    }
  }
);

/* =========================
   SET DEFAULT BANK ACCOUNT
========================= */
export const setDefaultBankAccount = createAsyncThunk(
  "wallet/setDefaultBank",
  async (bankId, { rejectWithValue }) => {
    try {
      const res = await api.put(
        `/user/bank/${bankId}/default`,
        {},
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      console.error("Set default error 👉", err.response?.data || err.message);
      return rejectWithValue(
        err.response?.data?.message || "Failed to set default bank account"
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
   errorMessage: "",
    successMessage: "",
    loadingBalance: false,
    loadingBank: false,
    loadingWithdraw: false,
    loadingHistory: false,
    loadingBankDetails: false,
    loadingDeleteBank: false,
    loadingSetDefault: false,

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
      messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
    setDepositHistory: (state, action) => {
      // For managing deposit history locally
      if (action.payload) {
        state.depositHistory = action.payload;
      }
    },
    resetWithdrawForm: (state) => {
      // Can be used to reset withdrawal form states
      state.loadingWithdraw = false;
    },
  },

  extraReducers: (builder) => {
    builder
      /* ========== CHECK BALANCE ========== */
       .addCase(zilpayRecharge.pending, (state) => {
        state.loader = true;
      })
      .addCase(zilpayRecharge.rejected, (state, { payload }) => {
        // console.log('register rejected payload:', payload); // Log payload
        state.errorMessage = payload?.errorMessage || "An error occurred";
        state.loader = false;
      })
      .addCase(zilpayRecharge.fulfilled, (state, { payload }) => {
     state.successMessage = payload.message;
        state.loader = false;
      })
      /* ========== ADD BANK ACCOUNT ========== */
      .addCase(addBankAccount.pending, (state) => {
        state.loadingBank = true;
        state.error = null;
      })
      .addCase(addBankAccount.fulfilled, (state, action) => {
        state.loadingBank = false;
        if (action.payload.data) {
          // Add new bank account to the beginning of the array
          state.bankAccounts.unshift(action.payload.data);
        }
        state.success = action.payload.message || "Bank account added successfully";
      })
      .addCase(addBankAccount.rejected, (state, action) => {
        state.loadingBank = false;
        state.error = action.payload || "Failed to add bank account";
      })

      /* ========== REQUEST WITHDRAWAL ========== */
      .addCase(requestWithdrawal.pending, (state) => {
        state.loadingWithdraw = true;
        state.error = null;
      })
      .addCase(requestWithdrawal.fulfilled, (state, action) => {
        state.loadingWithdraw = false;
        // Add new withdrawal to the beginning of withdrawals array
        if (action.payload.data) {
          state.withdrawals.unshift({
            ...action.payload.data,
            status: "pending",
            date: new Date().toLocaleString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          });
        }
        // Update balance (deduct withdrawal amount)
        if (action.payload.data?.amount) {
          state.balance -= action.payload.data.amount;
        }
        state.success = action.payload.message || "Withdrawal request submitted successfully";
      })
      .addCase(requestWithdrawal.rejected, (state, action) => {
        state.loadingWithdraw = false;
        state.error = action.payload || "Failed to process withdrawal";
      })

      /* ========== GET WITHDRAWAL HISTORY ========== */
      .addCase(getWithdrawalHistory.pending, (state) => {
        state.loadingHistory = true;
        state.error = null;
      })
      .addCase(getWithdrawalHistory.fulfilled, (state, action) => {
        state.loadingHistory = false;
        state.withdrawals = action.payload.data || [];
        state.pagination = {
          total: action.payload.total || 0,
          totalPages: action.payload.totalPages || 0,
          currentPage: action.payload.currentPage || 1,
        };
        state.success = action.payload.message || "History fetched successfully";
      })
      .addCase(getWithdrawalHistory.rejected, (state, action) => {
        state.loadingHistory = false;
        state.error = action.payload || "Failed to fetch withdrawal history";
      })

      /* ========== GET USER BANK DETAILS ========== */
      .addCase(getUserBankDetails.pending, (state) => {
        state.loadingBankDetails = true;
        state.error = null;
      })
      // getUserBankDetails.fulfilled में
.addCase(getUserBankDetails.fulfilled, (state, action) => {
  state.loadingBankDetails = false;
  
  // Handle response format
  if (action.payload.success && action.payload.data) {
    // Backend से data array आ रहा है
    state.bankAccounts = Array.isArray(action.payload.data) 
      ? action.payload.data 
      : [action.payload.data];
    
    // Ensure each bank account has both id and _id for compatibility
    state.bankAccounts = state.bankAccounts.map(account => ({
      ...account,
      id: account._id || account.id, // Ensure id field exists
    }));
  }
  
  state.success = action.payload.message || "Bank details fetched successfully";
})
      .addCase(getUserBankDetails.rejected, (state, action) => {
        state.loadingBankDetails = false;
        state.error = action.payload || "Failed to fetch bank details";
      })

      /* ========== DELETE BANK ACCOUNT ========== */
      .addCase(deleteBankAccount.pending, (state) => {
        state.loadingDeleteBank = true;
        state.error = null;
      })
      .addCase(deleteBankAccount.fulfilled, (state, action) => {
        state.loadingDeleteBank = false;
        // Remove the deleted bank account from the array
        state.bankAccounts = state.bankAccounts.filter(
          account => account.id !== action.payload.id && 
                     account._id !== action.payload.id
        );
        state.success = action.payload.message || "Bank account deleted successfully";
      })
      .addCase(deleteBankAccount.rejected, (state, action) => {
        state.loadingDeleteBank = false;
        state.error = action.payload || "Failed to delete bank account";
      })

      /* ========== SET DEFAULT BANK ACCOUNT ========== */
      .addCase(setDefaultBankAccount.pending, (state) => {
        state.loadingSetDefault = true;
        state.error = null;
      })
      .addCase(setDefaultBankAccount.fulfilled, (state, action) => {
        state.loadingSetDefault = false;
        // Update all bank accounts: set isDefault to false for all, then true for the selected one
        state.bankAccounts = state.bankAccounts.map(account => ({
          ...account,
          isDefault: account.id === action.payload.data?.id || 
                     account._id === action.payload.data?.id
        }));
        state.success = action.payload.message || "Default bank account updated successfully";
      })
      .addCase(setDefaultBankAccount.rejected, (state, action) => {
        state.loadingSetDefault = false;
        state.error = action.payload || "Failed to set default bank account";
      });
  },
});

export const {messageClear, clearWalletState, setDepositHistory, resetWithdrawForm } = walletSlice.actions;

// Selectors for easier state access
// export const selectBalance = (state) => state.wallet.balance;
// export const selectBankAccounts = (state) => state.wallet.bankAccounts;
// export const selectWithdrawals = (state) => state.wallet.withdrawals;
// export const selectLoading = (state) => ({
//   balance: state.wallet.loadingBalance,
//   bank: state.wallet.loadingBank,
//   withdraw: state.wallet.loadingWithdraw,
//   history: state.wallet.loadingHistory,
//   bankDetails: state.wallet.loadingBankDetails,
//   deleteBank: state.wallet.loadingDeleteBank,
//   setDefault: state.wallet.loadingSetDefault,
// });
// export const selectError = (state) => state.wallet.error;
// export const selectSuccess = (state) => state.wallet.success;
// export const selectPagination = (state) => state.wallet.pagination;

export default walletSlice.reducer;