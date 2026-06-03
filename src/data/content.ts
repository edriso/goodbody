/*
 * Good Bodies content, bundled into the frontend.
 *
 * In the full-stack app this lived in the database (routines + program, loaded
 * by the Prisma seed) and in the API code (ergonomics checklist, health facts).
 * Here it is static data served straight from the bundle.
 *
 * Evidence-based desk-health content distilled from trusted sources: NHS / NICE
 * guideline NG59, Mayo Clinic office-ergonomics guidance, AAOS, and Cleveland
 * Clinic. General guidance, not medical advice.
 */
import type {
  AppContent,
  ErgonomicsItem,
  Program,
  Routine,
  StepKind,
} from '@good-bodies/types';

// ---- Raw seed shapes (pre-ID) ---------------------------------------------

interface SeedStep {
  name: string;
  kind: StepKind;
  durationSeconds: number;
  cue: string;
  target: string;
}

interface SeedRoutine {
  slug: string;
  title: string;
  tag: string;
  estimatedMinutes: number;
  blurb: string;
  why: string;
  steps: SeedStep[];
}

interface SeedSession {
  dayLabel: string;
  routineSlug: string;
  note: string;
}

interface SeedWeek {
  weekNumber: number;
  theme: string;
  focus: string;
  sessions: SeedSession[];
}

interface SeedProgram {
  slug: string;
  title: string;
  blurb: string;
  weeks: SeedWeek[];
}

