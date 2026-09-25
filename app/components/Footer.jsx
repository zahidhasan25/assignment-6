export default function Footer() {
  return (
    <footer className="border-t border-[#292c31] bg-[#101113]">
      <div className="mx-auto flex min-h-[72px] max-w-[1400px] flex-col items-center justify-between gap-4 px-5 py-5 sm:flex-row lg:px-8">

        {/* Brand */}
        <div className="flex items-center gap-2">
          <img
            src="/assets/logo.png"
            alt="FitLog logo"
            className="h-6 w-6 object-contain"
          />

          <span className="text-[11px] font-black tracking-wide text-[#f5f5f0]">
            FITLOG
          </span>
        </div>

        {/* Copyright */}
        <p className="text-center text-[8px] font-medium text-[#858991] sm:text-right">
          © 2026 FitLog — Workout Library. Train hard, log honest.
        </p>

      </div>
    </footer>
  );
}