import BlogPostForm from "@/components/admin/BlogPostForm";

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-ink">New Post</h1>
      <p className="mt-1 text-sm text-ink/60">
        Write a new blog post. Leave &quot;Publish&quot; unchecked to save as
        a draft.
      </p>
      <div className="mt-8">
        <BlogPostForm />
      </div>
    </div>
  );
}