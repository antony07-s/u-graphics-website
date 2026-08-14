import PageHero from "@/components/ui/PageHero";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { connectDB } from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";

export const metadata = {
  title: "Latest News & Blog",
  description:
    "News, project updates and tips from U Graphics — signage, advertising and web design.",
};

export const revalidate = 3600;

async function getPosts() {
  await connectDB();
  const posts = await BlogPost.find({ isPublished: true })
    .sort({ publishedAt: -1 })
    .lean();
  return posts.map((p) => JSON.parse(JSON.stringify(p)));
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <PageHero
        title="Latest News"
        subtitle="Updates, completed projects and tips from the U Graphics team."
        crumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
      />

      <section className="section">
        <div className="container-page">
          {posts.length === 0 ? (
            <EmptyState
              title="No posts published yet"
              message="Check back soon for updates and news from our team."
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Card
                  key={post._id}
                  image={post.coverImage}
                  title={post.title}
                  description={post.excerpt}
                  href={`/blog/${post.slug}`}
                  tag={formatDate(post.publishedAt)}
                  cta="Read More"
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}