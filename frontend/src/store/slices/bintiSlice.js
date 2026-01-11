import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiFetch } from "../../lib/api.js";

export const fetchBintiPosts = createAsyncThunk("binti/fetchPosts", async () => {
  const res = await apiFetch("/api/public/binti/posts");
  return res.posts ?? [];
});

export const fetchBintiPostBySlug = createAsyncThunk("binti/fetchPostBySlug", async (slug) => {
  const res = await apiFetch(`/api/public/binti/posts/${slug}`);
  return res.post;
});

const bintiSlice = createSlice({
  name: "binti",
  initialState: {
    posts: [],
    postsStatus: "idle",
    postsError: null,
    postBySlug: {},
    postStatusBySlug: {},
    postErrorBySlug: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBintiPosts.pending, (state) => {
        state.postsStatus = "loading";
        state.postsError = null;
      })
      .addCase(fetchBintiPosts.fulfilled, (state, action) => {
        state.postsStatus = "succeeded";
        state.posts = action.payload;
      })
      .addCase(fetchBintiPosts.rejected, (state, action) => {
        state.postsStatus = "failed";
        state.postsError = action.error?.message ?? "Error";
      })
      .addCase(fetchBintiPostBySlug.pending, (state, action) => {
        const slug = action.meta.arg;
        state.postStatusBySlug[slug] = "loading";
        state.postErrorBySlug[slug] = null;
      })
      .addCase(fetchBintiPostBySlug.fulfilled, (state, action) => {
        const post = action.payload;
        state.postBySlug[post.slug] = post;
        state.postStatusBySlug[post.slug] = "succeeded";
      })
      .addCase(fetchBintiPostBySlug.rejected, (state, action) => {
        const slug = action.meta.arg;
        state.postStatusBySlug[slug] = "failed";
        state.postErrorBySlug[slug] = action.error?.message ?? "Error";
      });
  },
});

export default bintiSlice.reducer;
