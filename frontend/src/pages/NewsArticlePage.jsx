import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, CalendarDays } from "lucide-react";

import { fetchNewsBySlug } from "../store/slices/publicSlice.js";
import { apiUrl } from "../lib/api.js";
import { Container } from "../ui/Container.jsx";
import { Badge } from "../ui/Badge.jsx";
import { Card } from "../ui/Card.jsx";
import { Button } from "../ui/Button.jsx";

function resolveImage(url) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return apiUrl(url);
}

export function NewsArticlePage() {
  const { slug } = useParams();
  const dispatch = useDispatch();

  const item = useSelector((s) => (slug ? s.public.newsBySlug[slug] : null));
  const status = useSelector((s) => (slug ? s.public.newsStatusBySlug[slug] : "idle"));
  const error = useSelector((s) => (slug ? s.public.newsErrorBySlug[slug] : null));

  useEffect(() => {
    if (!slug) return;
    if (!status || status === "idle") dispatch(fetchNewsBySlug(slug));
  }, [dispatch, slug, status]);

  if (error) {
    return (
      <div className="py-12">
        <Container>
          <Card>
            <div className="text-lg font-semibold">Actualité introuvable</div>
            <p className="mt-2 text-sm text-ink-900/60">{error}</p>
            <div className="mt-4">
              <Link to="/actualites">
                <Button variant="secondary">
                  <ArrowLeft className="size-4" /> Retour aux actualités
                </Button>
              </Link>
            </div>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div>
      <section className="py-10 md:py-14">
        <Container>
          <Link to="/actualites" className="inline-flex items-center gap-2 text-sm text-ink-900/70 hover:text-ink-900">
            <ArrowLeft className="size-4" /> Actualités
          </Link>

          <div className="mt-6">
            <Badge className="bg-gradient-to-r from-neon-500/10 to-orchid-500/10">{item?.tag ?? "Actualité"}</Badge>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              {item?.title ?? (status === "loading" ? "Chargement…" : "—")}
            </h1>
            <div className="mt-4 flex items-center gap-2 text-sm text-ink-900/60">
              <CalendarDays className="size-4 text-neon-500" />
              {item?.date ?? ""}
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-16">
        <Container>
          <Card className="overflow-hidden p-0">
            <figure className="relative overflow-hidden">
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                {item?.imageUrl ? (
                  <img
                    src={resolveImage(item.imageUrl)}
                    alt={item?.title ?? ""}
                    className="h-full w-full object-cover transition-transform duration-700"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-tr from-neon-500/15 via-white/50 to-orchid-500/15" />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
              </div>
              {item?.excerpt ? (
                <figcaption className="px-6 py-4 text-sm text-ink-900/70">{item.excerpt}</figcaption>
              ) : null}
            </figure>
            <div className="p-6">
              <div className="mt-2 grid gap-4">
                {(item?.content ?? []).map((p, idx) => (
                  <p key={idx} className="text-base leading-relaxed text-ink-900/80 md:text-lg">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </Card>
        </Container>
      </section>
    </div>
  );
}


