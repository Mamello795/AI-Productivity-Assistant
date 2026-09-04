import { ShieldAlert } from "lucide-react";

export function PopiaNotice({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-alert/60 bg-alert/25 px-4 py-3 text-sm text-alert-foreground">
      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
      <p>
        <span className="font-semibold">POPIA notice.</span> Do not enter beneficiary personal
        information (ID numbers, bank details, contact details). No personal data is stored by the AI.
        {!compact && " All AI output must be checked by a SASSA official before it is sent or actioned."}
      </p>
    </div>
  );
}
