import { prisma } from "@/lib/prisma";
import CommentModerationQueue from "./CommentModerationQueue";

export default async function AdminCommentsPage() {
  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      article: { select: { title: true, slug: true } },
    },
  });

  return (
    <div>
      <h1 className="heading-font mb-6 text-2xl font-black text-white">Comment Moderation</h1>
      <CommentModerationQueue
        comments={comments.map((c) => ({ ...c, createdAt: c.createdAt.toISOString() }))}
      />
    </div>
  );
}
