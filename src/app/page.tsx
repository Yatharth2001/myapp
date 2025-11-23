import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authConfig);
  
  return (
    <main className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold text-gray-900">
            Welcome to MyApp
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage your projects efficiently and collaborate with your team in one place.
          </p>
          
          <div className="flex gap-4 justify-center mt-8">
            {session ? (
              <>
                <Link 
                  href="/dashboard"
                  className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
                >
                  Go to Dashboard
                </Link>
                <Link 
                  href="/projects"
                  className="bg-white text-gray-900 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
                >
                  View Projects
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href="/signup"
                  className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
                >
                  Get Started
                </Link>
                <Link 
                  href="/login"
                  className="bg-white text-gray-900 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
                >
                  Log in
                </Link>
              </>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Project Management</h3>
              <p className="text-gray-600">Create and manage your projects with an intuitive interface.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Authentication</h3>
              <p className="text-gray-600">Your data is protected with industry-standard security.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Updates</h3>
              <p className="text-gray-600">Stay updated with real-time synchronization across devices.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
