import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  UnknownAction,
} from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { New_Task, Task, TasksResponse, TasksState } from "../../types";

// Define the base URL for API requests.
const BASE_URL = "http://localhost:5000/api/tasks";

// Define the initial state for the tasks slice.
const initialState: TasksState = {
  tasks: { tasks: [] },
  loading: false,
  error: null,
};

/**
 * Async thunk to fetch tasks from the API.
 *
 * @returns A promise that resolves to an array of Task objects.
 *          If the API request fails, it returns a rejected promise with an error message.
 */
export const getTasks = createAsyncThunk<Task[], void, { rejectValue: string }>(
  "tasks/getTasks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(BASE_URL);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: TasksResponse = await response.json();
      toast.success("All tasks got successfully!");
      return data.tasks;
    } catch (error: any) {
      toast.error(`Error fetching tasks: ${error.message}`);
      return rejectWithValue("Server Error!");
    }
  }
);

/**
 * Async thunk to add a new task to the API.
 *
 * @param {New_Task} task - The task object to add.
 * @returns A promise that resolves to the added Task object.
 *          If the API request fails, it returns a rejected promise with an error message.
 */
export const addTask = createAsyncThunk<
  Task,
  New_Task,
  { rejectValue: string }
>(
  "tasks/addTask",
  async ({ title, description }: New_Task, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          description: description,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: any = await response.json();
      toast.success("Task created successfully!");
      return data.data;
    } catch (error: any) {
      toast.error(`Error adding task: ${error.message}`);
      return rejectWithValue("Can't add task. Server error.");
    }
  }
);

/**
 * Async thunk to delete a task from the API.
 *
 * @param {number} taskId - The ID of the task to delete.
 * @returns A promise that resolves to the ID of the deleted task.
 *          If the API request fails, it returns a rejected promise with an error message.
 */
export const deleteTask = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("tasks/deleteTask", async (taskId, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}/${taskId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    toast.success("Task deleted successfully!");
    return taskId;
  } catch (error: any) {
    toast.error(`Error deleting task: ${error.message}`);
    return rejectWithValue("Can't delete task. Server error.");
  }
});

/**
 * Async thunk to mark a task as done via the API.
 *
 * @param {number} taskId - The ID of the task to mark as done.
 * @returns A promise that resolves to the updated Task object.
 *          If the API request fails, it returns a rejected promise with an error message.
 */
export const doneTask = createAsyncThunk<Task, number, { rejectValue: string }>(
  "tasks/doneTask",
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/state/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data: Task = await response.json();
      toast.success("Task marked as done successfully!");
      return data;
    } catch (error: any) {
      toast.error(`Error marking task as done: ${error.message}`);
      return rejectWithValue("Can't finish task. Server error.");
    }
  }
);

/**
 * Async thunk to update a task via the API.
 *
 * @param {Task} data - The task object to update.
 * @returns A promise that resolves to the updated Task object.
 *          If the API request fails, it returns a rejected promise with an error message.
 */
export const updateTask = createAsyncThunk<Task, Task, { rejectValue: string }>(
  "tasks/updateTask",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/update/${data.id}`, {
        method: "PUT", // Should this be PUT or PATCH?  Probably PUT/PATCH
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const task: Task = await response.json();
      toast.success("Task updated successfully!");
      return task;
    } catch (error: any) {
      toast.error(`Error updating task: ${error.message}`);
      return rejectWithValue("Can't update Task. Server error.");
    }
  }
);

/**
 * Utility function to determine if an action is a rejected action.
 *
 * @param {UnknownAction} action - The action to check.
 * @returns {boolean} True if the action is a rejected action, false otherwise.
 */
function isError(action: UnknownAction) {
  return action.type.endsWith("rejected");
}

// Create the task slice.
export const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.tasks = action.payload;
      })
      .addCase(addTask.pending, (state) => {
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.tasks.push(action.payload);
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks.tasks = state.tasks.tasks.filter(
          (task) => task.id !== action.payload
        );
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.tasks.findIndex(
          (task) => task.id === action.payload.id
        );
        if (index !== -1) {
          state.tasks.tasks[index] = action.payload;
        }
      })
      .addCase(doneTask.fulfilled, (state, action) => {
        const index = state.tasks.tasks.findIndex(
          (task) => task.id === action.payload.id
        );
        if (index !== -1) {
          state.tasks.tasks[index] = action.payload; // Replace the task
        }
      })
      .addMatcher(isError, (state, action: PayloadAction<string>) => {
        state.error = action.payload;
        state.loading = false;
        toast.error(`Request failed: ${action.payload}`);
      });
  },
});

export default taskSlice.reducer;
