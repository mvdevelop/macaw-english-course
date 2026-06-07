interface SpinnerProps {
  size?: "sm" | "md" | "lg";
}

export default function Spinner({ size = "md" }: SpinnerProps) {
  const sizeClasses: Record<string, string> = {
    sm: "w-6 h-6 border-2",
    md: "w-12 h-12 border-4",
    lg: "w-16 h-16 border-[5px]",
  };

  const s: string = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      className={`${s} border-primary-light border-t-primary rounded-full animate-spin`}
      style={{ animationDuration: "0.8s" }}
    />
  );
}
