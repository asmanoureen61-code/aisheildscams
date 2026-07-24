import { Link } from "@tanstack/react-router";
import { ShieldCheck, Menu } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/supported-scams", label: "Supported Scams" },
  { to: "/safety-tips", label: "Safety Tips" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <ShieldCheck className="h-6 w-6 text-accent" aria-hidden />
          <span className="text-lg">
            ScamShield <span className="text-accent">AI</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden md:flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "text-foreground bg-secondary" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild className="hidden sm:inline-flex">
            <Link to="/analyse">Check a Message</Link>
          </Button>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-border"
            onClick={() => setOpen((v) => !v)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        className={cn(
          "md:hidden border-t border-border/70 bg-background",
          open ? "block" : "hidden",
        )}
      >
        <div className="container-page flex flex-col gap-1 py-3">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "text-foreground bg-secondary" }}
            >
              {item.label}
            </Link>
          ))}
          <Button asChild className="mt-2 sm:hidden">
            <Link to="/analyse" onClick={() => setOpen(false)}>
              Check a Message
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
