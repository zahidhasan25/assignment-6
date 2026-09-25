# FitLog — Workout Library

FitLog is a dark, responsive workout library and planning web application built with Next.js and Tailwind CSS.

It allows users to browse workouts, view detailed exercise information, add workouts to today's plan, save workouts for later, mark planned workouts as completed, remove workouts, and sort the workout library by duration, calories, or rating.

## Live Project

Live Demo: Add your deployed Vercel link here

GitHub Repository: Add your GitHub repository link here

## Project Description

FitLog is designed as a simple and focused gym companion.

Users can explore a workout library, check workout details, create a daily workout plan, save exercises for later, and track basic workout metrics such as exercises, minutes, and calories.

The interface follows a dark gym-focused design with a lime accent color and responsive layouts for desktop, tablet, and mobile devices.

## Technologies Used

- Next.js
- React
- JavaScript
- Tailwind CSS
- Lucide React
- Next.js App Router
- REST API
- LocalStorage
- Git and GitHub

## Key Features

### 1. Workout Library

- Fetches workout data from the FitLog API
- Displays workouts in a responsive grid
- Shows workout image, category, equipment, duration, calories, and rating
- Clicking a workout opens its details page

### 2. Workout Details

- Large workout image
- Workout name and description
- Muscle group/category tags
- Equipment information
- Difficulty
- Sets and reps
- Duration
- Calories
- Rating
- Step-by-step workout instructions

### 3. My Plan

- Add workouts to today's plan
- Maximum of five planned lifts
- Live exercise count
- Total workout minutes
- Total calories
- View workout details
- Mark workouts as done
- Remove workouts from the plan

### 4. Saved Workouts

- Save workouts for later
- View saved workouts from the My Plan page
- Remove saved workouts
- Live Saved count in the navbar

### 5. Workout Sorting

The workout library can be sorted by:

- Duration
- Calories
- Rating

Duration is the default sorting option.

### 6. Responsive Design

FitLog is responsive across:

- Desktop
- Tablet
- Mobile

The layout automatically adapts the navigation, hero section, workout grid, metrics, and workout cards to different screen sizes.

### 7. Loading and Error States

- Loading skeleton while workout data is being fetched
- Error message when API data cannot be loaded
- Custom 404 page for invalid workout routes

### 8. Toast Notifications

Users receive feedback when they:

- Add a workout to today's plan
- Save a workout
- Mark a workout as done
- Remove a workout

## API

FitLog uses the following REST API:

### All Workouts

```text
https://api.abcz.workers.dev/api/fitlog