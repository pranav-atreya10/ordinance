import Link from "next/link";
import { SITE } from "@/lib/site";
import { Mark } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-paper-2/60 print:hidden">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
            <Mark />
            <span className="font-serif text-[22px]">Ordinance</span>
          </div>
          <p className="mt-4 text-[14px] leading-relaxed text-muted">
            A student-built guide to Livingston, NJ permits and zoning. {SITE.disclaimer}
          </p>
        </div>
        <div>
          <h3 className="text-[12px] font-medium tracking-wider text-faint uppercase">Use it</h3>
          <ul className="mt-3 space-y-2 text-[14px]">
            <li><Link className="text-ink-2 hover:text-forest" href="/ask">Ask a question</Link></li>
            <li><Link className="text-ink-2 hover:text-forest" href="/precheck">Pre-check a project</Link></li>
            <li><Link className="text-ink-2 hover:text-forest" href="/staff">Staff dashboard</Link></li>
            <li><Link className="text-ink-2 hover:text-forest" href="/about">About & limits</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-[12px] font-medium tracking-wider text-faint uppercase">Official sources</h3>
          <ul className="mt-3 space-y-2 text-[14px]">
            <li><a className="text-ink-2 hover:text-forest" href={SITE.codeUrl} target="_blank" rel="noreferrer">Livingston Code on eCode360 ↗</a></li>
            <li><a className="text-ink-2 hover:text-forest" href={SITE.townshipUrl} target="_blank" rel="noreferrer">Livingston Township website ↗</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-4 py-5 text-[12.5px] text-faint sm:px-6">
          © {new Date().getFullYear()} Ordinance · Built by a Livingston student · Not legal advice
        </p>
      </div>
    </footer>
  );
}
