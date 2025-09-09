import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

type Plan = {
  name: string;
  price: string;
  features: string[];
  highlight?: boolean;
};

const plans: Plan[] = [
  {
    name: "Free",
    price: "$0",
    features: [
      "One default theme",
      "Instagram, X, LinkedIn, Twitter, Website",
      "Pitch Decks",
      "Domain",
    ],
  },
  {
    name: "Pro",
    price: "$5.99",
    highlight: true,
    features: [
      "Unlimited themes, Custom Themes & Backgrounds",
      "Unlimited Links",
      "Pitch Deck corner page",
      "Analytics – Link, Clicks, Where, Time",
    ],
  },
  {
    name: "Elite",
    price: "$7.99",
    features: [
      "Detailed analytics (duration, page from)",
      "Calendly integration",
      "Sell consultancy (2-3% commission)",
      "Custom Domain + Team support",
    ],
  },
  {
    name: "Investor AI",
    price: "Custom",
    features: [
      "Investor-ready AI",
      "Token-based rate limit",
      "Custom templates for all",
    ],
  },
];

export function UpgradeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-gray-900 text-white border border-gray-700 rounded-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Upgrade Your Plan</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex flex-col p-6 rounded-2xl border ${
                plan.highlight
                  ? "border-purple-500 bg-purple-950/40"
                  : "border-gray-700 bg-gray-800/50"
              }`}
            >
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="text-lg font-bold text-purple-400">{plan.price}</p>

              <ul className="mt-4 space-y-2 text-sm text-gray-300">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <Check className="h-4 w-4 text-purple-400 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`mt-6 w-full ${
                  plan.highlight
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {plan.price === "$0" ? "Current Plan" : "Upgrade"}
              </Button>
            </motion.div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
