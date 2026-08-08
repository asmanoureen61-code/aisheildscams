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
    <header className="nav-motion sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur animate-nav-fade-in">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold tracking-tight transition-opacity duration-200 hover:opacity-80"
        >
          <ShieldCheck className="h-6 w-6 text-accent" aria-hidden />
          <span className="text-lg">
            Scam Detector <span className="text-accent">AI</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden md:flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 ease-out hover:bg-secondary hover:text-foreground hover:-translate-y-px active:translate-y-0"
              activeProps={{ className: "text-foreground bg-secondary" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            className="hidden sm:inline-flex transition-transform duration-200 ease-out hover:scale-[1.03] active:scale-[0.98]"
          >
            <Link to="/analyse">Check a Message</Link>
          </Button>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-border transition-all duration-200 ease-out hover:bg-secondary active:scale-95"
            onClick={() => setOpen((v) => !v)}
          >
            <Menu
              className={cn(
                "h-5 w-5 transition-transform duration-200 ease-out",
                open && "rotate-90",
              )}
            />
          </button>
        </div>
      </div>

      <div
        className={cn(
          "md:hidden grid overflow-hidden border-border/70 bg-background transition-[grid-template-rows,opacity,border-color] duration-300 ease-out",
          open
            ? "grid-rows-[1fr] opacity-100 border-t"
            : "pointer-events-none grid-rows-[0fr] opacity-0 border-t border-transparent",
        )}
        aria-hidden={!open}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={cn(
              "container-page flex flex-col gap-1 py-3 transition-transform duration-300 ease-out",
              open ? "translate-y-0" : "-translate-y-1",
            )}
          >
            {NAV.map((item, i) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                style={{ transitionDelay: open ? `${60 + i * 40}ms` : "0ms" }}
                className={cn(
                  "rounded-md px-3 py-2 text-sm text-muted-foreground transition-all duration-200 ease-out hover:bg-secondary hover:text-foreground",
                  open ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0",
                )}
                activeProps={{ className: "text-foreground bg-secondary" }}
              >
                {item.label}
              </Link>
            ))}
            <Button
              asChild
              className={cn(
                "mt-2 sm:hidden transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]",
                open ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0",
              )}
              style={{ transitionDelay: open ? `${60 + NAV.length * 40}ms` : "0ms" }}
            >
              <Link to="/analyse" onClick={() => setOpen(false)}>
                Check a Message
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
