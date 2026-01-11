import { useEffect, useMemo, useState } from "react";
import { Plus, Edit, Trash2, Save } from "lucide-react";

import { adminFetch } from "../../lib/adminApi.js";
import { Badge } from "../../ui/Badge.jsx";
import { Button } from "../../ui/Button.jsx";
import { Card } from "../../ui/Card.jsx";

export function AdminHomeContentPage() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({ type: null, item: null, index: null });

  useEffect(() => {
    let alive = true;
    adminFetch("/api/admin/cms/site")
      .then((d) => alive && setContent(d.content))
      .catch((e) => alive && setError(e.message || "Erreur"))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const home = useMemo(
    () =>
      content?.home ?? {
        eyebrow: "",
        title: "",
        subtitle: "",
        ctas: [],
        orgParagraphs: [],
        spotlight: { name: "", title: "", bio: [] },
        northKivuCall: { heading: "", dates: "", cta: { label: "", href: "" } },
      },
    [content],
  );

  function updateHome(fn) {
    setContent((prev) => {
      const next = structuredClone(prev ?? {});
      next.home = fn(home);
      return next;
    });
  }

  async function saveAll() {
    if (!content) return;
    setSaving(true);
    setError(null);
    try {
      await adminFetch("/api/admin/cms/site", { method: "PUT", body: JSON.stringify({ content }) });
    } catch (e) {
      setError(e.message || "Erreur");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-sm text-ink-900/60">Chargement…</div>;
  if (error) return <div className="text-sm text-red-600">{error}</div>;

  return (
    <div className="grid gap-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Badge className="bg-gradient-to-r from-neon-500/10 to-orchid-500/10">CMS</Badge>
          <h1 className="mt-3 text-2xl font-semibold">Contenu — Page d'accueil</h1>
          <p className="mt-2 text-sm text-ink-900/60">Gestion du contenu de la page d'accueil (hero, organisation, spotlight, appel Nord-Kivu).</p>
        </div>
        <Button onClick={saveAll} disabled={saving}>
          <Save className="size-4" /> {saving ? "Enregistrement…" : "Enregistrer tout"}
        </Button>
      </div>

      {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div> : null}

      {/* Hero Section */}
      <Card className="grid gap-3">
        <div className="text-sm font-semibold">Section Hero</div>
        <Field label="Eyebrow" value={home.eyebrow} onChange={(v) => updateHome((h) => ({ ...h, eyebrow: v }))} />
        <Field label="Titre" value={home.title} onChange={(v) => updateHome((h) => ({ ...h, title: v }))} />
        <label className="grid gap-1 text-sm">
          <span className="text-xs text-ink-900/60">Sous-titre</span>
          <textarea
            className="min-h-[80px] rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm outline-none focus:border-neon-500/50"
            value={home.subtitle ?? ""}
            onChange={(e) => updateHome((h) => ({ ...h, subtitle: e.target.value }))}
          />
        </label>
      </Card>

      {/* CTAs */}
      <Card className="grid gap-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Boutons d'action (CTAs)</div>
          <Button variant="secondary" size="sm" onClick={() => setModal({ type: "cta", item: { label: "", href: "" }, index: null })}>
            <Plus className="size-4" /> Ajouter
          </Button>
        </div>
        <div className="overflow-hidden rounded-xl border border-black/10 bg-white/70">
          <div className="grid grid-cols-[1.5fr_1fr_auto] gap-3 border-b border-black/10 bg-white/60 px-4 py-3 text-xs font-semibold text-ink-900/70">
            <div>Label</div>
            <div>Lien</div>
            <div className="text-right">Actions</div>
          </div>
          <div className="divide-y divide-black/5">
            {(home.ctas ?? []).map((cta, idx) => (
              <div key={idx} className="grid grid-cols-[1.5fr_1fr_auto] items-center gap-3 px-4 py-3 text-sm">
                <div className="font-semibold text-ink-900">{cta.label}</div>
                <div className="truncate text-ink-900/60">{cta.href}</div>
                <div className="flex justify-end gap-2">
                  <Button variant="secondary" size="sm" onClick={() => setModal({ type: "cta", item: cta, index: idx })}>
                    <Edit className="size-4" /> Éditer
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      updateHome((h) => {
                        const next = [...(h.ctas ?? [])];
                        next.splice(idx, 1);
                        return { ...h, ctas: next };
                      })
                    }
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
            {!(home.ctas ?? []).length ? <div className="px-4 py-4 text-sm text-ink-900/60">Aucun bouton pour le moment.</div> : null}
          </div>
        </div>
      </Card>

      {/* Organisation Paragraphs */}
      <Card className="grid gap-3">
        <div className="text-sm font-semibold">Paragraphes de l'organisation</div>
        <label className="grid gap-2 text-sm">
          <span className="text-xs text-ink-900/60">Paragraphes (1 par ligne)</span>
          <textarea
            className="min-h-[200px] rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm outline-none focus:border-neon-500/50"
            value={(home.orgParagraphs ?? []).join("\n")}
            onChange={(e) => updateHome((h) => ({ ...h, orgParagraphs: e.target.value.split("\n").filter(Boolean) }))}
          />
        </label>
      </Card>

      {/* Spotlight */}
      <Card className="grid gap-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Spotlight (Portrait)</div>
          <Button variant="secondary" size="sm" onClick={() => setModal({ type: "spotlight", item: home.spotlight, index: null })}>
            <Edit className="size-4" /> Éditer
          </Button>
        </div>
        <div className="rounded-xl border border-black/10 bg-white/60 p-4 text-sm">
          <div className="text-lg font-semibold text-ink-900">{home.spotlight?.name || "Nom à définir"}</div>
          <div className="mt-1 text-ink-900/70">{home.spotlight?.title || "Titre à définir"}</div>
          <div className="mt-3 grid gap-2 text-ink-900/70">
            {(home.spotlight?.bio ?? []).map((p, idx) => (
              <p key={idx} className="text-sm">
                {p}
              </p>
            ))}
            {!(home.spotlight?.bio ?? []).length ? <p className="text-xs text-ink-900/50">Aucune biographie pour l'instant.</p> : null}
          </div>
        </div>
      </Card>

      {/* North Kivu Call */}
      <Card className="grid gap-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Appel Nord-Kivu</div>
          <Button variant="secondary" size="sm" onClick={() => setModal({ type: "northKivu", item: home.northKivuCall, index: null })}>
            <Edit className="size-4" /> Éditer
          </Button>
        </div>
        <div className="rounded-xl border border-black/10 bg-white/60 p-4 text-sm">
          <div className="text-lg font-semibold text-ink-900">{home.northKivuCall?.heading || "Titre à définir"}</div>
          <div className="mt-2 text-ink-900/70">{home.northKivuCall?.dates || "Dates à définir"}</div>
          <div className="mt-3">
            <div className="text-xs text-ink-900/60">Bouton:</div>
            <div className="mt-1 font-semibold text-ink-900">{home.northKivuCall?.cta?.label || "Label à définir"}</div>
            <div className="text-xs text-ink-900/60">{home.northKivuCall?.cta?.href || "/contact"}</div>
          </div>
        </div>
      </Card>

      {/* Modals */}
      {modal.type === "cta" ? (
        <CtaModal
          initial={modal.item}
          onClose={() => setModal({ type: null, item: null, index: null })}
          onSave={(payload) =>
            updateHome((h) => {
              const next = [...(h.ctas ?? [])];
              if (modal.index === null || modal.index === undefined) next.push(payload);
              else next[modal.index] = payload;
              return { ...h, ctas: next };
            })
          }
        />
      ) : null}

      {modal.type === "spotlight" ? (
        <SpotlightModal
          initial={modal.item}
          onClose={() => setModal({ type: null, item: null, index: null })}
          onSave={(payload) => updateHome((h) => ({ ...h, spotlight: payload }))}
        />
      ) : null}

      {modal.type === "northKivu" ? (
        <NorthKivuModal
          initial={modal.item}
          onClose={() => setModal({ type: null, item: null, index: null })}
          onSave={(payload) => updateHome((h) => ({ ...h, northKivuCall: payload }))}
        />
      ) : null}
    </div>
  );
}

function CtaModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial ?? {});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => setForm(initial ?? {}), [initial]);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <Modal onClose={onClose}>
      <div className="text-sm font-semibold">Bouton d'action</div>
      <div className="mt-3 grid gap-3">
        <Field label="Label" value={form.label} onChange={(v) => setField("label", v)} />
        <Field label="Lien (href)" value={form.href} onChange={(v) => setField("href", v)} />
      </div>
      {error ? <div className="mt-2 text-sm text-red-600">{error}</div> : null}
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose} disabled={saving}>
          Annuler
        </Button>
        <Button
          onClick={async () => {
            setSaving(true);
            setError(null);
            try {
              await onSave(form);
              onClose();
            } catch (e) {
              setError(e.message || "Erreur");
            } finally {
              setSaving(false);
            }
          }}
          disabled={saving}
        >
          {saving ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </div>
    </Modal>
  );
}

function SpotlightModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial ?? {});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => setForm(initial ?? {}), [initial]);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <Modal onClose={onClose}>
      <div className="text-sm font-semibold">Spotlight (Portrait)</div>
      <div className="mt-3 grid gap-3">
        <Field label="Nom" value={form.name} onChange={(v) => setField("name", v)} />
        <Field label="Titre" value={form.title} onChange={(v) => setField("title", v)} />
        <label className="grid gap-2 text-sm">
          <span className="text-xs text-ink-900/60">Biographie (1 paragraphe par ligne)</span>
          <textarea
            className="min-h-[140px] rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm outline-none focus:border-neon-500/50"
            value={(form.bio ?? []).join("\n")}
            onChange={(e) => setField("bio", e.target.value.split("\n").filter(Boolean))}
          />
        </label>
      </div>
      {error ? <div className="mt-2 text-sm text-red-600">{error}</div> : null}
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose} disabled={saving}>
          Annuler
        </Button>
        <Button
          onClick={async () => {
            setSaving(true);
            setError(null);
            try {
              await onSave(form);
              onClose();
            } catch (e) {
              setError(e.message || "Erreur");
            } finally {
              setSaving(false);
            }
          }}
          disabled={saving}
        >
          {saving ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </div>
    </Modal>
  );
}

function NorthKivuModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial ?? {});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => setForm(initial ?? {}), [initial]);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function setCtaField(key, value) {
    setForm((prev) => ({ ...prev, cta: { ...(prev.cta ?? {}), [key]: value } }));
  }

  return (
    <Modal onClose={onClose}>
      <div className="text-sm font-semibold">Appel Nord-Kivu</div>
      <div className="mt-3 grid gap-3">
        <Field label="Titre (heading)" value={form.heading} onChange={(v) => setField("heading", v)} />
        <Field label="Dates" value={form.dates} onChange={(v) => setField("dates", v)} />
        <div className="grid gap-2 rounded-xl border border-black/10 bg-white/60 p-3">
          <div className="text-xs font-semibold text-ink-900/70">Bouton d'action</div>
          <Field label="Label" value={form.cta?.label} onChange={(v) => setCtaField("label", v)} />
          <Field label="Lien (href)" value={form.cta?.href} onChange={(v) => setCtaField("href", v)} />
        </div>
      </div>
      {error ? <div className="mt-2 text-sm text-red-600">{error}</div> : null}
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose} disabled={saving}>
          Annuler
        </Button>
        <Button
          onClick={async () => {
            setSaving(true);
            setError(null);
            try {
              await onSave(form);
              onClose();
            } catch (e) {
              setError(e.message || "Erreur");
            } finally {
              setSaving(false);
            }
          }}
          disabled={saving}
        >
          {saving ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </div>
    </Modal>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-black/10 bg-white p-5 shadow-2xl">
        <div className="flex justify-end">
          <button className="text-xs text-ink-900/60 hover:text-ink-900" onClick={onClose}>
            Fermer
          </button>
        </div>
        <div className="mt-1">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-xs text-ink-900/60">{label}</span>
      <input
        type={type}
        className="h-10 rounded-xl border border-black/10 bg-white/70 px-3 text-sm outline-none focus:border-neon-500/50"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
