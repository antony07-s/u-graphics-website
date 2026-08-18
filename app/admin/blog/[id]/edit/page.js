import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import BlogPostForm from "@/components/admin/BlogPostForm";

async function getPost(id) {
  await connectDB();
  try {
    const post = await BlogPost.findById(id).lean();
    if (!post) return null;
    return JSON.parse(JSON.stringify(post));
  } catch {
    return null;
  }
}

export default async function EditBlogPostPage({ params }) {
  const post = await getPost(params.id);
  if (!post) notFound();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-ink">Edit Post</h1>
      <p className="mt-1 text-sm text-ink/60">{post.title}</p>
      <div className="mt-8">
        <BlogPostForm initialData={post} postId={post._id} />
      </div>
    </div>
  );
}