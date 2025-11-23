"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ProjectRowActions({ id }: { id: string }) {
  const router = useRouter();
  async function del() {
    if (!confirm("Delete this project?")) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Project deleted");
      router.refresh();
    } else {
      toast.error("Failed to delete");
    }
  }
  return (
    <div className="flex gap-2">
      <a className="text-sm underline" href={`/projects/${id}`}>View</a>
      <a className="text-sm underline" href={`/projects/${id}/edit`}>Edit</a>
      <button className="text-sm text-red-600" onClick={del}>Delete</button>
    </div>
  );
}
