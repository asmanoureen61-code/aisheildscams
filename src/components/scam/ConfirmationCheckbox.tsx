import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Props {
  checked: boolean;
  onChange: (v: boolean) => void;
}

export function ConfirmationCheckbox({ checked, onChange }: Props) {
  return (
    <div className="flex items-start gap-3">
      <Checkbox
        id="confirm"
        checked={checked}
        onCheckedChange={(v) => onChange(v === true)}
        className="mt-0.5"
      />
      <Label htmlFor="confirm" className="cursor-pointer text-sm font-normal text-muted-foreground">
        I understand that AI results are guidance and not a guarantee.
      </Label>
    </div>
  );
}
