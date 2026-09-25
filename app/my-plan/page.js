"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  Clock3,
  Flame,
  Star,
  X,
} from "lucide-react";

const PLAN_KEY = "fitlog-plan";
const SAVED_KEY = "fitlog-saved";

function readStorage(key) {
  try {
    const stored = localStorage.getItem(key);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStorage(key, items) {
  localStorage.setItem(key, JSON.stringify(items));

  window.dispatchEvent(
    new CustomEvent("fitlog-storage-update")
  );
}

export default function MyPlanPage() {
  const [activeTab, setActiveTab] = useState("plan");

  const [plan, setPlan] = useState([]);
  const [saved, setSaved] = useState([]);

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const loadData = () => {
      setPlan(readStorage(PLAN_KEY));
      setSaved(readStorage(SAVED_KEY));
      setLoading(false);
    };

    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener(
      "fitlog-storage-update",
      handleUpdate
    );

    window.addEventListener(
      "storage",
      handleUpdate
    );

    return () => {
      window.removeEventListener(
        "fitlog-storage-update",
        handleUpdate
      );

      window.removeEventListener(
        "storage",
        handleUpdate
      );
    };
  }, []);

  function showToast(message) {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2500);
  }

  function handleRemovePlan(id) {
    const updatedPlan = plan.filter(
      (item) => String(item.id) !== String(id)
    );

    setPlan(updatedPlan);
    writeStorage(PLAN_KEY, updatedPlan);

    showToast("Removed from today's plan.");
  }

  function handleRemoveSaved(id) {
    const updatedSaved = saved.filter(
      (item) => String(item.id) !== String(id)
    );

    setSaved(updatedSaved);
    writeStorage(SAVED_KEY, updatedSaved);

    showToast("Removed from saved.");
  }

  function handleDone(id) {
    const updatedPlan = plan.map((item) =>
      String(item.id) === String(id)
        ? {
            ...item,
            completed: true,
          }
        : item
    );

    setPlan(updatedPlan);
    writeStorage(PLAN_KEY, updatedPlan);

    showToast("Workout marked as done.");
  }

  const metrics = useMemo(() => {
    return plan.reduce(
      (total, workout) => {
        total.exercises += 1;
        total.minutes += Number(workout.duration) || 0;
        total.calories += Number(workout.caloriesBurned) || 0;

        return total;
      },
      {
        exercises: 0,
        minutes: 0,
        calories: 0,
      }
    );
  }, [plan]);

  const currentItems =
    activeTab === "plan" ? plan : saved;

  return (
    <main className="min-h-screen bg-[#101113] text-[#f5f5f0]">

      {/* Page Header */}
      <section className="mx-auto max-w-[1400px] px-5 pb-6 pt-10 lg:px-8">

        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#b8f500]">
          Your Training
        </p>

        <h1 className="mt-3 text-[36px] font-black uppercase leading-none tracking-[-0.03em] sm:text-[44px]">
          My Plan
        </h1>

        <p className="mt-3 max-w-[500px] text-[11px] leading-5 text-[#858991]">
          Cap off five lifts for today. Finish them,
          then load more.
        </p>

      </section>

      {/* Metrics */}
      <section className="mx-auto max-w-[1400px] px-5 lg:px-8">

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

          <MetricCard
            label="Exercises"
            value={metrics.exercises}
          />

          <MetricCard
            label="Minutes"
            value={metrics.minutes}
          />

          <MetricCard
            label="Calories"
            value={metrics.calories}
          />

        </div>

      </section>

      {/* Tabs */}
      <section className="mx-auto max-w-[1400px] px-5 pt-6 lg:px-8">

        <div className="flex items-center justify-between border-b border-[#292c31]">

          <div className="flex items-center gap-1">

            <button
              type="button"
              onClick={() => setActiveTab("plan")}
              className={`rounded-t-md px-4 py-3 text-[9px] font-black uppercase tracking-wide transition ${
                activeTab === "plan"
                  ? "bg-[#b8f500] text-black"
                  : "text-[#858991] hover:text-[#f5f5f0]"
              }`}
            >
              Today's Plan
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("saved")}
              className={`rounded-t-md px-4 py-3 text-[9px] font-black uppercase tracking-wide transition ${
                activeTab === "saved"
                  ? "bg-[#b8f500] text-black"
                  : "text-[#858991] hover:text-[#f5f5f0]"
              }`}
            >
              Saved
            </button>

          </div>

          <span className="hidden text-[9px] text-[#858991] sm:block">
            {activeTab === "plan"
              ? `${plan.length} ${plan.length === 1 ? "lift" : "lifts"}`
              : `${saved.length} ${saved.length === 1 ? "saved" : "saved"}`}
          </span>

        </div>

      </section>

      {/* Content */}
      <section className="mx-auto max-w-[1400px] px-5 pb-16 pt-5 lg:px-8">

        {loading ? (
          <LoadingState />
        ) : currentItems.length === 0 ? (
          <EmptyState activeTab={activeTab} />
        ) : (
          <div className="space-y-3">

            {currentItems.map((workout) => (
              <WorkoutRow
                key={workout.id}
                workout={workout}
                activeTab={activeTab}
                onDone={handleDone}
                onRemovePlan={handleRemovePlan}
                onRemoveSaved={handleRemoveSaved}
              />
            ))}

          </div>
        )}

      </section>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-md border border-[#b8f500] bg-[#17191d] px-5 py-3 shadow-2xl">
          <p className="text-[10px] font-bold text-[#f5f5f0]">
            {toast}
          </p>
        </div>
      )}

    </main>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="rounded-lg border border-[#292c31] bg-[#17191d] p-5">

      <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#858991]">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-[#f5f5f0]">
        {value}
      </p>

    </div>
  );
}

