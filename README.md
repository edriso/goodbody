# Good Body

A calm, evidence-based web app that helps desk workers take care of their back
and body in small, easy daily steps. It tracks how long you have been sitting
and nudges you to move, guides you through short follow-along routines, gives
you a progressive 6-week back program, and audits your desk setup.

This is the **frontend-only** build: it runs entirely in your browser with no
server and no account. Everything you do is saved locally on your device.

The health content is distilled from trusted sources: NHS / NICE guideline
NG59, Mayo Clinic office-ergonomics guidance, AAOS, and Cleveland Clinic. It is
general guidance, not medical advice.

## The four screens

- **Today** — a sitting timer that nudges you to move, your daily streak with a
  week dot-row, a short suggested plan, a rotating health fact, and a safety note.
- **Move** — a library of guided routines. Tapping one opens a full-screen player
  that steps through each move with a countdown ring, play/pause, skip, and restart.
- **Program** — a 6-week "Back Foundations" plan. Check off sessions and launch
  them straight into the player.
- **Setup** — an ergonomics checklist with a computed setup score, your
  move-reminder interval, an opt-in "remind me to move" notification, and the
  full safety note.

### About the sitting timer

The timer is intentionally automatic — there is no "start" button, so sitting
time accrues on its own (the evidence says to move roughly every 30 minutes).
To stay honest it resets when you have clearly stepped away: if the tab is
hidden or the machine sleeps for a while, that counts as a break. When you go
over your interval the browser tab updates to say "time to move," and if you
opt in on Setup, a gentle notification fires once. (Notifications only work
while the app's tab is open in the background — a static site cannot wake you
after the tab is closed.)

## Tech stack

- React 19 + TypeScript, built with Vite
- Tailwind CSS v4 (configured in CSS, no `tailwind.config.js`)
- TanStack Query as a small reactive cache over `localStorage`
- React Router for pages, Zustand for the player state
- No backend: routines, the program, ergonomics questions, and health facts are
  bundled as static data in `src/data/content.ts`

## Your data

Nothing leaves your browser. Everything is stored in `localStorage`:

| Key                | What it holds                                   |
| ------------------ | ----------------------------------------------- |
| `gb:settings`      | reminder interval, theme, accent, `lastMovedAt`, reminders on/off |
| `gb:movement-logs` | completion timestamps (used to compute streaks) |
| `gb:program`       | the program sessions you have checked off       |
| `gb:ergonomics`    | the checklist items you have ticked             |

It works offline, and clearing your browser data resets the app.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build

```bash
npm run build    # type-checks, then builds to dist/
npm run preview  # serve the production build locally
```

Deploys as a static SPA (see `netlify.toml`).

## Health disclaimer

Good Body gives general, evidence-based guidance. It is not medical advice.
Move within comfort. Mild discomfort during a stretch is normal, but stop if you
feel sharp or shooting pain, and see a GP or physiotherapist if pain lasts more
than a few weeks.

## License

MIT.
