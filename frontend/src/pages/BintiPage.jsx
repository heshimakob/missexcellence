import { FileText } from "lucide-react";
import { PageShell } from "../ui/PageShell.jsx";
import { Card } from "../ui/Card.jsx";

export function BintiPage() {
  return (
    <PageShell
      eyebrow="Binti"
      title="Bientôt disponible"
      subtitle="Un espace éditorial dédié aux actualités et contenus exclusifs de Miss Excellence."
    >
      <Card className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Contenu en préparation</div>
          <p className="mt-2 text-sm text-ink-900/60">Articles, éditos, coulisses et actualités à venir prochainement.</p>
        </div>
        <FileText className="size-6 text-ink-900/60" />
      </Card>
    </PageShell>
  );
}
