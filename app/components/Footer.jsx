import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#292c31] bg-[#101113]">
      <div className="mx-auto flex min-h-[72px] max-w-[1400px] flex-col items-center justify-between gap-4 px-5 py-5 sm:flex-row lg:px-8">

        {/* BRAND */}
        <Link
          href="/"
          aria-label="FitLog home"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <img
            src="/assets/logo.png"
            alt="FitLog logo"
            className="h-6 w-6 object-contain"
          />

          <span className="text-[11px] font-black tracking-wide text-[#f5f5f0]">
            FITLOG
          </span>
        </Link>

        {/* COPYRIGHT */}
        <p className="text-center text-[8px] font-medium leading-4 text-[#858991] sm:text-right">
          © 2026 FitLog — Workout Library. Train hard, log honest.
        </p>
      </div>
    </footer>
  );
}