import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

interface Props {
  file: File | null;
  onChange: (f: File | null) => void;
}

export function ScreenshotUpload({ file, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function validate(f: File): string | null {
    if (!ALLOWED.has(f.type)) return "Only JPG, PNG or WEBP files are supported.";
    if (f.size > MAX_BYTES) return "File must be 5 MB or smaller.";
    return null;
  }

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    if (files.length > 1) {
      setError("Only one screenshot can be selected at a time.");
      return;
    }
    const f = files[0];
    const err = validate(f);
    if (err) {
      setError(err);
      onChange(null);
      return;
    }
    setError(null);
    onChange(f);
  }

  return (
    <div className="space-y-3">
      <div className="rounded-md border border-dashed border-border bg-surface p-2">
        {file && preview ? (
          <div className="flex flex-col gap-3 sm:flex-row">
            <img
              src={preview}
              alt="Screenshot preview"
              className="max-h-56 w-full rounded-md object-contain sm:w-56"
            />
            <div className="flex flex-1 flex-col gap-2 p-2 text-sm">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-accent" aria-hidden />
                <span className="truncate font-medium">{file.name}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {file.type} · {formatSize(file.size)}
              </div>
              <div className="mt-auto flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => inputRef.current?.click()}
                >
                  Replace
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onChange(null)}
                >
                  <X className="mr-1 h-4 w-4" /> Remove
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFiles(e.dataTransfer.files);
            }}
            className={
              "flex flex-col items-center justify-center gap-3 rounded-md p-8 text-center " +
              (dragOver ? "bg-accent/10" : "")
            }
          >
            <Upload className="h-8 w-8 text-accent" aria-hidden />
            <div className="text-sm">
              <p className="font-medium">Drag & drop a screenshot here</p>
              <p className="text-muted-foreground">JPG, PNG or WEBP · max 5 MB</p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => inputRef.current?.click()}
            >
              Select Screenshot
            </Button>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="space-y-2 text-xs text-muted-foreground">
        <p>
          For better results, upload a clear screenshot with readable text. Avoid
          cropped, dark or blurry images.
        </p>
        <p className="font-medium text-foreground">
          Do not upload screenshots containing passwords, OTP codes or complete
          payment-card details.
        </p>
      </div>
    </div>
  );
}
