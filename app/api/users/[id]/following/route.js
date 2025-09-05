import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(_req, { params }) {
  try {
    const { id } = params;
    const following = await prisma.follow.findMany({
      where: { followerId: id },
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
    });
    return NextResponse.json({ following: following.map((f) => f.following) });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
