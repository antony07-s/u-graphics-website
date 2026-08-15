import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import Category from "@/models/Category"; // registers model for populate()
import ProjectForm from "@/components/admin/ProjectForm";

async function getProject(id) {
  await connectDB();
  try {
    const project = await Project.findById(id).populate("category").lean();
    if (!project) return null;
    return JSON.parse(JSON.stringify(project));
  } catch {
    return null; // invalid ObjectId format, etc.
  }
}

export default async function EditProjectPage({ params }) {
  const project = await getProject(params.id);
  if (!project) notFound();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-ink">
        Edit Project
      </h1>
      <p className="mt-1 text-sm text-ink/60">{project.title}</p>

      <div className="mt-8">
        <ProjectForm initialData={project} projectId={project._id} />
      </div>
    </div>
  );
}