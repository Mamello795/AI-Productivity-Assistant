import { X } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

type Props = {
  /** Called when the panel should close. Omit to navigate back to the dashboard. */
  onClose?: () => void;
  label?: string;
  className?: string;
};

/** 24px close control, top-right aligned, turns SASSA red on hover. */
export function CloseButton({ onClose, label = "Close", className = "" }: Props) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => {
        if (onClose) onClose();
        else void navigate({ to: "/dashboard" });
      }}
      className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-[var(--close-red)]/10 hover:text-[var(--close-red)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--close-red)] ${className}`}
    >
      <X className="h-6 w-6" strokeWidth={2} />
    </button>
  );
}
