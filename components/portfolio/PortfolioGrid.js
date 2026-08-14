"use client";

import { useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import CategoryFilterTabs from "@/components/ui/CategoryFilterTabs";
import EmptyState from "@/components/ui/EmptyState";

/**
 * categories: [{ _id, name, slug }]
 * projects: [{ _id, title, slug, coverImage, description, category: { _id, slug } }]
 */
export default function PortfolioGrid({ categories = [], projects = [] }) {
  const [active, setActive] = useState("all");

  const tabs = useMemo(
    () => [
      { label: "All", value: "all" },
      ...categories.map((c) => ({ label: c.name, value: c.slug })),
    ],
    [categories]
  );

  const filtered = useMemo(() => {
    if (active === "all") return projects;
    return projects.filter((p) => p.category?.slug === active);
  }, [active, projects]);

  return (
    <div>
      <CategoryFilterTabs tabs={tabs} active={active} onChange={setActive} />

      {filtered.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No projects in this category yet"
            message="Check back soon — we're adding new work regularly."
          />
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <Card
              key={project._id}
              image={project.coverImage}
              title={project.title}
              description={project.description}
              href={`/portfolio/${project.slug}`}
              tag={project.category?.name}
              cta="View Project"
            />
          ))}
        </div>
      )}
    </div>
  );
}