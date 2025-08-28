import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

// Get all followers and following for a user
export async function GET(request, { params }) {
  try {
    const { id: userId } = await params;

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch all followers
    const followersData = await prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Fetch all following
    const followingData = await prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Extract users
    const followers = followersData.map((f) => f.follower);
    const following = followingData.map((f) => f.following);

    return NextResponse.json({
      followers,
      following,
      totalFollowers: followers.length,
      totalFollowing: following.length,
    });
  } catch (error) {
    console.error("Get followers/following error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
