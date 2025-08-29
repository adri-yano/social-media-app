import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
// Get all likes for a post along with total count
export async function GET(request, { params }) {
  try {
    const { id: postId } = await params;

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Fetch all likes for the post
    const likes = await prisma.like.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Count total likes
    const totalLikes = likes.length; // simpler than a separate count query

    return NextResponse.json({
      totalLikes,
      likes,
    });
  } catch (error) {
    console.error("Get likes error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