// ---- Guided routines (follow-along player) --------------------------------
const seedRoutines: SeedRoutine[] = [
  {
    slug: 'desk-reset',
    title: 'Desk Reset',
    tag: 'Seated',
    estimatedMinutes: 3,
    blurb: 'A seated flow to undo a long sitting block. No standing up required.',
    why: 'Sitting still for a long time puts stress on your spine and stiffens your muscles. A few easy moves get you going again without leaving your chair.',
    steps: [
      {
        name: 'Settle & breathe',
        kind: 'move',
        durationSeconds: 20,
        cue: 'Sit tall, feet flat, weight even on both hips. Three slow breaths. Let the shoulders drop on each exhale.',
        target: 'Reset',
      },
      {
        name: 'Seated pelvic tilts',
        kind: 'move',
        durationSeconds: 30,
        cue: 'Gently rock your pelvis: round the low back, then arch it. Small, slow, pain-free. Wakes up the deep core.',
        target: 'Lower back',
      },
      {
        name: 'Seated twist, right',
        kind: 'move',
        durationSeconds: 25,
        cue: 'Hand on the opposite knee, lengthen up, rotate to the right. Keep both hips planted. Breathe into it.',
        target: 'Spine',
      },
      {
        name: 'Seated twist, left',
        kind: 'move',
        durationSeconds: 25,
        cue: 'Switch sides. Rotate left, eyes following over the shoulder. No forcing, go to a comfortable end range.',
        target: 'Spine',
      },
      {
        name: 'Overhead side bend, right',
        kind: 'move',
        durationSeconds: 20,
        cue: 'Reach the left arm up and over to the right. Feel the stretch down the side of the torso.',
        target: 'Lats / side',
      },
      {
        name: 'Overhead side bend, left',
        kind: 'move',
        durationSeconds: 20,
        cue: 'Other side. Keep both sit-bones down so the stretch stays in the side body.',
        target: 'Lats / side',
      },
      {
        name: 'Chest opener',
        kind: 'move',
        durationSeconds: 25,
        cue: 'Clasp hands behind you (or hold the chair edges), draw the shoulder blades together, lift the chest. Counters the hunch.',
        target: 'Chest / shoulders',
      },
      {
        name: 'Neck release',
        kind: 'move',
        durationSeconds: 30,
        cue: 'Ear toward shoulder, hold; gentle look down and across. Slow. Never crank the neck.',
        target: 'Neck',
      },
      {
        name: 'Wrist & forearm',
        kind: 'move',
        durationSeconds: 25,
        cue: 'Arm out, palm up, gently pull fingers back; then palm down and repeat. Eases keyboard strain.',
        target: 'Wrists',
      },
    ],
  },
  {
    slug: 'stand-stretch',
    title: 'Stand & Stretch',
    tag: 'Standing',
    estimatedMinutes: 2,
    blurb: 'Get out of the chair. Open the front of the body that sitting keeps closed.',
    why: 'Standing tall and opening your hips undoes the hunched shape that sitting creates. The AAOS suggests a break like this once an hour.',
    steps: [
      {
        name: 'Stand & roll shoulders',
        kind: 'move',
        durationSeconds: 20,
        cue: 'Stand up. Roll the shoulders back 5 times, then forward 5. Shake the arms out.',
        target: 'Shoulders',
      },
      {
        name: 'Standing back extension',
        kind: 'move',
        durationSeconds: 25,
        cue: 'Hands on your lower back, gently arch backward and look slightly up. Small range. This is the AAOS once-an-hour reset.',
        target: 'Lower back',
      },
      {
        name: 'Forward fold',
        kind: 'move',
        durationSeconds: 25,
        cue: 'Soft knees, hinge at the hips and let the head and arms hang. Decompress the spine. Roll up slowly.',
        target: 'Back / hamstrings',
      },
      {
        name: 'Hip flexor, right',
        kind: 'move',
        durationSeconds: 30,
        cue: 'Step the right foot back into a gentle lunge, tuck the tailbone. Opens the hip that sitting shortens.',
        target: 'Hip flexors',
      },
      {
        name: 'Hip flexor, left',
        kind: 'move',
        durationSeconds: 30,
        cue: 'Switch legs. Keep it light, a stretch, not a strain.',
        target: 'Hip flexors',
      },
      {
        name: 'Reach & breathe',
        kind: 'move',
        durationSeconds: 20,
        cue: 'Reach both arms overhead, big inhale, lengthen the whole spine. Exhale, relax. You are done.',
        target: 'Whole body',
      },
    ],
  },
  {
    slug: 'eye-break',
    title: '20-20-20 Eye Break',
    tag: 'Micro',
    estimatedMinutes: 1,
    blurb: 'Rest your eyes and neck. The cheapest health win you can take.',
    why: "Mayo Clinic's 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds to ease eye strain, paired here with a neck reset.",
    steps: [
      {
        name: 'Look far away',
        kind: 'move',
        durationSeconds: 20,
        cue: 'Find something at least 20 feet (6 m) away, a window is ideal. Soften your focus on it.',
        target: 'Eyes',
      },
      {
        name: 'Palm & blink',
        kind: 'move',
        durationSeconds: 15,
        cue: 'Cup your palms over closed eyes for a moment of dark. Then blink fully 10 times to re-wet the eyes.',
        target: 'Eyes',
      },
      {
        name: 'Chin tucks',
        kind: 'move',
        durationSeconds: 25,
        cue: 'Draw the chin straight back (make a double chin), hold a beat, release. 5 reps. Counters forward-head posture.',
        target: 'Neck',
      },
    ],
  },
  {
    slug: 'core-foundations',
    title: 'Core Foundations',
    tag: 'Floor · Strength',
    estimatedMinutes: 8,
    blurb: 'The strength base that supports your spine. Gentle, controlled, on the floor.',
    why: 'A strong core supports your spine and helps stop back pain from coming back. These are the basic moves used in NHS physiotherapy programs.',
    steps: [
      {
        name: 'Get set',
        kind: 'note',
        durationSeconds: 15,
        cue: 'Lie on your back, knees bent, feet flat and hip-width apart. Breathe normally throughout, never hold your breath.',
        target: 'Setup',
      },
      {
        name: 'Pelvic tilts',
        kind: 'move',
        durationSeconds: 40,
        cue: 'Flatten the low back gently into the floor by tilting the pelvis, hold 5s, release. About 10 slow reps. Foundational core activation.',
        target: 'Deep core',
      },
      {
        name: 'Rest',
        kind: 'rest',
        durationSeconds: 15,
        cue: 'Relax. Let the breath settle before the next move.',
        target: '',
      },
      {
        name: 'Glute bridges',
        kind: 'move',
        durationSeconds: 40,
        cue: 'Press through the heels, lift the hips to a straight line, squeeze the glutes at the top, lower slowly. About 10 reps.',
        target: 'Glutes / back',
      },
      {
        name: 'Rest',
        kind: 'rest',
        durationSeconds: 15,
        cue: 'Relax the hips back down. Breathe.',
        target: '',
      },
      {
        name: 'Bird-dog',
        kind: 'move',
        durationSeconds: 45,
        cue: 'On hands and knees: extend opposite arm and leg, keep the hips level and core braced, return. Alternate sides slowly.',
        target: 'Core / balance',
      },
      {
        name: 'Rest',
        kind: 'rest',
        durationSeconds: 15,
        cue: 'Sit back toward the heels for a moment.',
        target: '',
      },
      {
        name: 'Dead bug',
        kind: 'move',
        durationSeconds: 40,
        cue: 'On your back, arms up, knees at 90 degrees. Lower opposite arm and leg slowly, keep the low back quiet. Alternate.',
        target: 'Deep core',
      },
      {
        name: 'Rest',
        kind: 'rest',
        durationSeconds: 15,
        cue: 'Hug the knees gently to the chest.',
        target: '',
      },
      {
        name: 'Modified plank',
        kind: 'move',
        durationSeconds: 30,
        cue: 'Forearms and knees (or toes). Straight line head to hips, brace the core. Hold steady. Quality over time.',
        target: 'Core',
      },
      {
        name: "Child's pose",
        kind: 'move',
        durationSeconds: 30,
        cue: 'Sit hips back to heels, arms long, forehead down. Let the back lengthen and the breath slow. Finish.',
        target: 'Back release',
      },
    ],
  },
];

