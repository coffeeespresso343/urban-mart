import { Check, Copy, Gift } from "lucide-react";
import { useState } from "react";
import { useUIStore } from "../../hooks/uiStore";

const mysteryBoxRewards = [
  { name: "Extra 25% Off Your Entire Cart", code: "MYSTERY25" },
  {
    name: "Free Luxury Gift Packaging + Express Shipping",
    code: "FREESHIPVIP",
  },
  { name: "$30 Instant Cash Voucher", code: "BONUS30" },
];

const MysteryTab = () => {
  const showToast = useUIStore((s) => s.showToast);

  const [mysteryRevealed, setMysteryRevealed] = useState(false);
  const [mysteryReward, setMysteryReward] = useState<{
    name: string;
    code: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  const revealMystery = () => {
    const randomReward =
      mysteryBoxRewards[Math.floor(Math.random() * mysteryBoxRewards.length)];

    setMysteryReward(randomReward);
    setMysteryRevealed(true);
  };

  const handleCopy = async () => {
    if (!mysteryReward) return;

    await navigator.clipboard.writeText(mysteryReward.code);
    showToast(
      `Promo code "${mysteryReward.code}" copied to clipboard.`,
      "success",
    );
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 4000);
  };

  return (
    <div className="bg-paper-dim border border-line-light rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto shadow-sm">
      <div className="inline-flex p-3 bg-orange/10 rounded-2xl text-orange mb-4">
        <Gift
          className="h-8 w-8 animate-bounce"
          // style={{ animationDuration: "2s" }}
        />
      </div>

      <h2 className="text-3xl font-extrabold text-ink mb-3">
        Reveal Your Daily Mystery Reward
      </h2>
      <p className="text-stone text-sm max-w-md mx-auto mb-8">
        Click the box below to unlock a guaranteed surprise coupon code for
        purchase today!
      </p>

      {!mysteryRevealed ? (
        <div
          onClick={revealMystery}
          className="group cursor-pointer relative bg-paper border-2 border-orange/20 hover:border-orange
        rounded-3xl p-10 max-w-xs mx-auto transition-all transform hover:-translate-y-1 shadow-md hover:shadow-xl"
        >
          <Gift className="h-20 w-20 text-orange mx-auto mb-4 group-hover:scale-110 transition-transform" />
          <span className="inline-block bg-orange text-paper font-semibold text-sm px-4 py-2 rounded-xl shadow-sm">
            Click to Open Box
          </span>
        </div>
      ) : (
        <div className="bg-paper border border-orange/40 rounded-3xl p-8 max-w-md mx-auto shadow-lg space-y-4 animate-fade-in">
          <div className="text-xs uppercase font-bold text-good tracking-wider">
            Congratulations!
          </div>
          <h3 className="text-sm font-bold text-ink">{mysteryReward?.name}</h3>

          <div
            className="p-3 bg-paper-dim border border-line-light rounded-xl font-mono text-lg
          text-orange font-bold tracking-wider"
          >
            {mysteryReward?.code}
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="w-full py-3 bg-orange hover:bg-orange-dark text-paper font-semibold rounded-xl transition
          flex items-center gap-2 justify-center shadow-md"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" /> Copy Coupon Code
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default MysteryTab;
