"use client";

import { useEffect, useState } from "react";
import ImageUploadField from "@/components/admin/ImageUploadField";

const empty = {
  title: "",
  slug: "",
  catalogGroup: "signboards",
  shortDescription: "",
  description: "",
  image: "/images/hero/heroslider1.jpeg",
  order: 0,
};

export default function ServiceManager() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [status, setStatus] = useState("");

  const load = () =>
    fetch("/api/services")
      .then((r) => r.json())
      .then((data) =>
        setServices(data.services.filter((item) => item.catalogGroup))
      )
      .catch(() => setStatus("Unable to load services."));

  useEffect(() => {
    load();
  }, []);

  const change = (event) =>
    setForm({
      ...form,
      [event.target.name]:
        event.target.name === "order"
          ? Number(event.target.value)
          : event.target.value,
    });

  const submit = async (event) => {
    event.preventDefault();
    setStatus("Saving...");
    const url = editing ? `/api/services/${editing}` : "/api/services";
    const response = await fetch(url, {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!response.ok) {
      setStatus("Unable to save. Check the details and sign-in permissions.");
      return;
    }
    setForm(empty);
    setEditing(null);
    setStatus("Saved.");
    load();
  };

  const edit = (service) => {
    setEditing(service._id);
    setForm({ ...empty, ...service });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (service) => {
    if (!window.confirm(`Delete ${service.title}?`)) return;
    const response = await fetch(`/api/services/${service._id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setStatus("Deleted.");
      load();
    } else {
      setStatus("Unable to delete service.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">
            Manage Services
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            Signboards and Digital Printing services displayed on the public
            site.
          </p>
        </div>
      </div>

      <form
        onSubmit={submit}
        className="mt-6 grid gap-4 rounded-card bg-white p-5 shadow-card sm:grid-cols-2"
      >
        <h2 className="font-heading text-lg font-semibold sm:col-span-2">
          {editing ? "Edit service" : "Add service"}
        </h2>

        {[
          ["title", "Title"],
          ["slug", "URL slug"],
          ["order", "Display order"],
        ].map(([name, label]) => (
          <label key={name} className="text-sm font-medium">
            {label}
            <input
              required={name !== "order"}
              name={name}
              value={form[name]}
              onChange={change}
              className="mt-1 w-full rounded-card border border-ink/15 px-3 py-2"
            />
          </label>
        ))}

        <label className="text-sm font-medium">
          Service group
          <select
            name="catalogGroup"
            value={form.catalogGroup}
            onChange={change}
            className="mt-1 w-full rounded-card border border-ink/15 px-3 py-2"
          >
            <option value="signboards">Signboards</option>
            <option value="digital-printing">Digital Printing</option>
          </select>
        </label>

        <div className="sm:col-span-2">
          <ImageUploadField
            label="Image"
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
            folder="ugraphics/services"
          />
        </div>

        <label className="text-sm font-medium">
          Short description
          <input
            name="shortDescription"
            value={form.shortDescription || ""}
            onChange={change}
            className="mt-1 w-full rounded-card border border-ink/15 px-3 py-2"
          />
        </label>

        <label className="text-sm font-medium sm:col-span-2">
          Full description
          <textarea
            name="description"
            value={form.description || ""}
            onChange={change}
            rows="4"
            className="mt-1 w-full rounded-card border border-ink/15 px-3 py-2"
          />
        </label>

        <div className="flex gap-3 sm:col-span-2">
          <button className="btn-primary" type="submit">
            {editing ? "Save changes" : "Add service"}
          </button>
          {editing && (
            <button
              type="button"
              className="btn-outline"
              onClick={() => {
                setForm(empty);
                setEditing(null);
              }}
            >
              Cancel
            </button>
          )}
          <span className="self-center text-sm text-ink/60">{status}</span>
        </div>
      </form>

      <div className="mt-8 overflow-x-auto rounded-card bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-muted text-xs uppercase text-ink/50">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Group</th>
              <th className="p-4">Slug</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service._id} className="border-t border-ink/5">
                <td className="p-4 font-medium">{service.title}</td>
                <td className="p-4">{service.catalogGroup}</td>
                <td className="p-4 text-ink/60">{service.slug}</td>
                <td className="p-4 text-right">
                  <button
                    className="mr-3 text-primary"
                    onClick={() => edit(service)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-danger"
                    onClick={() => remove(service)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}