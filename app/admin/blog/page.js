import Link from "next/link";
import { Plus, Pencil, Circle, CheckCircle2 } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

async function getPosts() {
  await connectDB();
  const posts = await BlogPost.find({})
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(posts));
}

export default async function AdminBlogPage() {
  const posts = await getPosts();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink">Blog</h1>
          <p className="mt-1 text-sm text-ink/60">
            {posts.length} post{posts.length !== 1 && "s"} total
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> New Post
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-card bg-white shadow-card">
        {posts.length === 0 ? (
          <p className="p-8 text-center text-sm text-ink/50">
            No blog posts yet. Click &quot;New Post&quot; to write your first
            one.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/5 bg-surface-muted text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Author</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post._id}
                  className="border-b border-black/5 last:border-0"
                >
                  <td className="px-5 py-3 font-medium text-ink">
                    {post.title}
                  </td>
                  <td className="px-5 py-3">
                    {post.isPublished ? (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-green-700">
                        <CheckCircle2 size={14} /> Published
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-ink/50">
                        <Circle size={14} /> Draft
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-ink/60">
                    {post.author || "—"}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/blog/${post._id}/edit`}
                        className="flex items-center gap-1.5 rounded-card px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/5"
                      >
                        <Pencil size={15} /> Edit
                      </Link>
                      <DeleteButton
                        apiPath={`/api/blog/${post._id}`}
                        itemLabel={post.title}
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