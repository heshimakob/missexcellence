import { Crown, MapPin } from "lucide-react";
import { PageShell } from "../ui/PageShell.jsx";
import { Card } from "../ui/Card.jsx";
import { Badge } from "../ui/Badge.jsx";
import { missExcellenceText } from "../content/missExcellenceText.js";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchSiteContent } from "../store/slices/publicSlice.js";
import { SEO } from "../components/SEO.jsx";

export function DelegationsPage() {
  const dispatch = useDispatch();
  const siteContent = useSelector((s) => s.public.siteContent);
  const siteContentStatus = useSelector((s) => s.public.siteContentStatus);

  useEffect(() => {
    if (siteContentStatus === "idle") dispatch(fetchSiteContent());
  }, [dispatch, siteContentStatus]);

  const resolved = siteContent ?? missExcellenceText;

  return (
    <>
      <SEO
        title="Délégations"
        description={resolved.delegations.subtitle}
        url="/delegations"
      />
      <PageShell
        eyebrow="Délégations"
        title={resolved.delegations.title}
        subtitle={resolved.delegations.subtitle}
      >
      <div className="grid gap-4 md:grid-cols-3">
        {resolved.delegations.regions.map((d) => (
          <Card key={d.name} className="relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(192,155,255,.10),transparent_55%)]" />
            <div className="relative">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold">{d.name}</div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-ink-900/60">
                    <MapPin className="size-4 text-neon-500" />
                    {d.city}
                  </div>
                </div>
                <Crown className="size-5 text-ink-900/60" />
              </div>
              <div className="mt-4">
                <Badge>{d.status}</Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PageShell>
    </>
  );
}


