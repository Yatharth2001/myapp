"use client";
import { useState } from "react";
import AuthCard from "@/components/AuthCard";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";


export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const params = useSearchParams();
    const router = useRouter();


    async function onSubmit(formData: FormData) {
        setError(null);
        setLoading(true);
        const res = await signIn("credentials", {
            redirect: false,
            email: String(formData.get("email")),
            password: String(formData.get("password")),
        });
        setLoading(false);
        if (res?.error) {
            setError("Invalid email or password");
            return;
        }
        router.push("/profile");
    }


    return (
        <AuthCard title="Welcome back">
            {params.get("from") === "signup" && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700 text-center">✓ Signup successful. Please log in.</p>
                </div>
            )}
            <form action={onSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input name="email" type="email" placeholder="you@example.com" className="w-full border text-gray-700 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input name="password" type="password" placeholder="••••••••" className="w-full border text-gray-700 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" required />
                </div>
                {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg"><p className="text-sm text-red-600 text-center">{error}</p></div>}
                <button disabled={loading} className="w-full rounded-lg p-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg">
                    {loading ? "Logging in..." : "Log in"}
                </button>
                <p className="text-sm text-center text-gray-600 pt-2">
                    New here? <a href="/signup" className="text-blue-600  hover:text-blue-700 font-medium underline decoration-2 underline-offset-2">Create an account</a>
                </p>
            </form>
        </AuthCard>
    );
}