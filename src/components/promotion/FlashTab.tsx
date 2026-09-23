import {
  Award,
  Layers,
  RefreshCcw,
  ShieldCheck,
  ShoppingBag,
  Tag,
} from "lucide-react";
import { useState } from "react";
import ImageWithFallback from "../ui/ImageWithFallback";

const bundleProducts = [
  {
    id: 1,
    name: "Handcrafted Coffee Dripper",
    price: 65,
    image:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 2,
    name: "Double-Wall Thermal Mug",
    price: 35,
    image:
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 3,
    name: "Single-Origin Dark Roast Beans",
    price: 28,
    image:
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=300&q=80",
  },
];

const FlashTab = () => {
  const [selectedBundleItems, setSelectedBundleItems] = useState([1, 2]);

  const totalBundlePrice = selectedBundleItems.reduce((sum, id) => {
    const item = bundleProducts.find((p) => p.id === id);
    return sum + (item ? item.price : 0);
  }, 0);

  const bundleDiscount =
    selectedBundleItems.length >= 3
      ? 0.25
      : selectedBundleItems.length === 2
        ? 0.15
        : 0;
  const finalBundlePrice = Math.round(totalBundlePrice * (1 - bundleDiscount));
  const savedAmount = totalBundlePrice - finalBundlePrice;

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/** Interactive Bundle and Save Slider / Calculator */}
      <div
        className="lg:col-span-7 bg-paper-dim border border-line-light rounded-3xl p-4 md:p-8
      flex flex-col justify-between shadow-sm"
      >
        <div>
          <div className="flex items-center gap-2 justify-between mb-4">
            <div className="flex items-center gap-2 text-orange font-bold text-sm tracking-wide uppercase">
              <Layers className="h-4 w-4" />
            </div>
            <span className="text-xs shrink-0 bg-good/15 text-good px-3 py-1 rounded-full font-medium border border-good/30">
              Save up to 25% off
            </span>
          </div>

          <h2 className="text-2xl font-bold text-ink mb-2">
            Bundle Artisan Coffee Accessories
          </h2>
          <p className="text-stone text-sm mb-6">
            Select 2 items for 15% off, or all 3 items to get 25% off instantly.
          </p>

          <div className="space-y-3 mb-6">
            {bundleProducts.map((product) => {
              const isSelected = selectedBundleItems.includes(product.id);

              return (
                <div
                  key={product.id}
                  className={`flex items-center justify-between gap-2 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-paper border-orange shadow-sm"
                      : "bg-paper-warm/50 border-line-light/50 opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-xl"
                    />

                    <div>
                      <h4 className="text-sm font-semibold text-ink">
                        {product.name}
                      </h4>
                      <span className="text-xs text-stone">
                        ${product.price}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                      isSelected ? "text-orange bg-orange/10" : "text-stone"
                    }`}
                  >
                    {isSelected ? "Selected" : "Add +"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/** Dynamic Saving Summary */}
        <div className="bg-paper rounded-2xl p-5 border border-line-light space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-stone">Subtotal:</span>
            <span className="text-stone line-through">${totalBundlePrice}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-good font-medium">
              Bundle Discount ({bundleDiscount * 100}%):
            </span>
            <span className="text-good font-semibold">-${savedAmount}</span>
          </div>
          <div className="border-t border-line-light/60 pt-3 flex justify-between items-baseline">
            <span className="font-bold text-ink text-base">Bundle Total:</span>
            <span className="text-2xl font-extrabold text-orange-accent">
              ${finalBundlePrice}
            </span>
          </div>

          <button className="w-full mt-2 py-3 bg-ink hover:bg-ink-soft text-paper rounded-xl font-semibold transition flex items-center justify-center gap-2 shadow-md">
            <ShoppingBag className="w-4 h-4" /> Claim Bundle Deal
          </button>
        </div>
      </div>

      {/** Side Grid of Discount Coupons */}

      <div className="lg:col-span-5 space-y-4">
        <div className="bg-paper-warm/60 border border-line-light rounded-3xl p-6">
          <div className="flex items-center gap-2 text-ink font-bold text-lg mb-4">
            <Tag className="h-5 w-5 text-orange" /> Active Discount Vouchers
          </div>

          <div className="space-y-3">
            <div
              className="bg-paper border border-line-light rounded-2xl p-4 flex items-center justify-between shadow-xs
              hover:border-orange transition"
            >
              <div>
                <span className="text-xs font-bold text-orange uppercase tracking-wider block">
                  First Order
                </span>
                <h4 className="font-bold text-ink text-base">
                  15% OFF Sitewide
                </h4>
                <p className="text-xs text-stone">Min. spend $50</p>
              </div>
              <button
                type="button"
                className="px-3.5 py-2 bg-paper-dim hover:bg-orange hover:text-paper text-ink border border-line-light
                text-xs font-semibold rounded-xl transition"
              >
                WELCOME15
              </button>
            </div>

            <div
              className="bg-paper border border-line-light rounded-2xl p-4 flex items-center justify-between shadow-xs
              hover:border-orange transition"
            >
              <div>
                <span className="text-xs font-bold text-orange uppercase tracking-wider block">
                  Free Shipping
                </span>
                <h4 className="font-bold text-ink text-base">
                  $0 Express Delivery
                </h4>
                <p className="text-xs text-stone">All orders over $99</p>
              </div>
              <button
                type="button"
                className="px-3.5 py-2 bg-paper-dim hover:bg-orange hover:text-paper text-ink border border-line-light
                text-xs font-semibold rounded-xl transition"
              >
                FREESHP
              </button>
            </div>

            <div
              className="bg-paper border border-line-light rounded-2xl p-4 flex items-center justify-between shadow-xs
              hover:border-orange transition"
            >
              <div>
                <span className="text-xs font-bold text-orange uppercase tracking-wider block">
                  Weekend Special
                </span>
                <h4 className="font-bold text-ink text-base">
                  $25 OFF Premium Sets
                </h4>
                <p className="text-xs text-stone">Valid until Sunday</p>
              </div>
              <button
                type="button"
                className="px-3.5 py-2 bg-paper-dim hover:bg-orange hover:text-paper text-ink border border-line-light
                text-xs font-semibold rounded-xl transition"
              >
                WEEKEND22
              </button>
            </div>
          </div>
        </div>

        {/** Gurantees Box */}
        <div
          className="bg-paper-dim border border-line-light/80 rounded-2xl p-4
              flex justify-around text-center"
        >
          <div className="space-y-1">
            <ShieldCheck className="h-5 w-5 text-orange mx-auto" />
            <p className="text-ink text-[11px] font-semibold">
              Authentic Quality
            </p>
          </div>

          <div className="space-y-1">
            <RefreshCcw className="h-5 w-5 text-orange mx-auto" />
            <p className="text-ink text-[11px] font-semibold">30-Day Returns</p>
          </div>

          <div className="space-y-1">
            <Award className="h-5 w-5 text-orange mx-auto" />
            <p className="text-ink text-[11px] font-semibold">
              Verified Sellers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashTab;
