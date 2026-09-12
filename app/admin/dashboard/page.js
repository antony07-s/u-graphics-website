import { FolderKanban, Layers, Newspaper, Mail, Package, ClipboardList, Star } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import Service from "@/models/Service";
import BlogPost from "@/models/BlogPost";
import Enquiry from "@/models/Enquiry";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Review from "@/models/Review";

export const dynamic = "force-dynamic";

async function getCounts() {
  try {
    await connectDB();
    const [projects, services, posts, enquiries, products, orders, reviews] = await Promise.all([
      Project.countDocuments(),
      Service.countDocuments(),
      BlogPost.countDocuments(),
      Enquiry.countDocuments(),
      Product.countDocuments(), Order.countDocuments(), Review.countDocuments({ isApproved: false }),
    ]);
    return { projects, services, posts, enquiries, products, orders, reviews, error: false };
  } catch {
    return { projects: 0, services: 0, posts: 0, enquiries: 0, products: 0, orders: 0, reviews: 0, error: true };
  }
}

export default async function AdminDashboardPage() {
  const counts = await getCounts();

  const cards = [
    {
      label: "Products", value: counts.products, icon: Package, href: "/admin/products",
    }, {
      label: "Orders", value: counts.orders, icon: ClipboardList, href: "/admin/orders",
    }, {
      label: "Pending Reviews", value: counts.reviews, icon: Star, href: "/admin/reviews",
    }, {
      label: "Portfolio Projects",
      value: counts.projects,
      icon: FolderKanban,
      href: "/admin/portfolio",
    },
    {
      label: "Services",
      value: counts.services,
      icon: Layers,
      href: "/admin/services",
    },
    {
      label: "Blog Posts",
      value: counts.posts,
      icon: Newspaper,
      href: "/admin/blog",
    },
    {
      label: "Enquiries",
      value: counts.enquiries,
      icon: Mail,
      href: "/admin/enquiries",
    },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-ink/60">
        Overview of your website content.
      </p>
      {counts.error && <p className="mt-4 rounded-card border border-red-200 bg-red-50 p-3 text-sm text-danger">Dashboard data is temporarily unavailable. Check the database connection and refresh.</p>}

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, href }) => (
          <a
            key={label}
            href={href}
            className="flex flex-col gap-3 rounded-card bg-white p-6 shadow-card transition hover:shadow-cardHover"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-ink">{value}</p>
              <p className="text-sm text-ink/60">{label}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
