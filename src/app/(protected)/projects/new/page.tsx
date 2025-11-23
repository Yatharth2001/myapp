import ProjectForm from "@/components/ProjectForm";


export default function NewProjectPage() {
return (
<div className="space-y-4">
<h1 className="text-2xl font-semibold">New Project</h1>
<ProjectForm mode="create" />
</div>
);
}