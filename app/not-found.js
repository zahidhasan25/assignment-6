export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#101113] px-5 text-[#f5f5f0]">
      <div className="text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#b8f500]">
          FITLOG
        </p>

        <h1 className="mt-4 text-7xl font-black">
          404
        </h1>

        <h2 className="mt-4 text-xl font-black uppercase">
          Workout Not Found
        </h2>

        <p className="mt-3 text-sm text-[#858991]">
          The workout you are looking for does not exist.
        </p>

        <a
          href="/"
          className="mt-7 inline-block rounded-md bg-[#b8f500] px-5 py-3 text-[9px] font-black uppercase text-black"
        >
          Back to Workouts
        </a>
      </div>
    </main>
  );
}