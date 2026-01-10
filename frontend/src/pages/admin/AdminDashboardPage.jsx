import { useEffect, useState } from "react";
import { Shield, Sparkles } from "lucide-react";

import { apiFetch } from "../../lib/api.js";
import { getAdminToken } from "../../lib/adminAuth.js";
import { Card } from "../../ui/Card.jsx";
import { Badge } from "../../ui/Badge.jsx";

export function AdminDashboardPage() {
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = getAdminToken();
    apiFetch("/api/admin/me", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then((d) => setAdmin(d.admin))
      .catch((e) => setError(e.message || "Erreur"));
  }, []);

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <Badge className="bg-gradient-to-r from-neon-500/10 to-orchid-500/10">Dashboard</Badge>
          <h1 className="mt-3 text-2xl font-semibold">Bienvenue</h1>
          <p className="mt-2 text-sm text-ink-900/60">
            {admin ? `Connecté en tant que ${admin.email}` : "Validation de session…"}
          </p>
          {error ? <div className="mt-3 text-sm text-red-300">{error}</div> : null}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Shield className="size-4 text-neon-500" />
            Sécurité
          </div>
          <p className="mt-2 text-sm text-ink-900/60">
            Auth admin en mémoire (placeholder). À remplacer par JWT + DB/Redis.
          </p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="size-4 text-orchid-400" />
            Contenu
          </div>
          <p className="mt-2 text-sm text-ink-900/60">
            Prochaine étape: éditer le contenu (home, actus, candidates) via formulaires + stockage.
          </p>
        </Card>
      </div>
    </div>
  );
}


