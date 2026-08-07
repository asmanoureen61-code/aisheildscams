import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LANGUAGES, LANGUAGE_LABELS, type Language } from "@/types/scam";

interface Props {
  value: Language | "";
  onChange: (v: Language) => void;
}

export function LanguageSelector({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Response language</Label>
      <RadioGroup
        value={value}
        onValueChange={(v) => onChange(v as Language)}
        className="grid grid-cols-2 gap-2"
      >
        {LANGUAGES.map((v) => (
          <label
            key={v}
            className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm has-[:checked]:border-accent has-[:checked]:ring-1 has-[:checked]:ring-accent"
          >
            <RadioGroupItem value={v} id={`lang-${v}`} />
            <span>{LANGUAGE_LABELS[v]}</span>
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}
