import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { fetchBlogPostBySlug } from "../store/slices/blogSlice.js";
import { Container } from "../ui/Container.jsx";
import { Badge } from "../ui/Badge.jsx";
import { Card } from "../ui/Card.jsx";
import { Button } from "../ui/Button.jsx";

export function BlogPostPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const post = useSelector((s) => (slug ? s.blog.postBySlug[slug] : null));
  const status = useSelector((s) => (slug ? s.blog.postStatusBySlug[slug] : "idle"));
  const error = useSelector((s) => (slug ? s.blog.postErrorBySlug[slug] : null));

  useEffect(() => {
    if (!slug) return;
    if (!status || status === "idle") dispatch(fetchBlogPostBySlug(slug));
  }, [dispatch, slug, status]);

  if (error) {
    return (
      <div className="py-12">
        <Container>
          <Card>
            <div className="text-lg font-semibold">Article introuvable</div>
            <p className="mt-2 text-sm text-white/60">{error.message}</p>
            <div className="mt-4">
              <Link to="/blog">
                <Button variant="secondary">
                  <ArrowLeft className="size-4" /> Retour au blog
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
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-ink-900/70 hover:text-ink-900">
            <ArrowLeft className="size-4" /> Blog
          </Link>

          <div className="mt-6">
            <Badge className="bg-gradient-to-r from-neon-500/10 to-orchid-500/10">{post?.tag ?? "Article"}</Badge>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              {post?.title ?? (status === "loading" ? "Chargement…" : "—")}
            </h1>
            <div className="mt-4 flex items-center gap-2 text-sm text-ink-900/60">
              <CalendarDays className="size-4 text-neon-500" />
              {post?.date ?? ""}
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-16">
        <Container>
          <Card className="relative overflow-hidden">
            <div
              className={`absolute inset-0 bg-gradient-to-tr ${post?.cover?.gradient ?? "from-white/5 to-white/0"} blur-xl`}
            />
            <div className="relative">
              <p className="text-sm text-ink-900/60">{post?.excerpt}</p>
              <div className="mt-6 grid gap-4">
                {(post?.content ?? []).map((para, idx) => (
                  <p key={idx} className="text-sm leading-relaxed text-ink-900/70 md:text-base">
                    {para}
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


