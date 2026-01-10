import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiFetch } from "../../lib/api.js";

export const fetchHome = createAsyncThunk("public/fetchHome", async () => {
  return await apiFetch("/api/public/home");
});

export const fetchSiteContent = createAsyncThunk("public/fetchSiteContent", async () => {
  const res = await apiFetch("/api/public/content");
  return res.content;
});

export const fetchNews = createAsyncThunk("public/fetchNews", async () => {
  const res = await apiFetch("/api/public/news");
  return res.items ?? [];
});

export const fetchNewsBySlug = createAsyncThunk("public/fetchNewsBySlug", async (slug) => {
  const res = await apiFetch(`/api/public/news/${slug}`);
  return res.item;
});

const publicSlice = createSlice({
  name: "public",
  initialState: {
    home: null,
    homeStatus: "idle", // idle | loading | succeeded | failed
    homeError: null,

    siteContent: null,
    siteContentStatus: "idle",
    siteContentError: null,

    news: [],
    newsStatus: "idle",
    newsError: null,
    newsBySlug: {},
    newsStatusBySlug: {},
    newsErrorBySlug: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHome.pending, (state) => {
        state.homeStatus = "loading";
        state.homeError = null;
      })
      .addCase(fetchHome.fulfilled, (state, action) => {
        state.homeStatus = "succeeded";
        state.home = action.payload;
      })
      .addCase(fetchHome.rejected, (state, action) => {
        state.homeStatus = "failed";
        state.homeError = action.error?.message ?? "Error";
      })
      .addCase(fetchSiteContent.pending, (state) => {
        state.siteContentStatus = "loading";
        state.siteContentError = null;
      })
      .addCase(fetchSiteContent.fulfilled, (state, action) => {
        state.siteContentStatus = "succeeded";
        state.siteContent = action.payload;
      })
      .addCase(fetchSiteContent.rejected, (state, action) => {
        state.siteContentStatus = "failed";
        state.siteContentError = action.error?.message ?? "Error";
      })
      .addCase(fetchNews.pending, (state) => {
        state.newsStatus = "loading";
        state.newsError = null;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.newsStatus = "succeeded";
        state.news = action.payload;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.newsStatus = "failed";
        state.newsError = action.error?.message ?? "Error";
      })
      .addCase(fetchNewsBySlug.pending, (state, action) => {
        const slug = action.meta.arg;
        state.newsStatusBySlug[slug] = "loading";
        state.newsErrorBySlug[slug] = null;
      })
      .addCase(fetchNewsBySlug.fulfilled, (state, action) => {
        const item = action.payload;
        state.newsBySlug[item.slug] = item;
        state.newsStatusBySlug[item.slug] = "succeeded";
      })
      .addCase(fetchNewsBySlug.rejected, (state, action) => {
        const slug = action.meta.arg;
        state.newsStatusBySlug[slug] = "failed";
        state.newsErrorBySlug[slug] = action.error?.message ?? "Error";
      });
  },
});

export default publicSlice.reducer;


