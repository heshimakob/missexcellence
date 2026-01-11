import { useEffect, useMemo, useState } from "react";
import { Plus, Edit, Trash2, Mail, CheckCircle, Circle } from "lucide-react";

import { adminFetch } from "../../lib/adminApi.js";
import { Badge } from "../../ui/Badge.jsx";
import { Button } from "../../ui/Button.jsx";
import { Card } from "../../ui/Card.jsx";

export function AdminCmsContactPage() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({ type: null, item: null, index: null });
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

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

  async function refreshMessages() {
    setMessagesLoading(true);
    try {
      const d = await adminFetch("/api/admin/cms/contact/messages");
      setMessages(d.messages ?? []);
    } catch (e) {
      setError(e.message || "Erreur lors du chargement des messages");
    } finally {
      setMessagesLoading(false);
    }
  }

  useEffect(() => {
    refreshMessages();
  }, []);

  async function handleMarkAsRead(id) {
    try {
      await adminFetch(`/api/admin/cms/contact/messages/${id}`, { method: "PATCH", body: JSON.stringify({ read: true }) });
      await refreshMessages();
    } catch (e) {
      setError(e.message || "Erreur");
    }
  }

  async function handleDeleteMessage(id) {
    if (!confirm("Supprimer ce message ?")) return;
    try {
      await adminFetch(`/api/admin/cms/contact/messages/${id}`, { method: "DELETE" });
      await refreshMessages();
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (e) {
      setError(e.message || "Erreur");
    }
  }

  const contact = useMemo(
    () => content?.contact ?? { title: "", subtitle: "", emails: [] },
    [content],
  );

  function updateContact(fn) {
    setContent((prev) => {
      const next = structuredClone(prev ?? {});
      next.contact = fn(contact);
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

  const defaultEmail = "contact@missexcellenceorg.com";

  if (loading) return <div className="text-sm text-ink-900/60">Chargement…</div>;
  if (error) return <div className="text-sm text-red-600">{error}</div>;

  return (
    <div className="grid gap-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Badge className="bg-gradient-to-r from-neon-500/10 to-orchid-500/10">CMS</Badge>
          <h1 className="mt-3 text-2xl font-semibold">Contact</h1>
          <p className="mt-2 text-sm text-ink-900/60">Tableau + modales pour les emails et les textes.</p>
        </div>
        <Button onClick={saveAll} disabled={saving}>
          {saving ? "Enregistrement…" : "Enregistrer tout"}
        </Button>
      </div>

      <Card className="grid gap-3">
        <Field label="Titre" value={contact.title} onChange={(v) => updateContact((c) => ({ ...c, title: v }))} />
        <Field label="Sous-titre" value={contact.subtitle} onChange={(v) => updateContact((c) => ({ ...c, subtitle: v }))} />
      </Card>

      <Card className="grid gap-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Emails</div>
          <Button variant="secondary" size="sm" onClick={() => setModal({ type: "email", item: defaultEmail, index: null })}>
            <Plus className="size-4" /> Ajouter
          </Button>
        </div>

        <div className="overflow-hidden rounded-xl border border-black/10 bg-white/70">
          <div className="grid grid-cols-[1fr_auto] gap-3 border-b border-black/10 bg-white/60 px-4 py-3 text-xs font-semibold text-ink-900/70">
            <div>Email</div>
            <div className="text-right">Actions</div>
          </div>
          <div className="divide-y divide-black/5">
            {(contact.emails ?? []).map((mail, idx) => (
              <div key={`${mail}-${idx}`} className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 text-sm">
                <div className="text-ink-900">{mail}</div>
                <div className="flex justify-end gap-2">
                  <Button variant="secondary" size="sm" onClick={() => setModal({ type: "email", item: mail, index: idx })}>
                    <Edit className="size-4" /> Éditer
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      updateContact((c) => {
                        const next = [...(c.emails ?? [])];
                        next.splice(idx, 1);
                        return { ...c, emails: next };
                      })
                    }
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
            {!(contact.emails ?? []).length ? (
              <div className="px-4 py-4 text-sm text-ink-900/60">Aucun email pour le moment.</div>
            ) : null}
          </div>
        </div>
      </Card>

      {/* Messages de contact */}
      <Card className="grid gap-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Messages reçus</div>
            <div className="mt-1 text-xs text-ink-900/60">
              {messages.length} message{messages.length > 1 ? "s" : ""} ({messages.filter((m) => !m.read).length} non lu{messages.filter((m) => !m.read).length > 1 ? "s" : ""})
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={refreshMessages} disabled={messagesLoading}>
            {messagesLoading ? "Chargement…" : "Actualiser"}
          </Button>
        </div>

        {messagesLoading ? (
          <div className="py-8 text-center text-sm text-ink-900/60">Chargement des messages…</div>
        ) : messages.length === 0 ? (
          <div className="py-8 text-center text-sm text-ink-900/60">Aucun message pour le moment.</div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            <div className="max-h-[600px] space-y-2 overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`cursor-pointer rounded-xl border p-3 transition-colors ${
                    selectedMessage?.id === msg.id
                      ? "border-neon-500 bg-neon-500/10"
                      : msg.read
                        ? "border-black/10 bg-white/70"
                        : "border-neon-500/50 bg-neon-500/5"
                  }`}
                  onClick={() => setSelectedMessage(msg)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {msg.read ? (
                          <Circle className="size-3 text-ink-900/30 flex-shrink-0" />
                        ) : (
                          <div className="size-3 rounded-full bg-neon-500 flex-shrink-0" />
                        )}
                        <div className={`text-sm font-semibold truncate ${msg.read ? "text-ink-900/70" : "text-ink-900"}`}>
                          {msg.name}
                        </div>
                      </div>
                      <div className="mt-1 text-xs text-ink-900/60 truncate">{msg.subject}</div>
                      <div className="mt-1 text-xs text-ink-900/40">{new Date(msg.createdAt).toLocaleDateString("fr-FR")}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedMessage ? (
              <Card>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{selectedMessage.subject}</div>
                    <div className="mt-1 text-xs text-ink-900/60">
                      De: {selectedMessage.name} ({selectedMessage.email})
                    </div>
                    <div className="mt-1 text-xs text-ink-900/40">
                      {new Date(selectedMessage.createdAt).toLocaleString("fr-FR")}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!selectedMessage.read && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleMarkAsRead(selectedMessage.id)}
                      >
                        <CheckCircle className="size-4" /> Marquer lu
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteMessage(selectedMessage.id)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-4 rounded-xl border border-black/10 bg-white/60 p-4">
                  <div className="text-xs font-semibold text-ink-900/60 mb-2">Message</div>
                  <div className="text-sm text-ink-900/80 whitespace-pre-wrap">{selectedMessage.message}</div>
                </div>
              </Card>
            ) : (
              <Card className="flex items-center justify-center min-h-[200px]">
                <div className="text-center text-sm text-ink-900/60">
                  <Mail className="size-8 mx-auto mb-2 text-ink-900/30" />
                  Sélectionnez un message pour le lire
                </div>
              </Card>
            )}
          </div>
        )}
      </Card>

      {modal.type === "email" ? (
        <EmailModal
          initial={modal.item}
          onClose={() => setModal({ type: null, item: null, index: null })}
          onSave={(val) =>
            updateContact((c) => {
              const next = [...(c.emails ?? [])];
              if (modal.index === null || modal.index === undefined) next.push(val);
              else next[modal.index] = val;
              return { ...c, emails: next };
            })
          }
        />
      ) : null}
    </div>
  );
}

function EmailModal({ initial, onClose, onSave }) {
  const [value, setValue] = useState(initial ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => setValue(initial ?? ""), [initial]);

  return (
    <Modal onClose={onClose}>
      <div className="text-sm font-semibold">{initial ? "Éditer l’email" : "Ajouter un email"}</div>
      <div className="mt-3 grid gap-2">
        <input
          className="h-10 rounded-xl border border-black/10 bg-white/70 px-3 text-sm outline-none focus:border-neon-500/50"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
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
              await onSave(value);
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

function Field({ label, value, onChange }) {
  return (
    <label className="grid gap-1 text-sm flex-1">
      <span className="text-xs text-ink-900/60">{label}</span>
      <input
        className="h-10 rounded-xl border border-black/10 bg-white/70 px-3 text-sm outline-none focus:border-neon-500/50"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

