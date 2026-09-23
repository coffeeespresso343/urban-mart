import { Check, Copy, Crown, Flame, Gift, Truck, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import ImageWithFallback from "../ui/ImageWithFallback";
import { useUIStore } from "../../hooks/uiStore";
import FlashTab from "../promotion/FlashTab";
import MysteryTab from "../promotion/MysteryTab";
import VipTab from "../promotion/VipTab";

const dealOftTheDay = {
  title: "Artisan Ceramic & Brew Set",
  subtitle: "Limited Edition Handcrafted Collection",
  originalPrice: 180,
  discountPrice: 150,
  claimedPercent: 83,
  stockedLeft: 7,
  code: "FLASH22",
  image:
    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
};

const Promotion = () => {
  const [activeTab, setActiveTab] = useState<"flash" | "mystery" | "vip">(
    "flash",
  );
  const [timer, setTimer] = useState({ hours: 7, minutes: 24, seconds: 18 });
  const [copiedCode, setCopiedCode] = useState(null);

  const showToast = useUIStore((s) => s.showToast);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimer((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0)
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0)
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };

        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  });

  const copyToClipboard = (code, label) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Promo code "${code}" copied to clipboard!`, "success");
    setTimeout(() => {
      setCopiedCode(null);
    }, 3000);
  };

  return (
    <div className="container-edge py-10 sm:py-14 min-h-screen bg-paper text-ink transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-12">
        <section className="relative overflow-hidden rounded-3xl p-8 lg:p-12 border border-line-light bg-ink shadow-2xl">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-accent/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-orange-dark/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative grid grid-cols-1 gap-8 md:grid-cols-2 items-center text-paper">
            {/** Left Content */}
            <div className="space-y-6">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-ink-elevated border border-orange/40 rounded-full text-xs uppercase
              tracking-wider font-semibold text-orange-light"
              >
                <Flame className="h-4 w-4 text-orange animate-bounce" /> Limited
                Time Offers
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-paper leading-tight">
                Unlock Unbeatable Savings with Our{" "}
                <span className="text-orange underline decoration-orange-light/30">
                  Flash Deals
                </span>
              </h1>

              <p className="text-stone-light text-base md:text-lg max-w-xl">
                Elevate your space with premium artisan essentials. Grab
                exclusive discounts before the countdown runs out.
              </p>

              <div className="flex items-center gap-3 pt-3">
                <span className="text-xs uppercase tracking-wider text-stone-light font-medium mr-2 hidden md:inline">
                  Ends In:
                </span>
                <div className="flex gap-2 text-center font-mono">
                  <div className="bg-ink-elevated border border-line-light/20 rounded-xl px-3.5 py-2 min-w-15 shadow-inner">
                    <span className="block text-2xl font-bold text-orange">
                      {String(timer.hours).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] uppercase text-stone-light">
                      Hours
                    </span>
                  </div>

                  <span className="text-2xl font-bold text-orange py-2">:</span>

                  <div className="bg-ink-elevated border border-line-light/20 rounded-xl px-3.5 py-2 min-w-15 shadow-inner">
                    <span className="block text-2xl font-bold text-orange">
                      {String(timer.minutes).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] uppercase text-stone-light">
                      Mins
                    </span>
                  </div>

                  <span className="text-2xl font-bold text-orange py-2">:</span>

                  <div className="bg-ink-elevated border border-line-light/20 rounded-xl px-3.5 py-2 min-w-15 shadow-inner animate-pulse">
                    <span className="block text-2xl font-bold text-orange">
                      {String(timer.seconds).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] uppercase text-stone-light">
                      Secs
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/** Right Content */}
            <div className="p-6 bg-ink-soft/80 backdrop-blur-md rounded-2xl border border-line-light/10 shadow-lg">
              <div className="mb-4 flex items-center gap-3 justify-between">
                <span
                  className="bg-orange/20 text-orange-light text-xs px-3 py-1 rounded-full font-semibold
                border border-orange/30"
                >
                  Top Deal
                </span>
                <span className="flex items-center gap-1 text-xs text-stone-light">
                  <Truck className="h-3.5 w-3.5" /> Fast Delivery
                </span>
              </div>

              <div className="aspect-video w-full rounded-xl overflow-hidden mb-4 relative group">
                <ImageWithFallback
                  src={dealOftTheDay.image}
                  alt={dealOftTheDay.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 bg-orange text-paper font-bold text-xs px-2.5 py-1 rounded-lg shadow-md">
                  40% OFF
                </div>
              </div>

              <h3 className="text-xl font-bold text-paper mb-1">
                {dealOftTheDay.title}
              </h3>
              <p className="text-xs text-stone-light mb-4">
                {dealOftTheDay.subtitle}
              </p>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-extrabold text-orange">
                  ${dealOftTheDay.discountPrice}
                </span>
                <span className="text-sm text-stone line-through">
                  ${dealOftTheDay.originalPrice}
                </span>
              </div>

              <div className="mb-5 space-y-1.5">
                <div className="flex text-xs items-center justify-between gap-2">
                  <span>Claimed: {dealOftTheDay.claimedPercent}%</span>
                  <span className="font-medium text-orange-light">
                    Only {dealOftTheDay.stockedLeft} left
                  </span>
                </div>

                <div className="bg-ink-elevated w-full h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-orange h-full transition-all duration-1000"
                    style={{ width: `${dealOftTheDay.claimedPercent}%` }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  copyToClipboard(dealOftTheDay.code, "Flash Code")
                }
                className="w-full py-3 px-4 bg-orange hover:bg-orange-dark rounded-xl text-paper font-semibold transition flex items-center gap-2 justify-center shadow-lg"
              >
                {copiedCode === dealOftTheDay.code ? (
                  <>
                    <Check className="h-4 w-4 animate-bounce" /> Code Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" /> Claim Code:{" "}
                    {dealOftTheDay.code}
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        <div className="flex justify-center border-b border-line-light/60 pb-2">
          <nav className="flex items-center gap-2 sm:gap-6 bg-paper-dim p-1.5 rounded-2xl border border-line-light/40 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab("flash")}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "flash"
                  ? "bg-ink text-paper shadow-md"
                  : "text-stone hover:text-ink"
              }`}
            >
              <Zap className="h-4 w-4 text-orange shrink-0" /> Deals & Bundles
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("mystery")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "mystery"
                  ? "bg-ink text-paper shadow-md"
                  : "text-stone hover:text-ink"
              }`}
            >
              <Gift className="h-4 w-4 text-orange shrink-0" /> Mystery Reward
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("vip")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "vip"
                  ? "bg-ink text-paper shadow-md"
                  : "text-stone hover:text-ink"
              }`}
            >
              <Crown className="h-4 w-4 text-orange shrink-0" /> VIP Member
              Perks
            </button>
          </nav>
        </div>

        {activeTab === "flash" && <FlashTab />}
        {activeTab === "mystery" && <MysteryTab />}
        {activeTab === "vip" && <VipTab />}
      </div>
    </div>
  );
};

export default Promotion;
