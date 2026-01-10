import { Container } from "./Container.jsx";
import { missExcellenceText } from "../content/missExcellenceText.js";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSiteContent } from "../store/slices/publicSlice.js";

export function SiteFooter() {
  const dispatch = useDispatch();
  const siteContent = useSelector((s) => s.public.siteContent);
  const siteContentStatus = useSelector((s) => s.public.siteContentStatus);
  useEffect(() => {
    if (siteContentStatus === "idle") dispatch(fetchSiteContent());
  }, [dispatch, siteContentStatus]);

  const resolved = siteContent ?? missExcellenceText;

  return (
    <footer className="relative z-10 mt-16 border-t border-black/10">
      <div className="bg-gradient-to-b from-black/0 to-black/5">
        <Container className="grid gap-10 py-12 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-2xl bg-white/70 shadow-glow ring-1 ring-black/10">
                <img src="/logo.svg" alt="Miss Excellence" className="h-6 w-auto" />
              </div>
              <div>
                <div className="text-sm font-semibold">Miss Excellence</div>
                <div className="text-xs text-ink-900/60">Plateforme officielle</div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-900/60">
              Design premium, contenus dynamiques, et backoffice moderne pour piloter la plateforme.
            </p>
          </div>

          <div className="grid gap-2 text-sm text-ink-900/70">
            <div className="text-xs font-semibold text-ink-900/50">Liens</div>
            <a className="hover:text-ink-900" href="/">
              Home
            </a>
            <a className="hover:text-ink-900" href="/actualites">
              Actualités
            </a>
            <a className="hover:text-ink-900" href="/delegations">
              Délégations
            </a>
            <a className="hover:text-ink-900" href="/concours">
              Le concours
            </a>
          </div>

          <div className="grid gap-2 text-sm text-ink-900/70">
            <div className="text-xs font-semibold text-ink-900/50">Contact</div>
            <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
              <div className="text-sm font-semibold text-ink-900">Miss Excellence</div>
              <div className="mt-1 text-sm text-ink-900/60">Administration & partenariats</div>
              <div className="mt-3 text-sm text-ink-900/70">
                Email: <span className="text-ink-900">{resolved.partners.email}</span>
              </div>
            </div>
          </div>
        </Container>

        <div className="border-t border-black/10">
          <Container className="flex flex-col gap-2 py-6 text-xs text-ink-900/50 md:flex-row md:items-center md:justify-between">
            <div>© {new Date().getFullYear()} Miss Excellence — Tous droits réservés.</div>
            <div className="text-ink-900/40">Miss Excellence -  RDC</div>
          </Container>
        </div>
      </div>
    </footer>
  );
}


