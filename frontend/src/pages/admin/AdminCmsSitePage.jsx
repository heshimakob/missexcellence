import { useEffect, useState } from "react";
import { Save } from "lucide-react";

import { adminFetch } from "../../lib/adminApi.js";
import { Badge } from "../../ui/Badge.jsx";
import { Button } from "../../ui/Button.jsx";
import { Card } from "../../ui/Card.jsx";

export function AdminCmsSitePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [value, setValue] = useState("");

  useEffect(() => {
    let alive = true;
    adminFetch("/api/admin/cms/site")
      .then((d) => {
        if (!alive) return;
        setValue(JSON.stringify(d.content, null, 2));
      })
      .catch((e) => setError(e.message || "Erreur"))
      .finally(() => setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <Badge className="bg-gradient-to-r from-neon-500/10 to-orchid-500/10">CMS</Badge>
          <h1 className="mt-3 text-2xl font-semibold">Contenu — Site (global)</h1>
          <p className="mt-2 text-sm text-ink-900/60">
            Tout le contenu éditorial du site (Home, Concours, Délégations, Partenaires, Contact).
          </p>
        </div>

        <Button
          disabled={saving || loading}
          onClick={async () => {
            setError(null);
            setSaving(true);
            try {
              const parsed = JSON.parse(value);
              await adminFetch("/api/admin/cms/site", {
                method: "PUT",
                body: JSON.stringify({ content: parsed }),
              });
            } catch (e) {
              setError(e.message || "Erreur");
            } finally {
              setSaving(false);
            }
          }}
        >
          <Save className="size-4" /> {saving ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </div>

      {error ? <div className="mt-4 text-sm text-red-600">{error}</div> : null}

      <div className="mt-6">
        <Card className="p-0">
          <textarea
            className="min-h-[520px] w-full resize-y rounded-2xl border border-black/10 bg-white/70 p-4 font-mono text-xs text-ink-900/80 outline-none focus:border-neon-500/60"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={loading ? "Chargement…" : ""}
          />
        </Card>
        <div className="mt-2 text-xs text-ink-900/50">
          Astuce: c’est du JSON. Si tu fais une erreur de syntaxe, l’enregistrement refusera.
        </div>
      </div>
    </div>
  );
}




