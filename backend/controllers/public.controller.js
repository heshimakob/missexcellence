import { getHomeDataAsync } from "../services/public.service.js";

export async function getPublicHome(_req, res) {
  res.json(await getHomeDataAsync());
}


