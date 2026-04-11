"use client";

import {
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";

/* ================================================================== */
/*  TYPES & CONSTANTS                                                  */
/* ================================================================== */

type GameState = "welcome" | "playing" | "success" | "failure";

interface BoosterState {
  x: number;       // px from center
  y: number;       // px from bottom
  vx: number;      // horizontal velocity
  vy: number;      // vertical velocity
  angle: number;   // degrees, 0 = upright
  angularV: number; // angular velocity
  fuel: number;    // 0-100
  thrusting: boolean;
}

// Physics tuning
const GRAVITY = 80;        // px/s² (Mars ~3.7 m/s², scaled)
const THRUST = 220;        // px/s² when engine on
const ROTATION_SPEED = 120; // deg/s
const FUEL_RATE = 8;       // %/s when thrusting
const MAX_LAND_SPEED = 30; // px/s
const MAX_LAND_ANGLE = 12; // degrees from upright
const LANDING_ZONE_WIDTH = 120;
const BOOSTER_HEIGHT = 80;
const BOOSTER_WIDTH = 22;
const GROUND_Y = 100;      // ground level from bottom of viewport

/* ================================================================== */
/*  MAIN COMPONENT                                                     */
/* ================================================================== */

export default function LandTheBooster() {
  const [gameState, setGameState] = useState<GameState>("welcome");
  const [pilotName, setPilotName] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [wins, setWins] = useState(0);
  const [stats, setStats] = useState({ time: 0, accuracy: 0, score: 0 });
  const [failReasons, setFailReasons] = useState<string[]>([]);

  // Booster visual state (updated from game loop for rendering)
  const [booster, setBooster] = useState<BoosterState>({
    x: 0, y: 0, vx: 0, vy: 0, angle: 0, angularV: 0, fuel: 100, thrusting: false,
  });

  // Mutable refs for the game loop (no re-render overhead)
  const stateRef = useRef<BoosterState>({
    x: 0, y: 0, vx: 0, vy: 0, angle: 0, angularV: 0, fuel: 100, thrusting: false,
  });
  const keysRef = useRef<Set<string>>(new Set());
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const elapsedRef = useRef<number>(0);
  const gameStateRef = useRef<GameState>("welcome");
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep gameStateRef in sync
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  /* ---------------------------------------------------------------- */
  /*  Init / Reset                                                     */
  /* ---------------------------------------------------------------- */

  const initBooster = useCallback(() => {
    const container = containerRef.current;
    const w = container ? container.clientWidth : 800;
    const h = container ? container.clientHeight : 600;

    // Random start: top area, slight offset, slight velocity and tilt
    const startX = (Math.random() - 0.5) * w * 0.6;
    const startY = h - 60;
    const startAngle = (Math.random() - 0.5) * 30;
    const startVx = (Math.random() - 0.5) * 40;
    const startVy = -(40 + Math.random() * 60); // falling down

    const s: BoosterState = {
      x: startX,
      y: startY,
      vx: startVx,
      vy: startVy,
      angle: startAngle,
      angularV: 0,
      fuel: 100,
      thrusting: false,
    };
    stateRef.current = s;
    setBooster({ ...s });
    elapsedRef.current = 0;
    lastTimeRef.current = 0;
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Game Loop                                                        */
  /* ---------------------------------------------------------------- */

  const gameLoop = useCallback((timestamp: number) => {
    if (gameStateRef.current !== "playing") return;

    if (lastTimeRef.current === 0) lastTimeRef.current = timestamp;
    const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05); // cap dt
    lastTimeRef.current = timestamp;
    elapsedRef.current += dt;

    const s = stateRef.current;
    const keys = keysRef.current;

    // Controls
    const thrustOn =
      (keys.has("ArrowUp") || keys.has("w") || keys.has("W")) && s.fuel > 0;
    const rotateLeft = keys.has("ArrowLeft") || keys.has("a") || keys.has("A");
    const rotateRight = keys.has("ArrowRight") || keys.has("d") || keys.has("D");

    // Rotation
    let angularV = s.angularV;
    if (rotateLeft) angularV -= ROTATION_SPEED * dt;
    if (rotateRight) angularV += ROTATION_SPEED * dt;
    angularV *= 0.92; // damping
    const angle = s.angle + angularV * dt;

    // Thrust (applied along booster's up axis)
    const rad = (angle * Math.PI) / 180;
    let vx = s.vx;
    let vy = s.vy;

    if (thrustOn) {
      vx -= Math.sin(rad) * THRUST * dt;
      vy += Math.cos(rad) * THRUST * dt;
    }

    // Gravity
    vy -= GRAVITY * dt;

    // Position
    const x = s.x + vx * dt;
    const y = s.y + vy * dt;

    // Fuel
    const fuel = thrustOn ? Math.max(0, s.fuel - FUEL_RATE * dt) : s.fuel;

    // Update mutable state
    stateRef.current = {
      x, y, vx, vy, angle, angularV, fuel,
      thrusting: thrustOn,
    };

    // Check landing / crash
    if (y <= GROUND_Y) {
      const speed = Math.sqrt(vx * vx + vy * vy);
      const absAngle = Math.abs(angle % 360);
      const normalizedAngle = absAngle > 180 ? 360 - absAngle : absAngle;
      const onPad = Math.abs(x) < LANDING_ZONE_WIDTH / 2;
      const speedOk = speed < MAX_LAND_SPEED;
      const angleOk = normalizedAngle < MAX_LAND_ANGLE;

      stateRef.current.y = GROUND_Y;
      stateRef.current.vy = 0;
      stateRef.current.vx = 0;
      stateRef.current.thrusting = false;

      if (onPad && speedOk && angleOk) {
        // Success!
        const time = elapsedRef.current;
        const accuracy = Math.max(
          0,
          Math.round(
            (1 - Math.abs(x) / (LANDING_ZONE_WIDTH / 2)) *
              (1 - normalizedAngle / MAX_LAND_ANGLE) *
              100
          )
        );
        const score = Math.round(
          1500 + accuracy * 5 - time * 10
        );
        setStats({ time: Math.round(time * 10) / 10, accuracy, score });
        setWins((w) => w + 1);
        setAttempts((a) => a + 1);
        setGameState("success");
      } else {
        // Failure
        const reasons: string[] = [];
        if (!onPad) reasons.push("Missed landing zone");
        if (!speedOk) reasons.push(`Speed too high (${speed.toFixed(1)} m/s)`);
        if (!angleOk) reasons.push(`Bad angle (${normalizedAngle.toFixed(1)}°)`);
        setFailReasons(reasons);
        setAttempts((a) => a + 1);
        setGameState("failure");
      }

      setBooster({ ...stateRef.current });
      return;
    }

    // Render update (throttled to ~30fps for React setState)
    setBooster({ ...stateRef.current });

    rafRef.current = requestAnimationFrame(gameLoop);
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Start / Restart                                                  */
  /* ---------------------------------------------------------------- */

  const startGame = useCallback(() => {
    initBooster();
    setGameState("playing");
    lastTimeRef.current = 0;
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [initBooster, gameLoop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Restart loop when game state becomes "playing"
  useEffect(() => {
    if (gameState === "playing") {
      lastTimeRef.current = 0;
      rafRef.current = requestAnimationFrame(gameLoop);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [gameState, gameLoop]);

  /* ---------------------------------------------------------------- */
  /*  Keyboard input                                                   */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (e.key === " " && (gameState === "failure" || gameState === "success")) {
        e.preventDefault();
        startGame();
      }
    };
    const onUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key);
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [gameState, startGame]);

  /* ---------------------------------------------------------------- */
  /*  Touch controls                                                   */
  /* ---------------------------------------------------------------- */

  const touchZones = useRef<{ thrust: boolean; left: boolean; right: boolean }>({
    thrust: false,
    left: false,
    right: false,
  });

  const handleTouches = useCallback((e: React.TouchEvent) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    keysRef.current.delete("ArrowUp");
    keysRef.current.delete("ArrowLeft");
    keysRef.current.delete("ArrowRight");

    for (let i = 0; i < e.touches.length; i++) {
      const t = e.touches[i];
      const tx = t.clientX - rect.left;
      const ty = t.clientY - rect.top;

      // Top half = thrust
      if (ty < h * 0.5) {
        keysRef.current.add("ArrowUp");
      }
      // Bottom-left = rotate left
      if (ty >= h * 0.5 && tx < w * 0.5) {
        keysRef.current.add("ArrowLeft");
      }
      // Bottom-right = rotate right
      if (ty >= h * 0.5 && tx >= w * 0.5) {
        keysRef.current.add("ArrowRight");
      }
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    keysRef.current.delete("ArrowUp");
    keysRef.current.delete("ArrowLeft");
    keysRef.current.delete("ArrowRight");
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Derived values                                                   */
  /* ---------------------------------------------------------------- */

  const speed = Math.sqrt(booster.vx ** 2 + booster.vy ** 2);
  const absAngle = Math.abs(booster.angle % 360);
  const displayAngle = absAngle > 180 ? 360 - absAngle : absAngle;

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full select-none overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #1a0a0a 0%, #2d1117 30%, #4a1a1a 60%, #8b3a2a 85%, #c4603c 100%)",
        fontFamily: "'Space Mono', monospace",
      }}
      onTouchStart={handleTouches}
      onTouchMove={handleTouches}
      onTouchEnd={handleTouchEnd}
    >
      {/* Stars */}
      <Stars />

      {/* Mars surface */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          height: GROUND_Y,
          background: "linear-gradient(to bottom, #a0522d, #8b4513 40%, #6b3410)",
          borderTop: "3px solid #c4703c",
        }}
      >
        {/* Surface texture dots */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle, #5a2d0e 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }} />
      </div>

      {/* Landing pad */}
      <div
        className="absolute bottom-0 left-1/2 flex flex-col items-center"
        style={{
          width: LANDING_ZONE_WIDTH,
          height: GROUND_Y + 4,
          transform: "translateX(-50%)",
        }}
      >
        {/* Pad surface */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: GROUND_Y,
            background: "linear-gradient(to bottom, #5a5a5a, #3a3a3a)",
            borderTop: "4px solid #7a7a7a",
            borderLeft: "2px solid #6a6a6a",
            borderRight: "2px solid #6a6a6a",
          }}
        />
        {/* Landing target markers */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ bottom: GROUND_Y - 2 }}
        >
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full border-2 border-green-400/80 bg-green-500/30" />
            <div className="h-1 w-16 rounded bg-green-400/50" />
            <div className="h-3 w-3 rounded-full border-2 border-green-400/80 bg-green-500/30" />
          </div>
        </div>
      </div>

      {/* Booster */}
      {gameState !== "welcome" && (
        <div
          className="absolute left-1/2 bottom-0 z-10"
          style={{
            transform: `translate(calc(-50% + ${booster.x}px), calc(50% - ${booster.y}px)) rotate(${booster.angle}deg)`,
            transformOrigin: "center bottom",
            transition: gameState !== "playing" ? "none" : undefined,
          }}
        >
          {/* Flame / Thruster */}
          {booster.thrusting && (
            <div
              className="absolute left-1/2 -translate-x-1/2"
              style={{ top: BOOSTER_HEIGHT - 2 }}
            >
              <div
                className="relative"
                style={{
                  width: 14,
                  height: 30 + Math.random() * 20,
                  background: "linear-gradient(to bottom, #ff6b00, #ff4500 40%, #ffaa00 70%, transparent)",
                  borderRadius: "0 0 50% 50%",
                  filter: "blur(2px)",
                  opacity: 0.9,
                }}
              />
              {/* Glow */}
              <div
                className="absolute -left-3 -top-1"
                style={{
                  width: 20,
                  height: 20,
                  background: "radial-gradient(circle, rgba(255,165,0,0.6), transparent)",
                  borderRadius: "50%",
                }}
              />
            </div>
          )}

          {/* Booster body */}
          <div
            style={{
              width: BOOSTER_WIDTH,
              height: BOOSTER_HEIGHT,
              background: "linear-gradient(to right, #c0c0c0 0%, #e8e8e8 30%, #f5f5f5 50%, #e0e0e0 70%, #a0a0a0 100%)",
              borderRadius: "4px 4px 2px 2px",
              position: "relative",
              boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            }}
          >
            {/* Nose cone */}
            <div
              className="absolute -top-2 left-1/2 -translate-x-1/2"
              style={{
                width: 0,
                height: 0,
                borderLeft: `${BOOSTER_WIDTH / 2}px solid transparent`,
                borderRight: `${BOOSTER_WIDTH / 2}px solid transparent`,
                borderBottom: `10px solid #d0d0d0`,
              }}
            />
            {/* Grid fins */}
            <div
              className="absolute"
              style={{
                top: 8,
                left: -6,
                width: 6,
                height: 12,
                background: "#888",
                borderRadius: "2px 0 0 2px",
              }}
            />
            <div
              className="absolute"
              style={{
                top: 8,
                right: -6,
                width: 6,
                height: 12,
                background: "#888",
                borderRadius: "0 2px 2px 0",
              }}
            />
            {/* Band details */}
            <div className="absolute left-0 right-0" style={{ top: 25, height: 3, background: "#333" }} />
            <div className="absolute left-0 right-0" style={{ top: 55, height: 2, background: "#555" }} />
            {/* Engine nozzle */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2"
              style={{
                width: 16,
                height: 6,
                background: "linear-gradient(to bottom, #555, #333)",
                borderRadius: "0 0 3px 3px",
              }}
            />
          </div>
        </div>
      )}

      {/* Explosion effect */}
      {gameState === "failure" && (
        <div
          className="absolute left-1/2 bottom-0 z-20"
          style={{
            transform: `translate(calc(-50% + ${booster.x}px), calc(50% - ${booster.y}px))`,
          }}
        >
          <div
            className="animate-ping"
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,100,0,0.8), rgba(255,50,0,0.4), transparent)",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
      )}

      {/* Dashboard HUD */}
      {gameState === "playing" && (
        <div className="absolute left-3 right-3 top-3 z-30 flex flex-wrap gap-2 sm:left-5 sm:top-5 sm:right-auto sm:flex-col sm:gap-3">
          <HudMeter
            icon="⛽️"
            label="Fuel"
            value={`${booster.fuel.toFixed(1)}%`}
            meter={booster.fuel}
            max={100}
            low={20}
            high={40}
          />
          <HudMeter
            icon="🚀"
            label="Speed"
            value={`${speed.toFixed(1)} m/s`}
            meter={speed}
            max={300}
            low={MAX_LAND_SPEED}
            high={100}
            reverse
          />
          <HudMeter
            icon="📐"
            label="Angle"
            value={`${displayAngle.toFixed(1)}°`}
            meter={displayAngle}
            max={180}
            low={MAX_LAND_ANGLE}
            high={45}
            reverse
          />
        </div>
      )}

      {/* Touch control hints */}
      {gameState === "playing" && (
        <div className="pointer-events-none absolute inset-0 z-20 sm:hidden">
          <div className="absolute inset-x-0 top-0 flex h-1/2 items-center justify-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">thrust</span>
          </div>
          <div className="absolute bottom-0 left-0 flex h-1/2 w-1/2 items-center justify-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">← left</span>
          </div>
          <div className="absolute bottom-0 right-0 flex h-1/2 w-1/2 items-center justify-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">right →</span>
          </div>
        </div>
      )}

      {/* Welcome dialog */}
      {gameState === "welcome" && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 flex max-w-sm flex-col items-center gap-5 rounded-2xl border border-white/10 bg-black/80 p-8 text-center text-white backdrop-blur-xl">
            <h1 className="text-xl font-bold sm:text-2xl">
              Land the Booster<br />
              <span className="text-orange-400">on Mars</span>
            </h1>
            <p className="text-sm text-gray-400">
              Use arrow keys or WASD to maneuver
            </p>
            <p className="text-xs italic text-gray-500">
              You&apos;ll figure it out,<br />it&apos;s <em>not a rocket science</em>
            </p>
            <form
              className="flex w-full flex-col gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                startGame();
              }}
            >
              <input
                type="text"
                placeholder="Pilot name"
                value={pilotName}
                onChange={(e) => setPilotName(e.target.value)}
                maxLength={16}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-center text-sm text-white placeholder-gray-500 outline-none focus:border-orange-400/50"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="submit"
                className="rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-400 active:bg-orange-600"
              >
                🚀 Launch!
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success dialog */}
      {gameState === "success" && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 flex max-w-sm flex-col items-center gap-4 rounded-2xl border border-green-500/30 bg-black/80 p-8 text-center text-white backdrop-blur-xl">
            <h1 className="text-2xl font-bold text-green-400">🎉 Landed!</h1>
            <div className="flex w-full gap-4 text-center">
              <div className="flex-1">
                <div className="text-xs text-gray-400">Time</div>
                <div className="text-lg font-bold">{stats.time}s</div>
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-400">Accuracy</div>
                <div className="text-lg font-bold">{stats.accuracy}%</div>
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-400">Score</div>
                <div className="text-lg font-bold text-orange-400">{stats.score}</div>
              </div>
            </div>
            <div className="text-xs text-gray-400">
              🥵 Winrate: <b>{wins}</b> / {attempts} = {attempts > 0 ? Math.round((wins / attempts) * 100) : 0}%
            </div>
            <button
              onClick={startGame}
              className="rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-400"
            >
              🚀 Try Again
            </button>
            <div className="text-xs text-gray-500">press SPACE to retry</div>
          </div>
        </div>
      )}

      {/* Failure dialog */}
      {gameState === "failure" && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 flex max-w-sm flex-col items-center gap-4 rounded-2xl border border-red-500/30 bg-black/80 p-8 text-center text-white backdrop-blur-xl">
            <h1 className="text-2xl font-bold text-red-400">
              💥 Mission Failed 💥
            </h1>
            <p className="text-sm text-gray-400">
              The vehicle experienced a<br />rapid unscheduled disassembly.
            </p>
            <div className="flex flex-col gap-1">
              {failReasons.map((r) => (
                <div key={r} className="text-xs font-medium text-red-300">
                  ✗ {r}
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-400">
              🥵 Winrate: <b>{wins}</b> / {attempts} = {attempts > 0 ? Math.round((wins / attempts) * 100) : 0}%
            </div>
            <button
              onClick={startGame}
              className="rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-400"
            >
              🚀 Try Again
            </button>
            <div className="text-xs text-gray-500">press SPACE to retry</div>
          </div>
        </div>
      )}

      {/* Restart button (always visible when playing) */}
      {gameState === "playing" && (
        <button
          onClick={startGame}
          className="absolute bottom-4 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/60 backdrop-blur transition-colors hover:bg-black/60 hover:text-white sm:bottom-5 sm:right-5"
          title="Restart"
        >
          <svg width="18" height="18" viewBox="0 0 512 512" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="40">
            <path d="M320,146s24.36-12-64-12A160,160,0,1,0,416,294" strokeMiterlimit="10" />
            <path d="M256 58l80 80-80 80" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
}

/* ================================================================== */
/*  HUD Meter                                                          */
/* ================================================================== */

function HudMeter({
  icon,
  label,
  value,
  meter,
  max,
  low,
  high,
  reverse,
}: {
  icon: string;
  label: string;
  value: string;
  meter: number;
  max: number;
  low: number;
  high: number;
  reverse?: boolean;
}) {
  const pct = Math.min(100, (meter / max) * 100);
  const isLow = reverse ? meter > high : meter < low;
  const isMid = reverse ? meter > low && meter <= high : meter >= low && meter < high;

  const color = isLow
    ? "#ef4444"
    : isMid
      ? "#eab308"
      : "#22c55e";

  return (
    <div
      className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/50 px-2.5 py-1.5 backdrop-blur-md sm:min-w-[200px] sm:px-3 sm:py-2"
    >
      <span className="text-xs sm:text-sm">{icon}</span>
      <div className="flex flex-1 flex-col gap-0.5">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 sm:text-xs">
            {label}
          </span>
          <span className="text-xs font-bold text-white sm:text-sm">{value}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10 sm:h-2">
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{
              width: `${pct}%`,
              backgroundColor: color,
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Stars background                                                   */
/* ================================================================== */

function Stars() {
  const stars = useRef<Array<{ x: number; y: number; size: number; opacity: number }>>([]);

  if (stars.current.length === 0) {
    for (let i = 0; i < 100; i++) {
      stars.current.push({
        x: Math.random() * 100,
        y: Math.random() * 70,
        size: 0.5 + Math.random() * 2,
        opacity: 0.3 + Math.random() * 0.7,
      });
    }
  }

  return (
    <div className="pointer-events-none absolute inset-0">
      {stars.current.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
          }}
        />
      ))}
    </div>
  );
}