// ---- 6-week strength program ----------------------------------------------
const seedProgram: SeedProgram = {
  slug: 'back-foundations',
  title: 'Back Foundations',
  blurb:
    'A progressive 6-week build. Three short sessions a week, the dose NHS guidance pairs with daily movement to cut recurrence.',
  weeks: [
    {
      weekNumber: 1,
      theme: 'Wake it up',
      focus:
        'Learn the basic moves. Keep them slow and pain-free. You are teaching your body the movements, not trying to feel the burn.',
      sessions: [
        { dayLabel: 'Mon', routineSlug: 'core-foundations', note: 'Foundations, half the reps if new' },
        { dayLabel: 'Wed', routineSlug: 'stand-stretch', note: 'Mobility day' },
        { dayLabel: 'Fri', routineSlug: 'core-foundations', note: 'Foundations, full set' },
      ],
    },
    {
      weekNumber: 2,
      theme: 'Build the base',
      focus: 'Same moves, a touch more control. Add one round of pelvic tilts and bridges.',
      sessions: [
        { dayLabel: 'Mon', routineSlug: 'core-foundations', note: 'Add 5 reps to bridges' },
        { dayLabel: 'Wed', routineSlug: 'core-foundations', note: 'Hold bird-dog 2s longer' },
        { dayLabel: 'Fri', routineSlug: 'stand-stretch', note: 'Mobility plus a 10-min walk' },
      ],
    },
    {
      weekNumber: 3,
      theme: 'Steady strength',
      focus:
        'You should feel steadier. Plank holds get a few seconds longer; keep everything controlled.',
      sessions: [
        { dayLabel: 'Mon', routineSlug: 'core-foundations', note: 'Plank plus 10s' },
        { dayLabel: 'Wed', routineSlug: 'core-foundations', note: 'Full set, focus on form' },
        { dayLabel: 'Fri', routineSlug: 'core-foundations', note: 'Full set' },
      ],
    },
    {
      weekNumber: 4,
      theme: 'Add load',
      focus: 'Confidence is building. Add a second plank hold and a slow tempo to the bridges.',
      sessions: [
        { dayLabel: 'Mon', routineSlug: 'core-foundations', note: '2x plank' },
        { dayLabel: 'Wed', routineSlug: 'stand-stretch', note: 'Mobility plus walk' },
        { dayLabel: 'Fri', routineSlug: 'core-foundations', note: 'Slow-tempo bridges' },
      ],
    },
    {
      weekNumber: 5,
      theme: 'Own it',
      focus:
        'The routine should feel like yours now. Hold each move as far as feels strong but still comfortable.',
      sessions: [
        { dayLabel: 'Mon', routineSlug: 'core-foundations', note: 'Longer holds' },
        { dayLabel: 'Wed', routineSlug: 'core-foundations', note: 'Add dead-bug round' },
        { dayLabel: 'Fri', routineSlug: 'core-foundations', note: 'Full set' },
      ],
    },
    {
      weekNumber: 6,
      theme: 'Make it a habit',
      focus:
        'Lock it in. The goal from here is consistency, not intensity, a strong back is a maintained back.',
      sessions: [
        { dayLabel: 'Mon', routineSlug: 'core-foundations', note: 'Full set' },
        { dayLabel: 'Wed', routineSlug: 'stand-stretch', note: 'Mobility plus walk' },
        { dayLabel: 'Fri', routineSlug: 'core-foundations', note: 'Celebrate, you built this' },
      ],
    },
  ],
};

// ---- Build the ready-to-serve objects with deterministic IDs --------------

