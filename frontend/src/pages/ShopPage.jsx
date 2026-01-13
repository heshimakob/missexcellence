import { ShoppingBag } from "lucide-react";
import { PageShell } from "../ui/PageShell.jsx";
import { Card } from "../ui/Card.jsx";
import { SEO } from "../components/SEO.jsx";

export function ShopPage() {
  return (
    <>
      <SEO
        title="Boutique"
        description="Boutique officielle Miss Excellence — Produits premium, goodies, billets et éditions limitées."
        url="/boutique"
      />
      <PageShell
        eyebrow="Boutique"
        title="Boutique officielle (bientôt)"
        subtitle="Espace prêt pour une boutique (produits, commandes, paiement)."
      >
      <Card className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Produits premium</div>
          <p className="mt-2 text-sm text-ink-900/60">Goodies, billets, éditions limitées.</p>
        </div>
        <ShoppingBag className="size-6 text-ink-900/60" />
      </Card>
    </PageShell>
    </>
  );
}


