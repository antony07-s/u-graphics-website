"use client";

/**
 * tabs: [{ label: "All", value: "all" }, { label: "Signage", value: "signage" }, ...]
 */
export default function CategoryFilterTabs({ tabs = [], active, onChange }) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {tabs.map((tab) => {
        const isActive = active === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-primary text-white shadow-card"
                : "bg-surface-muted text-ink/70 hover:bg-primary/10 hover:text-primary"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
