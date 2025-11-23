import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { requireUser } from "@/lib/session";


const prisma = new PrismaClient();


const createSchema = z.object({
title: z.string().min(1).max(200),
description: z.string().max(2000).optional(),
status: z.enum(["PLANNED", "IN_PROGRESS", "DONE"]).optional(),
});


export async function GET(req: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
  if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const page = Number(searchParams.get("page") ?? 1) || 1;
  const PAGE_SIZE = 5;

  const where = {
    ownerId: dbUser.id,
    ...(q ? { title: { contains: q } } : {}),
  };

  const [total, projects] = await Promise.all([
    prisma.project.count({ where }),
    prisma.project.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  return NextResponse.json({ projects, total, page, PAGE_SIZE });
}


export async function POST(req: Request) {
const user = await requireUser();
if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
const body = await req.json();
const parsed = createSchema.safeParse(body);
if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
const project = await prisma.project.create({
data: {
title: parsed.data.title,
description: parsed.data.description,
status: parsed.data.status ?? "PLANNED",
ownerId: dbUser!.id,
},
});
return NextResponse.json({ project }, { status: 201 });
}