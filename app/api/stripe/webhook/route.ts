import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

function getCurrentPeriodEnd(subscription: Stripe.Subscription): Date {
  const unixSeconds = (subscription as unknown as { current_period_end: number }).current_period_end;
  return new Date(unixSeconds * 1000);
}

function mapStatus(status: Stripe.Subscription.Status) {
  switch (status) {
    case "active":
      return "ACTIVE" as const;
    case "trialing":
      return "TRIALING" as const;
    case "past_due":
      return "PAST_DUE" as const;
    case "incomplete":
      return "INCOMPLETE" as const;
    default:
      return "CANCELED" as const;
  }
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const stripe = getStripe();
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: `Invalid signature: ${err}` }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const tier = session.metadata?.tier as "COMMUNITY" | "INVESTIGATOR" | "FOUNDING" | undefined;
      const interval = session.metadata?.interval as "month" | "year" | undefined;
      if (!userId || !session.subscription) break;

      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

      await prisma.subscription.upsert({
        where: { userId },
        update: {
          tier: tier ?? "COMMUNITY",
          interval: interval ?? "month",
          status: mapStatus(subscription.status),
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: subscription.id,
          currentPeriodEnd: getCurrentPeriodEnd(subscription),
        },
        create: {
          userId,
          tier: tier ?? "COMMUNITY",
          interval: interval ?? "month",
          status: mapStatus(subscription.status),
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: subscription.id,
          currentPeriodEnd: getCurrentPeriodEnd(subscription),
        },
      });
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;
      if (!userId) break;

      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          status: event.type === "customer.subscription.deleted" ? "CANCELED" : mapStatus(subscription.status),
          currentPeriodEnd: getCurrentPeriodEnd(subscription),
        },
      });
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
