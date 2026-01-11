import { useEffect, useState } from "react";
import { Save, ChevronDown, ChevronUp, Code, FileText } from "lucide-react";
import { Link } from "react-router-dom";

import { adminFetch } from "../../lib/adminApi.js";
import { Badge } from "../../ui/Badge.jsx";
import { Button } from "../../ui/Button.jsx";
import { Card } from "../../ui/Card.jsx";

export function AdminCmsSitePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [content, setContent] = useState(null);
  const [showJson, setShowJson] = useState(false);
  const [jsonValue, setJsonValue] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    home: false,
    contest: false,
    delegations: false,
    partners: false,
    contact: false,
  });

  useEffect(() => {
    let alive = true;
    adminFetch("/api/admin/cms/site")
      .then((d) => {
        if (!alive) return;
        setContent(d.content);
        setJsonValue(JSON.stringify(d.content, null, 2));
      })
      .catch((e) => setError(e.message || "Erreur"))
      .finally(() => setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  function toggleSection(section) {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
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

  async function saveJson() {
    setSaving(true);
    setError(null);
    try {
      const parsed = JSON.parse(jsonValue);
      await adminFetch("/api/admin/cms/site", {
        method: "PUT",
        body: JSON.stringify({ content: parsed }),
      });
      setContent(parsed);
    } catch (e) {
      setError(e.message || "Erreur de syntaxe JSON");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-sm text-ink-900/60">Chargement…</div>;
  if (error && !content) return <div className="text-sm text-red-600">{error}</div>;

  return (
    <div className="grid gap-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Badge className="bg-gradient-to-r from-neon-500/10 to-orchid-500/10">CMS</Badge>
          <h1 className="mt-3 text-2xl font-semibold">Contenu — Site (global)</h1>
          <p className="mt-2 text-sm text-ink-900/60">
            Vue d'ensemble du contenu éditorial. Utilisez les pages dédiées pour une édition complète, ou éditez directement ici.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setShowJson(!showJson)}>
            {showJson ? <FileText className="size-4" /> : <Code className="size-4" />}
            {showJson ? "Mode formulaire" : "Mode JSON"}
          </Button>
          <Button onClick={showJson ? saveJson : saveAll} disabled={saving}>
            <Save className="size-4" /> {saving ? "Enregistrement…" : "Enregistrer"}
          </Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>
      ) : null}

      {showJson ? (
        <div>
          <Card className="p-0">
            <textarea
              className="min-h-[520px] w-full resize-y rounded-2xl border border-black/10 bg-white/70 p-4 font-mono text-xs text-ink-900/80 outline-none focus:border-neon-500/60"
              value={jsonValue}
              onChange={(e) => setJsonValue(e.target.value)}
              placeholder="JSON du contenu..."
            />
          </Card>
          <div className="mt-2 text-xs text-ink-900/50">
            Astuce: c'est du JSON. Si tu fais une erreur de syntaxe, l'enregistrement refusera.
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {/* Home Section */}
          <Card className="overflow-hidden">
            <button
              onClick={() => toggleSection("home")}
              className="flex w-full items-center justify-between p-4 text-left hover:bg-white/50"
            >
              <div>
                <div className="text-sm font-semibold">Page d'accueil (Home)</div>
                <div className="mt-1 text-xs text-ink-900/60">
                  Hero, CTAs, paragraphes organisation, spotlight, appel Nord-Kivu
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link to="/admin/content/home" className="text-xs text-neon-600 hover:text-neon-700">
                  Éditer complètement →
                </Link>
                {expandedSections.home ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              </div>
            </button>
            {expandedSections.home && (
              <div className="border-t border-black/10 p-4">
                <div className="grid gap-3 text-sm">
                  <div>
                    <span className="text-xs text-ink-900/60">Titre:</span>
                    <div className="mt-1 font-semibold">{content?.home?.title || "—"}</div>
                  </div>
                  <div>
                    <span className="text-xs text-ink-900/60">Eyebrow:</span>
                    <div className="mt-1">{content?.home?.eyebrow || "—"}</div>
                  </div>
                  <div>
                    <span className="text-xs text-ink-900/60">CTAs:</span>
                    <div className="mt-1">
                      {(content?.home?.ctas ?? []).length > 0
                        ? content.home.ctas.map((cta, i) => (
                            <span key={i} className="mr-2 text-xs">
                              {cta.label}
                            </span>
                          ))
                        : "Aucun"}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-ink-900/60">Spotlight:</span>
                    <div className="mt-1">{content?.home?.spotlight?.name || "—"}</div>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Contest Section */}
          <Card className="overflow-hidden">
            <button
              onClick={() => toggleSection("contest")}
              className="flex w-full items-center justify-between p-4 text-left hover:bg-white/50"
            >
              <div>
                <div className="text-sm font-semibold">Concours</div>
                <div className="mt-1 text-xs text-ink-900/60">Timeline, Beauté avec un But</div>
              </div>
              <div className="flex items-center gap-3">
                <Link to="/admin/cms/contest" className="text-xs text-neon-600 hover:text-neon-700">
                  Éditer complètement →
                </Link>
                {expandedSections.contest ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              </div>
            </button>
            {expandedSections.contest && (
              <div className="border-t border-black/10 p-4">
                <div className="grid gap-3 text-sm">
                  <div>
                    <span className="text-xs text-ink-900/60">Titre:</span>
                    <div className="mt-1 font-semibold">{content?.contest?.title || "—"}</div>
                  </div>
                  <div>
                    <span className="text-xs text-ink-900/60">Timeline:</span>
                    <div className="mt-1">{(content?.contest?.timeline ?? []).length} étapes</div>
                  </div>
                  <div>
                    <span className="text-xs text-ink-900/60">Beauté avec un But:</span>
                    <div className="mt-1">{content?.contest?.bauteBut?.title || "—"}</div>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Delegations Section */}
          <Card className="overflow-hidden">
            <button
              onClick={() => toggleSection("delegations")}
              className="flex w-full items-center justify-between p-4 text-left hover:bg-white/50"
            >
              <div>
                <div className="text-sm font-semibold">Délégations</div>
                <div className="mt-1 text-xs text-ink-900/60">Régions et candidates</div>
              </div>
              <div className="flex items-center gap-3">
                <Link to="/admin/cms/delegations" className="text-xs text-neon-600 hover:text-neon-700">
                  Éditer complètement →
                </Link>
                {expandedSections.delegations ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              </div>
            </button>
            {expandedSections.delegations && (
              <div className="border-t border-black/10 p-4">
                <div className="grid gap-3 text-sm">
                  <div>
                    <span className="text-xs text-ink-900/60">Titre:</span>
                    <div className="mt-1 font-semibold">{content?.delegations?.title || "—"}</div>
                  </div>
                  <div>
                    <span className="text-xs text-ink-900/60">Régions:</span>
                    <div className="mt-1">
                      {(content?.delegations?.regions ?? []).length > 0
                        ? content.delegations.regions.map((r, i) => (
                            <span key={i} className="mr-2 text-xs">
                              {r.name} ({r.city})
                            </span>
                          ))
                        : "Aucune"}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Partners Section */}
          <Card className="overflow-hidden">
            <button
              onClick={() => toggleSection("partners")}
              className="flex w-full items-center justify-between p-4 text-left hover:bg-white/50"
            >
              <div>
                <div className="text-sm font-semibold">Partenariats</div>
                <div className="mt-1 text-xs text-ink-900/60">Types de partenariats et contact</div>
              </div>
              <div className="flex items-center gap-3">
                <Link to="/admin/cms/partners" className="text-xs text-neon-600 hover:text-neon-700">
                  Éditer complètement →
                </Link>
                {expandedSections.partners ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              </div>
            </button>
            {expandedSections.partners && (
              <div className="border-t border-black/10 p-4">
                <div className="grid gap-3 text-sm">
                  <div>
                    <span className="text-xs text-ink-900/60">Titre:</span>
                    <div className="mt-1 font-semibold">{content?.partners?.title || "—"}</div>
                  </div>
                  <div>
                    <span className="text-xs text-ink-900/60">Types:</span>
                    <div className="mt-1">{(content?.partners?.types ?? []).length} types définis</div>
                  </div>
                  <div>
                    <span className="text-xs text-ink-900/60">Email:</span>
                    <div className="mt-1">{content?.partners?.email || "—"}</div>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Contact Section */}
          <Card className="overflow-hidden">
            <button
              onClick={() => toggleSection("contact")}
              className="flex w-full items-center justify-between p-4 text-left hover:bg-white/50"
            >
              <div>
                <div className="text-sm font-semibold">Contact</div>
                <div className="mt-1 text-xs text-ink-900/60">Emails et informations de contact</div>
              </div>
              <div className="flex items-center gap-3">
                <Link to="/admin/cms/contact" className="text-xs text-neon-600 hover:text-neon-700">
                  Éditer complètement →
                </Link>
                {expandedSections.contact ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              </div>
            </button>
            {expandedSections.contact && (
              <div className="border-t border-black/10 p-4">
                <div className="grid gap-3 text-sm">
                  <div>
                    <span className="text-xs text-ink-900/60">Titre:</span>
                    <div className="mt-1 font-semibold">{content?.contact?.title || "—"}</div>
                  </div>
                  <div>
                    <span className="text-xs text-ink-900/60">Emails:</span>
                    <div className="mt-1">
                      {(content?.contact?.emails ?? []).length > 0
                        ? content.contact.emails.map((email, i) => (
                            <div key={i} className="text-xs">
                              {email}
                            </div>
                          ))
                        : "Aucun"}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Quick Links */}
          <Card className="bg-gradient-to-r from-neon-500/5 to-orchid-500/5">
            <div className="p-4">
              <div className="text-sm font-semibold mb-3">Pages d'édition dédiées</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link to="/admin/content/home" className="rounded-lg border border-black/10 bg-white/70 px-3 py-2 hover:bg-white">
                  📄 Page d'accueil
                </Link>
                <Link to="/admin/cms/contest" className="rounded-lg border border-black/10 bg-white/70 px-3 py-2 hover:bg-white">
                  🏆 Concours
                </Link>
                <Link to="/admin/cms/delegations" className="rounded-lg border border-black/10 bg-white/70 px-3 py-2 hover:bg-white">
                  👥 Délégations
                </Link>
                <Link to="/admin/cms/partners" className="rounded-lg border border-black/10 bg-white/70 px-3 py-2 hover:bg-white">
                  🤝 Partenariats
                </Link>
                <Link to="/admin/cms/contact" className="rounded-lg border border-black/10 bg-white/70 px-3 py-2 hover:bg-white">
                  📧 Contact
                </Link>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
