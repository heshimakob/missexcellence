import { homeData } from "../models/home.model.js";
import { getLatestNewsAsync } from "./news.service.js";
import { getSiteContent } from "./siteContent.service.js";

export function getHomeData() {
  return {
    ...homeData,
    // keep home endpoint stable but enrich news with slug + imageUrl + content
    news: [],
  };
}

export async function getHomeDataAsync() {
  const site = await getSiteContent();
  const latestNews = await getLatestNewsAsync(3);

  return {
    ...homeData,
    // allow admin to manage hero/ctas from site content
    hero: {
      ...(homeData.hero ?? {}),
      eyebrow: site?.home?.eyebrow ?? homeData.hero?.eyebrow,
      title: site?.home?.title ?? homeData.hero?.title,
      subtitle: site?.home?.subtitle ?? homeData.hero?.subtitle,
      ctas: site?.home?.ctas ?? homeData.hero?.ctas,
    },
    news: latestNews,
  };
}


