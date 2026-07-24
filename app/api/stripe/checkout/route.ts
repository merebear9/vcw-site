import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { getStripe, MEMBERSHIP_TIERS, getPriceEnvKey, type MembershipTierId } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/utils";

const schema = z.object({
  tier: z.enum(["COMMUNITY", "INVESTIGATOR", "FOUNDING"]),
  interval: z.enum(["month", "year"]),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "auth_required" }, { status: 401 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const { tier, interval } = parsed.data;

  const tierDef = MEMBERSHIP_TIERS.find((t) => t.id === tier)!;
  const userId = session.user.id;

  let stripe;
  try {
    stripe = getStripe();
  } catch {
    return NextResponse.json(
      { error: "Payments are not configured yet. Set STRIPE_SECRET_KEY." },
      { status: 503 }
    );
  }

  const user = await prisma.user.findUnique({ where: { id: userId }, include: { subscription: true } });
  let customerId = user?.subscription?.stripeCustomerId ?? undefined;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email,
      name: session.user.name ?? undefined,
      metadata: { userId },
    });
    customerId = customer.id;
  }

  const priceEnvKey = getPriceEnvKey(tier as MembershipTierId, interval);
  const configuredPriceId = process.env[priceEnvKey];

  const lineItem = configuredPriceId
    ? { price: configuredPriceId, quantity: 1 }
    : {
        quantity: 1,
        price_data: {
          currency: "usd",
          product_data: { name: `${tierDef.name} Membership` },
          unit_amount: Math.round((interval === "month" ? tierDef.monthlyPrice : tierDef.annualPrice) * 100),
          recurring: { interval: interval as "month" | "year" },
        },
      };

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [lineItem],
    success_url: siteUrl("/support?checkout=success"),
    cancel_url: siteUrl("/support?checkout=canceled"),
    metadata: { userId, tier, interval },
    subscription_data: { metadata: { userId, tier, interval } },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
