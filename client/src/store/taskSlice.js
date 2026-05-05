import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api/axios.js";

export const fetchTasks = createAsyncThunk("tasks/fetch", async (_, thunkApi) => {
  try {
    const { data } = await api.get("/tasks");
    return data;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message || "Unable to load tasks");
  }
});

export const createTask = createAsyncThunk("tasks/create", async (payload, thunkApi) => {
  try {
    const { data } = await api.post("/tasks", payload);
    return data;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message || "Unable to create task");
  }
});

export const updateTask = createAsyncThunk("tasks/update", async ({ id, updates }, thunkApi) => {
  try {
    const { data } = await api.put(`/tasks/${id}`, updates);
    return data;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message || "Unable to update task");
  }
});

export const deleteTask = createAsyncThunk("tasks/delete", async (id, thunkApi) => {
  try {
    await api.delete(`/tasks/${id}`);
    return id;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message || "Unable to delete task");
  }
});

export const createDemoTasks = createAsyncThunk("tasks/demo", async (_, thunkApi) => {
  try {
    const { data } = await api.post("/tasks/demo");
    return data;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message || "Unable to create demo tasks");
  }
});

const priorityOrder = { Overdue: 5, High: 4, Medium: 3, Low: 2, Done: 1 };

const sortTasks = (tasks) =>
  [...tasks].sort((a, b) => {
    const scoreDiff = (b.priorityScore || 0) - (a.priorityScore || 0);
    if (scoreDiff !== 0) return scoreDiff;
    const levelDiff = (priorityOrder[b.priorityLevel] || 0) - (priorityOrder[a.priorityLevel] || 0);
    if (levelDiff !== 0) return levelDiff;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    clearTaskError(state) {
      state.error = null;
    },
    setTasks(state, action) {
      state.items = sortTasks(action.payload || []);
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = sortTasks(action.payload);
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.items = sortTasks([action.payload, ...state.items]);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.items = sortTasks(
          state.items.map((task) => (task._id === action.payload._id ? action.payload : task))
        );
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((task) => task._id !== action.payload);
      })
      .addCase(createDemoTasks.fulfilled, (state, action) => {
        state.items = sortTasks(action.payload);
      })
      .addMatcher(
        (action) =>
          [createTask.pending.type, updateTask.pending.type, deleteTask.pending.type, createDemoTasks.pending.type].includes(action.type),
        (state) => {
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          [fetchTasks.rejected.type, createTask.rejected.type, updateTask.rejected.type, deleteTask.rejected.type, createDemoTasks.rejected.type].includes(
            action.type
          ),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  }
});

export const { clearTaskError, setTasks } = taskSlice.actions;
export default taskSlice.reducer;
