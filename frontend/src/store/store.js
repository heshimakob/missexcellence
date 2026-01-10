import { configureStore } from "@reduxjs/toolkit";
import publicReducer from "./slices/publicSlice.js";
import blogReducer from "./slices/blogSlice.js";

export const store = configureStore({
  reducer: {
    public: publicReducer,
    blog: blogReducer,
  },
});


