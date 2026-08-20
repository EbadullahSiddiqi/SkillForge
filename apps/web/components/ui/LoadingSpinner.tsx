type LoadingSpinnerProps = {
  message?: string;
  size?: "sm" | "md" | "lg";
};

export function LoadingSpinner({
  message = "Loading...",
  size = "md",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className={`${sizeClasses[size]} rounded-full border-2 border-white/10 border-t-cyan-400 animate-spin`}
      />
      {message && <p className="text-muted text-sm animate-pulse">{message}</p>}
    </div>
  );
}
