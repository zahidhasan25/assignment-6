"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Clock3,
  Flame,
  Star,
  ArrowRight,
} from "lucide-react";

const API_URL = "/api/fitlog";

export default function Library() {
  const [workouts, setWorkouts] = useState([]);
  const [sortBy, setSortBy] = useState("duration");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchWorkouts() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch workouts");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid workout data");
      }

      setWorkouts(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load workouts. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const sortedWorkouts = [...workouts].sort((a, b) => {
    if (sortBy === "duration") {
      return a.duration - b.duration;
    }

    if (sortBy === "calories") {
      return b.caloriesBurned - a.caloriesBurned;
    }

    if (sortBy === "rating") {
      return b.rating - a.rating;
    }

    return 0;
  });

  return (
    <section
      id="library"
      className="mx-auto max-w-[1400px] px-5 pb-20 pt-16 lg:px-8"
    >
      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-[#b8f500]">
            Workout Library
          </p>

          <h2 className="text-[28px] font-black uppercase tracking-[-0.02em] text-[#f5f5f0] sm:text-[32px]">
            The Library
          </h2>

          <p className="mt-2 text-[11px] leading-5 text-[#858991] sm:text-[12px]">
            Twelve lifts covering every major muscle group.
          </p>
        </div>

        {/* Sort */}
        <div className="relative w-full sm:w-[170px]">
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="w-full appearance-none rounded-md border border-[#292c31] bg-[#17191d] px-4 py-3 pr-10 text-[10px] font-semibold uppercase tracking-wide text-[#f5f5f0] outline-none transition focus:border-[#b8f500]"
            aria-label="Sort workouts"
          >
            <option value="duration">Duration</option>
            <option value="calories">Calories</option>
            <option value="rating">Rating</option>
          </select>

          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#858991]"
          />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="animate-pulse overflow-hidden rounded-xl border border-[#292c31] bg-[#17191d]"
            >
              <div className="h-[230px] bg-[#1d2025]" />

              <div className="space-y-4 p-5">
                <div className="h-3 w-24 rounded bg-[#292c31]" />
                <div className="h-5 w-40 rounded bg-[#292c31]" />
                <div className="h-3 w-28 rounded bg-[#292c31]" />
                <div className="h-3 w-full rounded bg-[#292c31]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-xl border border-red-900/50 bg-[#17191d] px-6 py-12 text-center">
          <p className="text-sm font-semibold text-red-400">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchWorkouts}
            className="mt-5 rounded-md bg-[#b8f500] px-5 py-2.5 text-[10px] font-black uppercase text-black"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Workout Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sortedWorkouts.map((workout) => (
            <Link
              href={`/workout/${workout.id}`}
              key={workout.id}
              className="group overflow-hidden rounded-xl border border-[#292c31] bg-[#17191d] transition duration-300 hover:-translate-y-1 hover:border-[#41454c]"
            >
              {/* Image */}
              <div className="relative h-[230px] overflow-hidden bg-[#1d2025]">
                <img
                  src={workout.image}
                  alt={workout.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                {/* Difficulty */}
                <div className="absolute left-4 top-4">
                  <span className="rounded-full border border-[#ffffff1a] bg-[#101113dd] px-3 py-1.5 text-[8px] font-bold uppercase tracking-wide text-[#b8f500] backdrop-blur-sm">
                    {workout.difficulty}
                  </span>
                </div>

                {/* Arrow */}
                <div className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#b8f500] text-black opacity-0 transition duration-300 group-hover:opacity-100">
                  <ArrowRight size={14} />
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Muscle Groups */}
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {workout.muscleGroups.map((muscle) => (
                    <span
                      key={muscle}
                      className="rounded-full border border-[#292c31] bg-[#101113] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-wide text-[#858991]"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>

                {/* Name */}
                <h3 className="text-[18px] font-black uppercase tracking-[-0.01em] text-[#f5f5f0] transition group-hover:text-[#b8f500]">
                  {workout.name}
                </h3>

                {/* Equipment */}
                <p className="mt-2 text-[10px] font-medium text-[#858991]">
                  Equipment:{" "}
                  <span className="text-[#b7b9bd]">
                    {workout.equipment}
                  </span>
                </p>

                {/* Stats */}
                <div className="mt-5 flex items-center gap-4 border-t border-[#292c31] pt-4">
                  <div className="flex items-center gap-1.5">
                    <Clock3 size={13} className="text-[#858991]" />

                    <span className="text-[9px] font-semibold text-[#b7b9bd]">
                      {workout.duration} min
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Flame size={13} className="text-[#858991]" />

                    <span className="text-[9px] font-semibold text-[#b7b9bd]">
                      {workout.caloriesBurned} kcal
                    </span>
                  </div>

                  <div className="ml-auto flex items-center gap-1.5">
                    <Star
                      size={13}
                      className="fill-[#b8f500] text-[#b8f500]"
                    />

                    <span className="text-[9px] font-bold text-[#f5f5f0]">
                      {workout.rating}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}