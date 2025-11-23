import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import Link from "next/link";


export default async function ProfilePage() {
const session = await getServerSession(authConfig);


if (!session) {
return (
<div className="min-h-screen flex items-center justify-center">
<div className="text-center space-y-4">
<p className="text-lg">You are not logged in.</p>
<Link href="/login" className="underline">Go to Login</Link>
</div>
</div>
);
}


return (
<div className="min-h-screen flex items-center justify-center">
<div className="space-y-2 text-center">
<h1 className="text-2xl font-semibold">Hello {session.user?.name ?? session.user?.email}</h1>
<p className="text-gray-600">You are logged in.</p>
</div>
</div>
);
}