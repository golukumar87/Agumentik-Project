import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api/axios.js";

const savedUser = localStorage.getItem("productivity_user");
const savedToken = localStorage.getItem("productivity_token");

export const registerUser = createAsyncThunk("auth/register", async (payload, thunkApi) => {
  try {
    const { data } = await api.post("/auth/register", payload);
    return data;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message || "Registration failed");
  }
});

export const loginUser = createAsyncThunk("auth/login", async (payload, thunkApi) => {
  try {
    const { data } = await api.post("/auth/login", payload);
    return data;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: savedUser ? JSON.parse(savedUser) : null,
    token: savedToken || null,
    loading: false,
    error: null
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("productivity_user");
      localStorage.removeItem("productivity_token");
    },
    clearAuthError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type === registerUser.pending.type || action.type === loginUser.pending.type,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type === registerUser.fulfilled.type || action.type === loginUser.fulfilled.type,
        (state, action) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          localStorage.setItem("productivity_user", JSON.stringify(action.payload.user));
          localStorage.setItem("productivity_token", action.payload.token);
        }
      )
      .addMatcher(
        (action) => action.type === registerUser.rejected.type || action.type === loginUser.rejected.type,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  }
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
