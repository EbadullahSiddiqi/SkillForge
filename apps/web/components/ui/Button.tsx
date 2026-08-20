"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
};

const variants = {
  primary:
    "bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 font-semibold hover:from-cyan-400 hover:to-cyan-300 shadow-lg shadow-cyan-500/20",
  secondary:
    "bg-surface-elevated border border-white/10 text-foreground hover:border-white/20 hover:bg-white/5",
  ghost: "text-muted hover:text-foreground hover:bg-white/5",
  danger:
    "bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20",
};

const sizes = {
  sm: "px-4 py-2 text-sm rounded-lg",
  md: "px-6 py-3 text-sm rounded-xl",
  lg: "px-8 py-4 text-base rounded-2xl",
};

export function Button({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled,
  className = "",
}: ButtonProps) {
  const classes = `${variants[variant]} ${sizes[size]} inline-flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </motion.button>
  );
}
