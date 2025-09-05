import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyJwt } from "@/lib/auth";
import { profileUpdateSchema } from "@/lib/validators";

function getUserIdFromReq(req) {
  const token = req.cookies.get("token")?.value;
  const payload = token ? verifyJwt(token) : null;
  return payload?.sub || null;
}

export async function GET(_req, { params }) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        bio: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    });
    if (!user)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ user });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const authUserId = getUserIdFromReq(req);
    if (!authUserId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    if (id !== authUserId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const data = await req.json();
    const parsed = profileUpdateSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, bio, avatar } = parsed.data;
    const user = await prisma.user.update({
      where: { id },
      data: {
        name: name ?? undefined,
        bio: bio ?? undefined,
        avatar: avatar ?? undefined,
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        bio: true,
        avatar: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ user });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
