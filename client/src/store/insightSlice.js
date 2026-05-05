import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api/axios.js";

const emptyInsights = {
  totals: {
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0
  },
  activity: {
    dailyActivityCount: 0,
    completedToday: 0
  },
  categoryDistribution: [],
  completedByUser: [],
  recentActivities: [],
  productivityInsights: {
    completedTodayText: "You completed 0 tasks today",
    mostActiveCategory: "No category yet"
  }
};

export const fetchInsights = createAsyncThunk("insights/fetch", async (_, thunkApi) => {
  try {
    const { data } = await api.get("/insights");
    return data;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message || "Unable to load insights");
  }
});

const insightSlice = createSlice({
  name: "insights",
  initialState: {
    data: emptyInsights,
    loading: false,
    error: null,
    lastUpdated: null
  },
  reducers: {
    setInsights(state, action) {
      state.data = action.payload || emptyInsights;
      state.lastUpdated = new Date().toISOString();
      state.error = null;
    },
    resetInsights(state) {
      state.data = emptyInsights;
      state.loading = false;
      state.error = null;
      state.lastUpdated = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInsights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInsights.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchInsights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetInsights, setInsights } = insightSlice.actions;
export default insightSlice.reducer;
