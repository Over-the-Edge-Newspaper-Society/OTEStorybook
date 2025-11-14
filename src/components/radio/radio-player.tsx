import { animate, motion, useMotionValue, type AnimationPlaybackControls } from 'framer-motion';
import { ChevronLeft, ChevronRight, Lock, Play, Share2, Star, Unlock } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

const PX_PER_MAJOR = 40;
const MINOR_SPACING = 8;
const LED_FONT_STACK = '"LEDCounter7", var(--font-mono)';

type PlayerStatus = 'idle' | 'buffering' | 'playing' | 'failed';

type RadioBand = {
  kind: 'fm' | 'am';
  min: number;
  max: number;
  step: number;
  major: number;
  decimals: number;
  label: string;
};

type RadioStation = {
  name: string;
  city: string;
  frequency: number;
  track: string;
  artist: string;
  band: RadioBand;
};

const FM_BAND: RadioBand = {
  kind: 'fm',
  min: 70,
  max: 108,
  step: 0.2,
  major: 1,
  decimals: 1,
  label: 'FM',
};

const DEFAULT_STATION: RadioStation = {
  name: 'CFUR Radio',
  city: 'Prince George',
  frequency: 88.7,
  track: 'One More Cup of Coffee',
  artist: 'Bob Dylan',
  band: FM_BAND,
};

export interface RadioPlayerProps {
  station?: RadioStation;
  defaultLocked?: boolean;
}

