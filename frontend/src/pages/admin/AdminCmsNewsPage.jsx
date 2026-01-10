import { useEffect, useMemo, useState } from "react";
import { Plus, Edit, Trash2, Image, Upload } from "lucide-react";

import { adminFetch } from "../../lib/adminApi.js";
import { Badge } from "../../ui/Badge.jsx";
import { Button } from "../../ui/Button.jsx";
import { Card } from "../../ui/Card.jsx";

export function AdminCmsNewsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({ type: null, item: null });
  const [uploading, setUploading] = useState(false);

  async function refresh() {
    const d = await adminFetch("/api/admin/cms/news");
    setItems(d.items ?? []);
  }

  useEffect(() => {
    let alive = true;
    refresh()
      .catch((e) => alive && setError(e.message || "Erreur"))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const defaultPayload = useMemo(
    () => ({
      slug: `actualite-${Date.now()}`,
      title: "Nouvelle actualité",
      date: new Date().toISOString().slice(0, 10),
      tag: "Actualité",
      excerpt: "Résumé court…",
      imageUrl: "",
      content: ["Paragraphe 1…"],
    }),
    [],
  );

  async function handleSave(payload, id) {
    const body = JSON.stringify(payload);
    if (id) {
      await adminFetch(`/api/admin/cms/news/${id}`, { method: "PUT", body });
    } else {
      await adminFetch("/api/admin/cms/news", { method: "POST", body });
    }
    await refresh();
    setModal({ type: null, item: null });
  }

  async function handleDelete(id) {
    await adminFetch(`/api/admin/cms/news/${id}`, { method: "DELETE" });
    await refresh();
    setModal({ type: null, item: null });
  }

  async function uploadImage(file, onDone) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await adminFetch("/api/admin/cms/upload", { method: "POST", body: fd });
      onDone(res.url);
    } catch (e) {
      setError(e.message || "Upload impossible");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <Badge className="bg-gradient-to-r from-neon-500/10 to-orchid-500/10">CMS</Badge>
          <h1 className="mt-3 text-2xl font-semibold">Actualités</h1>
          <p className="mt-2 text-sm text-ink-900/60">Tableau + modales pour créer, modifier, supprimer. Upload d’image inclus.</p>
        </div>
        <Button onClick={() => setModal({ type: "create", item: defaultPayload })}>
          <Plus className="size-4" /> Ajouter
        </Button>
      </div>

      {loading ? <div className="mt-4 text-sm text-ink-900/60">Chargement…</div> : null}
      {error ? <div className="mt-4 text-sm text-red-600">{error}</div> : null}

      <div className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white/70">
        <div className="grid grid-cols-[1.5fr_1fr_.8fr_.8fr_auto] gap-3 border-b border-black/10 bg-white/60 px-4 py-3 text-xs font-semibold text-ink-900/70">
          <div>Titre</div>
          <div>Slug</div>
          <div>Date</div>
          <div>Tag</div>
          <div className="text-right">Actions</div>
        </div>
        <div className="divide-y divide-black/5">
          {items.map((it) => (
            <div key={it.id} className="grid grid-cols-[1.5fr_1fr_.8fr_.8fr_auto] items-center gap-3 px-4 py-3 text-sm">
              <div className="font-semibold text-ink-900">{it.title}</div>
              <div className="truncate text-ink-900/60">{it.slug}</div>
              <div className="text-ink-900/70">{it.date}</div>
              <div className="text-ink-900/70">{it.tag}</div>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" size="sm" onClick={() => setModal({ type: "edit", item: it })}>
                  <Edit className="size-4" /> Éditer
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setModal({ type: "delete", item: it })}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
          {!items.length && !loading ? <div className="px-4 py-6 text-sm text-ink-900/60">Aucune actualité pour le moment.</div> : null}
        </div>
      </div>

      {modal.type === "create" || modal.type === "edit" ? (
        <NewsModal
          title={modal.type === "create" ? "Ajouter une actualité" : "Modifier une actualité"}
          initial={modal.item}
          loading={uploading}
          onClose={() => setModal({ type: null, item: null })}
          onSave={(payload) => handleSave(payload, modal.type === "edit" ? modal.item.id : undefined)}
          onUpload={uploadImage}
        />
      ) : null}

      {modal.type === "delete" ? (
        <ConfirmModal
          title="Supprimer l’actualité ?"
          message={`"${modal.item.title}" sera supprimée définitivement.`}
          onClose={() => setModal({ type: null, item: null })}
          onConfirm={() => handleDelete(modal.item.id)}
        />
      ) : null}
    </div>
  );
}

function NewsModal({ title, initial, onClose, onSave, onUpload, loading }) {
  const [form, setForm] = useState(initial ?? {});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setForm(initial ?? {});
  }, [initial]);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <Modal onClose={onClose}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-xs text-ink-900/60">Remplis les champs puis enregistre.</div>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <Field label="Titre" value={form.title} onChange={(v) => setField("title", v)} />
        <Field label="Slug" value={form.slug} onChange={(v) => setField("slug", v)} help="Texte URL-friendly" />
        <Field label="Date" type="date" value={form.date} onChange={(v) => setField("date", v)} />
        <Field label="Tag" value={form.tag} onChange={(v) => setField("tag", v)} />
        <Field label="Résumé" value={form.excerpt} onChange={(v) => setField("excerpt", v)} />

        <div className="grid gap-2 text-sm">
          <div className="text-xs text-ink-900/60">Image</div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="min-w-[220px] flex-1">
              <input
                className="h-10 w-full rounded-xl border border-black/10 bg-white/70 px-3 text-sm outline-none focus:border-neon-500/50"
                placeholder="URL de l’image"
                value={form.imageUrl ?? ""}
                onChange={(e) => setField("imageUrl", e.target.value)}
              />
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-xs font-semibold text-ink-900/70 hover:border-neon-500/40">
              <Upload className="size-4" />
              {loading ? "Upload…" : "Uploader"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  onUpload(file, (url) => setField("imageUrl", url));
                  e.target.value = "";
                }}
              />
            </label>
            {form.imageUrl ? (
              <span className="max-w-full break-all text-[11px] text-ink-900/60">{form.imageUrl}</span>
            ) : (
              <span className="text-[11px] text-ink-900/50">Aucune image choisie</span>
            )}
          </div>
          {form.imageUrl ? (
            <div className="relative overflow-hidden rounded-xl border border-black/10 bg-white/70">
              <img src={form.imageUrl} alt="aperçu" className="h-40 w-full object-cover" />
              <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-lg bg-white/80 px-2 py-1 text-[11px] font-semibold text-ink-900/80">
                <Image className="size-3" />
                Prévisualisation
              </div>
            </div>
          ) : null}
        </div>

        <label className="grid gap-2 text-sm">
          <span className="text-xs text-ink-900/60">Contenu (1 paragraphe par ligne)</span>
          <textarea
            className="min-h-[140px] rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm outline-none focus:border-neon-500/50"
            value={(form.content ?? []).join("\n")}
            onChange={(e) => setField("content", e.target.value.split("\n").filter(Boolean))}
          />
        </label>
      </div>

      {error ? <div className="mt-3 text-sm text-red-600">{error}</div> : null}

      <div className="mt-5 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose} disabled={saving}>
          Annuler
        </Button>
        <Button
          onClick={async () => {
            setSaving(true);
            setError(null);
            try {
              await onSave(form);
            } catch (e) {
              setError(e.message || "Erreur");
            } finally {
              setSaving(false);
            }
          }}
          disabled={saving || loading}
        >
          {saving ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </div>
    </Modal>
  );
}

function ConfirmModal({ title, message, onClose, onConfirm }) {
  return (
    <Modal onClose={onClose}>
      <div className="text-sm font-semibold">{title}</div>
      <p className="mt-2 text-sm text-ink-900/70">{message}</p>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Annuler
        </Button>
        <Button variant="secondary" onClick={onConfirm}>
          Supprimer
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

function Field({ label, value, onChange, type = "text", help }) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-xs text-ink-900/60">{label}</span>
      <input
        type={type}
        className="h-10 rounded-xl border border-black/10 bg-white/70 px-3 text-sm outline-none focus:border-neon-500/50"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
      {help ? <span className="text-[11px] text-ink-900/50">{help}</span> : null}
    </label>
  );
}




