import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-ink">
        Add New Project
      </h1>
      <p className="mt-1 text-sm text-ink/60">
        Add a completed project to your portfolio.
      </p>

      <div className="mt-8">
        <ProjectForm />
      </div>
    </div>
  );
}