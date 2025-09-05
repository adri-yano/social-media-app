import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(_req, { params }) {
  try {
    const { id } = await params;
    const followers = await prisma.follow.findMany({
      where: { followingId: id },
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
    });
    return NextResponse.json({ followers: followers.map((f) => f.follower) });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
