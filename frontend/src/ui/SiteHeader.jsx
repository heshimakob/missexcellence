import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

import { cn } from "../lib/cn.js";
import { Container } from "./Container.jsx";
import { Button } from "./Button.jsx";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Actualités", href: "/actualites" },
  { label: "Blog", href: "/blog" },
  { label: "Délégations", href: "/delegations" },
  { label: "Le concours", href: "/concours" },
  { label: "Partenariats", href: "/partenariats" },
  { label: "Boutique", href: "/boutique" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const active = useMemo(() => NAV.find((n) => n.href === location.pathname)?.label, [location.pathname]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-40">
      <div className="border-b border-black/10 bg-white/70 backdrop-blur">
        <Container className="flex h-16 items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="group flex items-center gap-3 rounded-xl px-2 py-1 hover:bg-black/5"
          >
            <div className="grid size-10 place-items-center rounded-xl bg-white/70 shadow-glow ring-1 ring-black/10">
              <img src="/logo.svg" alt="Miss Excellence" className="h-6 w-auto" />
            </div>
            <div className="text-left leading-tight">
              <div className="text-sm font-semibold tracking-wide">Miss Excellence</div>
              <div className="text-xs text-ink-900/60">Officiel</div>
            </div>
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "rounded-xl px-3 py-2 text-sm text-ink-900/70 hover:bg-black/5 hover:text-ink-900",
                    isActive && "bg-black/5 text-ink-900",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <Button variant="secondary" onClick={() => navigate("/admin")}>
                Backoffice
              </Button>
            </div>
            <button
              className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white/70 p-2 text-ink-900/80 hover:bg-white md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </Container>
      </div>

      {open && (
        <div className="border-b border-black/10 bg-white/80 backdrop-blur md:hidden">
          <Container className="py-3">
            <div className="mb-2 text-xs font-semibold text-ink-900/50">Navigation{active ? ` — ${active}` : ""}</div>
            <div className="grid gap-1">
              {NAV.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "rounded-xl px-3 py-2 text-sm text-ink-900/75 hover:bg-black/5",
                      isActive && "bg-black/5 text-ink-900",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <Button className="mt-2 w-full" variant="secondary" onClick={() => navigate("/admin")}>
                Backoffice
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}


