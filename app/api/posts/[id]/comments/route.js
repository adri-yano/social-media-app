import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyJwt } from "@/lib/auth";
import { commentCreateSchema } from "@/lib/validators";

function getUserIdFromReq(req) {
  const token = req.cookies.get("token")?.value;
  const payload = token ? verifyJwt(token) : null;
  return payload?.sub || null;
}

// Get comments for a post
export async function GET(_req, { params }) {
  try {
    const { id: postId } = await params;

    const comments = await prisma.comment.findMany({
      where: { postId, parentCommentId: null }, // top-level comments only
      orderBy: { createdAt: "asc" },
      include: {
        author: {
          select: { id: true, username: true, name: true, avatar: true },
        },
        replies: {
          orderBy: { createdAt: "asc" },
          include: {
            author: {
              select: { id: true, username: true, name: true, avatar: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ comments });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Create a new comment
export async function POST(req, { params }) {
  try {
    const authUserId = getUserIdFromReq(req);
    if (!authUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: postId } = await params;
    const body = await req.json();

    const parsed = commentCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { content, parentCommentId } = parsed.data;

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: authUserId,
        parentCommentId: parentCommentId || null,
      },
      include: {
        author: {
          select: { id: true, username: true, name: true, avatar: true },
        },
      },
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
