import { Check, Loader2, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { isValidEmail } from "../../utils/validation";

type Status = "idle" | "loading" | "success" | "error";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setStatus("error");
      return;
    }

    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
    }, 700);
  };

  return (
    <section className="bg-ink py-20 text-paper-dim sm:py-28">
      <div className="container-edge mx-auto max-w-xl text-center">
        <span className="label-tag text-orange">Stay in The Loop</span>

        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Get The Good Stuff.
        </h2>

        <p className="mx-auto mt-4 max-w-sm text-stone-light">
          New drops, useful finds, and urban essentials - straight to your
          inbox.
        </p>

        {status === "success" ? (
          <div className="mt-8 flex flex-col items-center justify-center gap-2 rounded-xl border border-good/40 bg-good/10 px-4 py-4 text-sm text-green-400">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-good/30">
              <Check className="h-5 w-5" aria-hidden="true" />
            </span>

            <h3 className="mt-1 text-md">You are subscribed.</h3>

            <p className="text-paper/80">Welcome to Urban-Mart!</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="mx-auto mt-8 flex max-w-sm gap-2"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>

            <input
              id="newsletter-email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);

                if (status === "error") {
                  setStatus("idle");
                }
              }}
              placeholder="you@email.com"
              autoComplete="email"
              aria-invalid={status === "error"}
              aria-describedby={
                status === "error" ? "newsletter-error" : undefined
              }
              className="min-w-0 h-10 flex-1 rounded-full bg-ink-elevated px-5 py-3 text-sm text-paper outline-none placeholder:text-stone transition-all focus:ring-2 focus:ring-orange/50"
            />

            <button
              type="submit"
              disabled={status === "loading"}
              aria-label={
                status === "loading"
                  ? "Subscribing..."
                  : "Subscribe to newsletter"
              }
              className="label-tag h-10 flex items-center justify-center gap-2 rounded-full bg-orange px-3 py-3 font-semibold text-ink transition-all hover:bg-paper-dim disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.97]"
            >
              {status === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </form>
        )}

        <div className="min-h-6">
          {status === "error" && (
            <p
              id="newsletter-error"
              role="alert"
              className="mt-3 text-xs text-red-400"
            >
              Please enter a valid email address to subscribe
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
