import { configureStore } from "@reduxjs/toolkit";
import publicReducer from "./slices/publicSlice.js";
import bintiReducer from "./slices/bintiSlice.js";

export const store = configureStore({
  reducer: {
    public: publicReducer,
    binti: bintiReducer,
  },
});


