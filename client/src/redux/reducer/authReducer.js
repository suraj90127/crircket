import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";
import { jwtDecode } from "jwt-decode";

export const loginUser = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/user/login", userData, {
        withCredentials: true, // ✅ Allows sending and receiving cookies
      });

      const data = response.data;
      console.log(data, "user");

      // ✅ Store token in localStorage (Not recommended for auth security)
      if (data.token) {
        localStorage.setItem("auth", data.token);
      }

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Something went wrong" }
      );
    }
  }
);
export const addAdmin = createAsyncThunk(
  "user/create-admin",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/sub-admin/create", formData, {
        withCredentials: true,
      });
      const data = response.data;
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

export const getUser = createAsyncThunk(
  "user/get-user",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/get/user-details", {
        withCredentials: true,
      });
      const data = response.data;
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

export const changePasswordBySelf = createAsyncThunk(
  "user/changePasswordBySelf",
  async (data, { rejectWithValue }) => {
    console.log("Access denied, admin only", data);
    try {
      const response = await api.post("/change/password-self/user", data, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const passwordHistory = createAsyncThunk(
  "user/passwordHistory",
  async (_, { rejectWithValue }) => {
    // console.log("Access denied, admin only", data);
    try {
      const response = await api.get("/password/history", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getLoginHistory = createAsyncThunk(
  "creditRef/getUserLoginHistory",
  async (userId, { rejectWithValue }) => {
    // console.log("object", userId);
    try {
      const res = await api.get(`/get/user-login-history/${userId}`, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Fetch failed" }
      );
    }
  }
);

const decodeToken = (token) => {
  if (token) {
    const userInfo = jwtDecode(token);
    return userInfo;
  } else {
    return "";
  }
};

// Initial state
const initialState = {
  user: null,
  userInfo: decodeToken(localStorage.getItem("auth")) || null,
  loading: false,
  error: null,
  LoginData: [],
  singleadmin: null,
  useraddress: null,
  userDetail: null,
  passwordData: null,
  message: null,
};

// User slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
    user_reset: (state, _) => {
      state.userInfo = "";
    },
  },
  extraReducers: (builder) => {
    builder

      // Login user
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.userInfo = action.payload.data;
        console.log("User Info:", state.userInfo);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // add user
      .addCase(addAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(addAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get user by ID
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload.data;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(changePasswordBySelf.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(changePasswordBySelf.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.userInfo = action.payload.data;
        // state.errorMessage = null;
      })
      .addCase(changePasswordBySelf.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload.message;
      })
      .addCase(passwordHistory.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(passwordHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.passwordData = action.payload.data;
        // state.errorMessage = null;
      })
      .addCase(passwordHistory.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload.message;
      })
      .addCase(getLoginHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLoginHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.LoginData = action.payload.data;
      })
      .addCase(getLoginHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearError, messageClear, user_reset } = userSlice.actions;

export default userSlice.reducer;