export function RadioPlayer({ station = DEFAULT_STATION, defaultLocked = true }: RadioPlayerProps) {
  const [status, setStatus] = useState<PlayerStatus>('idle');
  const [isLocked, setIsLocked] = useState(defaultLocked);
  const [tunedFrequency, setTunedFrequency] = useState(station.frequency);
  const [hasCompletedIntro, setHasCompletedIntro] = useState(false);
  const frequencyMotion = useMotionValue(station.band.min);
  const [displayFrequency, setDisplayFrequency] = useState(station.band.min);
  const animationRef = useRef<AnimationPlaybackControls | null>(null);
  const introTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bufferingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const unsubscribe = frequencyMotion.on('change', (value) => setDisplayFrequency(value));
    return () => unsubscribe();
  }, [frequencyMotion]);

  const isActivelyPlaying = status === 'playing' || status === 'buffering';
  const showsLiveState = hasCompletedIntro && isActivelyPlaying;

  const animateToFrequency = useCallback((value: number, duration = 0.35) => {
    animationRef.current?.stop();
    animationRef.current = animate(frequencyMotion, value, {
      duration,
      ease: 'easeOut',
    });
  }, [frequencyMotion]);

  useEffect(() => {
    return () => {
      animationRef.current?.stop();
      if (introTimeoutRef.current) {
        clearTimeout(introTimeoutRef.current);
      }
      if (bufferingTimeoutRef.current) {
        clearTimeout(bufferingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (status !== 'playing') {
      if (!hasCompletedIntro) {
        animationRef.current?.stop();
        frequencyMotion.set(station.band.min);
      }
      return;
    }

    if (!hasCompletedIntro) {
      animationRef.current?.stop();
      frequencyMotion.set(station.band.min);
      animationRef.current = animate(frequencyMotion, tunedFrequency, {
        duration: 1.2,
        ease: 'easeOut',
      });
      if (introTimeoutRef.current) {
        clearTimeout(introTimeoutRef.current);
      }
      introTimeoutRef.current = setTimeout(() => {
        setHasCompletedIntro(true);
      }, 1250);
      return;
    }

    animateToFrequency(tunedFrequency, 0.4);
  }, [status, hasCompletedIntro, tunedFrequency, station.band.min, animateToFrequency, frequencyMotion]);

  useEffect(() => {
    if (!hasCompletedIntro) {
      return;
    }
    animateToFrequency(tunedFrequency, 0.25);
  }, [tunedFrequency, hasCompletedIntro, animateToFrequency]);

  const togglePlayback = () => {
    if (status === 'playing' || status === 'buffering') {
      stopPlayback();
      return;
    }
    startPlayback();
  };

  const startPlayback = () => {
    setStatus('buffering');
    if (bufferingTimeoutRef.current) {
      clearTimeout(bufferingTimeoutRef.current);
    }
    bufferingTimeoutRef.current = setTimeout(() => {
      setStatus('playing');
    }, 850);
  };

  const stopPlayback = () => {
    if (bufferingTimeoutRef.current) {
      clearTimeout(bufferingTimeoutRef.current);
    }
    setStatus('idle');
    if (!hasCompletedIntro) {
      animationRef.current?.stop();
      frequencyMotion.set(station.band.min);
    }
  };

  const tuneBy = (delta: number) => {
    setTunedFrequency((current) => {
      const next = rounded(clamp(current + delta, station.band.min, station.band.max), station.band.decimals);
      return next;
    });
  };

  const handleScrub = (value: number) => {
    const next = rounded(clamp(value, station.band.min, station.band.max), station.band.decimals);
    setTunedFrequency(next);
  };

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-10 sm:px-6">
      <div className="space-y-6 rounded-[32px] border border-border/40 bg-card p-6 text-card-foreground shadow-xl shadow-black/5 dark:shadow-black/30 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <p className="font-medium uppercase tracking-[0.35em] text-[0.65rem] text-muted-foreground">
            {station.city} • {station.band.label}
          </p>
          <div className="flex items-center gap-2">
            <LivePill isLive={showsLiveState} />
            <button
              type="button"
              onClick={() => setIsLocked((prev) => !prev)}
              className="inline-flex items-center gap-1 rounded-full border border-border/30 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground transition hover:border-foreground/50 hover:text-foreground"
            >
              {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
              {isLocked ? 'Locked' : 'Unlocked'}
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">{station.name}</h2>
        </div>

        <TunerRuler
          band={station.band}
          displayFrequency={displayFrequency}
          frequency={tunedFrequency}
          isLocked={isLocked}
          onScrub={handleScrub}
        />

        <div className="text-center">
          <p className="font-mono text-5xl font-semibold tabular-nums tracking-wider sm:text-6xl" style={{ fontFamily: LED_FONT_STACK }}>
            {displayFrequency.toFixed(station.band.decimals)}
          </p>
          <p className="text-sm text-muted-foreground">Tuned • {station.band.label}</p>
        </div>

        <div className="rounded-[24px] border border-border/40 bg-gradient-to-b from-card to-card/80 p-4 shadow-inner shadow-black/5 dark:from-card/70 dark:to-card/40">
          <ControlsBlock
            isLocked={isLocked}
            isLive={showsLiveState}
            status={status}
            onTogglePlay={togglePlayback}
            onTuneLeft={() => tuneBy(-station.band.step)}
            onTuneRight={() => tuneBy(station.band.step)}
          />
        </div>
      </div>
    </div>
  );
}

const ControlsBlock = ({
  isLocked,
  isLive,
  status,
  onTogglePlay,
  onTuneLeft,
  onTuneRight,
}: {
  isLocked: boolean;
  isLive: boolean;
  status: PlayerStatus;
  onTogglePlay: () => void;
  onTuneLeft: () => void;
  onTuneRight: () => void;
}) => {
  if (isLocked) {
    return (
      <button
        type="button"
        onClick={onTogglePlay}
        className="flex h-16 w-full items-center justify-center gap-3 rounded-[24px] bg-primary text-lg font-semibold uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/40 transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
      >
        {isLive ? <PulsingDot /> : <Play size={20} />}
        {isLive ? 'Live' : status === 'buffering' ? 'Connecting' : 'Go Live'}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <RoundedButton ariaLabel="Favorite station">
        <Star size={18} />
      </RoundedButton>

      <div className="flex flex-1 items-center gap-3">
        <RoundedButton ariaLabel="Tune left" onClick={onTuneLeft}>
          <ChevronLeft size={18} />
        </RoundedButton>

        <button
          type="button"
          onClick={onTogglePlay}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 font-semibold text-primary-foreground shadow-md shadow-primary/30 transition hover:bg-primary/90"
        >
          {isLive ? <PulsingDot /> : <Play size={18} />}
          {isLive ? 'Live' : status === 'buffering' ? 'Connecting' : 'Play'}
        </button>

        <RoundedButton ariaLabel="Tune right" onClick={onTuneRight}>
          <ChevronRight size={18} />
        </RoundedButton>
      </div>

      <RoundedButton ariaLabel="Share station">
        <Share2 size={18} />
      </RoundedButton>
    </div>
  );
};

const RoundedButton = ({
  children,
  ariaLabel,
  onClick,
}: {
  children: React.ReactNode;
  ariaLabel?: string;
  onClick?: () => void;
}) => (
  <button
    type="button"
    aria-label={ariaLabel}
    onClick={onClick}
    className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border/40 text-foreground transition hover:border-foreground/50"
  >
    {children}
  </button>
);

const LivePill = ({ isLive }: { isLive: boolean }) => (
  <span
    className={cn(
      'inline-flex items-center gap-2 rounded-full border border-border/40 px-3 py-1 text-xs font-semibold tracking-widest',
      isLive ? 'text-red-500' : 'text-muted-foreground',
    )}
  >
    <span className="relative h-3 w-3">
      <span className={cn('absolute inset-0 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]', !isLive && 'opacity-40')} />
      <span
        aria-hidden="true"
        className={cn('absolute inset-0 rounded-full border border-red-400', isLive ? 'radio-pulse-ring' : 'opacity-0')}
      />
    </span>
    {isLive ? 'LIVE' : 'OFF AIR'}
  </span>
);

const PulsingDot = () => (
  <span className="relative inline-flex h-4 w-4 items-center justify-center">
    <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-red-500/40" />
    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
  </span>
);

const TunerRuler = ({
  band,
  displayFrequency,
  frequency,
  isLocked,
  onScrub,
}: {
  band: RadioBand;
  displayFrequency: number;
  frequency: number;
  isLocked: boolean;
  onScrub: (value: number) => void;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current || typeof ResizeObserver === 'undefined') {
      return;
    }
    const observer = new ResizeObserver((entries) => {
      if (!entries[0]) return;
      setWidth(entries[0].contentRect.width);
    });
    observer.observe(containerRef.current);
    setWidth(containerRef.current.clientWidth);
    return () => observer.disconnect();
  }, []);

  const pxUnit = pxPerUnit(band);
  const totalPx = (band.max - band.min) * pxUnit;
  const translateX = useMemo(() => {
    if (!width) return 0;
    const unitsFromMin = displayFrequency - band.min;
    const currentPx = unitsFromMin * pxUnit;
    const centerPx = width / 2;
    const raw = centerPx - currentPx;
    const rightBound = centerPx - totalPx;
    return Math.max(raw, rightBound);
  }, [band.min, pxUnit, displayFrequency, totalPx, width]);

  const tapeWidth = Math.max(totalPx, width || 1);
  const minorTicks = useMemo(() => Math.ceil(tapeWidth / MINOR_SPACING) + 1, [tapeWidth]);
  const majorTicks = useMemo(() => Math.ceil(tapeWidth / PX_PER_MAJOR) + 1, [tapeWidth]);
  const labelValues = useMemo(() => fullMajorMarkers(band), [band]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value);
    onScrub(next);
  };

  return (
    <div
      ref={containerRef}
      className="relative h-28 overflow-hidden rounded-[28px] border border-border/50 bg-gradient-to-b from-background/40 to-background/70 shadow-inner"
    >
      <motion.div
        className="absolute inset-y-0 left-0"
        style={{ width: tapeWidth }}
        animate={{ x: translateX }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <svg width={tapeWidth} height={112} viewBox={`0 0 ${tapeWidth} 112`} aria-hidden="true">
          {[...Array(minorTicks)].map((_, index) => {
            const x = index * MINOR_SPACING;
            return (
              <line
                key={`minor-${x}`}
                x1={x}
                x2={x}
                y1={26}
                y2={70}
                stroke="var(--radio-tick-minor)"
                strokeWidth={1}
              />
            );
          })}

          {[...Array(majorTicks)].map((_, index) => {
            const x = index * PX_PER_MAJOR;
            return <line key={`major-${x}`} x1={x} x2={x} y1={12} y2={82} stroke="var(--radio-tick-major)" strokeWidth={2} />;
          })}

          {labelValues.map((value) => {
            const offset = (value - band.min) * pxUnit;
            return (
              <text
                key={`label-${value}`}
                x={offset}
                y={100}
                textAnchor="middle"
                fill="var(--muted-foreground)"
                fontSize={11}
                fontWeight={600}
              >
                {value.toFixed(0)}
              </text>
            );
          })}
        </svg>
      </motion.div>

      <div className="pointer-events-none absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-red-500" />

      <input
        type="range"
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        value={frequency}
        min={band.min}
        max={band.max}
        step={band.step}
        onChange={handleChange}
        disabled={isLocked}
        aria-label="Tune frequency"
      />
    </div>
  );
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function rounded(value: number, decimals: number) {
  const power = Math.pow(10, decimals);
  return Math.round(value * power) / power;
}

function pxPerUnit(band: RadioBand) {
  return PX_PER_MAJOR / band.major;
}

function fullMajorMarkers(band: RadioBand) {
  const labels: number[] = [];
  let value = band.min;
  while (value <= band.max + 0.0001) {
    labels.push(Number(value.toFixed(2)));
    value += band.major;
  }
  return labels;
}
