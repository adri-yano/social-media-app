import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyJwt } from "@/lib/auth";

function getUserIdFromReq(req) {
  const token = req.cookies.get("token")?.value;
  const payload = token ? verifyJwt(token) : null;
  return payload?.sub || null;
}

export async function POST(req, { params }) {
  try {
    const authUserId = getUserIdFromReq(req);
    if (!authUserId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id: targetId } = await params;
    if (authUserId === targetId)
      return NextResponse.json(
        { error: "Cannot follow yourself" },
        { status: 400 }
      );

    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: authUserId,
          followingId: targetId,
        },
      },
    });
    if (existing) {
      await prisma.follow.delete({ where: { id: existing.id } });
      return NextResponse.json({ following: false });
    }
    await prisma.follow.create({
      data: { followerId: authUserId, followingId: targetId },
    });
    return NextResponse.json({ following: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
