import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();


const credentialsSchema = z.object({
email: z.string().email(),
password: z.string().min(6),
});


export const authConfig: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
session: { strategy: "jwt" },
providers: [
Credentials({
name: "Credentials",
credentials: {
email: { label: "Email", type: "text" },
password: { label: "Password", type: "password" },
},
authorize: async (creds) => {
const parsed = credentialsSchema.safeParse(creds);
if (!parsed.success) return null;
const { email, password } = parsed.data;
const user = await prisma.user.findUnique({ where: { email } });
if (!user?.passwordHash) return null;
const ok = await bcrypt.compare(password, user.passwordHash);
if (!ok) return null;
return { id: user.id, email: user.email, name: user.name, image: user.image ?? undefined };
},
}),
],
pages: {
signIn: "/login",
},
callbacks: {
async jwt({ token, user }) {
if (user) {
token.id = user.id;
token.email = user.email;
token.name = user.name;
}
return token;
},
async session({ session, token }) {
if (token && session.user) {
session.user.id = token.id as string;
session.user.email = token.email as string;
session.user.name = token.name as string;
}
return session;
},
},
};