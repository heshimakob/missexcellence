import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchNews } from "../store/slices/publicSlice.js";
import { Card } from "../ui/Card.jsx";
import { Badge } from "../ui/Badge.jsx";
import { PageShell } from "../ui/PageShell.jsx";
import { apiUrl } from "../lib/api.js";

function resolveImage(url) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return apiUrl(url);
}

export function NewsPage() {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.public.news);
  const status = useSelector((s) => s.public.newsStatus);
  const loading = status === "idle" || status === "loading";

  useEffect(() => {
    if (status === "idle") dispatch(fetchNews());
  }, [dispatch, status]);

  return (
    <PageShell
      eyebrow="Actualités"
      title="Toutes les actus"
      subtitle="Une page prête à accueillir des articles complets (CMS via le backoffice)."
    >
      {loading ? <div className="text-sm text-ink-900/60">Chargement…</div> : null}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {items.map((n) => (
          <Link key={n.id} to={`/actualites/${n.slug}`} className="block">
            <Card className="group overflow-hidden p-0">
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <img
                  src={resolveImage(n.imageUrl)}
                  alt={n.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-white/10 to-transparent" />
                <div className="absolute left-4 top-4 flex items-center gap-2">
                  <Badge className="bg-white/80">{n.tag}</Badge>
                  <div className="text-xs text-ink-900/60">{n.date}</div>
                </div>
              </div>
              <div className="p-5">
                <div className="text-lg font-semibold">{n.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-ink-900/60">{n.excerpt}</p>
                <div className="mt-4 text-sm font-semibold text-ink-900/80 group-hover:text-ink-900">
                  Lire plus →
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}