/** Every guided routine, with stable IDs (id = slug; step id = `${slug}-${i}`). */
export const routines: Routine[] = seedRoutines.map((routine) => ({
  id: routine.slug,
  slug: routine.slug,
  title: routine.title,
  tag: routine.tag,
  estimatedMinutes: routine.estimatedMinutes,
  blurb: routine.blurb,
  why: routine.why,
  steps: routine.steps.map((step, index) => ({
    id: `${routine.slug}-${index}`,
    order: index,
    name: step.name,
    kind: step.kind,
    durationSeconds: step.durationSeconds,
    cue: step.cue,
    target: step.target,
  })),
}));

const routineBySlug = new Map(routines.map((routine) => [routine.slug, routine]));

/** The full program, sessions joined to their routine and given stable IDs. */
export const programs: Program[] = [
  {
    id: seedProgram.slug,
    slug: seedProgram.slug,
    title: seedProgram.title,
    blurb: seedProgram.blurb,
    weeks: seedProgram.weeks.map((week) => ({
      id: `${seedProgram.slug}-w${week.weekNumber}`,
      weekNumber: week.weekNumber,
      theme: week.theme,
      focus: week.focus,
      sessions: week.sessions.map((session, index) => {
        const routine = routineBySlug.get(session.routineSlug);
        return {
          id: `${seedProgram.slug}-w${week.weekNumber}-s${index}`,
          dayLabel: session.dayLabel,
          routineId: routine?.id ?? session.routineSlug,
          routineSlug: session.routineSlug,
          routineTitle: routine?.title ?? session.routineSlug,
          note: session.note,
        };
      }),
    })),
  },
];

// ---- Ergonomics checklist catalogue ---------------------------------------
type CatalogueItem = Pick<ErgonomicsItem, 'key' | 'group' | 'text'>;

export const ergonomicsCatalogue: CatalogueItem[] = [
  // Chair
  { key: 'feet', group: 'Chair', text: 'Feet flat on the floor (or a footrest), thighs roughly parallel to the ground.' },
  { key: 'knees', group: 'Chair', text: 'Knees level with, or just below, your hips.' },
  { key: 'lumbar', group: 'Chair', text: 'Lower back supported. No support? Roll a towel into the curve of your back.' },
  { key: 'seatdepth', group: 'Chair', text: '2 to 3 finger gap between the seat edge and the back of your knees.' },
  // Screen
  { key: 'monitor-h', group: 'Screen', text: 'Top of the screen at or just below eye level.' },
  { key: 'monitor-d', group: 'Screen', text: "Screen about an arm's length away, directly in front of you." },
  { key: 'laptop', group: 'Screen', text: 'On a laptop? Raise it and use an external keyboard and mouse.' },
  // Arms & hands
  { key: 'forearms', group: 'Arms & hands', text: 'Forearms parallel to the floor, elbows close to your sides (about 90 degrees).' },
  { key: 'wrists', group: 'Arms & hands', text: 'Wrists straight and neutral while typing, not bent up or down.' },
  { key: 'mouse', group: 'Arms & hands', text: 'Mouse on the same surface as the keyboard, within easy reach.' },
  // Movement
  { key: 'break', group: 'Movement', text: 'A reminder set to stand and move every 30 to 45 minutes.' },
  { key: 'clear', group: 'Movement', text: 'Floor under the desk clear, so you can shift and stretch your legs.' },
  { key: 'vary', group: 'Movement', text: 'You change posture often. The best posture is your next one.' },
];

/** The group order, used to keep the checklist in a stable, sensible order. */
export const ergonomicsGroupOrder = ['Chair', 'Screen', 'Arms & hands', 'Movement'];

// ---- Static copy -----------------------------------------------------------
export const appContent: AppContent = {
  tagline: 'Small, easy steps to look after your body at your desk.',
  safety:
    'Move within comfort. A little discomfort during a stretch is normal, but stop if you feel sharp or shooting pain, and see a doctor or physiotherapist if pain lasts more than a few weeks. Staying gently active is better than resting in bed. This app gives general advice, not medical advice.',
  facts: [
    'Sitting more than 5 hours a day makes back pain more likely. Moving is the simple fix.',
    'The best posture is your next posture. Changing position often matters more than any single "perfect" pose.',
    'Up to 8 in 10 people get back pain at some point. It is common, rarely serious, and usually eases within weeks.',
    'Exercise can cut the chance of back pain coming back by nearly half.',
    'A 2-minute movement break can undo hours of building stiffness.',
  ],
};
