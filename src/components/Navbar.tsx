import Link from "next/link";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import SignOutButton from "./SignOutButton";



export default async function Navbar() {
const session = await getServerSession(authConfig);
return (
<header className="border-b bg-white">
<div className="max-w-6xl mx-auto flex items-center justify-between p-4">
<Link href="/" className="text-lg font-semibold">MyApp</Link>
<nav className="flex items-center gap-4">
<Link href="/" className="text-sm text-gray-600 hover:text-gray-900">Home</Link>
<Link href="/profile" className="text-sm text-gray-600 hover:text-gray-900">Profile</Link>
<Link href="/projects" className="text-sm text-gray-600 hover:text-gray-900">Projects</Link>
{session ? (
<div className="flex items-center gap-3">
<span className="text-sm text-gray-700">{session.user?.name ?? session.user?.email}</span>
<SignOutButton />
</div>
) : (
<>
<Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">Log in</Link>
<Link href="/signup" className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded-lg">Sign up</Link>
</>
)}
</nav>
</div>
</header>
);
}