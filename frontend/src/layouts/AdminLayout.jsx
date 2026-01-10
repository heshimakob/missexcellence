import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutGrid, LogOut } from "lucide-react";

import { cn } from "../lib/cn.js";
import { clearAdminToken } from "../lib/adminAuth.js";
import { Container } from "../ui/Container.jsx";

export function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-white">
      <div className="sticky top-0 z-30 border-b border-black/10 bg-white/70 backdrop-blur">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-white/70 shadow-glow ring-1 ring-black/10">
              <img src="/logo.svg" alt="Miss Excellence" className="h-6 w-auto" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">Backoffice</div>
              <div className="text-xs text-ink-900/60">Miss Excellence</div>
            </div>
          </div>

          <button
            onClick={() => {
              clearAdminToken();
              navigate("/admin/login", { replace: true });
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm text-ink-900/80 hover:bg-white"
          >
            <LogOut className="size-4" />
            Déconnexion
          </button>
        </Container>
      </div>

      <Container className="grid gap-6 py-8 md:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-2xl border border-black/10 bg-white/70 p-3 shadow-glow">
          <div className="mb-3 flex items-center gap-2 px-2 text-xs font-semibold text-ink-900/60">
            <LayoutGrid className="size-4" />
            Navigation
          </div>
          <nav className="grid gap-1">
            <AdminNavItem to="/admin" end label="Dashboard" />
            <AdminNavItem to="/admin/content/home" label="Contenu — Home" />
            <AdminNavItem to="/admin/cms/site" label="CMS — Site (global)" />
            <AdminNavItem to="/admin/cms/contest" label="CMS — Concours" />
            <AdminNavItem to="/admin/cms/delegations" label="CMS — Délégations" />
            <AdminNavItem to="/admin/cms/partners" label="CMS — Partenariats" />
            <AdminNavItem to="/admin/cms/contact" label="CMS — Contact" />
            <AdminNavItem to="/admin/cms/news" label="CMS — Actualités" />
            <AdminNavItem to="/admin/cms/blog" label="CMS — Blog" />
          </nav>
        </aside>

        <section className="min-h-[60vh] rounded-2xl border border-black/10 bg-white/70 p-5 shadow-glow">
          <Outlet />
        </section>
      </Container>
    </div>
  );
}

function AdminNavItem({ to, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "rounded-xl px-3 py-2 text-sm text-ink-900/75 hover:bg-black/5",
          isActive && "bg-black/5 text-ink-900",
        )
      }
    >
      {label}
    </NavLink>
  );
}


