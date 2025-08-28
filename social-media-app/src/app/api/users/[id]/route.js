import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "../../../../lib/utils";
import prisma from "../../../../lib/prisma";
// Get user profile
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const currentUserId = getUserIdFromRequest(request);

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        name: true,
        bio: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if current user is following this user
    let isFollowing = false;
    if (currentUserId) {
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: id,
          },
        },
      });
      isFollowing = !!follow;
    }

    return NextResponse.json({
      ...user,
      isFollowing: currentUserId ? isFollowing : null, //display current userid if this user follows the profile user
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update user profile (authorized users only)
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const currentUserId = getUserIdFromRequest(request);

    if (!currentUserId || currentUserId !== id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, bio, avatar } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(bio !== undefined && { bio }),
        ...(avatar !== undefined && { avatar }),
      },
      select: {
        id: true,
        username: true,
        name: true,
        bio: true,
        avatar: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
