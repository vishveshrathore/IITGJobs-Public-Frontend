import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authcontext.jsx";

/**
 * ProtectedRoute
 * - Guards routes for both Internal users (LG/Admin/CRE) and Corporate (Employer) accounts.
 *
 * Props:
 * - children: ReactNode (required)
 * - requireCorporate: boolean | undefined -> if true, only corporate (employer) accounts can access
 * - redirectTo: string -> default redirect when not authenticated (default: "/")
 * - corporateRedirectTo: string -> redirect when requireCorporate=true fails (default: "/employer/login")
 *
 * Notes:
 * - Uses AuthContext first, then falls back to storage (token/role or corp_token/corp_account)
 * - Role aliases supported via roleAliases mapping
 */
const ProtectedRoute = ({ requireCorporate = false, redirectTo = "/", corporateRedirectTo = "/employer/login" }) => {
  const { isHydrating, isAuthenticated, isCorporate } = useAuth();

  // Wait for hydration so we don't incorrectly redirect during first paint
  if (isHydrating) return null;

  // Must be authenticated
  if (!isAuthenticated) {
    return <Navigate to={requireCorporate ? corporateRedirectTo : redirectTo} replace />;
  }

  // Corporate-only
  if (requireCorporate && !isCorporate) {
    return <Navigate to={corporateRedirectTo} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
