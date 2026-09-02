import type { ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { user, isLoading, isAdmin, isAdminLoading, isConfigured } = useAuth();

  if (!isConfigured) {
    return (
      <div className="container-edge flex min-h-[50vh] items-center justify-center py-16 text-center">
        <p className="max-w-sm text-stone text-sm">
          Admin dashboard requires to connect Supabase project - see
          <code className="label-tag">supabase/schema-admin.sql</code>.
        </p>
      </div>
    );
  }

  if (isLoading || isAdminLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span
          className="h-8 w-8 animate-spin rounded-full border-2 border-ink border-t-transparent"
          aria-hidden="true"
        />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" state={{ from: "/admin" }} replace />;
  // if (!isAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default AdminRoute;
