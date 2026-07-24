import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/70 bg-secondary/40">
      <div className="container-page grid gap-8 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="h-5 w-5 text-accent" aria-hidden />
            <span>
              ScamShield <span className="text-accent">AI</span>
            </span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            AI-powered safety guidance for suspicious messages and screenshots.
            Not a legal or financial service.
          </p>
        </div>

        <div className="text-sm">
          <div className="mb-3 font-medium">Product</div>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/analyse" className="hover:text-foreground">Check a Message</Link></li>
            <li><Link to="/how-it-works" className="hover:text-foreground">How It Works</Link></li>
            <li><Link to="/supported-scams" className="hover:text-foreground">Supported Scams</Link></li>
            <li><Link to="/safety-tips" className="hover:text-foreground">Safety Tips</Link></li>
          </ul>
        </div>

        <div className="text-sm">
          <div className="mb-3 font-medium">Legal</div>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/privacy" className="hover:text-foreground">Privacy</Link></li>
            <li><Link to="/terms" className="hover:text-foreground">Terms</Link></li>
            <li><Link to="/disclaimer" className="hover:text-foreground">Disclaimer</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/70">
        <div className="container-page py-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} ScamShield AI. Results are guidance, not a guarantee.
        </div>
      </div>
    </footer>
  );
}
