import { Check, Crown } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useUIStore } from "../../hooks/uiStore";

const VipTab = () => {
  const [vipUnlocked, setVipUnlocked] = useState(false);

  const [vipEmail, setVipEmail] = useState("");

  const showToast = useUIStore((s) => s.showToast);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (vipEmail) {
      setVipUnlocked(true);
      showToast("VIP Membership Activated! Code: VIPMEMBER22");
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText("VIPMEMBER22");
    showToast("Promo code 'VIPMEMBER22' copied to clipboard.", "success");
  };

  return (
    <div className="bg-ink text-paper rounded-3xl p-8 md:p-12 border border-line-light/20 relative overflow-hidden shadow-xl">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div
            className="inline-flex items-center gap-2 bg-ink-elevated px-3 py-1.5 rounded-full text-xs
          font-semibold text-orange border border-orange/30"
          >
            <Crown className="h-4 w-4 text-orange" />
            VIP Club Unlocked
          </div>

          <h2 className="text-3xl font-bold text-paper">
            Join the Insider Circle
          </h2>
          <p className="text-stone text-sm leading-relaxed">
            Subscribe to unlock secrect drops, early access to new seasonal
            collection, and an instanct 20% discount code.
          </p>

          <ul className="space-y-2 text-xs text-stone-light">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-good" /> Priority order fulfillment
            </li>

            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-good" /> Exclusive invite-only
              seasonal sales
            </li>

            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-good" /> Birthday surprise gifts
            </li>
          </ul>
        </div>

        <div className="bg-ink-soft p-6 rounded-2xl border border-line-light/70">
          {!vipUnlocked ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-bold text-paper">
                Unlock 20% off Instantly
              </h3>
              <p className="text-xs text-stone-light">
                Enter your email address to receive your private VIP code.
              </p>

              <input
                type="email"
                required
                value={vipEmail}
                onChange={(e) => setVipEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 bg-ink-elevated text-paper rounded-xl border border-line-light/20 focus:outline-none focus:border-orange text-sm"
              />

              <button
                type="submit"
                className="w-full py-3 bg-orange hover:bg-orange-dark text-paper font-semibold rounded-xl transition text-sm shadow-md"
              >
                Unlock VIP Privileges
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="h-12 w-12 bg-good/20 text-good rounded-full flex items-center justify-center mx-auto">
                <Check className="h-6 w-6" />
              </div>

              <h3 className="text-xl font-bold text-paper">
                Welcome to VIP Access
              </h3>
              <p className="text-xs text-stone-light">
                Use this code at checkout for 20% off
              </p>

              <div className="p-3 bg-ink-elevated rounded-xl font-mono text-orange-accent font-bold text-lg border border-orange-accent/30">
                VIPMEMBER20
              </div>
              <button
                onClick={handleCopy}
                className="text-xs text-orange-light underline hover:text-paper"
              >
                Click here to copy code
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VipTab;
