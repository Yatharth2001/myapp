// import ProjectRowActions from "@/components/ProjectRowActions";
// import { PrismaClient } from "@prisma/client";
// import { requireUser } from "@/lib/session";
// import { redirect } from "next/navigation";

// const prisma = new PrismaClient();

// type Project = {
//   id: string;
//   title: string;
//   description: string | null;
//   status: string;
//   ownerId: string;
//   createdAt: Date;
//   updatedAt: Date;
// };

// async function getProjects(): Promise<Project[]> {
//   const user = await requireUser();
//   if (!user) redirect("/login");
  
//   const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
//   if (!dbUser) return [];
  
//   const projects = await prisma.project.findMany({
//     where: { ownerId: dbUser.id },
//     orderBy: { createdAt: "desc" },
//   });
  
//   return projects;
// }


// export default async function ProjectsPage() {
// const projects = await getProjects();
// return (
// <div className="space-y-4">
// <div className="flex items-center justify-between">
// <h1 className="text-2xl font-semibold">Projects</h1>
// <a href="/projects/new" className="bg-gray-900 text-white px-3 py-1.5 rounded-lg">New Project</a>
// </div>
// <div className="overflow-x-auto border rounded-xl bg-white">
// <table className="w-full text-sm">
// <thead className="bg-gray-50 text-left">
// <tr>
// <th className="p-3 text-gray-600">Title</th>
// <th className="p-3 text-gray-600">Status</th>
// <th className="p-3 text-gray-600">Updated</th>
// <th className="p-3 text-gray-600">Actions</th>
// </tr>
// </thead>
// <tbody>
// {projects.length === 0 && (
// <tr><td className="p-4 text-gray-600" colSpan={4}>No projects yet.</td></tr>
// )}
//               {projects.map((p) => (
// <tr key={p.id} className="border-t">
// <td className="p-3 font-medium text-gray-600">{p.title}</td>
// <td className="p-3 text-gray-600">{p.status.replace("_", " ")}</td>
// <td className="p-3 text-gray-600">{new Date(p.updatedAt).toLocaleString()}</td>
// <td className="p-3 text-gray-600"><ProjectRowActions id={p.id} /></td>
// </tr>
// ))}
// </tbody>
// </table>
// </div>
// </div>
// );
// }

import ProjectRowActions from "@/components/ProjectRowActions";
import { cookies } from "next/headers";
import Link from "next/link";

async function getProjects(q: string, page: number) {
  const cookieStore = await cookies();
  const cookie = cookieStore.toString(); // forward auth cookie
  const url = new URL(`${process.env.NEXTAUTH_URL}/api/projects`);
  if (q) url.searchParams.set("q", q);
  url.searchParams.set("page", String(page));
  const res = await fetch(url.toString(), { headers: { Cookie: cookie }, cache: "no-store" });
  if (!res.ok) return { projects: [], total: 0, page: 1, PAGE_SIZE: 5 };
  return res.json();
}

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const page = Number(params.page ?? 1) || 1;
  const { projects, total, PAGE_SIZE } = await getProjects(q, page);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Link href="/projects/new" className="bg-gray-900 text-white px-3 py-1.5 rounded-lg">New Project</Link>
      </div>

      <form className="flex gap-2">
        <input name="q" defaultValue={q} placeholder="Search title…" className="border rounded-lg p-2 w-full max-w-sm" />
        <button className="border rounded-lg px-3">Search</button>
      </form>

      {total === 0 ? (
        <div className="border rounded-2xl bg-white p-10 text-center text-gray-600">
          <p className="mb-3">No projects{q ? ` for “${q}”` : ""} yet.</p>
          <Link href="/projects/new" className="inline-block bg-gray-900 text-white px-3 py-1.5 rounded-lg">Create your first project</Link>
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-xl bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-3  text-gray-600">Title</th>
                <th className="p-3  text-gray-600">Status</th>
                <th className="p-3  text-gray-600">Updated</th>
                <th className="p-3  text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p: any) => (
                <tr key={p.id} className="border-t">
                  <td className="p-3 font-medium  text-gray-600">{p.title}</td>
                  <td className="p-3  text-gray-600">{p.status.replace("_", " ")}</td>
                  <td className="p-3  text-gray-600">{new Date(p.updatedAt).toLocaleString()}</td>
                  <td className="p-3  text-gray-600"><ProjectRowActions id={p.id} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex gap-2 items-center">
          {Array.from({ length: pages }).map((_, i) => {
            const n = i + 1;
            const params = new URLSearchParams();
            if (q) params.set("q", q);
            params.set("page", String(n));
            const href = `/projects?${params.toString()}`;
            const active = n === page;
            return (
              <a key={n} href={href} className={`px-3 py-1 rounded-lg border ${active ? "bg-gray-900 text-white" : "bg-white"}`}>{n}</a>
            );
          })}
        </div>
      )}
    </div>
  );
}
