"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Close, Menu } from "./icons";
import { Logo } from "./Logo";

const LINKS = [
  { href: "/ask", label: "Ask" },
  { href: "/precheck", label: "Pre-check" },
  { href: "/staff", label: "For staff" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/80 backdrop-blur-xl print:hidden">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {LINKS.map((l) => {
            const active = path.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-3.5 py-1.5 text-[14px] transition-colors ${
                  active ? "bg-ink/[0.06] text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <Link
            href="/ask"
            className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[14px] font-medium text-paper transition hover:bg-ink-2"
          >
            Ask a question <ArrowRight size={15} />
          </Link>
        </nav>
        <button
          type="button"
          className="-mr-2 grid size-10 place-items-center rounded-full text-ink md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <Close size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <nav className="animate-rise border-t border-line bg-paper px-4 pt-2 pb-5 md:hidden" aria-label="Mobile">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between border-b border-line py-3.5 text-[17px] text-ink"
            >
              {l.label} <ArrowRight size={16} className="text-faint" />
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
