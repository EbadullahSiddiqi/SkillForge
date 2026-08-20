"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getUser, isAuthenticated, logout } from "@/lib/auth";
import { Button } from "@/components/ui/Button";

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

  const isLanding = pathname === "/";
  const links = authenticated ? appLinks : publicLinks;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5"
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href={authenticated ? "/dashboard" : "/"} className="flex items-center gap-2 group">
          <span className="text-2xl">⚒️</span>
          <span className="font-bold text-lg tracking-tight">
            Skill<span className="text-cyan-400">Forge</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                pathname === link.href
                  ? "text-cyan-400 bg-cyan-500/10"
                  : "text-muted hover:text-foreground hover:bg-white/5"
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
                <span className="text-sm text-muted">
                  Hi, <span className="text-foreground">{userName.split(" ")[0]}</span>
                </span>
              )}
              <Button variant="ghost" size="sm" onClick={logout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button href="/login" variant="ghost" size="sm">
                Log in
              </Button>
              <Button href="/signup" size="sm">
                Get started
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="md:hidden p-2 text-muted"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </nav>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden border-t border-white/5 px-6 py-4 space-y-2"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-lg text-sm text-muted hover:text-foreground hover:bg-white/5"
            >
              {link.label}
            </Link>
          ))}
          {authenticated ? (
            <button
              type="button"
              onClick={logout}
              className="w-full text-left px-4 py-3 rounded-lg text-sm text-muted hover:text-foreground"
            >
              Log out
            </button>
          ) : (
            <div className="flex gap-2 pt-2">
              <Button href="/login" variant="secondary" size="sm" className="flex-1">
                Log in
              </Button>
              <Button href="/signup" size="sm" className="flex-1">
                Sign up
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </motion.header>
  );
}
