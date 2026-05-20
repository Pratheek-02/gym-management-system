import { cn } from "@/lib/utils";

export function Input({
  className,
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-zinc-400">
          {label}
        </span>
      )}
      <input
        className={cn("theme-input", className)}
        {...props}
      />
    </label>
  );
}

export function Select({
  className,
  label,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-zinc-400">
          {label}
        </span>
      )}
      <select className={cn("theme-input", className)} {...props}>
        {children}
      </select>
    </label>
  );
}

export function Textarea({
  className,
  label,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-zinc-400">
          {label}
        </span>
      )}
      <textarea className={cn("theme-input", className)} {...props} />
    </label>
  );
}
