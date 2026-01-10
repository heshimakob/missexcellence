import { getHomeData } from "./public.service.js";

export function getPublicHome(_req, res) {
  res.json(getHomeData());
}


