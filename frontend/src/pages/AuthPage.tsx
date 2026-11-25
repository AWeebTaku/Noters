import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../lib/utils";

// Public demo account. Created by `npm run seed` in the backend; keep in sync with scripts/seed-demo.ts.
const DEMO = { email: "demo@noters.app", password: "demo-notes-2026" };

const AuthPage = ({ mode }: { mode: "login" | "register" }) => {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const isLogin = mode === "login";
  if (user) return <Navigate to="/" replace />;

  const submit = async (e: string, p: string) => {
    setError("");
    setBusy(true);
    try {
      await (isLogin ? login : register)(e, p);
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err, "Something went wrong. Try again."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-sm flex-col justify-center px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">
        {isLogin ? "Log in to Noters" : "Create your account"}
      </h1>

      <form
        className="mt-8 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          submit(email, password);
        }}
      >
        <div>
          <label htmlFor="email" className="label mb-2 text-base-content">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            className="input w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password" className="label mb-2 text-base-content">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            autoComplete={isLogin ? "current-password" : "new-password"}
            className="input w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {!isLogin && (
            <p className="mt-2 text-sm text-base-content/70">At least 8 characters.</p>
          )}
        </div>

        {error && (
          <p role="alert" className="text-sm text-error">
            {error}
          </p>
        )}

        <button type="submit" className="btn btn-primary w-full" disabled={busy}>
          {busy ? "Please wait..." : isLogin ? "Log in" : "Create account"}
        </button>
      </form>

      {isLogin && (
        <button
          type="button"
          className="btn btn-outline mt-3 w-full"
          disabled={busy}
          onClick={() => submit(DEMO.email, DEMO.password)}
        >
          Try the demo account
        </button>
      )}

      <p className="mt-6 text-sm text-base-content/70">
        {isLogin ? "New here? " : "Already have an account? "}
        <Link to={isLogin ? "/register" : "/login"} className="link link-primary">
          {isLogin ? "Create an account" : "Log in"}
        </Link>
      </p>
    </main>
  );
};
export default AuthPage;
