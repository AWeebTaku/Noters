import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

// Shown while the session check runs. Free hosting sleeps, so the first request can take a while.
export function SessionLoading() {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setSlow(true), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-3 px-4 text-center">
      <span className="loading loading-spinner loading-lg text-primary" />
      {slow && (
        <p role="status" className="max-w-sm text-base-content/70">
          Waking up the server. This app runs on free hosting that sleeps when idle, so the first
          load can take up to a minute.
        </p>
      )}
    </div>
  );
}

const ProtectedRoute = () => {
  const { user } = useAuth();
  if (user === undefined) return <SessionLoading />;
  if (user === null) return <Navigate to="/login" replace />;
  return <Outlet />;
};
export default ProtectedRoute;
