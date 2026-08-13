/**
 * Consistent styled form fields, meant to be used with react-hook-form.
 * Each accepts `label`, `error`, and standard input props via `register(...)`.
 */

export function FormInput({ label, error, id, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        className={`rounded-card border px-4 py-2.5 text-sm outline-none transition focus:border-primary ${
          error ? "border-danger" : "border-ink/15"
        }`}
        {...props}
      />
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
}

export function FormTextarea({ label, error, id, rows = 4, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        className={`rounded-card border px-4 py-2.5 text-sm outline-none transition focus:border-primary ${
          error ? "border-danger" : "border-ink/15"
        }`}
        {...props}
      />
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
}

export function FormSelect({ label, error, id, options = [], ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <select
        id={id}
        className={`rounded-card border bg-white px-4 py-2.5 text-sm outline-none transition focus:border-primary ${
          error ? "border-danger" : "border-ink/15"
        }`}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
}
