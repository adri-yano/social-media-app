import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyJwt } from "@/lib/auth";
import { supabaseServer, getPublicUrl } from "@/lib/supabase";
import { postUpdateSchema } from "@/lib/validators";

const BUCKET = "public-media";

function getUserIdFromReq(req) {
  const token = req.cookies.get("token")?.value;
  const payload = token ? verifyJwt(token) : null;
  return payload?.sub || null;
}

export async function GET(_req, { params }) {
  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, username: true, name: true, avatar: true },
        },
        _count: { select: { likes: true, comments: true } },
      },
    });
    if (!post)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ post });
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

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (post.authorId !== authUserId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const formData = await req.formData();
    const content = formData.get("content")?.toString();
    const imageField = formData.get("image"); // could be File, "null", or undefined

    // default: keep the old image
    let imageUrl = post.image;

    // 1. Upload new image if a file is provided
    if (imageField instanceof File && imageField.size > 0) {
      const fileName = `posts/${Date.now()}_${imageField.name}`;
      const arrayBuffer = await imageField.arrayBuffer();

      const { error: uploadError } = await supabaseServer.storage
        .from(BUCKET)
        .upload(fileName, Buffer.from(arrayBuffer), {
          upsert: true,
          contentType: imageField.type || "image/jpeg",
          cacheControl: "3600",
        });

      if (uploadError) throw uploadError;
      imageUrl = getPublicUrl(fileName);
    }
    // 2. Explicit remove
    else if (imageField === "null") {
      imageUrl = null;
    }
    // 3. If no "image" field was sent → keep existing image (do nothing)

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        content: content ?? undefined, // only update if provided
        image: imageUrl,
      },
      include: {
        author: {
          select: { id: true, username: true, name: true, avatar: true },
        },
        _count: { select: { likes: true, comments: true } },
      },
    });

    return NextResponse.json({ post: updatedPost });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const authUserId = getUserIdFromReq(req);
    if (!authUserId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (post.authorId !== authUserId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
