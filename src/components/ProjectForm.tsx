"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const schema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Max 200 characters"),
  description: z.string().max(2000, "Max 2000 characters").optional().or(z.literal("")),
  status: z.enum(["PLANNED", "IN_PROGRESS", "DONE"]),
});
type FormValues = z.infer<typeof schema>;

export default function ProjectForm({ initial, mode, id }:{
  initial?: { title?: string; description?: string | null; status?: "PLANNED"|"IN_PROGRESS"|"DONE" };
  mode: "create" | "edit";
  id?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        title: initial?.title ?? "",
        description: initial?.description ?? "",
        status: initial?.status ?? "PLANNED",
      },
    });

  async function onSubmit(values: FormValues) {
    const url = mode === "create" ? "/api/projects" : `/api/projects/${id}`;
    const method = mode === "create" ? "POST" : "PUT";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: "Something went wrong" }));
      toast.error(data.error ?? "Something went wrong");
      return;
    }
    toast.success(mode === "create" ? "Project created" : "Project updated");
    startTransition(() => { router.push("/projects"); router.refresh(); });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Title */}
      <div className="space-y-2">
        <label className="text-sm text-gray-700">Title</label>
        <input className="w-full border rounded-lg p-3" {...register("title")} />
        {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
      </div>
      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm text-gray-700">Description</label>
        <textarea className="w-full border rounded-lg p-3" rows={4} {...register("description")} />
        {errors.description && <p className="text-xs text-red-600">{errors.description.message}</p>}
      </div>
      {/* Status */}
      <div className="space-y-2">
        <label className="text-sm text-gray-700">Status</label>
        <select className="w-full border rounded-lg p-3" {...register("status")}>
          <option value="PLANNED">Planned</option>
          <option value="IN_PROGRESS">In progress Task</option>
          <option value="DONE">Done</option>
        </select>
      </div>
      <button disabled={isSubmitting || isPending} className="rounded-lg px-4 py-2 bg-gray-900 text-white disabled:opacity-60">
        {isSubmitting || isPending ? (mode === "create" ? "Creating..." : "Saving...") : (mode === "create" ? "Create Project" : "Save Changes")}
      </button>
    </form>
  );
}
