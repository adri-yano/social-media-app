import { NextResponse } from "next/server";

import { getUserIdFromRequest } from "../../../lib/utils";
import prisma from "../../../lib/prisma";

// Get all posts with search and filter functionality
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const hashtag = searchParams.get("hashtag");
    const search = searchParams.get("search");

    let whereClause = {};

    // Filter by hashtag
    if (hashtag) {
      whereClause.hashtags = {
        has: hashtag.startsWith("#") ? hashtag : `#${hashtag}`,
      };
    }

    // Search in content
    if (search) {
      whereClause.content = {
        contains: search,
        mode: "insensitive",
      };
    }

    // Fetch all posts
    const posts = await prisma.post.findMany({
      where: whereClause,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                username: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Get posts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Create a new post
export async function POST(request) {
  try {
    const userId = getUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { content, image } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Extract hashtags from content
    const extractedHashtags = content.match(/#\w+/g) || [];
    const uniqueHashtags = [...new Set(extractedHashtags)];

    const post = await prisma.post.create({
      data: {
        content,
        image: image || null,
        hashtags: uniqueHashtags,
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                username: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
