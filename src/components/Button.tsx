import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:opacity-50",
        size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-sm",
        variant === "primary" &&
          "bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-900/30",
        variant === "secondary" &&
          "border border-[#333] bg-[#111] text-zinc-200 hover:border-red-900/50 hover:bg-red-950/30",
        variant === "danger" &&
          "bg-red-800 text-white hover:bg-red-700",
        variant === "ghost" &&
          "text-zinc-400 hover:bg-[#1a1a1a] hover:text-white",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
