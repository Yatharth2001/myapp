import { PrismaClient } from "@prisma/client";
import { requireUser } from "@/lib/session";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

async function getProject(id: string) {
  const user = await requireUser();
  if (!user) redirect("/login");
  
  const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
  if (!dbUser) return null;
  
  const project = await prisma.project.findFirst({
    where: { id, ownerId: dbUser.id }
  });
  
  return project;
}


export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
const { id } = await params;
const project = await getProject(id);
if (!project) return <p>Not found</p>;
return (
<div className="space-y-2">
<h1 className="text-2xl font-semibold">{project.title}</h1>
<p className="text-gray-600">Status: {project.status.replace("_", " ")}</p>
{project.description && <p className="text-gray-700 whitespace-pre-line">{project.description}</p>}
<div className="pt-2">
<a className="underline" href={`/projects/${project.id}/edit`}>Edit</a>
</div>
</div>
);
}