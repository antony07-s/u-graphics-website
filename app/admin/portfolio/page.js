import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import Category from "@/models/Category"; // registers model for populate()
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic"; // always show fresh data in admin

async function getProjects() {
  await connectDB();
  const projects = await Project.find({})
    .populate("category")
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(projects));
}

export default async function AdminPortfolioPage() {
  const projects = await getProjects();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink">
            Portfolio
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            {projects.length} project{projects.length !== 1 && "s"}
          </p>
        </div>
        <Link
          href="/admin/portfolio/new"
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> Add Project
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-card bg-white shadow-card">
        {projects.length === 0 ? (
          <p className="p-8 text-center text-sm text-ink/50">
            No projects yet. Click &quot;Add Project&quot; to create your first
            one.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/5 bg-surface-muted text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-5 py-3">Image</th>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project._id}
                  className="border-b border-black/5 last:border-0"
                >
                  <td className="px-5 py-3">
                    <div className="relative h-12 w-16 overflow-hidden rounded-md bg-surface-muted">
                      {project.coverImage && (
                        <Image
                          src={project.coverImage}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 font-medium text-ink">
                    {project.title}
                  </td>
                  <td className="px-5 py-3 text-ink/60">
                    {project.category?.name || "—"}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/portfolio/${project._id}/edit`}
                        className="flex items-center gap-1.5 rounded-card px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/5"
                      >
                        <Pencil size={15} /> Edit
                      </Link>
                      <DeleteButton
                        apiPath={`/api/portfolio/${project._id}`}
                        itemLabel={project.title}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}