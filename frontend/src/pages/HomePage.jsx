import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, Newspaper } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { fetchHome, fetchSiteContent } from "../store/slices/publicSlice.js";
import { Container } from "../ui/Container.jsx";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { Badge } from "../ui/Badge.jsx";
import { SectionHeading } from "../ui/SectionHeading.jsx";
import { VideoBackground } from "../ui/VideoBackground.jsx";
import { missExcellenceText } from "../content/missExcellenceText.js";
import { apiUrl } from "../lib/api.js";

export function HomePage() {
  const dispatch = useDispatch();
  const data = useSelector((s) => s.public.home);
  const homeStatus = useSelector((s) => s.public.homeStatus);
  const homeError = useSelector((s) => s.public.homeError);
  const siteContent = useSelector((s) => s.public.siteContent);
  const siteContentStatus = useSelector((s) => s.public.siteContentStatus);

  useEffect(() => {
    if (homeStatus === "idle") dispatch(fetchHome());
    if (siteContentStatus === "idle") dispatch(fetchSiteContent());
  }, [dispatch, homeStatus, siteContentStatus]);

  const highlights = data?.highlights ?? [];
  const stats = data?.stats ?? [];
  const news = data?.news ?? [];

  const resolved = siteContent ?? missExcellenceText;
  const heroCtas = useMemo(() => resolved.home.ctas, [resolved]);
  const miss2025Gallery = [
    { src: "/media/miss-2025/IMG_4538.JPEG", alt: "Intervention Miss Excellence 2025", caption: "Moment d’éloquence" },
    { src: "/media/miss-2025/IMG_4526.JPEG", alt: "Intervention Miss Excellence 2025 (2)", caption: "Prise de parole" },
    { src: "/media/miss-2025/IMG_4537.JPEG", alt: "Défilé Miss Excellence 2025", caption: "Défilé soirée" },
    { src: "/media/miss-2025/IMG_4525.JPEG", alt: "Sourire Miss Excellence 2025", caption: "Présence scénique" },
  ];

  function resolveImage(url) {
    if (!url) return "";
    if (/^https?:\/\//i.test(url)) return url;
    return apiUrl(url);
  }

  return (
    <div>
      <section className="relative overflow-hidden py-16 md:py-24">
        <Container className="relative z-10">
          <div className="grid gap-10 md:grid-cols-[1.2fr_.8fr] md:items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge className="bg-gradient-to-r from-neon-500/15 to-orchid-500/15">{resolved.home.eyebrow}</Badge>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
                  <span className="bg-gradient-to-r from-ink-900 via-ink-900 to-ink-900/70 bg-clip-text text-transparent">
                    {resolved.home.title}
                  </span>
                </h1>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-900/60 md:text-lg">
                  {resolved.home.subtitle}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link to={heroCtas[0]?.href}>
                    <Button className="w-full sm:w-auto">
                      {heroCtas[0]?.label}
                      <ArrowRight className="size-4" />
                    </Button>
                  </Link>
                  <Link to={heroCtas[1]?.href}>
                    <Button className="w-full sm:w-auto" variant="secondary">
                      {heroCtas[1]?.label}
                    </Button>
                  </Link>
                </div>

                {homeError ? (
                  <div className="mt-6 text-sm text-red-300">
                    API non disponible. Lance le backend pour activer le contenu dynamique.
                  </div>
                ) : null}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative"
            >
              <div className="absolute inset-0 -z-10 rounded-[28px] bg-gradient-to-tr from-neon-500/15 via-white/40 to-orchid-500/15 blur-xl" />
              <div className="relative rounded-[28px] border border-black/10 bg-white/70 p-6 shadow-glow backdrop-blur">
                <VideoBackground src="/videos/hero.mp4" />
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Aperçu saison</div>
                  <Badge className="text-ink-900/70">2026</Badge>
                </div>
                <div className="mt-6 grid gap-3">
                  {stats.length ? (
                    <div className="grid grid-cols-3 gap-3">
                      {stats.map((s) => (
                        <div key={s.label} className="rounded-2xl border border-black/10 bg-white/70 p-4">
                          <div className="text-2xl font-semibold">{s.value}</div>
                          <div className="mt-1 text-xs text-ink-900/60">{s.label}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-black/10 bg-white/70 p-4 text-sm text-ink-900/60">
                      {homeStatus === "loading" ? "Chargement…" : "—"}
                    </div>
                  )}

                  <div className="rounded-2xl border border-black/10 bg-gradient-to-r from-black/5 to-black/0 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <CalendarDays className="size-4 text-neon-500" />
                      Prochain temps fort
                    </div>
                    <div className="mt-2 text-sm text-ink-900/60">{resolved.home.northKivuCall.dates}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <SectionHeading
            eyebrow="Organisation"
            title="Miss Excellence: une beauté qui devient un levier de changement"
            subtitle="Concours, mouvement, état d’esprit: une plateforme de leadership, de cohésion sociale et d’impact durable."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {highlights.map((h) => (
              <Card key={h.title} className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,255,203,.18),transparent_55%)]" />
                <div className="relative">
                  <div className="text-lg font-semibold">{h.title}</div>
                  <p className="mt-2 text-sm leading-relaxed text-ink-900/60">{h.description}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Card>
              <div className="text-sm font-semibold">Résumé</div>
              <div className="mt-3 grid gap-3">
                {resolved.home.orgParagraphs.map((p, idx) => (
                  <p key={idx} className="text-sm leading-relaxed text-ink-900/60">
                    {p}
                  </p>
                ))}
              </div>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(192,155,255,.14),transparent_55%)]" />
              <div className="relative">
                <Badge className="bg-gradient-to-r from-neon-500/15 to-orchid-500/15">Portrait</Badge>
                <div className="mt-3 text-xl font-semibold">{resolved.home.spotlight.name}</div>
                <div className="mt-1 text-sm text-ink-900/60">{resolved.home.spotlight.title}</div>
                <div className="mt-4 grid gap-3">
                  {resolved.home.spotlight.bio.map((p, idx) => (
                    <p key={idx} className="text-sm leading-relaxed text-ink-900/60">
                      {p}
                    </p>
                  ))}
                </div>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Link to="/delegations">
                    <Button variant="secondary">Voir les candidates</Button>
                  </Link>
                  <Link to="/concours">
                    <Button>Voir le programme</Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-6">
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,255,203,.16),transparent_55%)]" />
              <div className="relative flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <div className="text-lg font-semibold">{resolved.home.northKivuCall.heading}</div>
                  <div className="mt-2 text-sm text-ink-900/60">{resolved.home.northKivuCall.dates}</div>
                </div>
                <Link to={resolved.home.northKivuCall.cta.href}>
                  <Button>
                    {resolved.home.northKivuCall.cta.label} <ArrowRight className="size-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <SectionHeading
            eyebrow="Miss Excellence 2025"
            title="Moments forts de l’édition 2025"
            subtitle="Quelques clichés emblématiques pour garder l’émotion et l’énergie du concours."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {miss2025Gallery.map((item) => (
              <Card key={item.src} className="group overflow-hidden p-0">
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/10 to-transparent" />
                </div>
                <div className="p-4">
                  <div className="text-sm font-semibold text-ink-900">{item.caption}</div>
                  <div className="mt-1 text-xs text-ink-900/60">Édition 2025 — Miss Excellence</div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container className="flex items-end justify-between gap-6">
          <SectionHeading eyebrow="Actualités" title="Dernières infos" subtitle="Communiqués, annonces, événements et coulisses." />
          <Link to="/actualites" className="hidden md:block">
            <Button variant="secondary">
              Voir toutes les actualités <ArrowRight className="size-4" />
            </Button>
          </Link>
        </Container>

        <Container className="mt-8 grid gap-4 md:grid-cols-3">
          {news.map((n) => (
            <Link key={n.id} to={`/actualites/${n.slug}`} className="block">
              <Card className="group overflow-hidden p-0">
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  {n.imageUrl ? (
                    <img
                      src={resolveImage(n.imageUrl)}
                      alt={n.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  <div className={`h-full w-full bg-gradient-to-tr from-neon-500/15 via-white/50 to-orchid-500/15 ${n.imageUrl ? "hidden" : ""}`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-white/10 to-transparent" />
                  <div className="absolute left-4 top-4 flex items-center gap-2">
                    <Badge className="bg-white/80">{n.tag}</Badge>
                    <div className="text-xs text-ink-900/60">{n.date}</div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-lg font-semibold">{n.title}</div>
                  <p className="mt-2 text-sm leading-relaxed text-ink-900/60">{n.excerpt}</p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-ink-900/80 group-hover:text-ink-900">
                    <Newspaper className="size-4 text-neon-500" />
                    Lire plus →
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </Container>

        <Container className="mt-6 md:hidden">
          <Link to="/actualites">
            <Button className="w-full" variant="secondary">
              Voir toutes les actualités <ArrowRight className="size-4" />
            </Button>
          </Link>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <SectionHeading
            eyebrow="Partenaires"
            title="Nos partenaires"
            subtitle=""
          />
          <div className="mt-6 flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <motion.img
              src="/media/pat1.jpeg"
              alt="Partenaire 1"
              className="h-16 w-auto object-contain opacity-70 transition-opacity hover:opacity-100 md:h-20"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0,
              }}
            />
            <motion.img
              src="/media/pat2.jpeg"
              alt="Partenaire 2"
              className="h-16 w-auto object-contain opacity-70 transition-opacity hover:opacity-100 md:h-20"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              }}
            />
          </div>
        </Container>
      </section>
    </div>
  );
}


