"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Card from "@/components/ui/Card";
import CategoryFilterTabs from "@/components/ui/CategoryFilterTabs";
import EmptyState from "@/components/ui/EmptyState";

/**
 * categories: [{ _id, name, slug, group }]
 * services: [{ _id, title, slug, image, shortDescription, category: { _id, slug, name } }]
 */
export default function ServicesGrid({ categories = [], services = [] }) {
  const searchParams = useSearchParams();
  const requestedGroup = searchParams.get("group");
  const initialGroup = requestedGroup === "signage" || requestedGroup === "web-design" ? requestedGroup : "all";
  const [activeGroup, setActiveGroup] = useState(initialGroup);
  const [activeCategory, setActiveCategory] = useState("all");

  const groupTabs = [{ label: "All", value: "all" }, { label: "Web Design", value: "web-design" }];

  const visibleCategories = useMemo(
    () =>
      activeGroup === "all"
        ? categories
        : categories.filter((c) => c.group === activeGroup),
    [categories, activeGroup]
  );

  const categoryTabs = useMemo(
    () => [
      { label: "All", value: "all" },
      ...visibleCategories.map((c) => ({ label: c.name, value: c.slug })),
    ],
    [visibleCategories]
  );

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const matchesGroup =
        activeGroup === "all" || s.category?.group === activeGroup;
      const matchesCategory =
        activeCategory === "all" || s.category?.slug === activeCategory;
      return matchesGroup && matchesCategory;
    });
  }, [services, activeGroup, activeCategory]);

  return (
    <div>
      <CategoryFilterTabs
        tabs={groupTabs}
        active={activeGroup}
        onChange={(val) => {
          setActiveGroup(val);
          setActiveCategory("all");
        }}
      />

      {categoryTabs.length > 1 && (
        <div className="mt-4">
          <CategoryFilterTabs
            tabs={categoryTabs}
            active={activeCategory}
            onChange={setActiveCategory}
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No services in this category yet"
            message="Check back soon — we're adding new services regularly."
          />
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((service) => (
            <Card
              key={service._id}
              image={service.image}
              title={service.title}
              description={service.shortDescription}
              href={`/services/${service.slug}`}
              tag={service.category?.name}
              cta="View Service"
            />
          ))}
        </div>
      )}
    </div>
  );
}
