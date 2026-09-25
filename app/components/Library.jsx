"use client";

import Link from "next/link";
import { ChevronDown, Clock3, Flame, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const SORT_OPTIONS = [
  {
    value: "duration",
    label: "Duration",
  },
  {
    value: "calories",
    label: "Calories",
  },
  {
    value: "rating",
    label: "Rating",
  },
];

function getWorkoutList(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.workouts)) {
    return data.workouts;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  return [];
}

function getNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

export default function Library() {
  const [workouts, setWorkouts] = useState([]);
  const [sortBy, setSortBy] = useState("duration");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchWorkouts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/fitlog", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load workouts.");
        }

        const data = await response.json();

        const workoutList = getWorkoutList(data);

        setWorkouts(workoutList);
      } catch (err) {
        console.error("Library fetch error:", err);

        setError(
          "Unable to load workouts right now. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchWorkouts();
  }, []);

  const sortedWorkouts = useMemo(() => {
    const list = [...workouts];

    if (sortBy === "duration") {
      return list.sort(
        (a, b) =>
          getNumber(a.duration) -
          getNumber(b.duration)
      );
    }

    if (sortBy === "calories") {
      return list.sort(
        (a, b) =>
          getNumber(b.caloriesBurned) -
          getNumber(a.caloriesBurned)
      );
    }

    if (sortBy === "rating") {
      return list.sort(
        (a, b) =>
          getNumber(b.rating) -
          getNumber(a.rating)
      );
    }

    return list;
  }, [workouts, sortBy]);

  return (
    <section
      id="library"
      className="mx-auto max-w-[1400px] px-5 py-14 lg:px-8 lg:py-16"
    >
      {/* SECTION HEADER */}
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[#b8f500]">
            Training Library
          </p>

          <h2 className="text-3xl font-black uppercase tracking-[-0.03em] text-[#f5f5f0] sm:text-4xl">
            The Library
          </h2>

          <p className="mt-2 text-[11px] leading-5 text-[#858991] sm:text-[12px]">
            Twelve lifts covering every major muscle group.
          </p>
        </div>

        {/* SORT DROPDOWN */}
        <div className="relative w-full sm:w-[180px]">
          <label
            htmlFor="workout-sort"
            className="mb-2 block text-[8px] font-bold uppercase tracking-[0.16em] text-[#858991]"
          >
            Sort by
          </label>

          <div className="relative">
            <select
              id="workout-sort"
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value)
              }
              className="h-10 w-full appearance-none rounded-md border border-[#292c31] bg-[#17191d] px-3 pr-9 text-[10px] font-semibold text-[#f5f5f0] outline-none transition hover:border-[#44484f] focus:border-[#b8f500]"
            >
              {SORT_OPTIONS.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="bg-[#17191d] text-[#f5f5f0]"
                >
                  {option.label}
                </option>
              ))}
            </select>

            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#858991]"
            />
          </div>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-[#292c31] bg-[#17191d]"
            >
              <div className="h-[220px] animate-pulse bg-[#1d2025]" />

              <div className="space-y-3 p-5">
                <div className="h-3 w-20 animate-pulse rounded bg-[#292c31]" />
                <div className="h-5 w-3/4 animate-pulse rounded bg-[#292c31]" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-[#292c31]" />

                <div className="flex gap-4 pt-2">
                  <div className="h-3 w-14 animate-pulse rounded bg-[#292c31]" />
                  <div className="h-3 w-14 animate-pulse rounded bg-[#292c31]" />
                  <div className="h-3 w-10 animate-pulse rounded bg-[#292c31]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="rounded-xl border border-[#292c31] bg-[#17191d] px-5 py-12 text-center">
          <p className="text-sm font-bold uppercase text-[#f5f5f0]">
            Something went wrong
          </p>

          <p className="mt-2 text-xs text-[#858991]">
            {error}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 rounded-md bg-[#b8f500] px-5 py-3 text-[9px] font-black uppercase text-black"
          >
            Try Again
          </button>
        </div>
      )}

      {/* WORKOUT GRID */}
      {!loading &&
        !error &&
        sortedWorkouts.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortedWorkouts.map((workout) => {
              const categories = Array.isArray(
                workout.muscleGroups
              )
                ? workout.muscleGroups
                : workout.category
                  ? [workout.category]
                  : [];

              return (
                <Link
                  key={workout.id}
                  href={`/workout/${workout.id}`}
                  className="group overflow-hidden rounded-xl border border-[#292c31] bg-[#17191d] transition duration-200 hover:-translate-y-0.5 hover:border-[#44484f]"
                >
                  {/* IMAGE */}
                  <div className="relative h-[220px] overflow-hidden bg-[#1d2025]">
                    <img
                      src={workout.image}
                      alt={workout.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />

                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#17191d] to-transparent" />

                    {/* CATEGORY */}
                    {categories.length > 0 && (
                      <div className="absolute left-4 top-4 flex max-w-[80%] flex-wrap gap-1.5">
                        {categories.slice(0, 2).map((category) => (
                          <span
                            key={category}
                            className="rounded-full border border-[#b8f500]/30 bg-[#101113]/80 px-2.5 py-1 text-[8px] font-bold uppercase tracking-wide text-[#b8f500] backdrop-blur-sm"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="p-5">
                    <h3 className="text-[17px] font-black uppercase leading-tight text-[#f5f5f0]">
                      {workout.name}
                    </h3>

                    <p className="mt-2 text-[10px] text-[#858991]">
                      Equipment:{" "}
                      <span className="text-[#c8c9c5]">
                        {workout.equipment || "N/A"}
                      </span>
                    </p>

                    {/* STATS */}
                    <div className="mt-5 flex items-center gap-4 border-t border-[#292c31] pt-4">
                      <div className="flex items-center gap-1.5 text-[9px] text-[#858991]">
                        <Clock3 size={12} />
                        <span>
                          {workout.duration} min
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[9px] text-[#858991]">
                        <Flame size={12} />
                        <span>
                          {workout.caloriesBurned} kcal
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[9px] text-[#b8f500]">
                        <Star
                          size={12}
                          fill="currentColor"
                        />
                        <span>
                          {workout.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

      {/* EMPTY */}
      {!loading &&
        !error &&
        sortedWorkouts.length === 0 && (
          <div className="rounded-xl border border-[#292c31] bg-[#17191d] px-5 py-14 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#b8f500]">
              Nothing Found
            </p>

            <p className="mt-3 text-sm text-[#858991]">
              No workouts are available right now.
            </p>
          </div>
        )}
    </section>
  );
}