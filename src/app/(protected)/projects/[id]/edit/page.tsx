import ProjectForm from "@/components/ProjectForm";
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


export default async function EditProject({ params }: { params: Promise<{ id: string }> }) {
const { id } = await params;
const project = await getProject(id);
if (!project) return <p>Not found</p>;
return (
<div className="space-y-4">
<h1 className="text-2xl font-semibold">Edit Project</h1>
<ProjectForm mode="edit" id={project.id} initial={project} />
</div>
);
}