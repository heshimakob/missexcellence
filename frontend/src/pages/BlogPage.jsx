import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, NotebookPen } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { fetchBlogPosts } from "../store/slices/blogSlice.js";
import { PageShell } from "../ui/PageShell.jsx";
import { Card } from "../ui/Card.jsx";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";

export function BlogPage() {
  const dispatch = useDispatch();
  const posts = useSelector((s) => s.blog.posts);
  const status = useSelector((s) => s.blog.postsStatus);
  const error = useSelector((s) => s.blog.postsError);
  const loading = status === "idle" || status === "loading";

  useEffect(() => {
    if (status === "idle") dispatch(fetchBlogPosts());
  }, [dispatch, status]);

  return (
    <PageShell
      eyebrow="Blog"
      title="Édito, coulisses, annonces"
      subtitle="Une section premium pour publier les contenus officiels et faire vivre la saison."
    >
      {loading ? <div className="text-sm text-ink-900/60">Chargement…</div> : null}
      {error ? <div className="text-sm text-red-300">API non disponible. Lance le backend.</div> : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {posts.map((p) => (
          <Link key={p.id} to={`/blog/${p.slug}`} className="block">
            <Card className="group relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-tr ${p.cover?.gradient ?? "from-white/5 to-white/0"} blur-xl`} />
              <div className="relative">
                <div className="flex items-center justify-between gap-3">
                  <Badge>{p.tag}</Badge>
                  <div className="text-xs text-ink-900/50">{p.date}</div>
                </div>
                <div className="mt-4 text-lg font-semibold">{p.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-ink-900/60">{p.excerpt}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm text-ink-900/70 group-hover:text-ink-900">
                  <NotebookPen className="size-4 text-neon-500" />
                  Lire l’article <ArrowRight className="size-4" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-black/10 bg-white/70 p-5">
        <div className="text-sm font-semibold">Prochaine étape</div>
        <p className="mt-2 text-sm text-ink-900/60">
          Connecter le blog au backoffice (CRUD + DB) pour publier en production.
        </p>
        <div className="mt-4">
          <Link to="/admin">
            <Button variant="secondary">Ouvrir le backoffice</Button>
          </Link>
        </div>
      </div>
    </PageShell>
  );
}


