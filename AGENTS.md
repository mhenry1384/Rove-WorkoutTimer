# Workout Timer

A small static web app (plain HTML/CSS/JS, no build step) with timed workouts:
Plank Timer, Ab Workout and Kegel Timer (which asks: quick ~70 s or long 5 min).

- `index.html`: the screens (home, timer, coming soon)
- `app.js`: the stick-figure drawings, the workout definitions (`WORKOUTS`), the timer and the routing
- `styles.css`: styles, with light and dark themes
- `sounds/`: the wood-block tick and the bell

## Mobile first

This app is meant to be used on a phone. It's fine if it also works on desktop,
but phones come first.

- **Every screen should fit on a phone screen without scrolling.** That includes
  the home screen and the timer screen for every workout, mid-workout, with
  descriptions, captions and controls all showing. Aim for a small phone
  (about 375 x 600 visible in the browser) as well as larger ones.
- Size things with the viewport in mind (`dvh`/`vw` with `clamp()`), not just
  fixed pixels, and check new content (longer names, descriptions, extra
  elements) against that limit.
- Keep tap targets big. The user is usually on the floor, glancing at the
  phone from a distance, so the important things (the countdown, the
  exercise vs. rest state) must be readable at a glance.

## Testing

Add `?test` to the URL (for example `index.html?test#/abs`) to make every
segment, and Get Ready, last at most 5 seconds.
