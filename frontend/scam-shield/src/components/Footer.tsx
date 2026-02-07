import { Link } from "react-router-dom";
import { Shield, Github, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">Baggage</span>
            <span className="text-muted-foreground">• AFF Detector</span>
          </div>

          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <Link to="/detector" className="transition-colors hover:text-foreground">
              Detector
            </Link>
          </nav>

          {/* <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-3.5 w-3.5 fill-destructive text-destructive" />
            <span>to fight fraud</span>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
