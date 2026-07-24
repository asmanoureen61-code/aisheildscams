import { ShieldAlert } from "lucide-react";

export function PrivacyNotice() {
  return (
    <div className="flex items-start gap-3 rounded-md border border-border bg-secondary/50 p-3 text-sm">
      <ShieldAlert className="mt-0.5 h-4 w-4 flex-none text-accent" aria-hidden />
      <p className="text-muted-foreground">
        Remove passwords, OTP codes, complete card details and unnecessary
        personal information before analysis. Automatic masking may not detect
        every private detail.
      </p>
    </div>
  );
}
