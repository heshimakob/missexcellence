import { useEffect, useMemo, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";

import { adminFetch } from "../../lib/adminApi.js";
import { Badge } from "../../ui/Badge.jsx";
import { Button } from "../../ui/Button.jsx";
import { Card } from "../../ui/Card.jsx";

export function AdminCmsContestPage() {
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

  const contest = useMemo(
    () => content?.contest ?? { title: "", subtitle: "", timeline: [], bauteBut: { eyebrow: "", title: "", items: [] } },
    [content],
  );

  function updateContest(fn) {
    setContent((prev) => {
      const next = structuredClone(prev ?? {});
      next.contest = fn(contest);
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

  const defaultStep = { title: "Nouvelle étape", date: new Date().toISOString().slice(0, 10), points: ["Détail…"] };

  if (loading) return <div className="text-sm text-ink-900/60">Chargement…</div>;
  if (error) return <div className="text-sm text-red-600">{error}</div>;

  return (
    <div className="grid gap-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Badge className="bg-gradient-to-r from-neon-500/10 to-orchid-500/10">CMS</Badge>
          <h1 className="mt-3 text-2xl font-semibold">Concours</h1>
          <p className="mt-2 text-sm text-ink-900/60">Gestion en tableau + modales (timeline & Beauté avec un But).</p>
        </div>
        <Button onClick={saveAll} disabled={saving}>
          {saving ? "Enregistrement…" : "Enregistrer tout"}
        </Button>
      </div>

      <Card className="grid gap-3">
        <Field label="Titre" value={contest.title} onChange={(v) => updateContest((c) => ({ ...c, title: v }))} />
        <Field label="Sous-titre" value={contest.subtitle} onChange={(v) => updateContest((c) => ({ ...c, subtitle: v }))} />
      </Card>

      <Card className="grid gap-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Timeline</div>
          <Button variant="secondary" size="sm" onClick={() => setModal({ type: "step", item: defaultStep, index: null })}>
            <Plus className="size-4" /> Ajouter
          </Button>
        </div>
        <div className="overflow-hidden rounded-xl border border-black/10 bg-white/70">
          <div className="grid grid-cols-[1.4fr_.8fr_.6fr_auto] gap-3 border-b border-black/10 bg-white/60 px-4 py-3 text-xs font-semibold text-ink-900/70">
            <div>Titre</div>
            <div>Date</div>
            <div>Points</div>
            <div className="text-right">Actions</div>
          </div>
          <div className="divide-y divide-black/5">
            {(contest.timeline ?? []).map((step, idx) => (
              <div key={`${step.title}-${idx}`} className="grid grid-cols-[1.4fr_.8fr_.6fr_auto] items-center gap-3 px-4 py-3 text-sm">
                <div className="font-semibold text-ink-900">{step.title}</div>
                <div className="text-ink-900/70">{step.date}</div>
                <div className="text-ink-900/60">{step.points?.length ?? 0} pts</div>
                <div className="flex justify-end gap-2">
                  <Button variant="secondary" size="sm" onClick={() => setModal({ type: "step", item: step, index: idx })}>
                    <Edit className="size-4" /> Éditer
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      updateContest((c) => {
                        const next = [...(c.timeline ?? [])];
                        next.splice(idx, 1);
                        return { ...c, timeline: next };
                      })
                    }
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
            {!(contest.timeline ?? []).length ? (
              <div className="px-4 py-4 text-sm text-ink-900/60">Aucune étape pour le moment.</div>
            ) : null}
          </div>
        </div>
      </Card>

      <Card className="grid gap-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Beauté avec un But</div>
            <div className="text-xs text-ink-900/60">Eyebrow, titre, et items listés.</div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setModal({ type: "bauteBut", item: contest.bauteBut, index: null })}>
            <Edit className="size-4" /> Éditer
          </Button>
        </div>
        <div className="rounded-xl border border-black/10 bg-white/60 p-4 text-sm">
          <div className="text-xs font-semibold text-ink-900/60">{contest.bauteBut?.eyebrow || "Eyebrow"}</div>
          <div className="text-lg font-semibold text-ink-900">{contest.bauteBut?.title || "Titre à définir"}</div>
          <ul className="mt-3 grid gap-2 text-ink-900/70">
            {(contest.bauteBut?.items ?? []).map((it, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="mt-1 size-1.5 rounded-full bg-neon-500" />
                <span>{it}</span>
              </li>
            ))}
            {!(contest.bauteBut?.items ?? []).length ? (
              <li className="text-xs text-ink-900/50">Aucun item pour l’instant.</li>
            ) : null}
          </ul>
        </div>
      </Card>

      {modal.type === "step" ? (
        <StepModal
          initial={modal.item}
          onClose={() => setModal({ type: null, item: null, index: null })}
          onSave={(payload) =>
            updateContest((c) => {
              const next = [...(c.timeline ?? [])];
              if (modal.index === null || modal.index === undefined) next.push(payload);
              else next[modal.index] = payload;
              return { ...c, timeline: next };
            })
          }
        />
      ) : null}

      {modal.type === "bauteBut" ? (
        <BauteButModal
          initial={modal.item}
          onClose={() => setModal({ type: null, item: null, index: null })}
          onSave={(payload) => updateContest((c) => ({ ...c, bauteBut: payload }))}
        />
      ) : null}
    </div>
  );
}

function StepModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial ?? {});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => setForm(initial ?? {}), [initial]);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <Modal onClose={onClose}>
      <div className="text-sm font-semibold">Étape de timeline</div>
      <div className="mt-3 grid gap-3">
        <Field label="Titre" value={form.title} onChange={(v) => setField("title", v)} />
        <Field label="Date" type="date" value={form.date} onChange={(v) => setField("date", v)} />
        <label className="grid gap-2 text-sm">
          <span className="text-xs text-ink-900/60">Points (1 par ligne)</span>
          <textarea
            className="min-h-[120px] rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm outline-none focus:border-neon-500/50"
            value={(form.points ?? []).join("\n")}
            onChange={(e) => setField("points", e.target.value.split("\n").filter(Boolean))}
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

function BauteButModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial ?? {});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => setForm(initial ?? {}), [initial]);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <Modal onClose={onClose}>
      <div className="text-sm font-semibold">Beauté avec un But</div>
      <div className="mt-3 grid gap-3">
        <Field label="Eyebrow" value={form.eyebrow} onChange={(v) => setField("eyebrow", v)} />
        <Field label="Titre" value={form.title} onChange={(v) => setField("title", v)} />
        <label className="grid gap-2 text-sm">
          <span className="text-xs text-ink-900/60">Items (1 par ligne)</span>
          <textarea
            className="min-h-[120px] rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm outline-none focus:border-neon-500/50"
            value={(form.items ?? []).join("\n")}
            onChange={(e) => setField("items", e.target.value.split("\n").filter(Boolean))}
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

