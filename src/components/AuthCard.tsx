import React from "react";


export default function AuthCard({ title, children }: { title: string; children: React.ReactNode }) {
return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
<div className="w-full max-w-md rounded-2xl shadow-xl bg-white p-8 border border-gray-100">
<h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{title}</h1>
{children}
</div>
</div>
);
}