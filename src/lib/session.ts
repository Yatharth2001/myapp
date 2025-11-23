import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";


export async function requireUser() {
const session = await getServerSession(authConfig);
if (!session?.user?.email) return null;
return session.user;
}