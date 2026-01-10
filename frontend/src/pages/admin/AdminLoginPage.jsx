import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";

import { apiFetch } from "../../lib/api.js";
import { setAdminToken } from "../../lib/adminAuth.js";
import { Container } from "../../ui/Container.jsx";
import { Card } from "../../ui/Card.jsx";
import { Button } from "../../ui/Button.jsx";
import { Badge } from "../../ui/Badge.jsx";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/admin";

  const [email, setEmail] = useState("admin@miss-excellence.local");
  const [password, setPassword] = useState("ChangeMeNow!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div className="min-h-dvh bg-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-20 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-r from-neon-500/25 to-orchid-500/25 blur-3xl" />
      </div>

      <Container className="relative z-10 grid min-h-dvh place-items-center py-12">
        <Card className="w-full max-w-md">
          <Badge className="bg-gradient-to-r from-neon-500/10 to-orchid-500/10">Backoffice</Badge>
          <h1 className="mt-4 text-2xl font-semibold">Connexion administrateur</h1>
          <p className="mt-2 text-sm text-ink-900/60">Connecte-toi pour gérer le contenu et la plateforme.</p>

          <form
            className="mt-6 grid gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              setLoading(true);
              try {
                const res = await apiFetch("/api/admin/auth/login", {
                  method: "POST",
                  body: JSON.stringify({ email, password }),
                });
                setAdminToken(res.token);
                navigate(from, { replace: true });
              } catch (err) {
                setError(err.message || "Erreur");
              } finally {
                setLoading(false);
              }
            }}
          >
            <label className="grid gap-1">
              <span className="text-xs text-ink-900/60">Email</span>
              <div className="flex items-center gap-2 rounded-xl border border-black/10 bg-white/70 px-3">
                <Mail className="size-4 text-ink-900/50" />
                <input
                  className="h-11 w-full bg-transparent text-sm outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </label>

            <label className="grid gap-1">
              <span className="text-xs text-ink-900/60">Mot de passe</span>
              <div className="flex items-center gap-2 rounded-xl border border-black/10 bg-white/70 px-3">
                <Lock className="size-4 text-ink-900/50" />
                <input
                  type="password"
                  className="h-11 w-full bg-transparent text-sm outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
            </label>

            {error ? <div className="text-sm text-red-300">{error}</div> : null}

            <Button type="submit" disabled={loading}>
              {loading ? "Connexion…" : "Se connecter"}
            </Button>

            <div className="text-xs text-ink-900/45">
              Astuce: configure `backend/.env` depuis `backend/env.example.txt`.
            </div>
          </form>
        </Card>
      </Container>
    </div>
  );
}