function WorkoutRow({
  workout,
  activeTab,
  onDone,
  onRemovePlan,
  onRemoveSaved,
}) {
  const isCompleted =
    activeTab === "plan" && workout.completed;

  return (
    <article
      className={`group flex flex-col gap-4 rounded-lg border bg-[#17191d] p-3 transition sm:flex-row sm:items-center ${
        isCompleted
          ? "border-[#b8f500]/40"
          : "border-[#292c31] hover:border-[#44484f]"
      }`}
    >

      {/* Image */}
      <div className="h-24 w-full shrink-0 overflow-hidden rounded-md bg-[#1d2025] sm:h-20 sm:w-32">
        <img
          src={workout.image}
          alt={workout.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Main Info */}
      <div className="min-w-0 flex-1">

        <div className="flex flex-wrap items-center gap-2">

          <h2
            className={`text-[14px] font-black uppercase ${
              isCompleted
                ? "text-[#b8f500]"
                : "text-[#f5f5f0]"
            }`}
          >
            {workout.name}
          </h2>

          {isCompleted && (
            <span className="rounded-full bg-[#b8f500] px-2 py-1 text-[7px] font-black uppercase text-black">
              Done
            </span>
          )}

        </div>

        <p className="mt-1 text-[10px] text-[#858991]">
          Equipment:{" "}
          <span className="text-[#b7b9bd]">
            {workout.equipment}
          </span>
        </p>

        {/* Stats */}
        <div className="mt-3 flex flex-wrap items-center gap-4">

          <Stat
            icon={<Clock3 size={12} />}
            value={`${workout.duration} min`}
          />

          <Stat
            icon={<Flame size={12} />}
            value={`${workout.caloriesBurned} kcal`}
          />

          <Stat
            icon={<Star size={12} />}
            value={workout.rating}
            highlight
          />

        </div>

      </div>

      {/* Actions */}
      <div className="flex shrink-0 flex-wrap items-center gap-2">

        <Link
          href={`/workout/${workout.id}`}
          className="rounded-md border border-[#41454c] px-3 py-2 text-[8px] font-black uppercase tracking-wide text-[#f5f5f0] transition hover:border-[#b8f500] hover:text-[#b8f500]"
        >
          View Details
        </Link>

        {activeTab === "plan" ? (
          <>
            {!isCompleted && (
              <button
                type="button"
                onClick={() => onDone(workout.id)}
                className="inline-flex items-center gap-1.5 rounded-md bg-[#b8f500] px-3 py-2 text-[8px] font-black uppercase tracking-wide text-black transition hover:bg-[#c8ff27]"
              >
                <Check size={12} />
                Mark as Done
              </button>
            )}

            <button
              type="button"
              onClick={() => onRemovePlan(workout.id)}
              aria-label={`Remove ${workout.name}`}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-[#41454c] text-[#858991] transition hover:border-red-500 hover:text-red-400"
            >
              <X size={13} />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => onRemoveSaved(workout.id)}
            aria-label={`Remove ${workout.name} from saved`}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#41454c] text-[#858991] transition hover:border-red-500 hover:text-red-400"
          >
            <X size={13} />
          </button>
        )}

      </div>

    </article>
  );
}

function Stat({ icon, value, highlight = false }) {
  return (
    <div
      className={`flex items-center gap-1.5 text-[9px] font-semibold ${
        highlight
          ? "text-[#b8f500]"
          : "text-[#858991]"
      }`}
    >
      {icon}
      <span>{value}</span>
    </div>
  );
}

function EmptyState({ activeTab }) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-[#292c31] bg-[#17191d] px-5 text-center">

      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b8f500]">
        Nothing Here Yet
      </p>

      <p className="mt-3 max-w-[350px] text-[11px] leading-5 text-[#858991]">
        {activeTab === "plan"
          ? "Browse the library and add a lift to get today moving."
          : "Save a workout from the library and it will appear here for later."}
      </p>

      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#b8f500] px-4 py-2.5 text-[9px] font-black uppercase tracking-wide text-black transition hover:bg-[#c8ff27]"
      >
        Go to Workouts
        <ArrowRight size={12} />
      </Link>

    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-[#292c31] bg-[#17191d]">

      <div className="flex flex-col items-center">

        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#292c31] border-t-[#b8f500]" />

        <p className="mt-4 text-[9px] font-bold uppercase tracking-wide text-[#858991]">
          Loading your plan...
        </p>

      </div>

    </div>
  );
}