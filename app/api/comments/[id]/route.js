import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyJwt } from "@/lib/auth";
import { commentCreateSchema } from "@/lib/validators";

function getUserIdFromReq(req) {
  const token = req.cookies.get("token")?.value;
  const payload = token ? verifyJwt(token) : null;
  return payload?.sub || null;
}

export async function PATCH(req, { params }) {
  try {
    const authUserId = getUserIdFromReq(req);
    if (!authUserId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;

    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (comment.authorId !== authUserId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const parsed = commentCreateSchema.pick({ content: true }).safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const updated = await prisma.comment.update({
      where: { id },
      data: { content: parsed.data.content },
    });
    return NextResponse.json({ comment: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const authUserId = getUserIdFromReq(req);
    if (!authUserId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;

    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (comment.authorId !== authUserId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await prisma.comment.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
