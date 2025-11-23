import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { requireUser } from "@/lib/session";


const prisma = new PrismaClient();


const updateSchema = z.object({
title: z.string().min(1).max(200).optional(),
description: z.string().max(2000).nullable().optional(),
status: z.enum(["PLANNED", "IN_PROGRESS", "DONE"]).optional(),
});


async function findOwned(id: string, ownerId: string) {
return prisma.project.findFirst({ where: { id, ownerId } });
}


export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
const { id } = await params;
const user = await requireUser();
if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
const project = await findOwned(id, dbUser!.id);
if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
return NextResponse.json({ project });
}


export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
const { id } = await params;
const user = await requireUser();
if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
const owned = await findOwned(id, dbUser!.id);
if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });
const body = await req.json();
const parsed = updateSchema.safeParse(body);
if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
const project = await prisma.project.update({
where: { id },
data: parsed.data,
});
return NextResponse.json({ project });
}


export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
const { id } = await params;
const user = await requireUser();
if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
const owned = await findOwned(id, dbUser!.id);
if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });
await prisma.project.delete({ where: { id } });
return NextResponse.json({ ok: true });
}