import { Mail, Send } from "lucide-react";
import { PageShell } from "../ui/PageShell.jsx";
import { Card } from "../ui/Card.jsx";
import { Button } from "../ui/Button.jsx";
import { missExcellenceText } from "../content/missExcellenceText.js";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchSiteContent } from "../store/slices/publicSlice.js";

export function ContactPage() {
  const dispatch = useDispatch();
  const siteContent = useSelector((s) => s.public.siteContent);
  const siteContentStatus = useSelector((s) => s.public.siteContentStatus);

  useEffect(() => {
    if (siteContentStatus === "idle") dispatch(fetchSiteContent());
  }, [dispatch, siteContentStatus]);

  const resolved = siteContent ?? missExcellenceText;

  return (
    <PageShell
      eyebrow="Contact"
      title={resolved.contact.title}
      subtitle={resolved.contact.subtitle}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Mail className="size-4 text-neon-500" />
            Nous contacter
          </div>
          <form
            className="mt-4 grid gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Formulaire à connecter au backend.");
            }}
          >
            <Field label="Nom" placeholder="Votre nom" />
            <Field label="Email" placeholder="vous@email.com" />
            <Field label="Sujet" placeholder="Partenariat, presse, candidature…" />
            <label className="grid gap-1 text-sm">
              <span className="text-xs text-ink-900/60">Message</span>
              <textarea
                className="min-h-[110px] rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm outline-none focus:border-neon-500/50"
                placeholder="Votre message…"
              />
            </label>
            <Button type="submit" className="mt-2">
              Envoyer <Send className="size-4" />
            </Button>
          </form>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Informations</div>
          <p className="mt-2 text-sm leading-relaxed text-ink-900/60">
            Contacts officiels Miss Excellence (presse, coordination, partenariats, direction).
          </p>
          <div className="mt-6 grid gap-3">
            {resolved.contact.emails.map((e) => (
              <div key={e} className="rounded-2xl border border-black/10 bg-white/70 p-4">
                <div className="text-sm font-semibold">Email</div>
                <div className="mt-1 text-sm text-ink-900/70">{e}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}

function Field({ label, placeholder }) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-xs text-ink-900/60">{label}</span>
      <input
        className="h-11 rounded-xl border border-black/10 bg-white/70 px-3 text-sm outline-none focus:border-neon-500/50"
        placeholder={placeholder}
      />
    </label>
  );
}


