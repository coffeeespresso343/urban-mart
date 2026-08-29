import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Mail, ShoppingCart } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { isValidEmail, isValidPassword, required } from "../utils/validation";
import { useUIStore } from "../hooks/uiStore";

type Mode = "sign-in" | "sign-up" | "magic-link";

type FieldName = "email" | "password" | "firstName" | "lastName";

type FiledErrors = {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  form?: string;
};

const Login = () => {
  const {
    user,
    isConfigured,
    signInWithPassword,
    signUpWithPassword,
    signInWithMagicLink,
  } = useAuth();

  const showToast = useUIStore((s) => s.showToast);

  const [mode, setMode] = useState<Mode>("sign-in");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FiledErrors>({});
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

  const handleChange = (field: FieldName, value: string) => {
    const setters = {
      email: setEmail,
      password: setPassword,
      firstName: setFirstName,
      lastName: setLastName,
    };

    setters[field](value);

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: FiledErrors = {};

    if (!required(email)) {
      newErrors.email = "Valid email address is required.";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (mode !== "magic-link") {
      if (!required(password)) {
        newErrors.password = "Password is required.";
      } else if (!isValidPassword(password)) {
        newErrors.password = "Password must be at least 8 characters.";
      }
    }

    if (mode === "sign-up") {
      if (!required(firstName)) {
        newErrors.firstName = "First name is required.";
      }

      if (!required(lastName)) {
        newErrors.lastName = "Last name is required.";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "magic-link") {
        const { error: authError } = await signInWithMagicLink(email);

        if (authError) {
          setErrors({ form: authError });

          showToast(authError, "error");
        } else {
          setMagicLinkSent(true);
          showToast(`Check ${email} for a sign-in link`, "success");
        }

        return;
      }

      if (mode === "sign-up") {
        const { error: authError } = await signUpWithPassword(
          email,
          password,
          firstName,
          lastName,
        );

        if (authError) {
          setErrors({
            form: authError,
          });
        } else {
          navigate(redirectTo, { replace: true });
          showToast(
            "Account created successfully. Welcome to Urban-Mart!",
            "success",
          );
        }

        return;
      }

      const { error: authError } = await signInWithPassword(email, password);

      if (authError) {
        setErrors({
          form: authError,
        });
      } else {
        navigate(redirectTo, { replace: true });

        showToast("Login successful! Welcome back to Urban-Mart.", "success");
      }
    } finally {
      setIsSubmitting(false);
    }
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
          <div className="mt-8 flex flex-col items-center gap-3 rounded-lg border border-good/30 bg-good/10 p-4">
            <motion.span
              initial={{ opacity: 0, scale: 0.6, rotate: 95 }}
              animate={{ opacity: 1, scale: 1, rotate: 360 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
            >
              <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-good" />
            </motion.span>
            <p className="text-sm text-good">
              Sign-in link sent to <strong>{email}</strong>
            </p>
            <p className="text-sm text-good">Please check your inbox.</p>
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
                    id="firstName"
                    value={firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    placeholder="Kyaw"
                    className={`border rounded-lg bg-paper px-3.5 py-2 outline-none text-sm focus:border-ink ${
                      errors.firstName ? "border-error" : "border-line-light"
                    }`}
                  />
                  {errors.firstName && (
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-error">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="first-name" className="label-tag text-stone">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    placeholder="Gyi"
                    className={`border rounded-lg bg-paper px-3.5 py-2 outline-none text-sm focus:border-ink ${
                      errors.lastName ? "border-error" : "border-line-light"
                    }`}
                  />
                  {errors.lastName && (
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-error">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      {errors.lastName}
                    </p>
                  )}
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
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="you@example.com"
                className={`border rounded-lg bg-paper px-3.5 py-2 outline-none text-sm focus:border-ink ${
                  errors.email ? "border-error" : "border-line-light"
                }`}
              />
              {errors.email && (
                <p className="mt-0.5 flex items-center gap-1 text-xs text-error">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {errors.email}
                </p>
              )}
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
                  className={`border rounded-lg bg-paper px-3.5 py-2 outline-none text-sm focus:border-ink ${
                    errors.password ? "border-error" : "border-line-light"
                  }`}
                />
                {errors.password && (
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-error">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {errors.password}
                  </p>
                )}
              </div>
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
                  setErrors({});
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
                onClick={() => {
                  setMode("sign-in");
                  setMagicLinkSent(false);
                }}
                className="font-medium text-ink underline"
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              New to Urban-Mart?{" "}
              <button
                onClick={() => {
                  setMode("sign-up");
                  setMagicLinkSent(false);
                }}
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
