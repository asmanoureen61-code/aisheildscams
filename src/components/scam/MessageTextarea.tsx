import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const MAX = 5000;
const MIN = 10;

const EXAMPLE =
  "Dear customer, your HBL account has been temporarily suspended due to unusual activity. To reactivate, verify your details within 30 minutes: http://hbl-verify-secure.co/login. Please share your OTP with our agent to confirm identity.";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export function MessageTextarea({ value, onChange }: Props) {
  const len = value.length;
  const trimmed = value.trim();
  const tooShort = trimmed.length > 0 && trimmed.length < MIN;
  const tooLong = len > MAX;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="message" className="text-sm font-medium">
          Paste the suspicious message
        </Label>
        <button
          type="button"
          className="text-xs text-accent hover:underline"
          onClick={() => onChange(EXAMPLE)}
        >
          Load example
        </button>
      </div>
      <Textarea
        id="message"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste a WhatsApp message, SMS, email, job offer or payment request here..."
        rows={8}
        maxLength={MAX + 500}
        aria-invalid={tooShort || tooLong}
        aria-describedby="message-help"
        className="resize-y bg-surface"
      />
      <div id="message-help" className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-muted-foreground">
          {tooShort && <span className="text-destructive">At least {MIN} characters required. </span>}
          {tooLong && <span className="text-destructive">Maximum {MAX} characters. </span>}
          {!tooShort && !tooLong && "Do not paste passwords or OTP codes."}
        </span>
        <span className={len > MAX ? "text-destructive" : "text-muted-foreground"}>
          {len} / {MAX}
        </span>
      </div>
      {value === EXAMPLE && (
        <div className="rounded-md bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
          This is a clearly fake example message provided for testing.
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="ml-2 h-6 px-2"
            onClick={() => onChange("")}
          >
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}

export function isValidMessage(v: string) {
  const t = v.trim();
  return t.length >= MIN && t.length <= MAX;
}
