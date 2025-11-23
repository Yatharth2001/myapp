import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcrypt";


const prisma = new PrismaClient();


const signupSchema = z.object({
name: z.string().min(1).max(100),
email: z.string().email(),
password: z.string().min(6),
});


export async function POST(req: Request) {
try {
const body = await req.json();
const parsed = signupSchema.parse(body);
const existing = await prisma.user.findUnique({ where: { email: parsed.email } });
if (existing) {
return NextResponse.json({ error: "Email already in use" }, { status: 400 });
}
const passwordHash = await bcrypt.hash(parsed.password, 10);
const user = await prisma.user.create({
data: {
name: parsed.name,
email: parsed.email,
passwordHash,
},
select: { id: true, email: true, name: true },
});
return NextResponse.json({ user });
} catch (err: any) {
return NextResponse.json({ error: err.message ?? "Invalid input" }, { status: 400 });
}
}