"use client";
import { useState } from "react";
import AuthCard from "@/components/AuthCard";
import { useRouter } from "next/navigation";


export default function SignupPage() {
const router = useRouter();
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);


async function onSubmit(formData: FormData) {
setError(null);
setLoading(true);
const payload = {
name: formData.get("name"),
email: formData.get("email"),
password: formData.get("password"),
};
const res = await fetch("/api/signup", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(payload),
});
setLoading(false);
if (!res.ok) {
const data = await res.json();
setError(data.error ?? "Something went wrong");
return;
}
// Go to login after successful signup
router.push("/login?from=signup");
}


return (
<AuthCard title="Create your account">
<form action={onSubmit} className="space-y-5">
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
<input name="name" placeholder="John Doe" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700" required />
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
<input name="email" type="email" placeholder="you@example.com" className="w-full border text-gray-700 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" required />
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
<input name="password" type="password" placeholder="Minimum 6 characters" className="w-full border text-gray-700 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" required />
</div>
{error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg"><p className="text-sm text-red-600 text-center">{error}</p></div>}
<button disabled={loading} className="w-full rounded-lg p-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg">
{loading ? "Creating..." : "Sign up"}
</button>
<p className="text-sm text-center text-gray-600 pt-2">
Already have an account? <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium underline decoration-2 underline-offset-2">Log in</a>
</p>
</form>
</AuthCard>
);
}