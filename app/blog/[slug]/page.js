import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";

export const revalidate = 3600;

async function getPost(slug) {
  await connectDB();
  const post = await BlogPost.findOne({ slug, isPublished: true }).lean();
  if (!post) return null;
  return JSON.parse(JSON.stringify(post));
}

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <article className="section">
      <div className="container-page max-w-3xl">
        <Link
          href="/blog"
          className="mb-6 flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft size={16} /> Back to Latest News
        </Link>

        <h1 className="font-heading text-3xl font-bold text-ink sm:text-4xl">
          {post.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-ink/60">
          <span className="flex items-center gap-1.5">
            <User size={16} /> {post.author || "U Graphics Team"}
          </span>
          {post.publishedAt && (
            <span className="flex items-center gap-1.5">
              <Calendar size={16} /> {formatDate(post.publishedAt)}
            </span>
          )}
        </div>

        {post.coverImage && (
          <div className="relative mt-6 h-64 w-full overflow-hidden rounded-card bg-surface-muted sm:h-96">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* content is stored as HTML/markdown text from the admin editor */}
        <div className="prose prose-neutral mt-8 max-w-none whitespace-pre-line text-ink/80">
          {post.content}
        </div>

        {post.tags?.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-ink/60"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}