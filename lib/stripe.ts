import Stripe from "stripe";

let stripeSingleton: Stripe | null = null;

export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set. Add it to your .env file.");
  }
  if (!stripeSingleton) {
    stripeSingleton = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeSingleton;
}

export type MembershipTierId = "COMMUNITY" | "INVESTIGATOR" | "FOUNDING";

export interface TierDefinition {
  id: MembershipTierId;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  perks: string[];
}

export const MEMBERSHIP_TIERS: TierDefinition[] = [
  {
    id: "COMMUNITY",
    name: "Community Supporter",
    monthlyPrice: 5,
    annualPrice: 50,
    perks: ["Full access to all articles", "Member badge on comments"],
  },
  {
    id: "INVESTIGATOR",
    name: "Investigator",
    monthlyPrice: 10,
    annualPrice: 100,
    perks: [
      "Everything in Community Supporter",
      "Early access to stories (48hr before public)",
      "Monthly behind-the-scenes newsletter",
    ],
  },
  {
    id: "FOUNDING",
    name: "Founding Member",
    monthlyPrice: 25,
    annualPrice: 250,
    perks: [
      "Everything in Investigator",
      "Name on supporters page",
      "Quarterly Q&A",
    ],
  },
];

export function getPriceEnvKey(tier: MembershipTierId, interval: "month" | "year") {
  return `STRIPE_PRICE_${tier}_${interval.toUpperCase()}` as const;
}
