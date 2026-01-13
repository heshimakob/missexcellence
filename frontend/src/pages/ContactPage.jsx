import { Mail, Send, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { PageShell } from "../ui/PageShell.jsx";
import { Card } from "../ui/Card.jsx";
import { Button } from "../ui/Button.jsx";
import { missExcellenceText } from "../content/missExcellenceText.js";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchSiteContent } from "../store/slices/publicSlice.js";
import { apiFetch } from "../lib/api.js";
import { SEO } from "../components/SEO.jsx";

export function ContactPage() {
  const dispatch = useDispatch();
  const siteContent = useSelector((s) => s.public.siteContent);
  const siteContentStatus = useSelector((s) => s.public.siteContentStatus);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (siteContentStatus === "idle") dispatch(fetchSiteContent());
  }, [dispatch, siteContentStatus]);

  const resolved = siteContent ?? missExcellenceText;

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await apiFetch("/api/public/contact", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (response.success) {
        setSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        // Réinitialiser le message de succès après 5 secondes
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      setError(err.message || "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Réinitialiser les messages d'erreur/succès quand l'utilisateur modifie le formulaire
    if (error) setError(null);
    if (success) setSuccess(false);
  }

  return (
    <>
      <SEO
        title="Contact"
        description={resolved.contact.subtitle || "Contactez-nous pour toute question concernant Miss Excellence : presse, candidatures, coordination, partenariats."}
        url="/contact"
      />
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
          {success && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              <CheckCircle className="size-4" />
              Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.
            </div>
          )}
          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="size-4" />
              {error}
            </div>
          )}
          <form className="mt-4 grid gap-3" onSubmit={handleSubmit}>
            <Field
              label="Nom"
              placeholder="Votre nom"
              value={formData.name}
              onChange={(v) => handleChange("name", v)}
              required
            />
            <Field
              label="Email"
              type="email"
              placeholder="vous@email.com"
              value={formData.email}
              onChange={(v) => handleChange("email", v)}
              required
            />
            <Field
              label="Sujet"
              placeholder="Partenariat, presse, candidature…"
              value={formData.subject}
              onChange={(v) => handleChange("subject", v)}
              required
            />
            <label className="grid gap-1 text-sm">
              <span className="text-xs text-ink-900/60">Message</span>
              <textarea
                className="min-h-[110px] rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm outline-none focus:border-neon-500/50"
                placeholder="Votre message…"
                value={formData.message}
                onChange={(e) => handleChange("message", e.target.value)}
                required
              />
            </label>
            <Button type="submit" className="mt-2" disabled={submitting}>
              {submitting ? "Envoi en cours…" : "Envoyer"} <Send className="size-4" />
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
    </>
  );
}
function Field({label, placeholder, value, onChange, type = "text", required = false}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-xs text-ink-900/60">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      <input
        type={type}
        className="h-11 rounded-xl border border-black/10 bg-white/70 px-3 text-sm outline-none focus:border-neon-500/50"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </label>
  );
} 