(() => {
  "use strict";

  // ------------------------------------------------------------------
  // Figure drawings (inline SVG, viewBox 0 0 300 160, ground at y=140)
  // ------------------------------------------------------------------
  const line = (cls, ...pts) =>
    `<polyline class="${cls}" points="${pts.map((p) => p.join(",")).join(" ")}"/>`;
  const head = (x, y) => `<circle class="head" cx="${x}" cy="${y}" r="11"/>`;
  const mirror = (svg) => `<g transform="translate(300,0) scale(-1,1)">${svg}</g>`;

  // Full (high) plank, side view, head to the right.
  // `raise` = "near" | "far" | undefined  (which leg is lifted)
  function fullPlank(raise) {
    const sh = [222, 86], hip = [145, 106];
    const legDown = [hip, [100, 117], [52, 128], [58, 139]];
    const legDownFar = [hip, [100, 116], [56, 127], [62, 139]];
    const legUp = [hip, [100, 99], [55, 92], [43, 95]];
    return [
      line("far", [219, 88], [215, 139]),
      line(raise === "far" ? "raised" : "far", ...(raise === "far" ? legUp : legDownFar)),
      line(raise === "near" ? "raised" : "limb", ...(raise === "near" ? legUp : legDown)),
      line("torso", sh, hip),
      line("limb", sh, [222, 139]),
      head(241, 79),
    ].join("");
  }

  // Forearm (elbow) plank, side view, head to the right.
  // `raise` = "near" | "far" | undefined  (which leg is lifted)
  function elbowPlank(raise) {
    const sh = [220, 110], hip = [145, 119];
    const legDown = [hip, [100, 124], [52, 129], [58, 139]];
    const legDownFar = [hip, [100, 123], [56, 128], [62, 139]];
    const legUp = [hip, [100, 111], [55, 104], [43, 107]];
    return [
      line("far", [216, 112], [213, 137], [243, 137]),
      line(raise === "far" ? "raised" : "far", ...(raise === "far" ? legUp : legDownFar)),
      line(raise === "near" ? "raised" : "limb", ...(raise === "near" ? legUp : legDown)),
      line("torso", sh, hip),
      line("limb", sh, [219, 137], [251, 137]),
      head(239, 104),
    ].join("");
  }

  // Side plank, facing the viewer, supported on the LEFT forearm (elbow bent,
  // forearm on the mat), top hand behind the head, head to the right.
  function sidePlankLeft() {
    const sh = [212, 108], hip = [135, 122];
    return [
      line("far", hip, [92, 129], [56, 135], [52, 139]),
      line("limb", hip, [92, 131], [52, 138], [46, 139]),
      line("torso", sh, hip),
      line("limb", sh, [212, 137], [242, 137]),
      head(231, 101),
      line("limb", sh, [204, 72], [223, 89]),
    ].join("");
  }

  // Kegel: a ring that tightens (squeeze) or opens up (relax), with arrows
  // pointing in or out. Not drawn on a mat.
  // `r` overrides the ring size (used for the "elevator" levels).
  function kegelRing(squeeze, r) {
    const c = [150, 80];
    const arrows = [0, 90, 180, 270].map((deg) => {
      // Chevron on the axis at `deg`, pointing toward (squeeze) or away
      // from (relax) the centre.
      const [tip, back] = squeeze ? [52, 68] : [70, 54];
      const pts = [[back, -9], [tip, 0], [back, 9]]
        .map(([r, o]) => {
          const a = (deg * Math.PI) / 180;
          return [c[0] + r * Math.cos(a) - o * Math.sin(a), c[1] + r * Math.sin(a) + o * Math.cos(a)];
        })
        .map((p) => p.map((v) => v.toFixed(1)));
      return line("kegel-arrow", ...pts);
    });
    return `<g class="kegel ${squeeze ? "squeeze" : "relax"}">
      <circle class="kegel-ring" cx="${c[0]}" cy="${c[1]}" r="${r || (squeeze ? 24 : 42)}"/>
      ${arrows.join("")}
    </g>`;
  }

  // ----- Ab workout figures: lying on the back, head to the LEFT -----
  // Crunch base: knees bent, feet flat, shoulders curled off the mat.
  // `arms` draws the arms from the shoulder point.
  function crunch(arms) {
    const sh = [108, 113], hip = [165, 131];
    return [
      line("far", hip, [207, 99], [243, 137]),
      arms("far", [sh[0] + 3, sh[1] - 1]),
      line("torso", sh, hip),
      line("limb", hip, [203, 98], [236, 137]),
      head(91, 106),
      arms("limb", sh),
    ].join("");
  }
  // Arms folded across the chest.
  const crossedArms = (cls, [x, y]) => line(cls, [x, y], [x + 22, y - 22], [x + 2, y - 19]);
  // Arms reaching straight back past the ears.
  const longArms = (cls, [x, y]) => line(cls === "limb" ? "raised" : "far", [x, y], [x - 26, y - 10], [x - 51, y - 19]);

  // Reverse crunch: back flat, knees pulled in toward the chest, hips curling up.
  function reverseCrunch() {
    const sh = [88, 132], hip = [152, 125];
    return [
      line("far", sh, [118, 137], [148, 137]),
      line("far", hip, [133, 86], [170, 75]),
      line("torso", sh, hip),
      line("raised", hip, [129, 88], [166, 76]),
      head(67, 129),
      line("limb", sh, [116, 137], [145, 137]),
    ].join("");
  }

  // Bird dog: on hands and knees, head to the right; near leg and far arm extended.
  function birdDog() {
    const sh = [205, 96], hip = [132, 96];
    return [
      line("raised far", sh, [231, 93], [258, 90]),
      line("far", hip, [136, 137], [92, 137]),
      line("torso", sh, hip),
      line("limb", sh, [207, 118], [205, 139]),
      line("raised", hip, [87, 94], [40, 92]),
      head(226, 81),
    ].join("");
  }

  // Glute bridge: shoulders on the mat, hips lifted in a line with the knees.
  function bridge() {
    const sh = [90, 132], hip = [163, 104];
    return [
      line("far", sh, [118, 137], [148, 137]),
      line("far", hip, [206, 90], [214, 137]),
      line("torso", sh, hip),
      line("raised", hip, [210, 88], [220, 137]),
      head(69, 128),
      line("limb", sh, [116, 137], [145, 137]),
    ].join("");
  }

  // Bicycle crunch: hands behind the head, near knee pulled in, far leg extended.
  function bicycle() {
    const sh = [110, 112], hip = [165, 128];
    return [
      line("far", hip, [210, 114], [258, 104]),
      line("far", [sh[0] + 3, sh[1] - 1], [127, 96], [100, 92]),
      line("torso", sh, hip),
      line("raised", hip, [145, 87], [185, 78]),
      head(93, 105),
      line("limb", sh, [122, 92], [97, 90]),
    ].join("");
  }

  // Seated forward fold (hamstring stretch): legs straight out to the
  // right, torso leaning forward, hands reaching for the toes.
  function forwardFold() {
    const sh = [168, 84], hip = [104, 131];
    return [
      line("far", hip, [168, 135], [228, 135], [233, 124]),
      line("far", [sh[0] + 2, sh[1] + 2], [198, 106], [226, 122]),
      line("limb", hip, [166, 137], [224, 137], [230, 126]),
      line("torso", sh, hip),
      head(183, 71),
      line("limb", sh, [196, 104], [222, 121]),
    ].join("");
  }

  const POSES = {
    squeeze: () => kegelRing(true),
    relax: () => kegelRing(false),
    // Elevator: the ring closes a bit more on each "floor".
    lift1: () => kegelRing(true, 36),
    lift2: () => kegelRing(true, 30),
    lift3: () => kegelRing(true, 24),
    full: () => fullPlank(),
    elbow: () => elbowPlank(),
    // In this side view we see the figure's right side, so the right leg
    // is the near leg and the left leg is the far one.
    leftLeg: () => elbowPlank("far"),
    rightLeg: () => elbowPlank("near"),
    leftSide: () => sidePlankLeft(),
    rightSide: () => mirror(sidePlankLeft()),
    crossCrunch: () => crunch(crossedArms),
    reverseCrunch: () => reverseCrunch(),
    birdDog: () => birdDog(),
    longArmCrunch: () => crunch(longArms),
    bridge: () => bridge(),
    bicycle: () => bicycle(),
    stretch: () => forwardFold(),
  };

  const NO_MAT = new Set(["squeeze", "relax", "lift1", "lift2", "lift3"]);

  function renderFigure(poseKey) {
    const body = POSES[poseKey] ? POSES[poseKey]() : "";
    const onMat = !NO_MAT.has(poseKey);
    return `<svg viewBox="0 0 300 160" role="img">
      ${onMat ? `<rect class="mat" x="20" y="139" width="260" height="8" rx="4"/>` : ""}
      ${body}
    </svg>`;
  }

  // ------------------------------------------------------------------
  // Workouts. Add new timed workouts here.
  // ------------------------------------------------------------------
  // Gives each exercise `work` seconds and puts a `rest`-second break
  // between them. The break shows the next exercise so you can get set.
  function withRests(work, rest, exercises) {
    return exercises.flatMap((ex, i) => [
      ...(i ? [{ name: "Rest", seconds: rest, pose: ex.pose, rest: true }] : []),
      { ...ex, seconds: work },
    ]);
  }

  function stretchWorkout(sets) {
    return {
      title: `Stretch · ${sets} sets`,
      back: "#/stretch",
      prepSeconds: 5,
      tapToPause: true,
      countExercises: true,
      countLabel: "", // just a big "1 of 10"
      segments: withRests(30, 10, Array.from({ length: sets }, () => (
        { name: "Stretch", pose: "stretch", desc: "Ease into the stretch and hold. Breathe slowly; no bouncing." }
      ))),
    };
  }

  const WORKOUTS = {
    plank: {
      title: "Plank Timer",
      prepSeconds: 5,
      tapToPause: true, // tap the figure to pause / resume
      segments: [
        { name: "Full Plank", seconds: 60, pose: "full" },
        { name: "Elbow Plank", seconds: 30, pose: "elbow" },
        { name: "Left Leg Plank", seconds: 30, pose: "leftLeg" },
        { name: "Right Leg Plank", seconds: 30, pose: "rightLeg" },
        { name: "Left Side Plank", seconds: 30, pose: "leftSide" },
        { name: "Right Side Plank", seconds: 30, pose: "rightSide" },
        { name: "Elbow Plank", seconds: 30, pose: "elbow" },
        { name: "Full Plank", seconds: 60, pose: "full" },
      ],
    },
    // 15 s Get Ready, then 45 s on / 15 s rest (no rest after the last one) = 7:00.
    abs: {
      title: "Ab Workout",
      prepSeconds: 15,
      prepInTotal: true, // Get Ready counts toward the time left (7:00 total)
      tapToPause: true,
      countExercises: true, // "Exercise 3 of 7"; rests aren't counted
      segments: withRests(45, 15, [
        { name: "Cross Arm Crunches", pose: "crossCrunch",
          desc: "Lie on your back, knees bent, arms crossed on your chest. Curl your shoulders up off the mat, then lower slowly." },
        { name: "Reverse Crunches", pose: "reverseCrunch",
          desc: "Lie flat, arms at your sides. Pull your knees in toward your chest, curling your hips off the mat, then lower with control." },
        { name: "Straight Arm Plank", pose: "full",
          desc: "Hands under your shoulders, arms straight. Hold a straight line from head to heels and keep your core tight." },
        { name: "Bird Dog", pose: "birdDog",
          desc: "On hands and knees, reach one arm forward and the opposite leg back. Pause, return, and switch sides." },
        { name: "Long Arm Crunches", pose: "longArmCrunch",
          desc: "Lie on your back, knees bent, arms straight overhead by your ears. Crunch up, keeping your arms extended." },
        { name: "Bridge", pose: "bridge",
          desc: "Lie on your back, knees bent, feet flat. Squeeze your glutes and lift your hips until knees, hips and shoulders line up. Lower." },
        { name: "Bicycle Crunches", pose: "bicycle",
          desc: "Hands behind your head. Bring one elbow toward the opposite knee as the other leg straightens. Alternate sides." },
      ]),
    },
    // Stretch opens a chooser (5 or 10 sets): 30 s stretch / 10 s rest.
    "stretch/5": stretchWorkout(5),
    "stretch/10": stretchWorkout(10),
    // Kegel opens a chooser (quick or long); see CHOOSERS below.
    // Quick: about 60-80 seconds, different every time (see kegelRoutine
    // below). Always ends on a squeeze.
    "kegel/quick": {
      title: "Kegel Timer",
      back: "#/kegel",
      prepSeconds: 5,
      prepPose: "relax",
      ticks: "beforeWork",
      generate: () => kegelRoutine(),
    },
    // Long: a fixed 5-minute session, meant for once a week.
    "kegel/long": {
      title: "Long Kegel",
      back: "#/kegel",
      prepSeconds: 5,
      prepPose: "relax",
      ticks: "beforeWork",
      generate: () => kegelLongRoutine(),
    },
  };

  // ------------------------------------------------------------------
  // Random Kegel routine. Builds a few blocks (short squeezes, long
  // holds, quick pulses, a ladder), shuffles their order, and finishes
  // with a final squeeze. Limits keep it sensible:
  //   - squeezes: 2-12 s (quick pulses 1-2 s)
  //   - relaxes: at least 3 s and at least ~half the squeeze before it
  //     (quick pulses: 2 s), never more than 6 s
  //   - total work time: KEGEL_MIN-KEGEL_MAX seconds
  // ------------------------------------------------------------------
  const KEGEL_MIN = 60, KEGEL_MAX = 80;
  const rand = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };
  const squeeze = (name, seconds) => ({ name, seconds, pose: "squeeze" });
  const relaxFor = (squeezeSecs) =>
    ({ name: "Relax", pose: "relax", rest: true,
       seconds: Math.min(6, Math.max(3, rand(Math.ceil(squeezeSecs / 2), Math.ceil(squeezeSecs / 2) + 2))) });

  const KEGEL_BLOCKS = {
    short() {
      const out = [];
      for (let i = rand(2, 4); i > 0; i--) {
        const s = rand(4, 6);
        out.push(squeeze("Squeeze", s), relaxFor(s));
      }
      return out;
    },
    hold() {
      const out = [];
      for (let i = rand(1, 3); i > 0; i--) {
        const s = rand(8, 12);
        out.push(squeeze("Squeeze & Hold", s), relaxFor(s));
      }
      return out;
    },
    pulse() {
      const out = [];
      const s = pick([1, 2]);
      for (let i = rand(3, 6); i > 0; i--) {
        out.push(squeeze("Quick Squeeze", s), { name: "Relax", seconds: 2, pose: "relax", rest: true });
      }
      return out;
    },
    ladder() {
      const steps = pick([[3, 5, 7], [4, 6, 8], [3, 6, 9], [7, 5, 3], [8, 6, 4]]);
      return steps.flatMap((s) => [squeeze(`Squeeze ${s}s`, s), relaxFor(s)]);
    },
  };

  // ------------------------------------------------------------------
  // Long Kegel routine: exactly 5:00 of work, in stages that train both
  // the slow (endurance) and fast (quick-contraction) muscle fibres.
  // Each stage is one bar on the timeline and its name shows above the
  // exercise, with a short how-to underneath.
  // ------------------------------------------------------------------
  function kegelLongRoutine() {
    const stage = (group, desc, segs) => segs.map((seg) => ({ ...seg, group, desc }));
    const sq = (name, seconds, pose = "squeeze") => ({ name, seconds, pose });
    const rx = (seconds) => ({ name: "Relax", seconds, pose: "relax", rest: true });
    const reps = (n, fn) => Array.from({ length: n }, (_, i) => fn(i)).flat();

    const flickSet = () => [
      ...reps(9, () => [sq("Quick Squeeze", 1), rx(1)]),
      sq("Quick Squeeze", 1), rx(10),
    ];
    // One continuous squeeze (no relax between floors, on purpose); the
    // "Hold ·" names make that clear on screen.
    const elevator = () => [
      sq("Squeeze · Floor 1", 3, "lift1"), sq("Hold · Floor 2", 3, "lift2"), sq("Hold · Top Floor", 4, "lift3"),
      sq("Hold · Down to 2", 3, "lift2"), sq("Hold · Down to 1", 3, "lift1"), rx(8),
    ];

    return [
      ...stage("Warm-up", "Gentle squeezes to find the right muscles. Lift up and in, as if stopping the flow of urine.",
        reps(5, () => [sq("Squeeze", 3), rx(3)])),                                   // 0:30
      ...stage("Endurance holds", "Squeeze and lift, then hold. Keep breathing and keep your belly, glutes and thighs relaxed.",
        reps(5, () => [sq("Squeeze & Hold", 10), rx(10)])),                          // 1:40
      ...stage("Quick flicks", "Squeeze hard and fast, then let go completely each time.",
        [...flickSet(), ...flickSet()]),                                             // 0:58
      ...stage("Elevator", "One long squeeze, no letting go: tighten more at each floor, then ease down a floor at a time.",
        [...elevator(), ...elevator()]),                                             // 0:48
      ...stage("Long holds", "Your longest holds. Steady squeeze, slow breaths. If you tire, ease off a little rather than letting go.",
        [sq("Long Hold", 20), rx(12), sq("Long Hold", 20)]),                        // 0:52
      ...stage("Cool-down", "Let everything go. Breathe slowly and feel the muscles fully relax.",
        [rx(12)]),                                                                   // 0:12  => 5:00
    ];
  }

  function kegelRoutine() {
    for (let attempt = 0; attempt < 200; attempt++) {
      // Usually the three classic blocks; sometimes add a ladder, sometimes
      // repeat one, sometimes swap one out for a ladder.
      let kinds = ["short", "hold", "pulse"];
      const roll = Math.random();
      if (roll < 0.25) kinds.push("ladder");
      else if (roll < 0.4) kinds.push(pick(kinds));
      else if (roll < 0.55) kinds[rand(0, 2)] = "ladder";
      shuffle(kinds);
      // Don't put the same block twice in a row.
      if (kinds.some((k, i) => i > 0 && k === kinds[i - 1])) continue;

      const segs = kinds.flatMap((k) => KEGEL_BLOCKS[k]());
      segs.push(squeeze("Final Squeeze", rand(5, 10)));
      const total = segs.reduce((n, s) => n + s.seconds, 0);
      if (total >= KEGEL_MIN && total <= KEGEL_MAX) return segs;
    }
    // Fallback: the original fixed routine.
    return [
      ...[5, 5, 5].flatMap((s) => [squeeze("Squeeze", s), { name: "Relax", seconds: 3, pose: "relax", rest: true }]),
      ...[10, 10].flatMap((s) => [squeeze("Squeeze & Hold", s), { name: "Relax", seconds: 4, pose: "relax", rest: true }]),
      ...[2, 2, 2].flatMap((s) => [squeeze("Quick Squeeze", s), { name: "Relax", seconds: 2, pose: "relax", rest: true }]),
      squeeze("Final Squeeze", 6),
    ];
  }

  // ------------------------------------------------------------------
  // Sound: wood-block ticks before each switch, a bell when a new
  // position starts. Files live in sounds/ (swap in your own WAV/MP3s).
  // Uses Web Audio for tight timing; falls back to <audio> elements when
  // the files can't be fetched (e.g. opening index.html via file://).
  // ------------------------------------------------------------------
  const SOUND_FILES = {
    tick: "sounds/woodblock.wav",
    bell: "sounds/bell.wav",
  };
  let audioCtx = null;
  const buffers = {};
  const elements = {};
  for (const [name, src] of Object.entries(SOUND_FILES)) {
    const a = new Audio(src);
    a.preload = "auto";
    elements[name] = a;
  }

  function unlockAudio() {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) {
        audioCtx = new Ctx();
        for (const [name, src] of Object.entries(SOUND_FILES)) {
          fetch(src)
            .then((r) => r.arrayBuffer())
            .then((data) => new Promise((ok, fail) => audioCtx.decodeAudioData(data, ok, fail)))
            .then((buf) => (buffers[name] = buf))
            .catch(() => { /* use the <audio> fallback */ });
        }
      }
      // Prime the fallback elements inside the user gesture (needed on iOS).
      for (const a of Object.values(elements)) {
        a.muted = true;
        a.play().then(() => { a.pause(); a.currentTime = 0; a.muted = false; })
          .catch(() => { a.muted = false; });
      }
    }
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
  }

  function play(name, delay = 0) {
    if (audioCtx && buffers[name]) {
      const src = audioCtx.createBufferSource();
      const g = audioCtx.createGain();
      g.gain.value = name === "tick" ? 0.9 : 0.7;
      src.buffer = buffers[name];
      src.connect(g).connect(audioCtx.destination);
      src.start(audioCtx.currentTime + delay);
      return;
    }
    const el = elements[name];
    if (!el) return;
    const go = () => {
      const a = el.cloneNode();
      a.volume = name === "tick" ? 0.9 : 0.7;
      a.play().catch(() => {});
    };
    delay ? setTimeout(go, delay * 1000) : go();
  }

  const tickSound = () => play("tick");
  const bellSound = () => play("bell");
  // "Relax" cue: a breathy whoosh, like an exhale. Filtered noise whose
  // pitch sweeps downward with a gentle swell. Synthesized with Web Audio,
  // so it needs no sound file. Smooth in character but loud enough to
  // cut through an audiobook; tweak RELAX_VOLUME if needed.
  const RELAX_VOLUME = 1.4;
  let noiseBuffer = null;
  function relaxSound() {
    if (!audioCtx) return;
    if (!noiseBuffer) {
      const len = Math.floor(audioCtx.sampleRate * 1.2);
      noiseBuffer = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    }
    const t = audioCtx.currentTime;
    const dur = 0.9;
    const src = audioCtx.createBufferSource();
    src.buffer = noiseBuffer;

    // Band-pass sweeping from airy to low gives the "whoosh".
    const bp = audioCtx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 0.9;
    bp.frequency.setValueAtTime(2200, t);
    bp.frequency.exponentialRampToValueAtTime(350, t + dur);

    // Swell in, then fade out.
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(RELAX_VOLUME, t + 0.18);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    src.connect(bp).connect(g).connect(audioCtx.destination);
    src.start(t);
    src.stop(t + dur + 0.05);
  }
  const finishSound = () => [0, 0.45, 0.9].forEach((d) => play("bell", d));

  // ------------------------------------------------------------------
  // Keep the screen awake while a timer runs (where supported)
  // ------------------------------------------------------------------
  let wakeLock = null;
  async function requestWakeLock() {
    try {
      if ("wakeLock" in navigator && !wakeLock) {
        wakeLock = await navigator.wakeLock.request("screen");
        wakeLock.addEventListener("release", () => (wakeLock = null));
      }
    } catch (_) { /* not available; ignore */ }
  }
  function releaseWakeLock() {
    if (wakeLock) wakeLock.release().catch(() => {});
    wakeLock = null;
  }

  // ------------------------------------------------------------------
  // Timer
  // ------------------------------------------------------------------
  const $ = (id) => document.getElementById(id);
  const els = {
    title: $("workout-title"),
    total: $("total-remaining"),
    step: $("segment-step"),
    name: $("segment-name"),
    desc: $("segment-desc"),
    figure: $("figure"),
    figureWrap: $("figure-wrap"),
    figureIcon: $("figure-icon"),
    countdown: $("countdown"),
    upNext: $("up-next"),
    next: $("next-up"),
    timeline: $("timeline"),
    start: $("btn-start"),
    restart: $("btn-restart"),
  };

  // Test mode: add ?test to the URL (e.g. index.html?test#/plank) to make
  // every position last at most TEST_SECONDS.
  const TEST_MODE = new URLSearchParams(location.search).has("test");
  const TEST_SECONDS = 5;

  const fmt = (secs) => {
    secs = Math.max(0, Math.ceil(secs));
    return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
  };

  const timer = {
    workout: null,
    phases: [],       // prep + segments, each { name, seconds, pose, start, prep? }
    totalMs: 0,       // includes prep
    workMs: 0,        // segments only
    elapsedMs: 0,     // accumulated while paused
    startedAt: 0,     // performance.now() when last resumed
    state: "idle",    // idle | running | paused | done
    phaseIndex: -1,
    tickId: null,
    lastPose: null,
    lastTickKey: null, // "phaseIndex:secondsLeft" of the last wood-block tick

    load(workout) {
      this.stop();
      this.workout = workout;
      // Randomized workouts get a fresh routine on every load / restart.
      if (workout.generate) workout.segments = workout.generate();
      this.phases = [];
      let t = 0;
      // Test mode also caps Get Ready at TEST_SECONDS.
      const prepSeconds = TEST_MODE ? Math.min(workout.prepSeconds || 0, TEST_SECONDS) : workout.prepSeconds;
      if (prepSeconds) {
        this.phases.push({
          name: "Get Ready",
          seconds: prepSeconds,
          pose: workout.prepPose || workout.segments[0].pose,
          prep: true,
          start: 0,
        });
        t = prepSeconds * 1000;
      }
      const workStart = t;
      const segments = TEST_MODE
        ? workout.segments.map((seg) => ({ ...seg, seconds: Math.min(seg.seconds, TEST_SECONDS) }))
        : workout.segments;
      this.segments = segments;
      for (const seg of segments) {
        this.phases.push({ ...seg, start: t });
        t += seg.seconds * 1000;
      }
      this.totalMs = t;
      this.workMs = t - workStart;
      this.elapsedMs = 0;
      this.state = "idle";
      this.phaseIndex = -1;
      this.lastPose = null;
      this.lastTickKey = null;

      els.title.textContent = TEST_MODE ? `${workout.title} (test)` : workout.title;
      // One bar per segment, except segments sharing a `group` (a stage of
      // the long Kegel) share one bar so the timeline stays readable.
      this.bars = [];
      for (const p of this.phases) {
        if (p.prep) continue;
        const last = this.bars[this.bars.length - 1];
        if (p.group && last && last.group === p.group) last.ms += p.seconds * 1000;
        else this.bars.push({ group: p.group, start: p.start, ms: p.seconds * 1000, seg: p });
      }
      els.timeline.innerHTML = this.bars
        .map(({ seg, ms, group }) => `<div class="timeline-seg${!group && seg.pose === "squeeze" ? " squeeze" : ""}${workout.countExercises && seg.rest ? " rest" : ""}" style="flex:${ms}"><div class="timeline-fill"></div></div>`)
        .join("");
      this.render();
    },

    elapsed() {
      return this.state === "running"
        ? this.elapsedMs + (performance.now() - this.startedAt)
        : this.elapsedMs;
    },

    start() {
      unlockAudio();
      if (this.state === "done") this.reset();
      if (this.state === "running") return;
      this.state = "running";
      this.startedAt = performance.now();
      this.tickId = setInterval(() => this.tick(), 50);
      requestWakeLock();
      this.tick();
    },

    pause() {
      if (this.state !== "running") return;
      this.elapsedMs = this.elapsed();
      this.state = "paused";
      this.stop();
      this.render();
    },

    stop() {
      if (this.tickId) clearInterval(this.tickId);
      this.tickId = null;
      releaseWakeLock();
    },

    reset() {
      if (this.workout && this.workout.generate) {
        this.load(this.workout); // new random routine
        return;
      }
      this.stop();
      this.elapsedMs = 0;
      this.state = "idle";
      this.phaseIndex = -1;
      this.lastTickKey = null;
      this.render();
    },

    tick() {
      const e = this.elapsed();
      if (e >= this.totalMs) {
        this.elapsedMs = this.totalMs;
        this.state = "done";
        this.stop();
        finishSound();
        this.render();
        return;
      }
      let idx = 0;
      while (idx + 1 < this.phases.length && this.phases[idx + 1].start <= e) idx++;
      if (idx !== this.phaseIndex) {
        // Bell whenever a new position starts (including the first real
        // segment after "Get Ready"), but not when the timer first starts.
        // Rest phases get the softer "relax" tone instead.
        if (this.phaseIndex !== -1) {
          this.phases[idx].rest ? relaxSound() : bellSound();
        }
        this.phaseIndex = idx;
      }
      // Wood-block ticks warn that something is about to happen.
      // Default: three ticks (at 3, 2 and 1 seconds left) before every
      // switch, including the end of "Get Ready" and the final position.
      // "beforeWork" (Kegel): one tick, 1 second before a rest ends.
      const phase = this.phases[idx];
      const secsLeft = Math.ceil((phase.start + phase.seconds * 1000 - e) / 1000);
      const key = `${idx}:${secsLeft}`;
      const wantTick = this.workout.ticks === "beforeWork"
        ? (phase.prep || phase.rest) && secsLeft === 1 && idx + 1 < this.phases.length
        : secsLeft <= 3 && secsLeft >= 1 && phase.seconds > 3;
      if (wantTick && key !== this.lastTickKey) {
        // Skip a tick for a second we were already inside when (re)starting.
        const intoSecond = secsLeft * 1000 - (phase.start + phase.seconds * 1000 - e);
        if (intoSecond < 300) tickSound();
        this.lastTickKey = key;
      }
      this.render();
    },

    render() {
      const e = this.elapsed();
      const phases = this.phases;
      const done = this.state === "done";
      const segs = this.segments;
      const prepOffset = phases[0].prep ? 1 : 0;
      // Before starting, preview the first real segment.
      const idx = this.phaseIndex < 0 ? prepOffset : this.phaseIndex;
      const phase = phases[idx];

      // Labels
      if (done) {
        els.step.textContent = "Workout complete";
        els.step.classList.remove("big");
        els.name.textContent = "Nice work!";
        els.desc.textContent = "";
        els.countdown.textContent = "Done";
        els.next.textContent = "";
        els.upNext.textContent = "";
      } else {
        const segNum = idx - prepOffset + 1;
        const label = this.workout.countLabel ?? "Exercise";
        // No label (Stretch): show a bare "1 of 10", larger.
        els.step.classList.toggle("big", !label && !!this.workout.countExercises && !phase.prep && !phase.rest);
        if (phase.prep) els.step.textContent = "Starting soon";
        else if (this.workout.countExercises) {
          const work = segs.filter((s) => !s.rest);
          const n = segs.slice(0, segNum).filter((s) => !s.rest).length;
          els.step.textContent = phase.rest ? "" : `${label} ${n} of ${work.length}`.trim();
        } else if (phase.group) {
          const groups = [...new Set(segs.map((s) => s.group))];
          els.step.textContent = `${phase.group} \u00b7 ${groups.indexOf(phase.group) + 1} of ${groups.length}`;
        } else els.step.textContent = `Part ${segNum} of ${segs.length}`;
        els.name.textContent = phase.rest && this.workout.countExercises ? "REST" : phase.name;
        // How-to text, shown while doing the exercise (not during breaks).
        // Grouped stages (long Kegel) keep their text through the relaxes.
        els.desc.textContent = !phase.prep && phase.desc && (!phase.rest || phase.group) ? phase.desc : "";
        const remaining = (phase.start + phase.seconds * 1000 - e) / 1000;
        els.countdown.textContent =
          this.state === "idle" ? fmt(phase.seconds) : fmt(remaining);
        const nxt = phases[idx + 1];
        // Breaks (and Get Ready) in exercise workouts: the caption above the
        // small, faded figure names what's coming, so skip the "Next:" line.
        const breather = this.workout.countExercises && (phase.rest || phase.prep) && nxt;
        els.upNext.textContent = breather ? `Up next: ${nxt.name}` : "";
        const after = phases[idx + 2];
        els.next.textContent = breather ? "" :
          !nxt ? "Last one!" :
          nxt.rest && after && this.workout.countExercises ? `Next: ${after.name} (after a ${nxt.seconds}s rest)` :
          `Next: ${nxt.name}`;
      }
      // Calm tint, small ghosted figure during breaks (see .resting in CSS).
      const resting = !done && !!this.workout.countExercises && !!(phase.rest || phase.prep);
      document.body.classList.toggle("resting", resting);
      els.countdown.classList.toggle("done", done);

      // Figure (only re-render when the pose changes, with a little pulse)
      const pose = done ? segs[segs.length - 1].pose : phase.pose;
      if (pose !== this.lastPose) {
        els.figure.innerHTML = renderFigure(pose);
        if (this.lastPose !== null) {
          els.figure.classList.remove("pulse");
          void els.figure.offsetWidth;
          els.figure.classList.add("pulse");
        }
        this.lastPose = pose;
      }

      // Total remaining (work time only, unless the workout counts Get Ready too)
      if (this.workout.prepInTotal) {
        els.total.textContent = `${fmt((this.totalMs - e) / 1000)} left`;
      } else {
        const workElapsed = Math.max(0, e - (this.totalMs - this.workMs));
        els.total.textContent = `${fmt((this.workMs - workElapsed) / 1000)} left`;
      }

      // Timeline
      const fills = els.timeline.querySelectorAll(".timeline-fill");
      this.bars.forEach((b, i) => {
        const frac = Math.min(1, Math.max(0, (e - b.start) / b.ms));
        fills[i].style.width = `${frac * 100}%`;
      });

      // Buttons
      els.start.textContent =
        this.state === "running" ? "Pause" :
        this.state === "paused" ? "Resume" :
        this.state === "done" ? "Again" : "Start";

      // Tap-to-pause overlay on the figure
      const tappable = !!this.workout.tapToPause && !done;
      const wrap = els.figureWrap;
      wrap.classList.toggle("tappable", tappable);
      wrap.classList.toggle("paused", tappable && this.state === "paused");
      const icon = !tappable ? "" : this.state === "running" ? "pause" : "play";
      if (wrap.dataset.icon !== icon) {
        wrap.dataset.icon = icon;
        els.figureIcon.innerHTML = icon === "pause" ? PAUSE_ICON : icon === "play" ? PLAY_ICON : "";
        if (icon) {
          wrap.setAttribute("role", "button");
          wrap.tabIndex = 0;
          wrap.setAttribute("aria-label", icon === "pause" ? "Pause" : this.state === "paused" ? "Resume" : "Start");
        } else {
          wrap.removeAttribute("role");
          wrap.removeAttribute("tabindex");
          wrap.removeAttribute("aria-label");
        }
      }
    },
  };

  const PAUSE_ICON = `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="48"/><rect x="33" y="28" width="11" height="44" rx="3"/><rect x="56" y="28" width="11" height="44" rx="3"/></svg>`;
  const PLAY_ICON = `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="48"/><path d="M40 28 L72 50 L40 72 Z"/></svg>`;

  const toggle = () => {
    if (timer.state === "running") timer.pause();
    else timer.start();
  };
  els.start.addEventListener("click", toggle);

  // Tapping anywhere on the figure pauses / resumes (workouts with tapToPause).
  els.figureWrap.addEventListener("click", () => {
    if (els.figureWrap.classList.contains("tappable")) toggle();
  });
  els.figureWrap.addEventListener("keydown", (ev) => {
    if ((ev.key === "Enter" || ev.key === " ") && els.figureWrap.classList.contains("tappable")) {
      ev.preventDefault();
      toggle();
    }
  });
  els.restart.addEventListener("click", () => timer.reset());

  // Re-acquire the wake lock if the page becomes visible again mid-workout.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && timer.state === "running") requestWakeLock();
  });

  // ------------------------------------------------------------------
  // Routing (#/, #/plank, #/abs, #/kegel -> #/kegel/quick | #/kegel/long,
  //          #/stretch -> #/stretch/5 | #/stretch/10)
  // ------------------------------------------------------------------
  // Workouts that first ask which version you want.
  const CHOOSERS = {
    stretch: {
      title: "Stretch Timer",
      options: [
        { href: "#/stretch/5", name: "5 Sets", meta: "3:10 · 30 sec stretch, 10 sec rest" },
        { href: "#/stretch/10", name: "10 Sets", meta: "6:30 · 30 sec stretch, 10 sec rest" },
      ],
    },
    kegel: {
      title: "Kegel Timer",
      options: [
        { href: "#/kegel/quick", name: "Quick", meta: "~70 sec \u00b7 different every time" },
        { href: "#/kegel/long", name: "Long", meta: "5 min \u00b7 once a week" },
      ],
    },
  };

  const screens = {
    home: $("screen-home"),
    choose: $("screen-choose"),
    timer: $("screen-timer"),
    soon: $("screen-soon"),
  };

  function show(name) {
    if (name !== "timer") document.body.classList.remove("resting");
    for (const [key, el] of Object.entries(screens)) el.hidden = key !== name;
    window.scrollTo(0, 0);
  }

  function route() {
    const key = location.hash.replace(/^#\/?/, "");
    const workout = WORKOUTS[key];
    const chooser = CHOOSERS[key];
    if (chooser) {
      timer.stop();
      if (timer.workout) timer.reset();
      $("choose-title").textContent = chooser.title;
      $("choose-list").innerHTML = chooser.options
        .map((o) => `<a class="workout-btn choice-btn" href="${o.href}">
            <span class="workout-text">
              <span class="workout-name">${o.name}</span>
              <span class="workout-meta">${o.meta}</span>
            </span>
          </a>`)
        .join("");
      show("choose");
      return;
    }
    if (!workout) {
      timer.stop();
      if (timer.workout) timer.reset();
      show("home");
      return;
    }
    if (workout.comingSoon) {
      timer.stop();
      $("soon-title").textContent = workout.title;
      show("soon");
      return;
    }
    $("timer-back").setAttribute("href", workout.back || "#/");
    timer.load(workout);
    show("timer");
  }

  window.addEventListener("hashchange", route);
  route();
})();
