import type { ReactNode } from "react";
import { CloseButton } from "@/components/CloseButton";
import { PopiaNotice } from "@/components/PopiaNotice";

type Props = {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
};

/** Standard tool page frame: yellow header band with a 24px red-hover close control. */
export function ToolShell({ title, description, icon, children }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 rounded-xl gradient-gold px-5 py-4 card-elevated">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-background/70 p-2 text-gold-foreground">{icon}</div>
          <div>
            <h1 className="text-xl font-bold text-gold-foreground">{title}</h1>
            <p className="text-sm text-gold-foreground/80">{description}</p>
          </div>
        </div>
        <CloseButton label="Close tool and return to dashboard" className="text-gold-foreground/70" />
      </div>
      <PopiaNotice />
      {children}
    </div>
  );
}
