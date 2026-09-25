"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Bookmark,
    Check,
    Plus,
} from "lucide-react";

const PLAN_KEY = "fitlog-plan";
const SAVED_KEY = "fitlog-saved";

function getStoredItems(key) {
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

function saveItems(key, items) {
    localStorage.setItem(key, JSON.stringify(items));

    window.dispatchEvent(
        new CustomEvent("fitlog-storage-update")
    );
}

export default function WorkoutDetails({ workout }) {
    const [isInPlan, setIsInPlan] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [toast, setToast] = useState("");

    useEffect(() => {
        const plan = getStoredItems(PLAN_KEY);
        const saved = getStoredItems(SAVED_KEY);

        const alreadyInPlan = plan.some(
            (item) => String(item.id) === String(workout.id)
        );

        const alreadySaved = saved.some(
            (item) => String(item.id) === String(workout.id)
        );

        setIsInPlan(alreadyInPlan);
        setIsSaved(alreadySaved);
    }, [workout.id]);

    function showToast(message) {
        setToast(message);

        setTimeout(() => {
            setToast("");
        }, 2500);
    }

    function handleAddToPlan() {
        const plan = getStoredItems(PLAN_KEY);

        const alreadyAdded = plan.some(
            (item) => String(item.id) === String(workout.id)
        );

        if (alreadyAdded) {
            setIsInPlan(true);
            showToast("Already in today's plan.");
            return;
        }

        if (plan.length >= 5) {
            showToast("Today's plan can contain only 5 lifts.");
            return;
        }

        const updatedPlan = [...plan, workout];

        saveItems(PLAN_KEY, updatedPlan);

        setIsInPlan(true);

        showToast("Added to today's plan.");
    }

    function handleSave() {
        const saved = getStoredItems(SAVED_KEY);

        const alreadySaved = saved.some(
            (item) => String(item.id) === String(workout.id)
        );

        if (alreadySaved) {
            setIsSaved(true);
            showToast("Already saved for later.");
            return;
        }

        const updatedSaved = [...saved, workout];

        saveItems(SAVED_KEY, updatedSaved);

        setIsSaved(true);

        showToast("Saved for later.");
    }

    return (
        <main className="min-h-screen bg-[#101113] text-[#f5f5f0]">
            {/* Back Button */}
            <div className="mx-auto max-w-\[1400px] px-5 pt-6 lg:px-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-[#858991] transition hover:text-[#b8f500]"
                >
                    <ArrowLeft size={14} />
                    Back to library
                </Link>
            </div>

            {/* Details Section */}
            <section className="mx-auto max-w-\[1400px] px-5 pb-20 pt-6 lg:px-8">
                <div className="grid overflow-hidden rounded-xl border border-[#292c31] bg-[#17191d] lg:grid-cols-[1.05fr_0.95fr]">

                    {/* Left Image */}
                    <div className="relative min-h-\[360px] overflow-hidden bg-[#1d2025] lg:min-h-\[650px]">
                        <img
                            src={workout.image}
                            alt={workout.name}
                            className="absolute inset-0 h-full w-full object-cover"
                        />

                        {/* Difficulty Badge */}
                        <div className="absolute left-5 top-5">
                            <span className="rounded-full bg-[#b8f500] px-3 py-1.5 text-[8px] font-black uppercase tracking-wide text-black">
                                {workout.difficulty}
                            </span>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="p-6 sm:p-8 lg:p-10">

                        {/* Eyebrow */}
                        <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[#b8f500]">
                            Workout Details
                        </p>

                        {/* Workout Name */}
                        <h1 className="max-w-\[650px] text-[34px] font-black uppercase leading-[0.95] tracking-[-0.03em] text-[#f5f5f0] sm:text-[42px]">
                            {workout.name}
                        </h1>

                        {/* Description */}
                        <p className="mt-5 text-[12px] leading-6 text-[#858991]">
                            {workout.description}
                        </p>

                        {/* Muscle Groups */}
                        <div className="mt-6 flex flex-wrap gap-2">
                            {workout.muscleGroups.map((muscle) => (
                                <span
                                    key={muscle}
                                    className="rounded-full border border-[#292c31] bg-[#101113] px-3 py-1.5 text-[8px] font-bold uppercase tracking-wide text-[#b7b9bd]"
                                >
                                    {muscle}
                                </span>
                            ))}
                        </div>

                        {/* Key Specifications */}
                        <div className="mt-8 overflow-hidden rounded-xl border border-[#292c31] bg-[#101113]">

                            <div className="grid grid-cols-2">

                                <Spec
                                    label="Equipment"
                                    value={workout.equipment}
                                />

                                <Spec
                                    label="Difficulty"
                                    value={workout.difficulty}
                                />

                                <Spec
                                    label="Sets"
                                    value={workout.sets}
                                />

                                <Spec
                                    label="Reps"
                                    value={workout.reps}
                                />

                                <Spec
                                    label="Duration"
                                    value={`${workout.duration} min`}
                                />

                                <Spec
                                    label="Calories"
                                    value={`${workout.caloriesBurned} kcal`}
                                />

                                <div className="border-t border-[#292c31] p-4">
                                    <p className="text-[8px] font-bold uppercase tracking-wide text-[#858991]">
                                        Rating
                                    </p>

                                    <p className="mt-1 text-[11px] font-bold text-[#f5f5f0]">
                                        {workout.rating}
                                    </p>
                                </div>

                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="mt-8">

                            <h2 className="text-[13px] font-black uppercase tracking-wide text-[#f5f5f0]">
                                Instructions
                            </h2>

                            <ol className="mt-5 space-y-4">
                                {workout.instructions.map((instruction, index) => (
                                    <li
                                        key={index}
                                        className="flex gap-4"
                                    >
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#b8f500] text-[9px] font-black text-black">
                                            {index + 1}
                                        </span>

                                        <p className="pt-1 text-[11px] leading-5 text-[#858991]">
                                            {instruction}
                                        </p>
                                    </li>
                                ))}
                            </ol>

                        </div>

                        {/* Action Buttons */}
                        <div className="mt-9 flex flex-col gap-3 sm:flex-row">

                            {/* Add To Plan */}
                            <button
                                type="button"
                                onClick={handleAddToPlan}
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-[#b8f500] px-5 py-3 text-[9px] font-black uppercase tracking-wide text-black transition hover:bg-[#c8ff27]"
                            >
                                {isInPlan ? (
                                    <Check size={14} />
                                ) : (
                                    <Plus size={14} />
                                )}

                                {isInPlan
                                    ? "Added to today's plan"
                                    : "Add to today's plan"}
                            </button>

                            {/* Save */}
                            <button
                                type="button"
                                onClick={handleSave}
                                className={`inline-flex flex-1 items-center justify-center gap-2 rounded-md border px-5 py-3 text-[9px] font-black uppercase tracking-wide transition ${isSaved
                                        ? "border-[#b8f500] text-[#b8f500]"
                                        : "border-[#41454c] text-[#f5f5f0] hover:border-[#b8f500] hover:text-[#b8f500]"
                                    }`}
                            >
                                {isSaved ? (
                                    <Check size={14} />
                                ) : (
                                    <Bookmark size={14} />
                                )}

                                {isSaved
                                    ? "Saved"
                                    : "Save for later"}
                            </button>

                        </div>

                    </div>
                </div>
            </section>

            {/* Toast Notification */}
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

function Spec({ label, value }) {
    return (
        <div className="border-b border-[#292c31] p-4">
            <p className="text-[8px] font-bold uppercase tracking-wide text-[#858991]">
                {label}
            </p>

            <p className="mt-1 text-[11px] font-bold text-[#f5f5f0]">
                {value}
            </p>
        </div>
    );
}