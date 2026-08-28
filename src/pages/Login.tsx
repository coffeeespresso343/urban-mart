import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Mail, ShoppingCart } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { isValidEmail, isValidPassword, required } from "../utils/validation";

type Mode = "sign-in" | "sign-up" | "magic-link";

const Login = () => {
  const {
    user,
    isConfigured,
    signInWithPassword,
    signUpWithPassword,
    signInWithMagicLink,
  } = useAuth();

  const [mode, setMode] = useState<Mode>("sign-in");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo =
    (
      location.state as {
        from?: string;
      } | null
    )?.from ?? "/account/orders";

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    if (mode === "magic-link") {
      const { error: authError } = await signInWithMagicLink(email);
      setIsSubmitting(false);
      if (authError) setError(authError);
      else setMagicLinkSent(true);
      return;
    }

    if (!isValidPassword(password)) {
      setError("Password must be at least 8 characters.");
      setIsSubmitting(false);
      return;
    }

    if (mode === "sign-up") {
      if (!required(firstName) || !required(lastName)) {
        setError("First and last name are required.");
        setIsSubmitting(false);
        return;
      }

      const { error: authError } = await signUpWithPassword(
        email,
        password,
        firstName,
        lastName,
      );

      setIsSubmitting(false);
      if (authError) setError(authError);
      else navigate(redirectTo, { replace: true });
      return;
    }

    const { error: authError } = await signInWithPassword(email, password);
    setIsSubmitting(false);
    if (authError) setError(authError);
    else navigate(redirectTo, { replace: true });
  };

  return (
    <div className="container-edge flex min-h-[70vh] items-center justify-center py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="flex flex-col items-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-0.5 font-body text-lg font-black tracking-tight sm:text-xl"
          >
            Urban <span className="text-orange">Mart</span>
            <ShoppingCart className="h-5 w-5 text-orange" strokeWidth={2.5} />
          </Link>

          <h1 className="mt-6 font-display text-2xl font-bold">
            {mode === "sign-up" ? "Create Account" : "Sign In"}
          </h1>
          <p className="mt-2 text-sm text-stone">
            {mode === "sign-up"
              ? "Save addresses and track orders across devices."
              : "Access your order history and saved details."}
          </p>
        </div>

        {magicLinkSent ? (
          <div className="mt-8 flex items-start gap-3 rounded-lg border border-good/30 bg-good/10 p-4">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-good" />
            <p className="text-sm text-good">
              Check <strong>{email}</strong> for a sign-in link
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            {mode === "sign-up" ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="first-name" className="label-tag text-stone">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="first-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Kyaw"
                    className="border border-line-light rounded-lg bg-paper px-3.5 py-2 outline-none text-sm focus:border-ink"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="first-name" className="label-tag text-stone">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="last-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Gyi"
                    className="border border-line-light rounded-lg bg-paper px-3.5 py-2 outline-none text-sm focus:border-ink"
                  />
                </div>
              </div>
            ) : null}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="label-tag text-stone">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="border border-line-light rounded-lg bg-paper px-3.5 py-2 outline-none text-sm focus:border-ink"
              />
            </div>

            {mode !== "magic-link" ? (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="label-tag text-stone">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters."
                  className="border border-line-light rounded-lg bg-paper px-3.5 py-2 outline-none text-sm focus:border-ink"
                />
              </div>
            ) : null}

            {error ? (
              <p className="flex items-start gap-1 text-xs text-warn">
                <AlertCircle className=" h-3.5 w-3.5 shrink-0" />
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              size="md"
              className="mt-2"
              isLoading={isSubmitting}
            >
              {mode === "sign-up"
                ? "Create Account"
                : mode === "magic-link"
                  ? "Send Magic Link"
                  : "Sign In"}
            </Button>

            {mode !== "magic-link" ? (
              <button
                type="button"
                onClick={() => {
                  setMode("magic-link");
                  setError(null);
                }}
                className="label-tag mt-2 flex items-center justify-center gap-1.5 text-stone hover:text-ink"
              >
                <Mail className="h-3.5 w-3.5 shrink-0" />
                Email me a sign-in link instead.
              </button>
            ) : null}
          </form>
        )}

        <p className="mt-8 text-center text-sm text-stone">
          {mode === "sign-up" ? (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("sign-in")}
                className="font-medium text-ink underline"
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              New to Urban-Mart?{" "}
              <button
                onClick={() => setMode("sign-up")}
                className="font-medium text-ink underline"
              >
                Create an Account
              </button>
            </>
          )}
        </p>

        <p className="mt-4 text-center">
          <Link to="/shop" className="label-tag text-stone hover:text-ink">
            Continue as Guest
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
