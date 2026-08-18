import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";

export async function getProjectsForService(serviceSlug) {
  try {
    await connectDB();
    const projects = await Project.find({ serviceSlug })
      .sort({ completedAt: -1, createdAt: -1 })
      .limit(6)
      .lean();
    return projects.map((project) => JSON.parse(JSON.stringify(project)));
  } catch {
    return [];
  }
}
