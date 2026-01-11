import { Routes, Route, Navigate } from "react-router-dom";

import { SiteLayout } from "./layouts/SiteLayout.jsx";
import { AdminLayout } from "./layouts/AdminLayout.jsx";

import { HomePage } from "./pages/HomePage.jsx";
import { NewsPage } from "./pages/NewsPage.jsx";
import { NewsArticlePage } from "./pages/NewsArticlePage.jsx";
import { BintiPage } from "./pages/BintiPage.jsx";
import { DelegationsPage } from "./pages/DelegationsPage.jsx";
import { ContestPage } from "./pages/ContestPage.jsx";
import { PartnersPage } from "./pages/PartnersPage.jsx";
import { ShopPage } from "./pages/ShopPage.jsx";
import { ContactPage } from "./pages/ContactPage.jsx";

import { AdminLoginPage } from "./pages/admin/AdminLoginPage.jsx";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage.jsx";
import { AdminHomeContentPage } from "./pages/admin/AdminHomeContentPage.jsx";
import { AdminCmsSitePage } from "./pages/admin/AdminCmsSitePage.jsx";
import { AdminCmsNewsPage } from "./pages/admin/AdminCmsNewsPage.jsx";
import { AdminCmsBintiPage } from "./pages/admin/AdminCmsBintiPage.jsx";
import { AdminCmsContestPage } from "./pages/admin/AdminCmsContestPage.jsx";
import { AdminCmsDelegationsPage } from "./pages/admin/AdminCmsDelegationsPage.jsx";
import { AdminCmsPartnersPage } from "./pages/admin/AdminCmsPartnersPage.jsx";
import { AdminCmsContactPage } from "./pages/admin/AdminCmsContactPage.jsx";

import { RequireAdmin } from "./routes/RequireAdmin.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/actualites" element={<NewsPage />} />
        <Route path="/actualites/:slug" element={<NewsArticlePage />} />
        <Route path="/binti" element={<BintiPage />} />
        <Route path="/delegations" element={<DelegationsPage />} />
        <Route path="/concours" element={<ContestPage />} />
        <Route path="/partenariats" element={<PartnersPage />} />
        <Route path="/boutique" element={<ShopPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="content/home" element={<AdminHomeContentPage />} />
        <Route path="cms/site" element={<AdminCmsSitePage />} />
        <Route path="cms/contest" element={<AdminCmsContestPage />} />
        <Route path="cms/delegations" element={<AdminCmsDelegationsPage />} />
        <Route path="cms/partners" element={<AdminCmsPartnersPage />} />
        <Route path="cms/contact" element={<AdminCmsContactPage />} />
        <Route path="cms/news" element={<AdminCmsNewsPage />} />
        <Route path="cms/binti" element={<AdminCmsBintiPage />} />
      </Route>

      <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}


