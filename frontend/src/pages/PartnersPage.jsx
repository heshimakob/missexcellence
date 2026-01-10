import { Banknote, Handshake, Megaphone } from "lucide-react";
import { Card } from "../ui/Card.jsx";
import { PageShell } from "../ui/PageShell.jsx";
import { Badge } from "../ui/Badge.jsx";
import { missExcellenceText } from "../content/missExcellenceText.js";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchSiteContent } from "../store/slices/publicSlice.js";

export function PartnersPage() {
  const dispatch = useDispatch();
  const siteContent = useSelector((s) => s.public.siteContent);
  const siteContentStatus = useSelector((s) => s.public.siteContentStatus);

  useEffect(() => {
    if (siteContentStatus === "idle") dispatch(fetchSiteContent());
  }, [dispatch, siteContentStatus]);

  const resolved = siteContent ?? missExcellenceText;

  return (
    <PageShell
      eyebrow="Partenariats"
      title={resolved.partners.title}
      subtitle={resolved.partners.subtitle}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Banknote className="size-4 text-neon-500" />
            {resolved.partners.types[0]?.title ?? "Financiers"}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-900/60">{resolved.partners.types[0]?.desc ?? ""}</p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Handshake className="size-4 text-neon-500" />
            {resolved.partners.types[1]?.title ?? "Techniques"}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-900/60">{resolved.partners.types[1]?.desc ?? ""}</p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Megaphone className="size-4 text-neon-500" />
            {resolved.partners.types[2]?.title ?? "Promotionnels"}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-900/60">{resolved.partners.types[2]?.desc ?? ""}</p>
        </Card>
      </div>

      <div className="mt-6">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,255,203,.16),transparent_55%)]" />
          <div className="relative">
            <Badge className="bg-gradient-to-r from-neon-500/10 to-orchid-500/10">Contact partenariat</Badge>
            <div className="mt-3 text-sm text-ink-900/70">
              Email: <span className="font-semibold text-ink-900">{resolved.partners.email}</span>
            </div>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}


