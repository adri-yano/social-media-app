import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "../../../lib/utils";
import prisma from "../../../lib/prisma";
// Follow or unfollow a user
export async function POST(request) {
  try {
    const userId = getUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { followingId } = await request.json();

    if (!followingId) {
      return NextResponse.json(
        { error: "followingId is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: followingId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent self-follow
    if (userId === followingId) {
      return NextResponse.json(
        { error: "Cannot follow yourself" },
        { status: 400 }
      );
    }

    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId,
        },
      },
    });

    if (existingFollow) {
      // Unfollow the user
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId,
          },
        },
      });
      return NextResponse.json({ following: false });
    } else {
      // Follow the user
      await prisma.follow.create({
        data: {
          followerId: userId,
          followingId,
        },
      });
      return NextResponse.json({ following: true }, { status: 201 });
    }
  } catch (error) {
    console.error("Follow user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
