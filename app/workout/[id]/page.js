import { notFound } from "next/navigation";
import WorkoutDetails from "../../components/WorkoutDetails";

const API_URL = "https://api.abcz.workers.dev/api/fitlog";

async function getWorkout(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Workout details error:", error);
    return null;
  }
}

export default async function WorkoutPage({ params }) {
  const { id } = await params;

  const workout = await getWorkout(id);

  if (!workout) {
    notFound();
  }

  return <WorkoutDetails workout={workout} />;
}