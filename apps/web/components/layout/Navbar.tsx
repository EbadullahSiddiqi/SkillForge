"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getUser, isAuthenticated, logout } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Hammer, Menu, X } from "lucide-react";

const publicLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
];

const appLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/boss", label: "Boss Battle" },
  { href: "/mentor", label: "AI Mentor" },
];

export function Navbar() {
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
    setUserName(getUser()?.name ?? null);
  }, [pathname]);

  const links = authenticated ? appLinks : publicLinks;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-800"
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href={authenticated ? "/dashboard" : "/"} className="flex items-center gap-2 group">
          <Hammer className="w-5 h-5 text-cyan-400 transition-transform group-hover:rotate-12" />
          <span className="font-mono font-bold text-base tracking-tight uppercase">
            Skill<span className="text-cyan-400">Forge</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all border ${
                pathname === link.href
                  ? "text-cyan-400 bg-zinc-900 border-zinc-700"
                  : "text-muted border-transparent hover:text-foreground hover:bg-zinc-900/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {authenticated ? (
            <>
              {userName && (
                <span className="text-xs font-mono text-muted uppercase">
                  HI, <span className="text-foreground">{userName.split(" ")[0]}</span>
                </span>
              )}
              <Button variant="ghost" size="sm" onClick={logout} className="font-mono text-xs uppercase">
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button href="/login" variant="ghost" size="sm" className="font-mono text-xs uppercase">
                Log in
              </Button>
              <Button href="/signup" size="sm" className="font-mono text-xs uppercase">
                Get started
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="md:hidden p-2 text-muted hover:text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden border-t border-zinc-800 bg-[#09090b] px-6 py-4 space-y-2"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-sm font-mono uppercase tracking-wider text-muted hover:text-foreground hover:bg-zinc-900"
            >
              {link.label}
            </Link>
          ))}
          {authenticated ? (
            <button
              type="button"
              onClick={logout}
              className="w-full text-left px-4 py-3 text-sm font-mono uppercase tracking-wider text-muted hover:text-foreground"
            >
              Log out
            </button>
          ) : (
            <div className="flex gap-2 pt-2">
              <Button href="/login" variant="secondary" size="sm" className="flex-1 font-mono text-xs uppercase">
                Log in
              </Button>
              <Button href="/signup" size="sm" className="flex-1 font-mono text-xs uppercase">
                Sign up
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </motion.header>
  );
}
