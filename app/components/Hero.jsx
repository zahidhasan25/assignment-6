import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="mx-auto max-w-\[1400px\] px-5 pt-5 lg:px-8">

      <div className="grid min-h-\[310px\] overflow-hidden rounded-xl border border-[#292c31] bg-[#17191d] md:grid-cols-2">

        {/* Left Content */}
        <div className="flex flex-col justify-center px-6 py-10 sm:px-8 lg:px-10">

          <p className="mb-4 text-[9px] font-bold uppercase tracking-[0.2em] text-[#b8f500]">
            Workout Library
          </p>

          <h1 className="max-w-\[600px\] text-[34px] font-black uppercase leading-[0.95] tracking-[-0.03em] text-[#f5f5f0] sm:text-[40px] lg:text-[46px]">
            Train With Intent.
            <br />
            Log Every Set.
          </h1>

          <p className="mt-5 max-w-\[500px\] text-[11px] leading-5 text-[#858991] sm:text-[12px]">
            FitLog is a dark, no-nonsense gym companion:
            pick a lift, lock it into today&apos;s plan,
            and watch the week&apos;s work add up.
          </p>

          <div className="mt-6">

            <Link
              href="#library"
              className="inline-flex items-center gap-2 rounded-md bg-[#b8f500] px-4 py-2.5 text-[9px] font-black uppercase tracking-wide text-black transition hover:bg-[#c8ff27]"
            >
              Browse Workouts
              <ArrowRight size={12} strokeWidth={2.5} />
            </Link>

          </div>

        </div>

        {/* Right Banner Image */}
        <div className="relative min-h-\[260px\] overflow-hidden bg-[#17191d]">

          <img
            src="/assets/banner.png"
            alt="FitLog workout banner"
            className="absolute inset-0 h-full w-full object-contain"
          />

        </div>

      </div>

    </section>
  );
}