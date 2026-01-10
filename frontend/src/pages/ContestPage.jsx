import { Card } from "../ui/Card.jsx";
import { PageShell } from "../ui/PageShell.jsx";
import { Badge } from "../ui/Badge.jsx";
import { missExcellenceText } from "../content/missExcellenceText.js";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchSiteContent } from "../store/slices/publicSlice.js";

export function ContestPage() {
  const dispatch = useDispatch();
  const siteContent = useSelector((s) => s.public.siteContent);
  const siteContentStatus = useSelector((s) => s.public.siteContentStatus);

  useEffect(() => {
    if (siteContentStatus === "idle") dispatch(fetchSiteContent());
  }, [dispatch, siteContentStatus]);

  const resolved = siteContent ?? missExcellenceText;

  return (
    <PageShell
      eyebrow="Le concours"
      title={resolved.contest.title}
      subtitle={resolved.contest.subtitle}
    >
      <div className="grid gap-4">
        {resolved.contest.timeline.map((step) => (
          <Card key={step.title}>
            <div className="flex items-center justify-between">
              <Badge className="bg-gradient-to-r from-neon-500/10 to-orchid-500/10">{step.date}</Badge>
              <div className="text-xs text-ink-900/50">Saison 2026 — Nord-Kivu</div>
            </div>
            <div className="mt-3 text-lg font-semibold">{step.title}</div>
            <ul className="mt-2 grid gap-2 text-sm leading-relaxed text-ink-900/60">
              {step.points.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-neon-500" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-4">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,255,203,.16),transparent_55%)]" />
          <div className="relative">
            <Badge className="bg-gradient-to-r from-neon-500/10 to-orchid-500/10">{resolved.contest.bauteBut.eyebrow}</Badge>
            <div className="mt-3 text-lg font-semibold">{resolved.contest.bauteBut.title}</div>
            <p className="mt-2 text-sm text-ink-900/60">
              La lauréate met en œuvre des projets à fort impact social, économique et environnemental au cours de son mandat.
            </p>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {resolved.contest.bauteBut.items.map((it) => (
                <div key={it} className="rounded-2xl border border-black/10 bg-white/70 p-4">
                  <div className="text-sm font-semibold">{it}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}


