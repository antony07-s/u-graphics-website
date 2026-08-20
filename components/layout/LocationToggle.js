"use client";

import { useState } from "react";
import { MapPin, Phone } from "lucide-react";

function IndiaFlag({ className = "" }) {
  return (
    <svg viewBox="0 0 24 16" className={className} aria-hidden="true">
      <rect width="24" height="16" fill="#fff" />
      <rect width="24" height="5.33" fill="#FF9933" />
      <rect y="10.67" width="24" height="5.33" fill="#138808" />
      <circle cx="12" cy="8" r="2" fill="none" stroke="#000080" strokeWidth="0.4" />
    </svg>
  );
}

function MalaysiaFlag({ className = "" }) {
  return (
    <svg viewBox="0 0 24 16" className={className} aria-hidden="true">
      <rect width="24" height="16" fill="#fff" />
      <rect width="24" height="1.14" fill="#CC0001" />
      <rect y="2.29" width="24" height="1.14" fill="#CC0001" />
      <rect y="4.57" width="24" height="1.14" fill="#CC0001" />
      <rect y="6.86" width="24" height="1.14" fill="#CC0001" />
      <rect y="9.14" width="24" height="1.14" fill="#CC0001" />
      <rect y="11.43" width="24" height="1.14" fill="#CC0001" />
      <rect y="13.71" width="24" height="1.14" fill="#CC0001" />
      <rect width="12" height="8.57" fill="#010066" />
      <circle cx="6" cy="4.3" r="2.4" fill="#FFCC00" />
      <circle cx="6.9" cy="4.3" r="2" fill="#010066" />
    </svg>
  );
}

/**
 * Location switcher — India is the default/active tab, Malaysia only shows
 * once clicked. Renders address, phone (if provided) and flag per location.
 */
export default function LocationToggle({
  indiaAddress,
  malaysiaAddress,
  malaysiaPhone,
  indiaPhone,
}) {
  const [active, setActive] = useState("india");

  const locations = {
    india: {
      label: "India",
      flag: IndiaFlag,
      address: indiaAddress,
      phone: indiaPhone,
    },
    malaysia: {
      label: "Malaysia",
      flag: MalaysiaFlag,
      address: malaysiaAddress,
      phone: malaysiaPhone,
    },
  };

  const current = locations[active];
  const CurrentFlag = current.flag;

  return (
    <div>
      <div className="flex gap-2">
        {Object.entries(locations).map(([key, loc]) => {
          const Flag = loc.flag;
          const isActive = key === active;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActive(key)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition ${
                isActive
                  ? "bg-white text-primary-dark"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              <Flag className="h-3 w-4 rounded-sm" />
              {loc.label}
            </button>
          );
        })}
      </div>

      <ul className="mt-3 space-y-3 text-sm text-white/70">
        <li className="flex items-start gap-2">
          <CurrentFlag className="mt-1 h-3.5 w-5 shrink-0 rounded-sm" />
          <span>{current.address}</span>
        </li>
        {current.phone && (
          <li className="flex items-center gap-2">
            <Phone size={16} />
            <a href={`tel:${current.phone}`} className="hover:text-accent">
              {current.phone}
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}


