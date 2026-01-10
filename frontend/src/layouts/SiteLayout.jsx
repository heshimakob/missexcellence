import { Outlet } from "react-router-dom";
import { SiteHeader } from "../ui/SiteHeader.jsx";
import { SiteFooter } from "../ui/SiteFooter.jsx";
import { AmbientBackground } from "../ui/AmbientBackground.jsx";

export function SiteLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <AmbientBackground />
      <SiteHeader />
      <main className="relative z-10 flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}


