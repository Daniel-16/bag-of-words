import { Link, useLocation } from "react-router-dom";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">Baggage</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link to="/">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-muted-foreground transition-colors hover:text-foreground",
                isActive("/") && "text-foreground font-medium"
              )}
            >
              Home
            </Button>
          </Link>
          <Link to="/detector">
            <Button
              variant={isActive("/detector") ? "default" : "ghost"}
              size="sm"
              className={cn(
                !isActive("/detector") && "text-muted-foreground hover:text-foreground"
              )}
            >
              Detector
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
