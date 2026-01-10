import { useEffect, useMemo, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";

import { adminFetch } from "../../lib/adminApi.js";
import { Badge } from "../../ui/Badge.jsx";
import { Button } from "../../ui/Button.jsx";
import { Card } from "../../ui/Card.jsx";

export function AdminCmsDelegationsPage() {
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

  const delegations = useMemo(
    () => content?.delegations ?? { title: "", subtitle: "", regions: [] },
    [content],
  );

  function updateDelegations(fn) {
    setContent((prev) => {
      const next = structuredClone(prev ?? {});
      next.delegations = fn(delegations);
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

  const defaultRegion = { name: "Nouvelle région", city: "Ville", status: "Statut" };

  if (loading) return <div className="text-sm text-ink-900/60">Chargement…</div>;
  if (error) return <div className="text-sm text-red-600">{error}</div>;

  return (
    <div className="grid gap-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Badge className="bg-gradient-to-r from-neon-500/10 to-orchid-500/10">CMS</Badge>
          <h1 className="mt-3 text-2xl font-semibold">Délégations</h1>
          <p className="mt-2 text-sm text-ink-900/60">Tableau + modales pour gérer les régions.</p>
        </div>
        <Button onClick={saveAll} disabled={saving}>
          {saving ? "Enregistrement…" : "Enregistrer tout"}
        </Button>
      </div>

      <Card className="grid gap-3">
        <Field label="Titre" value={delegations.title} onChange={(v) => updateDelegations((d) => ({ ...d, title: v }))} />
        <Field
          label="Sous-titre"
          value={delegations.subtitle}
          onChange={(v) => updateDelegations((d) => ({ ...d, subtitle: v }))}
        />
      </Card>

      <Card className="grid gap-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Régions</div>
          <Button variant="secondary" size="sm" onClick={() => setModal({ type: "region", item: defaultRegion, index: null })}>
            <Plus className="size-4" /> Ajouter
          </Button>
        </div>

        <div className="overflow-hidden rounded-xl border border-black/10 bg-white/70">
          <div className="grid grid-cols-[1.1fr_1fr_.8fr_auto] gap-3 border-b border-black/10 bg-white/60 px-4 py-3 text-xs font-semibold text-ink-900/70">
            <div>Nom</div>
            <div>Ville</div>
            <div>Statut</div>
            <div className="text-right">Actions</div>
          </div>
          <div className="divide-y divide-black/5">
            {(delegations.regions ?? []).map((r, idx) => (
              <div key={`${r.name}-${idx}`} className="grid grid-cols-[1.1fr_1fr_.8fr_auto] items-center gap-3 px-4 py-3 text-sm">
                <div className="font-semibold text-ink-900">{r.name}</div>
                <div className="text-ink-900/70">{r.city}</div>
                <div className="text-ink-900/70">{r.status}</div>
                <div className="flex justify-end gap-2">
                  <Button variant="secondary" size="sm" onClick={() => setModal({ type: "region", item: r, index: idx })}>
                    <Edit className="size-4" /> Éditer
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      updateDelegations((d) => {
                        const next = [...(d.regions ?? [])];
                        next.splice(idx, 1);
                        return { ...d, regions: next };
                      })
                    }
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
            {!(delegations.regions ?? []).length ? (
              <div className="px-4 py-4 text-sm text-ink-900/60">Aucune région pour le moment.</div>
            ) : null}
          </div>
        </div>
      </Card>

      {modal.type === "region" ? (
        <RegionModal
          initial={modal.item}
          onClose={() => setModal({ type: null, item: null, index: null })}
          onSave={(payload) =>
            updateDelegations((d) => {
              const next = [...(d.regions ?? [])];
              if (modal.index === null || modal.index === undefined) next.push(payload);
              else next[modal.index] = payload;
              return { ...d, regions: next };
            })
          }
        />
      ) : null}
    </div>
  );
}

function RegionModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial ?? {});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => setForm(initial ?? {}), [initial]);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <Modal onClose={onClose}>
      <div className="text-sm font-semibold">Région</div>
      <div className="mt-3 grid gap-3">
        <Field label="Nom" value={form.name} onChange={(v) => setField("name", v)} />
        <Field label="Ville" value={form.city} onChange={(v) => setField("city", v)} />
        <Field label="Statut" value={form.status} onChange={(v) => setField("status", v)} />
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
      <div className="w-full max-w-xl rounded-2xl border border-black/10 bg-white p-5 shadow-2xl">
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

