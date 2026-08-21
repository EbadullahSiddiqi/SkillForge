import { Button } from "./Button";
import { AlertTriangle } from "lucide-react";

type ErrorStateProps = {
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
};

export function ErrorState({
  title = "Something went wrong",
  message,
  actionLabel,
  onAction,
  actionHref,
}: ErrorStateProps) {
  return (
    <div className="bg-[#101012] border border-zinc-850 p-10 text-center max-w-md mx-auto shadow-2xl">
      <div className="w-12 h-12 bg-red-950/20 border border-red-950/30 text-red-500 flex items-center justify-center mx-auto mb-6">
        <AlertTriangle className="w-6 h-6 animate-pulse" />
      </div>
      <h2 className="text-base font-mono font-bold uppercase tracking-wider text-foreground mb-2">{title}</h2>
      <p className="text-xs text-zinc-400 font-mono leading-relaxed mb-6">{message}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="secondary" className="font-mono text-xs uppercase tracking-wider w-full">
          {actionLabel}
        </Button>
      )}
      {actionLabel && actionHref && !onAction && (
        <Button href={actionHref} variant="secondary" className="font-mono text-xs uppercase tracking-wider w-full">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
