import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiFetch } from "../../lib/api.js";

export const fetchBlogPosts = createAsyncThunk("blog/fetchPosts", async () => {
  const res = await apiFetch("/api/public/blog/posts");
  return res.posts ?? [];
});

export const fetchBlogPostBySlug = createAsyncThunk("blog/fetchPostBySlug", async (slug) => {
  const res = await apiFetch(`/api/public/blog/posts/${slug}`);
  return res.post;
});

const blogSlice = createSlice({
  name: "blog",
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
      .addCase(fetchBlogPosts.pending, (state) => {
        state.postsStatus = "loading";
        state.postsError = null;
      })
      .addCase(fetchBlogPosts.fulfilled, (state, action) => {
        state.postsStatus = "succeeded";
        state.posts = action.payload;
      })
      .addCase(fetchBlogPosts.rejected, (state, action) => {
        state.postsStatus = "failed";
        state.postsError = action.error?.message ?? "Error";
      })
      .addCase(fetchBlogPostBySlug.pending, (state, action) => {
        const slug = action.meta.arg;
        state.postStatusBySlug[slug] = "loading";
        state.postErrorBySlug[slug] = null;
      })
      .addCase(fetchBlogPostBySlug.fulfilled, (state, action) => {
        const post = action.payload;
        state.postBySlug[post.slug] = post;
        state.postStatusBySlug[post.slug] = "succeeded";
      })
      .addCase(fetchBlogPostBySlug.rejected, (state, action) => {
        const slug = action.meta.arg;
        state.postStatusBySlug[slug] = "failed";
        state.postErrorBySlug[slug] = action.error?.message ?? "Error";
      });
  },
});

export default blogSlice.reducer;


