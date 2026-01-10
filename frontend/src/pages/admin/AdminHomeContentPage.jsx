import { useEffect, useState } from "react";
import { Braces } from "lucide-react";

import { apiFetch } from "../../lib/api.js";
import { Card } from "../../ui/Card.jsx";
import { Badge } from "../../ui/Badge.jsx";

export function AdminHomeContentPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    apiFetch("/api/public/home").then(setData).catch(() => setData(null));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <Badge className="bg-gradient-to-r from-neon-500/10 to-orchid-500/10">Contenu</Badge>
          <h1 className="mt-3 text-2xl font-semibold">Home — Données (mock)</h1>
          <p className="mt-2 text-sm text-ink-900/60">
            Version initiale: preview JSON. Prochaine étape: formulaires d’édition + persistance (DB).
          </p>
        </div>
        <Braces className="hidden size-6 text-ink-900/50 md:block" />
      </div>

      <div className="mt-6 grid gap-4">
        <Card className="overflow-auto">
          <pre className="text-xs leading-relaxed text-ink-900/70">{JSON.stringify(data, null, 2)}</pre>
        </Card>
      </div>
    </div>
  );
}


