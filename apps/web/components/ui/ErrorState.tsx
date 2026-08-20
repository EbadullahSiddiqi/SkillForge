import { Button } from "./Button";

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
    <div className="glass rounded-3xl p-10 text-center max-w-md mx-auto">
      <div className="text-4xl mb-4">⚠️</div>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-muted mb-6">{message}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="secondary">
          {actionLabel}
        </Button>
      )}
      {actionLabel && actionHref && !onAction && (
        <Button href={actionHref} variant="secondary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
