"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const PLAN_KEY = "fitlog-plan";
const SAVED_KEY = "fitlog-saved";

function getCount(key) {
  try {
    const stored = localStorage.getItem(key);

    if (!stored) return 0;

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
}

export default function Navbar() {
  const pathname = usePathname();

  const [mobileMenu, setMobileMenu] = useState(false);
  const [planCount, setPlanCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);

  const isWorkoutActive =
    pathname === "/" || pathname.startsWith("/workout");

  const isPlanActive = pathname === "/my-plan";

  function updateCounts() {
    setPlanCount(getCount(PLAN_KEY));
    setSavedCount(getCount(SAVED_KEY));
  }

  useEffect(() => {
    updateCounts();

    const handleStorageUpdate = () => {
      updateCounts();
    };

    window.addEventListener(
      "fitlog-storage-update",
      handleStorageUpdate
    );

    window.addEventListener("storage", handleStorageUpdate);

    return () => {
      window.removeEventListener(
        "fitlog-storage-update",
        handleStorageUpdate
      );

      window.removeEventListener(
        "storage",
        handleStorageUpdate
      );
    };
  }, []);

  return (
    <header className="border-b border-[#292c31] bg-[#101113]">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-8">
        <div className="flex h-[64px] items-center justify-between">

          {/* LOGO */}
          <Link
            href="/"
            onClick={() => setMobileMenu(false)}
            className="flex items-center gap-2"
            aria-label="FitLog home"
          >
            <img
              src="/assets/logo.png"
              alt="FitLog logo"
              className="h-7 w-7 object-contain"
            />

            <span className="text-[15px] font-black tracking-wide text-[#f5f5f0]">
              FITLOG
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-8 md:flex"
          >
            {/* WORKOUT */}
            <Link
              href="/"
              aria-current={isWorkoutActive ? "page" : undefined}
              className="text-[11px] font-semibold transition"
              style={{
                color: isWorkoutActive
                  ? "#b8f500"
                  : "#858991",
              }}
            >
              Workout
            </Link>

            {/* MY PLAN */}
            <Link
              href="/my-plan"
              aria-current={isPlanActive ? "page" : undefined}
              className="text-[11px] font-semibold transition"
              style={{
                color: isPlanActive
                  ? "#b8f500"
                  : "#858991",
              }}
            >
              My Plan
            </Link>
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2">

            {/* PLAN */}
            <Link
              href="/my-plan"
              aria-label={`Today's plan, ${planCount} workouts`}
              className="flex items-center gap-2 rounded-full border border-[#292c31] bg-[#17191d] px-3 py-1.5 transition hover:border-[#44484f]"
            >
              <span className="text-[9px] font-semibold text-[#858991]">
                Plan
              </span>

              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#b8f500] px-1 text-[8px] font-black text-black">
                {planCount}
              </span>
            </Link>

            {/* SAVED */}
            <Link
              href="/my-plan"
              aria-label={`Saved workouts, ${savedCount} workouts`}
              className="flex items-center gap-2 rounded-full border border-[#292c31] bg-[#17191d] px-3 py-1.5 transition hover:border-[#44484f]"
            >
              <span className="text-[9px] font-semibold text-[#858991]">
                Saved
              </span>

              <span className="flex h-4 min-w-4 items-center justify-center rounded-full border border-[#555960] px-1 text-[8px] font-black text-[#f5f5f0]">
                {savedCount}
              </span>
            </Link>

            {/* MOBILE MENU */}
            <button
              type="button"
              aria-label={
                mobileMenu
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={mobileMenu}
              onClick={() => setMobileMenu(!mobileMenu)}
              className="ml-1 flex h-8 w-8 items-center justify-center rounded-md border border-[#292c31] text-[#858991] md:hidden"
            >
              {mobileMenu ? (
                <X size={15} />
              ) : (
                <Menu size={15} />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE NAVIGATION */}
        {mobileMenu && (
          <div className="border-t border-[#292c31] py-4 md:hidden">
            <nav
              aria-label="Mobile navigation"
              className="flex flex-col gap-1"
            >
              {/* MOBILE WORKOUT */}
              <Link
                href="/"
                onClick={() => setMobileMenu(false)}
                aria-current={isWorkoutActive ? "page" : undefined}
                className="rounded-md px-3 py-3 text-[11px] font-semibold"
                style={{
                  color: isWorkoutActive
                    ? "#b8f500"
                    : "#858991",
                  backgroundColor: isWorkoutActive
                    ? "#17191d"
                    : "transparent",
                }}
              >
                Workout
              </Link>

              {/* MOBILE MY PLAN */}
              <Link
                href="/my-plan"
                onClick={() => setMobileMenu(false)}
                aria-current={isPlanActive ? "page" : undefined}
                className="flex items-center justify-between rounded-md px-3 py-3 text-[11px] font-semibold"
                style={{
                  color: isPlanActive
                    ? "#b8f500"
                    : "#858991",
                  backgroundColor: isPlanActive
                    ? "#17191d"
                    : "transparent",
                }}
              >
                <span>My Plan</span>

                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#b8f500] px-1 text-[8px] font-black text-black">
                  {planCount}
                </span>
              </Link>

              {/* MOBILE SAVED */}
              <Link
                href="/my-plan"
                onClick={() => setMobileMenu(false)}
                aria-label={`Saved workouts, ${savedCount} workouts`}
                className="flex items-center justify-between rounded-md px-3 py-3 text-[11px] font-semibold text-[#858991]"
              >
                <span>Saved</span>

                <span className="flex h-5 min-w-5 items-center justify-center rounded-full border border-[#555960] px-1 text-[8px] text-[#f5f5f0]">
                  {savedCount}
                </span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}