import Link from "next/link";

export function Mark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`grid size-8 place-items-center rounded-[9px] bg-forest text-[19px] leading-none text-paper shadow-[inset_0_-2px_0_rgb(0_0_0/0.18)] ${className}`}
      aria-hidden
    >
      <span className="font-serif -mt-px">§</span>
    </span>
  );
}

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label="Ordinance home">
      <Mark className="transition-transform duration-300 group-hover:-rotate-6" />
      <span className="font-serif text-[23px] leading-none tracking-[-0.01em] text-ink">Ordinance</span>
    </Link>
  );
}
