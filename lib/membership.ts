import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Article } from "@prisma/client";

export async function getCurrentUserSubscription() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return null;

  return prisma.subscription.findUnique({ where: { userId } });
}

export async function canAccessArticle(article: Pick<Article, "accessLevel">) {
  if (article.accessLevel !== "members_only") return true;

  const subscription = await getCurrentUserSubscription();
  return subscription?.status === "ACTIVE";
}
