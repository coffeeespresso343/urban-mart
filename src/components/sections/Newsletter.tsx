import { ArrowRight, Check, Loader2 } from "lucide-react";
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
        <h2 className="mt-3 font-display text-3xl font-bold  tracking-tight sm:text-4xl">
          Get The Good Stuff.
        </h2>
        <p className="mt-4 mx-auto max-w-sm text-stone-light">
          New drops, useful finds, and urban essentials - straight to your
          inbox.
        </p>

        {status === "success" ? (
          <div className=" mt-8 rounded-xl flex flex-col items-center justify-center gap-2 border border-good/40 bg-good/10 px-4 py-3.5 text-sm text-green-400">
            <span className="h-8 w-8 rounded-full bg-good/30 flex justify-center items-center">
              <Check className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="mt-1 text-md"> You are subscribed.</h3>
            <p className="text-paper/80">Welcome to Urban-Mart!</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="mx-auto mt-8 flex max-w-sm gap-1 sm:flex-row"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              placeholder="you@email.com"
              className="font-mono text-xs flex-1 rounded-xl border border-white/20 bg-transparent px-4 py-3.5 text-paper placeholder:text-stone "
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="label-tag flex items-center justify-center gap-2 bg-paper px-3.5 py-3.5
              font-semibold text-ink transition-colors hover:bg-orange hover:text-paper disabled:opacity-60"
            >
              {status === "loading" ? "Subscribing..." : "Subscribe"}
              {status === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </form>
        )}
        {status === "error" ? (
          <p
            id="newsletter-error"
            role="alert"
            className="mt-3 text-xs text-red-400"
          >
            Enter a valid email address to subscribe.
          </p>
        ) : null}
      </div>
    </section>
  );
};

export default Newsletter;
