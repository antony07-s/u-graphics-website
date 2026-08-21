"use client";

import { useEffect, useState } from "react";
import { motion, animate } from "framer-motion";

function Counter({ to, suffix = "" }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, to, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => setValue(Math.floor(v)),
    });
    return () => controls.stop();
  }, [to]);

  return (
    <span className="font-heading text-4xl font-bold text-primary sm:text-5xl">
      {value}
      {suffix}
    </span>
  );
}

/**
 * stats: [{ label: "Projects Completed", value: 500, suffix: "+" }, ...]
 */
export default function StatsCounter({ stats = [] }) {
  return (
    <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className="text-center"
        >
          <Counter to={stat.value} suffix={stat.suffix} />
          <p className="mt-1 text-sm font-medium text-ink/65">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}